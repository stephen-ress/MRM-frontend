// // import { Row, Col, Card, Statistic, Alert, Typography, Divider } from 'antd';
// // import { 
// //   InboxOutlined, 
// //   WarningOutlined, 
// //   ClockCircleOutlined, 
// //   CheckCircleOutlined, 
// //   CloseCircleOutlined,
// //   FileDoneOutlined,
// //   ShoppingOutlined,
// //   HistoryOutlined
// // } from '@ant-design/icons';
// // import { useQuery } from '@tanstack/react-query';
// // import { useAuth } from '../context/AuthContext';
// // import { inventory, tickets, orders } from '../api'; // Ensure 'orders' is in your API exports
// // import { Link, useNavigate } from 'react-router-dom';

// // const { Title } = Typography;

// // export default function Dashboard() {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
  
// //   const deptId = user?.departmentId?._id || user?.departmentId;
// //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';

// //   // --- 1. Fetch Inventory Data ---
// //   const { data: invList = [] } = useQuery({
// //     queryKey: ['inventory', deptId, isAdmin],
// //     queryFn: () => inventory.list(isAdmin ? {} : { departmentId: deptId }),
// //   });

// //   const { data: belowThreshold = [] } = useQuery({
// //     queryKey: ['inventory', 'below-threshold'],
// //     queryFn: inventory.belowThreshold,
// //   });

// //   // --- 2. Fetch Ticket Data ---
// //   const { data: ticketList = [] } = useQuery({
// //     queryKey: ['tickets'],
// //     queryFn: () => tickets.list(),
// //   });

// //   // --- 3. Fetch Kitchen Orders Data (Admin only) ---
// //   const { data: kitchenOrders = [] } = useQuery({
// //     queryKey: ['orders', 'all'],
// //     queryFn: () => orders.listPending(), // Fetching pending/all for status counts
// //     enabled: isAdmin
// //   });

// //   // --- Filtering Logic ---
// //   const alertItems = belowThreshold
// //     .filter((i) => {
// //       if (isAdmin) return true;
// //       const itemDeptId = i.departmentId?._id || i.departmentId;
// //       return itemDeptId === deptId;
// //     })
// //     .sort((a, b) => a.itemName.localeCompare(b.itemName));
  
// //   // Ticket Status Aggregations
// //   const pendingTickets = ticketList.filter(t => t.status === 'Pending');
// //   const approvedTickets = ticketList.filter(t => t.status === 'Approved' || t.status === 'Approved by Director');
// //   const resolvedTickets = ticketList.filter(t => t.status === 'Resolved');

// //   // Kitchen Order Aggregations (New Section)
// //   const pendingKitchen = kitchenOrders.filter(o => o.status === 'Pending');
// //   const fulfilledKitchen = kitchenOrders.filter(o => o.status === 'Approved');

// //   return (
// //     <div style={{ padding: '8px' }}>
// //       <Title level={2} style={{ marginBottom: 24, fontWeight: 700 }}>Dashboard Overview</Title>

// //       {/* Threshold Alerts */}
// //       {alertItems.length > 0 && (
// //         <Alert
// //           type="warning"
// //           showIcon
// //           icon={<WarningOutlined />}
// //           message={isAdmin ? "Global Low Stock Alert" : "Department Low Stock Alert"}
// //           description={
// //             <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
// //               {alertItems.map((i) => (
// //                 <li key={i._id}>
// //                   <strong>{i.itemName}</strong>: {i.currentQuantity} {i.unit} left — <Link to="/inventory">Manage</Link>
// //                 </li>
// //               ))}
// //             </ul>
// //           }
// //           style={{ marginBottom: 24, borderRadius: '8px' }}
// //         />
// //       )}

