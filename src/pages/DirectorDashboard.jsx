// import { useState } from 'react';
// import { Row, Col, Card, Statistic, Table, Button, Modal, InputNumber, message, Progress, Typography, Divider } from 'antd';
// import { EditOutlined, DashboardOutlined, PieChartOutlined } from '@ant-design/icons';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
// import { dashboard, tickets, departments } from '../api';

// const { Title, Text } = Typography;

// export default function DirectorDashboard() {
//   const queryClient = useQueryClient();
//   const [messageApi, contextHolder] = message.useMessage(); // Fix for Message Warning
  
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDept, setEditingDept] = useState(null);
//   const [newBudget, setNewBudget] = useState(0);

//   // --- Data Fetching ---
//   const { data: spending = [], isLoading: isSpendingLoading } = useQuery({
//     queryKey: ['dashboard', 'spending'],
//     queryFn: dashboard.spending,
//   });

//   const { data: totalSpent = {} } = useQuery({
//     queryKey: ['dashboard', 'totalSpent'],
//     queryFn: dashboard.totalSpent,
//   });

//   const { data: ticketList = [] } = useQuery({
//     queryKey: ['tickets'],
//     queryFn: () => tickets.list({ status: 'Pending' }),
//   });

//   // --- Mutation for Updating Budget ---
//   const updateBudgetMutation = useMutation({
//     mutationFn: ({ id, budget }) => departments.update(id, { budgetAllocated: budget }),
//     onSuccess: () => {
//       messageApi.success('Budget updated successfully');
//       queryClient.invalidateQueries(['dashboard']);
//       setIsModalOpen(false);
//     },
//     onError: () => messageApi.error('Failed to update budget'),
//   });

//   const handleEdit = (record) => {
//     setEditingDept(record);
//     setNewBudget(record.budgetAllocated || 0);
//     setIsModalOpen(true);
//   };

//   const handleSave = () => {
//     updateBudgetMutation.mutate({ 
//       id: editingDept._id, 
//       budget: newBudget 
//     });
//   };

//   const chartData = spending.map((d) => ({
//     name: d.name?.length > 15 ? d.name.slice(0, 15) + '...' : d.name,
//     budget: d.budgetAllocated,
//     spent: d.totalSpent,
//   }));

//   return (
//     <div style={{ padding: '4px' }}>
//       {contextHolder} {/* Important for the message hook to work */}
      
//       <Title level={2} style={{ marginBottom: 24 }}><DashboardOutlined /> Director Dashboard</Title>
      
//       <Row gutter={[16, 16]}>
//         <Col xs={24} md={12}>
//           {/* Fix: changed bordered={false} to variant="borderless" */}
//           <Card variant="borderless" style={{ borderRadius: '12px', background: '#e6f7ff', borderLeft: '6px solid #1890ff' }}>
//             <Statistic title="Total Institutional Expenditure" value={totalSpent.totalSpent ?? 0} prefix="₹" valueStyle={{ color: '#003a8c', fontWeight: 700 }} />
//           </Card>
//         </Col>
//         <Col xs={24} md={12}>
//           <Card variant="borderless" style={{ borderRadius: '12px', background: '#fff7e6', borderLeft: '6px solid #fa8c16' }}>
//             <Statistic title="Tickets Awaiting Your Approval" value={ticketList.length} valueStyle={{ color: '#873800', fontWeight: 700 }} />
//           </Card>
//         </Col>
//       </Row>

//       <Card title={<span><PieChartOutlined /> Budget Utilization Analysis</span>} style={{ marginTop: 24, borderRadius: '12px' }}>
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//             <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={70} />
//             <YAxis />
//             <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
//             <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
//             <Bar dataKey="budget" fill="#1890ff" name="Allocated Budget" radius={[4, 4, 0, 0]} barSize={35} />
//             <Bar dataKey="spent" fill="#52c41a" name="Actual Spent" radius={[4, 4, 0, 0]} barSize={35} />
//           </BarChart>
//         </ResponsiveContainer>
//       </Card>

//       <Card title="Departmental Summary & Budget Control" style={{ marginTop: 24, borderRadius: '12px' }}>
//         <Table
//           size="middle"
//           rowKey="_id"
//           dataSource={spending}
//           loading={isSpendingLoading}
//           pagination={false}
//           columns={[
//             { title: 'Department', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
//             { title: 'Budget (₹)', dataIndex: 'budgetAllocated', render: (val) => `₹${val.toLocaleString()}` },
//             { 
//                 title: 'Utilization', 
//                 key: 'utilization',
//                 width: 200,
//                 render: (_, record) => {
//                   const percent = record.budgetAllocated > 0 ? Math.round((record.totalSpent / record.budgetAllocated) * 100) : 0;
//                   return (
//                     <Progress 
//                       percent={percent} 
//                       size="small" 
//                       status={percent > 90 ? 'exception' : 'active'} 
//                       strokeColor={percent > 90 ? '#ff4d4f' : '#52c41a'}
//                     />
//                   );
//                 }
//             },
//             { 
//                 title: 'Remaining (₹)', 
//                 dataIndex: 'remaining', 
//                 render: (v) => (
//                     <Text type={v < 0 ? 'danger' : 'success'} strong>
//                         {v < 0 ? `(Over) ₹${Math.abs(v).toLocaleString()}` : `₹${v.toLocaleString()}`}
//                     </Text>
//                 )
//             },
//             {
//               title: 'Action',
//               key: 'action',
//               align: 'center',
//               render: (_, record) => (
//                 <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
//                   Allot Budget
//                 </Button>
//               ),
//             },
//           ]}
//         />
//       </Card>

