// // import { useState } from 'react';
// // import { Form, Input, Button, Card, message } from 'antd';
// // import { UserOutlined, LockOutlined } from '@ant-design/icons';
// // import { useNavigate, useLocation, Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';

// // export default function Login() {
// //   const [loading, setLoading] = useState(false);
// //   const { login } = useAuth();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const from = location.state?.from?.pathname || '/';

// //   const onFinish = async (v) => {
// //     setLoading(true);
// //     try {
// //       await login(v.email, v.password);
// //       message.success('Logged in');
// //       navigate(from, { replace: true });
// //     } catch (e) {
// //       message.error(e.response?.data?.message || 'Login failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
// //       <Card title="MONTESSORI.ERP - Login" extra={<Link to="/register">Register</Link>}>
// //         <Form layout="vertical" onFinish={onFinish}>
// //           <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
// //             <Input prefix={<UserOutlined />} placeholder="Email" />
// //           </Form.Item>
// //           <Form.Item name="password" rules={[{ required: true }]}>
// //             <Input.Password prefix={<LockOutlined />} placeholder="Password" />
// //           </Form.Item>
// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" block loading={loading}>
// //               Log in
// //             </Button>
// //           </Form.Item>
// //         </Form>
// //       </Card>
// //     </div>
// //   );
// // }









// import { useState } from 'react';
// import { Form, Input, Button, Card, message, Modal } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { auth } from '../api'; // Ensure auth is imported to call forgotPassword

// export default function Login() {
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Redirect to previous page or dashboard
//   const from = location.state?.from?.pathname || '/';

//   const onFinish = async (v) => {
//     setLoading(true);
//     try {
//       await login(v.email, v.password);
//       message.success('Logged in');
//       navigate(from, { replace: true });
//     } catch (e) {
//       message.error(e.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgot = async () => {
//     // Simple prompt for email; can be replaced with an Ant Design Modal + Form later
//     const email = prompt("Please enter your registered email:");
//     if (email) {
//       try {
//         await auth.forgotPassword(email);
//         message.success("Check your email for reset instructions");
//       } catch (e) {
//         message.error(e.response?.data?.message || "Failed to send reset email");
//       }
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
//       <Card 
//         title="MONTESSORI.ERP - Login" 
//         extra={<Link to="/register">Register</Link>}
//       >
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item 
//             name="email" 
//             rules={[{ required: true, message: 'Please enter your email' }, { type: 'email' }]}
//           >
//             <Input prefix={<UserOutlined />} placeholder="Email" />
//           </Form.Item>

//           <Form.Item 
//             name="password" 
//             rules={[{ required: true, message: 'Please enter your password' }]}
//           >
//             <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//           </Form.Item>

//           <div style={{ marginBottom: 16, textAlign: 'right' }}>
//             <a 
//               style={{ fontSize: '12px' }} 
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleForgot();
//               }}
//             >
//               Forgot Password?
//             </a>
//           </div>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Log in
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }







import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../api'; 

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to previous page or dashboard
  const from = location.state?.from?.pathname || '/';

  // Integrated handleLogin logic into onFinish
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 1. Log exactly what is being sent to verify the "dot" issue
      console.log("Frontend Sending Email:", values.email);
      
      // 2. Call login from AuthContext
      await login(values.email, values.password);
      
      message.success('Logged in successfully');
      navigate(from, { replace: true });
    } catch (e) {
      console.error("Login Error Details:", e.response?.data);
      message.error(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    const email = prompt("Please enter your registered email:");
    if (email) {
      try {
        // Ensure email sent to forgotPassword is also cleaned
        const cleanEmail = email.toLowerCase().trim();
        await auth.forgotPassword(cleanEmail);
        message.success("Check your email for reset instructions");
      } catch (e) {
        message.error(e.response?.data?.message || "Failed to send reset email");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <Card 
        title="MONTESSORI.ERP - Login" 
        extra={<Link to="/register">Register</Link>}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="email" 
            rules={[
              { required: true, message: 'Please enter your email' }, 
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <a 
              href="#forgot"
              style={{ fontSize: '12px' }} 
              onClick={(e) => {
                e.preventDefault();
                handleForgot();
              }}
            >
              Forgot Password?
            </a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}