// //       {/* SECTION: KITCHEN DAILY ORDERS (Admin Only) */}
// //       {isAdmin && (
// //         <>
// //           <Title level={4} style={{ marginBottom: 16 }}>
// //             <ShoppingOutlined /> Kitchen Today's Orders
// //           </Title>
// //           <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
// //             <Col xs={24} sm={12}>
// //               <Card 
// //                 hoverable 
// //                 onClick={() => navigate('/admin-approvals')}
// //                 style={{ 
// //                   borderRadius: '12px', 
// //                   borderLeft: '5px solid #fa8c16',
// //                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
// //                 }}
// //               >
// //                 <Statistic 
// //                   title="Pending Kitchen Requests" 
// //                   value={pendingKitchen.length} 
// //                   valueStyle={{ color: '#fa8c16', fontWeight: '700' }}
// //                   prefix={<ClockCircleOutlined />} 
// //                 />
// //                 <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
// //                   Click to review and approve stock deduction
// //                 </div>
// //               </Card>
// //             </Col>
// //             <Col xs={24} sm={12}>
// //               <Card 
// //                 hoverable 
// //                 style={{ 
// //                   borderRadius: '12px', 
// //                   borderLeft: '5px solid #52c41a',
// //                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
// //                 }}
// //               >
// //                 <Statistic 
// //                   title="Fulfilled Today" 
// //                   value={fulfilledKitchen.length} 
// //                   valueStyle={{ color: '#52c41a', fontWeight: '700' }}
// //                   prefix={<CheckCircleOutlined />} 
// //                 />
// //                 <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
// //                   Orders successfully subtracted from warehouse
// //                 </div>
// //               </Card>
// //             </Col>
// //           </Row>
// //           <Divider />
// //         </>
// //       )}

// //       {/* SECTION: TICKET TRACKING */}
// //       <Title level={4} style={{ marginBottom: 16 }}>
// //         <HistoryOutlined /> Ticket Management
// //       </Title>
// //       <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #1890ff' }}>
// //             <Statistic title="Pending" value={pendingTickets.length} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #722ed1' }}>
// //             <Statistic title="Approved" value={approvedTickets.length} valueStyle={{ color: '#722ed1' }} prefix={<CheckCircleOutlined />} />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #52c41a' }}>
// //             <Statistic title="Resolved" value={resolvedTickets.length} prefix={<FileDoneOutlined />} />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #ff4d4f' }}>
// //             <Statistic title="Rejected" value={ticketList.filter(t => t.status === 'Rejected').length} prefix={<CloseCircleOutlined />} />
// //           </Card>
// //         </Col>
// //       </Row>

// //       {/* SECTION: INVENTORY STATS */}
// //       <Title level={4} style={{ marginBottom: 16 }}>
// //         <InboxOutlined /> Inventory Health
// //       </Title>
// //       <Row gutter={[16, 16]}>
// //         <Col xs={24} sm={12}>
// //           <Card bordered={false} style={{ borderRadius: '12px', background: '#f5f5f5' }}>
// //             <Statistic 
// //               title={isAdmin ? "Total System Items" : "Department Items"} 
// //               value={invList.length} 
// //               prefix={<InboxOutlined />} 
// //             />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12}>
// //           <Card bordered={false} style={{ borderRadius: '12px', background: '#fff1f0' }}>
// //             <Statistic 
// //               title="Items Below Threshold" 
// //               value={alertItems.length} 
// //               valueStyle={{ color: '#cf1322' }} 
// //               prefix={<WarningOutlined />} 
// //             />
// //           </Card>
// //         </Col>
// //       </Row>
// //     </div>
// //   );
// // }














// // import { Row, Col, Card, Statistic, Alert, Typography, Divider } from 'antd';
// // import { 
// //   InboxOutlined, 
// //   WarningOutlined, 
// //   ClockCircleOutlined, 
// //   CheckCircleOutlined, 
// //   CloseCircleOutlined,
// //   FileDoneOutlined,
// //   ShoppingOutlined,
// //   HistoryOutlined
// // } from '@ant-design/icons';
// // import { useQuery } from '@tanstack/react-query';
// // import { useAuth } from '../context/AuthContext';
// // import { inventory, tickets, orders } from '../api'; 
// // import { Link, useNavigate } from 'react-router-dom';

// // const { Title } = Typography;

// // export default function Dashboard() {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
  
