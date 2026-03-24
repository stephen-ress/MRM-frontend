// import { useState } from 'react';
// import { Form, Input, Button, Card, message } from 'antd';
// import { LockOutlined } from '@ant-design/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import { auth } from '../api';

// export default function ResetPassword() {
//   const [loading, setLoading] = useState(false);
//   const { token } = useParams(); // Grabs the token from the URL
//   const navigate = useNavigate();

//   const onFinish = async (v) => {
//     if (v.password !== v.confirmPassword) {
//       return message.error("Passwords do not match");
//     }

//     setLoading(true);
//     try {
//       await auth.resetPassword(token, v.password);
//       message.success('Password reset successfully! Please login.');
//       navigate('/login');
//     } catch (e) {
//       message.error(e.response?.data?.message || 'Reset link expired or invalid');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
//       <Card title="Reset Your Password">
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item 
//             name="password" 
//             label="New Password"
//             rules={[{ required: true, min: 6, message: 'Minimum 6 characters' }]}
//           >
//             <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
//           </Form.Item>

//           <Form.Item 
//             name="confirmPassword" 
//             label="Confirm New Password"
//             rules={[{ required: true, message: 'Please confirm your password' }]}
//           >
//             <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Update Password
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }











import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../api';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Grabs the token from the URL path: /reset-password/:token
  const navigate = useNavigate();

  const onFinish = async (v) => {
    setLoading(true);
    try {
      // Calling the API method we added to api/index.js
      await auth.resetPassword(token, v.password);
      message.success('Password reset successfully! Please login.');
      navigate('/login', { replace: true });
    } catch (e) {
      message.error(e.response?.data?.message || 'Reset link expired or invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh', 
      padding: '0 24px' 
    }}>
      <Card 
        title="DREAM - Reset Your Password" 
        style={{ maxWidth: 400, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="password" 
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
          </Form.Item>

          <Form.Item 
            name="confirmPassword" 
            label="Confirm New Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}