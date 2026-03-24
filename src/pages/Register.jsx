// // import { useState } from 'react';
// // import { Form, Input, Button, Card, Select, message } from 'antd';
// // import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { useQuery } from '@tanstack/react-query';
// // import { departments } from '../api';

// // export default function Register() {
// //   const [loading, setLoading] = useState(false);
// //   const { register } = useAuth();
// //   const navigate = useNavigate();
// //   const { data: deptList = [] } = useQuery({ queryKey: ['departments'], queryFn: departments.list });

// //   const onFinish = async (v) => {
// //     setLoading(true);
// //     try {
// //       await register({
// //         name: v.name,
// //         email: v.email,
// //         password: v.password,
// //         role: v.role,
// //         departmentId: v.departmentId || undefined,
// //       });
// //       message.success('Registered');
// //       navigate('/', { replace: true });
// //     } catch (e) {
// //       message.error(e.response?.data?.message || 'Registration failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
// //       <Card title="DREAM - Register" extra={<Link to="/login">Login</Link>}>
// //         <Form layout="vertical" onFinish={onFinish}>
// //           <Form.Item name="name" rules={[{ required: true }]}>
// //             <Input prefix={<UserOutlined />} placeholder="Full name" />
// //           </Form.Item>
// //           <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
// //             <Input prefix={<MailOutlined />} placeholder="Email" />
// //           </Form.Item>
// //           <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
// //             <Input.Password prefix={<LockOutlined />} placeholder="Password (min 6)" />
// //           </Form.Item>
// //           <Form.Item name="role" rules={[{ required: true }]}>
// //             <Select placeholder="Role" options={[
// //               { value: 'Staff', label: 'Staff' },
// //               { value: 'Admin', label: 'Admin' },
// //               { value: 'Super-Admin', label: 'Super-Admin (Director)' },
// //             ]} />
// //           </Form.Item>
// //           <Form.Item name="departmentId">
// //             <Select
// //               placeholder="Department (optional)"
// //               allowClear
// //               options={deptList.map((d) => ({ value: d._id, label: d.name }))}
// //             />
// //           </Form.Item>
// //           <Form.Item>
// //             <Button type="primary" htmlType="submit" block loading={loading}>
// //               Register
// //             </Button>
// //           </Form.Item>
// //         </Form>
// //       </Card>
// //     </div>
// //   );
// // }






// import { useState } from 'react';
// import { Form, Input, Button, Card, Select, message } from 'antd';
// import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useQuery } from '@tanstack/react-query';
// import { departments } from '../api'; // Check this file to ensure the URL is correct

// export default function Register() {
//   const [loading, setLoading] = useState(false);
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   // This is already fetching your departments from the backend!
//   const { data: deptList = [], isLoading } = useQuery({ 
//     queryKey: ['departments'], 
//     queryFn: departments.list 
//   });

//   const onFinish = async (v) => {
//     setLoading(true);
//     try {
//       await register({
//         name: v.name,
//         email: v.email,
//         password: v.password,
//         role: v.role,
//         departmentId: v.departmentId || undefined,
//       });
//       message.success('Registered successfully');
//       navigate('/', { replace: true });
//     } catch (e) {
//       message.error(e.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
//       <Card title="DREAM - Register" extra={<Link to="/login">Login</Link>}>
//         <Form layout="vertical" onFinish={onFinish}>
//           <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
//             <Input prefix={<UserOutlined />} placeholder="Full name" />
//           </Form.Item>

//           <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
//             <Input prefix={<MailOutlined />} placeholder="Email" />
//           </Form.Item>

//           <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password must be 6+ chars' }]}>
//             <Input.Password prefix={<LockOutlined />} placeholder="Password" />
//           </Form.Item>

//           <Form.Item name="role" rules={[{ required: true, message: 'Please select a role' }]}>
//             <Select placeholder="Select Role">
//               <Select.Option value="Staff">Staff</Select.Option>
//               <Select.Option value="Admin">Admin</Select.Option>
//               <Select.Option value="Super-Admin">Super-Admin (Director)</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="departmentId">
//             <Select
//               placeholder="Select Department (optional)"
//               allowClear
//               loading={isLoading} // Shows a spinner while fetching
//               options={deptList.map((d) => ({ 
//                 value: d._id, 
//                 label: d.name // This will now show "Electrical Department", etc.
//               }))}
//             />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" block loading={loading}>
//               Register
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }














import { useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { auth, departments } from '../api';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Fetch registration status to show/hide roles
  const { data: status } = useQuery({ 
    queryKey: ['regStatus'], 
    queryFn: auth.getRegStatus 
  });

  // Fetch departments list
  const { data: deptList = [], isLoading: isDeptLoading } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: departments.list 
  });

  const onFinish = async (v) => {
    setLoading(true);
    try {
      await register({
        name: v.name,
        email: v.email,
        password: v.password,
        role: v.role,
        departmentId: v.departmentId || undefined,
      });
      message.success('Registered successfully');
      navigate('/', { replace: true });
    } catch (e) {
      message.error(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <Card title="DREAM - Register" extra={<Link to="/login">Login</Link>}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input prefix={<UserOutlined />} placeholder="Full name" />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password must be 6+ chars' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item name="role" rules={[{ required: true, message: 'Please select a role' }]}>
            <Select placeholder="Select Role">
              <Select.Option value="Staff">Staff</Select.Option>
              
              {/* Only show Admin if limit is not reached */}
              {status?.canRegisterAdmin && (
                <Select.Option value="Admin">Admin</Select.Option>
              )}

              {/* Only show Super-Admin if none exists */}
              {status?.canRegisterSuperAdmin && (
                <Select.Option value="Super-Admin">Super-Admin (Director)</Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item name="departmentId">
            <Select
              placeholder="Select Department (optional)"
              allowClear
              loading={isDeptLoading}
              options={deptList.map((d) => ({ 
                value: d._id, 
                label: d.name 
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}