// //   const deptId = user?.departmentId?._id || user?.departmentId;
// //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
  
// //   // Logic to identify Kitchen Department
// //   const isKitchen = user?.role === 'Kitchen' || user?.departmentId?.name === 'Kitchen';

// //   // --- 1. Fetch Inventory Data ---
// //   const { data: invList = [] } = useQuery({
// //     queryKey: ['inventory', deptId, isAdmin],
// //     queryFn: () => inventory.list(isAdmin ? {} : { departmentId: deptId }),
// //   });

// //   const { data: belowThreshold = [] } = useQuery({
// //     queryKey: ['inventory', 'below-threshold'],
// //     queryFn: inventory.belowThreshold,
// //   });

// //   // --- 2. Fetch Ticket Data ---
// //   const { data: ticketList = [] } = useQuery({
// //     queryKey: ['tickets'],
// //     queryFn: () => tickets.list(),
// //   });

// //   // --- 3. Fetch Kitchen Orders Data (Admin OR Kitchen department) ---
// //   const { data: kitchenOrders = [] } = useQuery({
// //     queryKey: ['orders', 'all'],
// //     queryFn: () => orders.listPending(), 
// //     enabled: isAdmin || isKitchen // Now kitchen staff can trigger this fetch
// //   });

// //   // --- Filtering Logic ---
// //   const alertItems = belowThreshold
// //     .filter((i) => {
// //       if (isAdmin) return true;
// //       const itemDeptId = i.departmentId?._id || i.departmentId;
// //       return itemDeptId === deptId;
// //     })
// //     .sort((a, b) => a.itemName.localeCompare(b.itemName));
  
// //   // Ticket Status Aggregations
// //   const pendingTickets = ticketList.filter(t => t.status === 'Pending');
// //   const approvedTickets = ticketList.filter(t => t.status === 'Approved' || t.status === 'Approved by Director');
// //   const resolvedTickets = ticketList.filter(t => t.status === 'Resolved');

// //   // Kitchen Order Aggregations
// //   const pendingKitchen = kitchenOrders.filter(o => o.status === 'Pending');
// //   const fulfilledKitchen = kitchenOrders.filter(o => o.status === 'Approved');

// //   return (
// //     <div style={{ padding: '8px' }}>
// //       <Title level={2} style={{ marginBottom: 24, fontWeight: 700 }}>Dashboard Overview</Title>

// //       {/* Threshold Alerts */}
// //       {alertItems.length > 0 && (
// //         <Alert
// //           type="warning"
// //           showIcon
// //           icon={<WarningOutlined />}
// //           message={isAdmin ? "Global Low Stock Alert" : "Department Low Stock Alert"}
// //           description={
// //             <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
// //               {alertItems.map((i) => (
// //                 <li key={i._id}>
// //                   <strong>{i.itemName}</strong>: {i.currentQuantity} {i.unit} left — <Link to="/inventory">Manage</Link>
// //                 </li>
// //               ))}
// //             </ul>
// //           }
// //           style={{ marginBottom: 24, borderRadius: '8px' }}
// //         />
// //       )}

// //       {/* SECTION: KITCHEN DAILY ORDERS (Admin & Kitchen Visibility) */}
// //       {(isAdmin || isKitchen) && (
// //         <>
// //           <Title level={4} style={{ marginBottom: 16 }}>
// //             <ShoppingOutlined /> Kitchen Today's Orders
// //           </Title>
// //           <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
// //             <Col xs={24} sm={12}>
// //               <Card 
// //                 hoverable 
// //                 onClick={() => navigate(isAdmin ? '/admin-approvals' : '/kitchen-orders')}
// //                 style={{ 
// //                   borderRadius: '12px', 
// //                   borderLeft: '5px solid #fa8c16',
// //                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
// //                 }}
// //               >
// //                 <Statistic 
// //                   title="Pending Kitchen Requests" 
// //                   value={pendingKitchen.length} 
// //                   valueStyle={{ color: '#fa8c16', fontWeight: '700' }}
// //                   prefix={<ClockCircleOutlined />} 
// //                 />
// //                 <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
// //                   {isAdmin ? "Click to review and approve stock" : "Orders awaiting preparation"}
// //                 </div>
// //               </Card>
// //             </Col>
// //             <Col xs={24} sm={12}>
// //               <Card 
// //                 hoverable 
// //                 style={{ 
// //                   borderRadius: '12px', 
// //                   borderLeft: '5px solid #52c41a',
// //                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
// //                 }}
// //               >
// //                 <Statistic 
// //                   title="Fulfilled Today" 
// //                   value={fulfilledKitchen.length} 
// //                   valueStyle={{ color: '#52c41a', fontWeight: '700' }}
// //                   prefix={<CheckCircleOutlined />} 
// //                 />
// //                 <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
// //                   Successfully subtracted from inventory
// //                 </div>
// //               </Card>
// //             </Col>
// //           </Row>
// //           <Divider />
// //         </>
// //       )}