//       <Modal
//         title={<span><EditOutlined /> Adjust Departmental Budget</span>}
//         open={isModalOpen}
//         onOk={handleSave}
//         onCancel={() => setIsModalOpen(false)}
//         confirmLoading={updateBudgetMutation.isLoading}
//         okText="Update & Save"
//         cancelText="Cancel"
//         destroyOnHidden // Fix: replaced destroyOnClose with destroyOnHidden
//       >
//         <div style={{ padding: '10px 0' }}>
//           <Text type="secondary">Department:</Text>
//           <Title level={4} style={{ marginTop: 0 }}>{editingDept?.name}</Title>
//           <Divider style={{ margin: '12px 0' }} />
//           <Row gutter={16} style={{ marginBottom: 20 }}>
//             <Col span={12}>
//               <Statistic title="Total Spent" value={editingDept?.totalSpent} prefix="₹" valueStyle={{ fontSize: '1.2rem' }} />
//             </Col>
//             <Col span={12}>
//               <Statistic title="Current Budget" value={editingDept?.budgetAllocated} prefix="₹" valueStyle={{ fontSize: '1.2rem' }} />
//             </Col>
//           </Row>
//           <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>New Budget Allocation:</label>
//           <InputNumber
//             prefix="₹"
//             style={{ width: '100%' }}
//             value={newBudget}
//             onChange={setNewBudget}
//             min={0}
//             size="large"
//             placeholder="Enter amount"
//           />
//         </div>
//       </Modal>

//       {ticketList.length > 0 && (
//         <Card title="Priority Pending Approvals" style={{ marginTop: 24, borderRadius: '12px' }} headStyle={{ background: '#fff1f0' }}>
//           <Table
//             size="small"
//             rowKey="_id"
//             dataSource={ticketList}
//             pagination={{ pageSize: 5 }}
//             columns={[
//               { title: 'Title', dataIndex: 'title', key: 'title' },
//               { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Text code>{t}</Text> },
//               { title: 'Department', dataIndex: ['departmentId', 'name'], key: 'dept' },
//               { 
//                 title: 'Action', 
//                 key: 'go', 
//                 render: () => <Button type="link" onClick={() => messageApi.info('Redirecting to tickets...')}>Review</Button> 
//               }
//             ]}
//           />
//         </Card>
//       )}
//     </div>
//   );
// }










import { useState } from 'react';
import { Row, Col, Card, Statistic, Table, Button, Modal, InputNumber, message, Progress, Typography, Divider } from 'antd';
import { EditOutlined, DashboardOutlined, PieChartOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboard, tickets, departments } from '../api';

const { Title, Text } = Typography;