// //       {/* SECTION: TICKET TRACKING */}
// //       <Title level={4} style={{ marginBottom: 16 }}>
// //         <HistoryOutlined /> Ticket Management
// //       </Title>
// //       <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #1890ff' }}>
// //             <Statistic title="Pending" value={pendingTickets.length} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #722ed1' }}>
// //             <Statistic title="Approved" value={approvedTickets.length} valueStyle={{ color: '#722ed1' }} prefix={<CheckCircleOutlined />} />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #52c41a' }}>
// //             <Statistic title="Resolved" value={resolvedTickets.length} prefix={<FileDoneOutlined />} />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12} md={6}>
// //           <Card hoverable style={{ borderRadius: '12px', borderTop: '4px solid #ff4d4f' }}>
// //             <Statistic title="Rejected" value={ticketList.filter(t => t.status === 'Rejected').length} prefix={<CloseCircleOutlined />} />
// //           </Card>
// //         </Col>
// //       </Row>

// //       {/* SECTION: INVENTORY STATS */}
// //       <Title level={4} style={{ marginBottom: 16 }}>
// //         <InboxOutlined /> Inventory Health
// //       </Title>
// //       <Row gutter={[16, 16]}>
// //         <Col xs={24} sm={12}>
// //           <Card bordered={false} style={{ borderRadius: '12px', background: '#f5f5f5' }}>
// //             <Statistic 
// //               title={isAdmin ? "Total System Items" : "Department Items"} 
// //               value={invList.length} 
// //               prefix={<InboxOutlined />} 
// //             />
// //           </Card>
// //         </Col>
// //         <Col xs={24} sm={12}>
// //           <Card bordered={false} style={{ borderRadius: '12px', background: '#fff1f0' }}>
// //             <Statistic 
// //               title="Items Below Threshold" 
// //               value={alertItems.length} 
// //               valueStyle={{ color: '#cf1322' }} 
// //               prefix={<WarningOutlined />} 
// //             />
// //           </Card>
// //         </Col>
// //       </Row>
// //     </div>
// //   );
// // }











// import { Row, Col, Card, Statistic, Alert, Typography, Divider } from 'antd';
// import { 
//   InboxOutlined, 
//   WarningOutlined, 
//   ClockCircleOutlined, 
//   CheckCircleOutlined, 
//   CloseCircleOutlined,
//   FileDoneOutlined,
//   ShoppingOutlined,
//   HistoryOutlined
// } from '@ant-design/icons';
// import { useQuery } from '@tanstack/react-query';
// import { useAuth } from '../context/AuthContext';
// import { inventory, tickets, orders } from '../api'; 
// import { Link, useNavigate } from 'react-router-dom';

// const { Title } = Typography;

// export default function Dashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const deptId = user?.departmentId?._id || user?.departmentId;
//   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
  
//   // Logic to identify Kitchen Department visibility
//   const isKitchen = user?.role === 'Kitchen' || user?.departmentId?.name === 'Kitchen';

//   // --- 1. Fetch Inventory Data ---
//   const { data: invList = [] } = useQuery({
//     queryKey: ['inventory', deptId, isAdmin],
//     queryFn: () => inventory.list(isAdmin ? {} : { departmentId: deptId }),
//   });

//   const { data: belowThreshold = [] } = useQuery({
//     queryKey: ['inventory', 'below-threshold'],
//     queryFn: inventory.belowThreshold,
//   });

//   // --- 2. Fetch Ticket Data ---
//   const { data: ticketList = [] } = useQuery({
//     queryKey: ['tickets'],
//     queryFn: () => tickets.list(),
//   });

//   // --- 3. Fetch Kitchen Orders Data (Admin OR Kitchen department) ---
//   const { data: kitchenOrders = [] } = useQuery({
//     queryKey: ['orders', 'all'],
//     queryFn: () => orders.listPending(), 
//     enabled: isAdmin || isKitchen 
//   });

//   // --- Filtering Logic ---
//   const alertItems = belowThreshold
//     .filter((i) => {
//       if (isAdmin) return true;
//       const itemDeptId = i.departmentId?._id || i.departmentId;
//       return itemDeptId === deptId;
//     })
//     .sort((a, b) => a.itemName.localeCompare(b.itemName));
  
//   // Ticket Status Aggregations
//   const pendingTickets = ticketList.filter(t => t.status === 'Pending');
//   const approvedTickets = ticketList.filter(t => t.status === 'Approved' || t.status === 'Approved by Director');
//   const resolvedTickets = ticketList.filter(t => t.status === 'Resolved');

//   // Kitchen Order Aggregations
//   const pendingKitchen = kitchenOrders.filter(o => o.status === 'Pending');
//   const fulfilledKitchen = kitchenOrders.filter(o => o.status === 'Approved');

//   return (
//     <div style={{ padding: '8px' }}>
//       <Title level={2} style={{ marginBottom: 24, fontWeight: 700 }}>Dashboard Overview</Title>

//       {/* Threshold Alerts */}
//       {alertItems.length > 0 && (
//         <Alert
//           type="warning"
//           showIcon
//           icon={<WarningOutlined />}
//           message={isAdmin ? "Global Low Stock Alert" : "Department Low Stock Alert"}
//           description={
//             <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
//               {alertItems.map((i) => (
//                 <li key={i._id}>
//                   <strong>{i.itemName}</strong>: {i.currentQuantity} {i.unit} left — <Link to="/inventory">Manage</Link>
//                 </li>
//               ))}
//             </ul>
//           }
//           style={{ marginBottom: 24, borderRadius: '8px' }}
//         />
//       )}

//       {/* SECTION: KITCHEN DAILY ORDERS (Visible to Admin & Kitchen) */}
//       {(isAdmin || isKitchen) && (
//         <>
//           <Title level={4} style={{ marginBottom: 16 }}>
//             <ShoppingOutlined /> Kitchen Today's Orders
//           </Title>
//           <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
//             <Col xs={24} sm={12}>
//               <Card 
//                 // Only hoverable and clickable if user is Admin
//                 hoverable={isAdmin} 
//                 onClick={isAdmin ? () => navigate('/admin-approvals') : undefined}
//                 style={{ 
//                   borderRadius: '12px', 
//                   borderLeft: '5px solid #fa8c16',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
//                   cursor: isAdmin ? 'pointer' : 'default' // Remove pointer for non-admins
//                 }}
//               >
//                 <Statistic 
//                   title="Pending Kitchen Requests" 
//                   value={pendingKitchen.length} 
//                   valueStyle={{ color: '#fa8c16', fontWeight: '700' }}
//                   prefix={<ClockCircleOutlined />} 
//                 />
//                 <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
//                   {isAdmin 
//                     ? "Click to review and approve stock" 
//                     : "Live count of orders awaiting stock approval"}
//                 </div>
//               </Card>
//             </Col>
//             <Col xs={24} sm={12}>
//               <Card 
//                 style={{ 
//                   borderRadius: '12px', 
//                   borderLeft: '5px solid #52c41a',
//                   boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
//                   cursor: 'default'
//                 }}
//               >
//                 <Statistic 
//                   title="Fulfilled Today" 
//                   value={fulfilledKitchen.length} 
//                   valueStyle={{ color: '#52c41a', fontWeight: '700' }}
//                   prefix={<CheckCircleOutlined />} 
//                 />
//                 <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
//                   Orders successfully processed and deducted
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//           <Divider />
//         </>
//       )}