export default function DirectorDashboard() {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [newBudget, setNewBudget] = useState(0);

  // --- Data Fetching ---
  const { data: spending = [], isLoading: isSpendingLoading } = useQuery({
    queryKey: ['dashboard', 'spending'],
    queryFn: dashboard.spending,
  });

  const { data: totalSpent = {} } = useQuery({
    queryKey: ['dashboard', 'totalSpent'],
    queryFn: dashboard.totalSpent,
  });

  const { data: ticketList = [] } = useQuery({
    queryKey: ['tickets', 'pending'],
    queryFn: () => tickets.list({ status: 'Pending' }),
  });

  // --- Mutation for Updating Budget ---
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, budget }) => departments.update(id, { budgetAllocated: budget }),
    onSuccess: () => {
      messageApi.success('Budget updated successfully');
      // Invalidate both spending and total spent to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
      setEditingDept(null);
    },
    onError: (error) => {
      console.error("Update Error:", error);
      messageApi.error('Failed to update budget. Please try again.');
    },
  });

  const handleEdit = (record) => {
    setEditingDept(record);
    setNewBudget(record.budgetAllocated || 0);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingDept?._id) return;
    
    updateBudgetMutation.mutate({ 
      id: editingDept._id, 
      budget: newBudget 
    });
  };

  const chartData = spending.map((d) => ({
    name: d.name?.length > 15 ? d.name.slice(0, 15) + '...' : d.name,
    budget: d.budgetAllocated,
    spent: d.totalSpent,
  }));

  return (
    <div style={{ padding: '24px' }}>
      {contextHolder}
      
      <Title level={2} style={{ marginBottom: 24 }}>
        <DashboardOutlined /> Director Dashboard
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: '12px', background: '#e6f7ff', borderLeft: '6px solid #1890ff' }}>
            <Statistic 
              title="Total Institutional Expenditure" 
              value={totalSpent.totalSpent ?? 0} 
              prefix="₹" 
              valueStyle={{ color: '#003a8c', fontWeight: 700 }} 
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ borderRadius: '12px', background: '#fff7e6', borderLeft: '6px solid #fa8c16' }}>
            <Statistic 
              title="Tickets Awaiting Your Approval" 
              value={ticketList.length} 
              valueStyle={{ color: '#873800', fontWeight: 700 }} 
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<span><PieChartOutlined /> Budget Utilization Analysis</span>} 
        style={{ marginTop: 24, borderRadius: '12px' }}
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={70} />
            <YAxis />
            <RechartsTooltip cursor={{ fill: '#f5f5f5' }} />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
            <Bar dataKey="budget" fill="#1890ff" name="Allocated Budget" radius={[4, 4, 0, 0]} barSize={35} />
            <Bar dataKey="spent" fill="#52c41a" name="Actual Spent" radius={[4, 4, 0, 0]} barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Departmental Summary & Budget Control" style={{ marginTop: 24, borderRadius: '12px' }}>
        <Table
          size="middle"
          rowKey="_id"
          dataSource={spending}
          loading={isSpendingLoading}
          pagination={false}
          columns={[
            { title: 'Department', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
            { title: 'Budget (₹)', dataIndex: 'budgetAllocated', render: (val) => `₹${(val || 0).toLocaleString()}` },
            { 
                title: 'Utilization', 
                key: 'utilization',
                width: 200,
                render: (_, record) => {
                  const percent = record.budgetAllocated > 0 ? Math.round((record.totalSpent / record.budgetAllocated) * 100) : 0;
                  return (
                    <Progress 
                      percent={percent} 
                      size="small" 
                      status={percent > 90 ? 'exception' : 'active'} 
                      strokeColor={percent > 90 ? '#ff4d4f' : '#52c41a'}
                    />
                  );
                }
            },
            { 
                title: 'Remaining (₹)', 
                key: 'remaining', 
                render: (_, record) => {
                  const v = record.budgetAllocated - record.totalSpent;
                  return (
                    <Text type={v < 0 ? 'danger' : 'success'} strong>
                        {v < 0 ? `(Over) ₹${Math.abs(v).toLocaleString()}` : `₹${v.toLocaleString()}`}
                    </Text>
                  );
                }
            },
            {
              title: 'Action',
              key: 'action',
              align: 'center',
              render: (_, record) => (
                <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                  Allot Budget
                </Button>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={<span><EditOutlined /> Adjust Departmental Budget</span>}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={updateBudgetMutation.isPending} // Updated for TanStack Query v5
        okText="Update & Save"
        cancelText="Cancel"
        destroyOnClose // Ensures state resets when closed
      >
        <div style={{ padding: '10px 0' }}>
          <Text type="secondary">Department:</Text>
          <Title level={4} style={{ marginTop: 0 }}>{editingDept?.name}</Title>
          <Divider style={{ margin: '12px 0' }} />
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <Statistic title="Total Spent" value={editingDept?.totalSpent} prefix="₹" valueStyle={{ fontSize: '1.2rem' }} />
            </Col>
            <Col span={12}>
              <Statistic title="Current Budget" value={editingDept?.budgetAllocated} prefix="₹" valueStyle={{ fontSize: '1.2rem' }} />
            </Col>
          </Row>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>New Budget Allocation:</label>
          <InputNumber
            prefix="₹"
            style={{ width: '100%' }}
            value={newBudget}
            onChange={(val) => setNewBudget(val)}
            min={0}
            size="large"
            placeholder="Enter amount"
          />
        </div>
      </Modal>

      {ticketList.length > 0 && (
        <Card title="Priority Pending Approvals" style={{ marginTop: 24, borderRadius: '12px' }} headStyle={{ background: '#fff1f0' }}>
          <Table
            size="small"
            rowKey="_id"
            dataSource={ticketList}
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Title', dataIndex: 'title', key: 'title' },
              { title: 'Type', dataIndex: 'type', key: 'type', render: (t) => <Text code>{t}</Text> },
              { title: 'Department', dataIndex: ['departmentId', 'name'], key: 'dept' },
              { 
                title: 'Action', 
                key: 'go', 
                render: () => <Button type="link" onClick={() => messageApi.info('Redirecting to tickets...')}>Review</Button> 
              }
            ]}
          />
        </Card>
      )}
    </div>
  );
}