//       {/* SECTION: TICKET TRACKING */}
//       <Title level={4} style={{ marginBottom: 16 }}>
//         <HistoryOutlined /> Ticket Management
//       </Title>
//       <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
//         <Col xs={24} sm={12} md={6}>
//           <Card style={{ borderRadius: '12px', borderTop: '4px solid #1890ff' }}>
//             <Statistic title="Pending" value={pendingTickets.length} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card style={{ borderRadius: '12px', borderTop: '4px solid #722ed1' }}>
//             <Statistic title="Approved" value={approvedTickets.length} valueStyle={{ color: '#722ed1' }} prefix={<CheckCircleOutlined />} />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card style={{ borderRadius: '12px', borderTop: '4px solid #52c41a' }}>
//             <Statistic title="Resolved" value={resolvedTickets.length} prefix={<FileDoneOutlined />} />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card style={{ borderRadius: '12px', borderTop: '4px solid #ff4d4f' }}>
//             <Statistic title="Rejected" value={ticketList.filter(t => t.status === 'Rejected').length} prefix={<CloseCircleOutlined />} />
//           </Card>
//         </Col>
//       </Row>

//       {/* SECTION: INVENTORY STATS */}
//       <Title level={4} style={{ marginBottom: 16 }}>
//         <InboxOutlined /> Inventory Health
//       </Title>
//       <Row gutter={[16, 16]}>
//         <Col xs={24} sm={12}>
//           <Card bordered={false} style={{ borderRadius: '12px', background: '#f5f5f5' }}>
//             <Statistic 
//               title={isAdmin ? "Total System Items" : "Department Items"} 
//               value={invList.length} 
//               prefix={<InboxOutlined />} 
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12}>
//           <Card bordered={false} style={{ borderRadius: '12px', background: '#fff1f0' }}>
//             <Statistic 
//               title="Items Below Threshold" 
//               value={alertItems.length} 
//               valueStyle={{ color: '#cf1322' }} 
//               prefix={<WarningOutlined />} 
//             />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }











import { Row, Col, Card, Statistic, Alert, Typography, Divider } from 'antd';
import { 
  InboxOutlined, 
  WarningOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  FileDoneOutlined,
  ShoppingOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { inventory, tickets, orders } from '../api'; 
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const deptId = user?.departmentId?._id || user?.departmentId;
  const staffDeptName = user?.departmentId?.name || user?.departmentName || "";
  
  // 1. Role & Department Visibility Logic
  const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
  
  // Check if user belongs to Kitchen or Mess
  const isKitchenOrMess = 
    staffDeptName?.toLowerCase().includes('kitchen') || 
    staffDeptName?.toLowerCase().includes('mess') ||
    user?.role === 'Kitchen';

  // --- 2. Data Fetching ---
  const { data: invList = [] } = useQuery({
    queryKey: ['inventory', deptId, isAdmin],
    queryFn: () => inventory.list(isAdmin ? {} : { departmentId: deptId }),
  });

  const { data: belowThreshold = [] } = useQuery({
    queryKey: ['inventory', 'below-threshold'],
    queryFn: inventory.belowThreshold,
  });

  const { data: ticketList = [] } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => tickets.list(),
  });

  // Fetch Kitchen Orders only for Admin or Kitchen/Mess staff
  const { data: kitchenOrders = [] } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orders.listPending(), 
    enabled: isAdmin || isKitchenOrMess 
  });

  // --- 3. Filtering & Aggregation Logic ---
  const alertItems = belowThreshold
    .filter((i) => {
      if (isAdmin) return true;
      const itemDeptId = i.departmentId?._id || i.departmentId;
      return itemDeptId === deptId;
    })
    .sort((a, b) => a.itemName.localeCompare(b.itemName));
  
  // Ticket Status Aggregations
  const pendingTickets = ticketList.filter(t => t.status === 'Pending');
  const approvedTickets = ticketList.filter(t => t.status === 'Approved' || t.status === 'Approved by Director');
  const resolvedTickets = ticketList.filter(t => t.status === 'Resolved');
  const rejectedTickets = ticketList.filter(t => t.status === 'Rejected');

  // Kitchen Order Aggregations
  const pendingKitchen = kitchenOrders.filter(o => o.status === 'Pending');
  const fulfilledKitchen = kitchenOrders.filter(o => o.status === 'Approved');

  return (
    <div style={{ padding: '12px', maxWidth: '1600px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24, fontWeight: 700 }}>Dashboard Overview</Title>

      {/* Threshold Alerts */}
      {alertItems.length > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message={isAdmin ? "Global Low Stock Alert" : "Department Low Stock Alert"}
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              {alertItems.map((i) => (
                <li key={i._id}>
                  <strong>{i.itemName}</strong>: {i.currentQuantity} {i.unit} left — <Link to="/inventory">Manage</Link>
                </li>
              ))}
            </ul>
          }
          style={{ marginBottom: 24, borderRadius: '8px' }}
        />
      )}

      {/* SECTION: KITCHEN & MESS DAILY ORDERS (Admin, Kitchen, or Mess only) */}
      {(isAdmin || isKitchenOrMess) && (
        <>
          <Title level={4} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingOutlined style={{ color: '#fa8c16' }} /> Kitchen & Mess Today's Orders
          </Title>
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12}>
              <Card 
                hoverable={isAdmin} 
                onClick={isAdmin ? () => navigate('/admin-approvals') : undefined}
                style={{ 
                  borderRadius: '12px', 
                  borderLeft: '5px solid #fa8c16',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: isAdmin ? 'pointer' : 'default'
                }}
              >
                <Statistic 
                  title="Pending Stock Approvals" 
                  value={pendingKitchen.length} 
                  valueStyle={{ color: '#fa8c16', fontWeight: '700' }}
                  prefix={<ClockCircleOutlined />} 
                />
                <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
                  {isAdmin 
                    ? "Click to review and release inventory" 
                    : "Orders awaiting warehouse fulfillment"}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card 
                style={{ 
                  borderRadius: '12px', 
                  borderLeft: '5px solid #52c41a',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'default'
                }}
              >
                <Statistic 
                  title="Fulfilled Today" 
                  value={fulfilledKitchen.length} 
                  valueStyle={{ color: '#52c41a', fontWeight: '700' }}
                  prefix={<CheckCircleOutlined />} 
                />
                <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
                  Inventory items successfully deducted
                </div>
              </Card>
            </Col>
          </Row>
          <Divider />
        </>
      )}

      {/* SECTION: TICKET TRACKING */}
      <Title level={4} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HistoryOutlined style={{ color: '#1890ff' }} /> Ticket Management
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={12} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', borderTop: '4px solid #1890ff' }}>
            <Statistic title="Pending" value={pendingTickets.length} valueStyle={{ color: '#1890ff' }} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', borderTop: '4px solid #722ed1' }}>
            <Statistic title="Approved" value={approvedTickets.length} valueStyle={{ color: '#722ed1' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', borderTop: '4px solid #52c41a' }}>
            <Statistic title="Resolved" value={resolvedTickets.length} prefix={<FileDoneOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', borderTop: '4px solid #ff4d4f' }}>
            <Statistic title="Rejected" value={rejectedTickets.length} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* SECTION: INVENTORY HEALTH */}
      <Title level={4} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <InboxOutlined style={{ color: '#000' }} /> Inventory Health
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: '12px', background: '#f5f5f5' }}>
            <Statistic 
              title={isAdmin ? "Total System Items" : "Department Items"} 
              value={invList.length} 
              prefix={<InboxOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: '12px', background: '#fff1f0' }}>
            <Statistic 
              title="Items Below Threshold" 
              value={alertItems.length} 
              valueStyle={{ color: '#cf1322' }} 
              prefix={<WarningOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}