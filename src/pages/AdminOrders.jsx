// import React, { useState } from 'react';
// import { Table, Button, Card, App, Typography, Tag, Space, Input, Tooltip } from 'antd';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { orders } from '../api';
// import { 
//   CheckCircleOutlined, 
//   ClockCircleOutlined, 
//   FileDoneOutlined, 
//   SearchOutlined, 
//   FileExcelOutlined 
// } from '@ant-design/icons';
// import * as XLSX from 'xlsx';
// import dayjs from 'dayjs';

// export default function AdminOrders() {
//   const { message } = App.useApp();
//   const queryClient = useQueryClient();
//   const [searchText, setSearchText] = useState('');

//   // 1. DATA FETCHING
//   const { data: allOrders = [], isLoading } = useQuery({
//     queryKey: ['orders', 'all'],
//     queryFn: () => orders.list(),
//     refetchInterval: 10000,
//   });

//   const approveMutation = useMutation({
//     mutationFn: (id) => orders.approve(id),
//     onSuccess: () => {
//       message.success("Order Approved & Stock Deducted");
//       queryClient.invalidateQueries(['orders']);
//       queryClient.invalidateQueries(['inventory']);
//     },
//   });

//   // HELPER: Flatten order data for Excel (One row per item)
//   const formatDataForExcel = (ordersList) => {
//     const rows = [];
//     ordersList.forEach(order => {
//       order.items.forEach(item => {
//         rows.push({
//           'Date': dayjs(order.createdAt).format('DD-MM-YYYY HH:mm'),
//           'Ordered By': order.orderedBy || 'Kitchen Staff',
//           'Item Name': item.itemName,
//           'Quantity': item.quantity,
//           'Unit': item.unit || 'pcs', // Measurement column
//           'Status': order.status,
//           'Order ID': order._id.slice(-6).toUpperCase()
//         });
//       });
//     });
//     return rows;
//   };

//   // EXCEL EXPORT LOGIC: Single Order
//   const exportSingleOrder = (order) => {
//     const dataToExport = formatDataForExcel([order]);
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");
//     XLSX.writeFile(workbook, `Order_${order._id.slice(-6)}.xlsx`);
//   };

//   // EXCEL EXPORT LOGIC: Bulk
//   const handleExportExcel = () => {
//     const dataToExport = formatDataForExcel(filteredData);
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Kitchen Inventory Requests");
//     XLSX.writeFile(workbook, `All_Kitchen_Orders_${dayjs().format('YYYY-MM-DD')}.xlsx`);
//   };

//   // SEARCH FILTER LOGIC
//   const filteredData = allOrders.filter(order => {
//     const searchLower = searchText.toLowerCase();
//     return (
//       (order.orderedBy || '').toLowerCase().includes(searchLower) ||
//       order.status.toLowerCase().includes(searchLower) ||
//       order.items.some(i => i.itemName.toLowerCase().includes(searchLower))
//     );
//   });

//   const columns = [
//     { 
//       title: 'Date', 
//       dataIndex: 'createdAt', 
//       key: 'createdAt',
//       width: 180,
//       sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//       render: (date) => (
//         <span style={{ color: '#666' }}>
//           {dayjs(date).format('DD MMM YYYY, hh:mm A')}
//         </span>
//       )
//     },
//     { 
//       title: 'Ordered By', 
//       dataIndex: 'orderedBy', 
//       key: 'orderedBy',
//       render: (text) => <b>{text || 'Kitchen Staff'}</b>
//     },
//     { 
//       title: 'Items Requested', 
//       dataIndex: 'items', 
//       key: 'items',
//       render: (items) => (
//         <Space wrap>
//           {items.map((i, idx) => (
//             <Tag color="blue" key={i.itemId || idx} style={{ fontSize: '13px' }}>
//               {i.itemName} <b>x{i.quantity}</b> {i.unit && <small>({i.unit})</small>}
//             </Tag>
//           ))}
//         </Space>
//       ) 
//     },
//     { 
//       title: 'Status', 
//       dataIndex: 'status',
//       key: 'status',
//       render: (status) => (
//         <Tag 
//           icon={status === 'Approved' ? <CheckCircleOutlined /> : <ClockCircleOutlined spin={status === 'Pending'} />} 
//           color={status === 'Approved' ? 'success' : 'orange'}
//         >
//           {status === 'Approved' ? 'COMPLETED' : 'PENDING'}
//         </Tag>
//       ) 
//     },
//     { 
//       title: 'Actions', 
//       key: 'action',
//       align: 'right',
//       render: (_, record) => (
//         <Space size="middle">
//           <Tooltip title="Download Excel">
//             <Button 
//               icon={<FileExcelOutlined />} 
//               size="small"
//               onClick={() => exportSingleOrder(record)}
//               style={{ color: '#1d743e', borderColor: '#1d743e' }}
//             />
//           </Tooltip>

//           {record.status === 'Approved' ? (
//             <Tag icon={<FileDoneOutlined />} color="default" style={{ padding: '4px 12px', borderRadius: '4px', margin: 0 }}>
//               Done
//             </Tag>
//           ) : (
//             <Button 
//               type="primary" 
//               icon={<CheckCircleOutlined />} 
//               loading={approveMutation.isPending && approveMutation.variables === record._id}
//               onClick={() => approveMutation.mutate(record._id)}
//               style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
//             >
//               Approve & Deduct
//             </Button>
//           )}
//         </Space>
//       ) 
//     }
//   ];

//   return (
//     <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
//       <Typography.Title level={2} style={{ marginBottom: 24 }}>
//         Kitchen Requests Management
//       </Typography.Title>
      
//       <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
        
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           marginBottom: 20,
//           gap: '16px',
//           flexWrap: 'wrap'
//         }}>
//           <Input
//             placeholder="Search items, staff or status..."
//             prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
//             style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//           />
          
//           <Button 
//             icon={<FileExcelOutlined />} 
//             onClick={handleExportExcel}
//             style={{ borderRadius: '6px', display: 'flex', alignItems: 'center' }}
//           >
//             Export All to Excel
//           </Button>
//         </div>

//         <Table 
//           dataSource={[...filteredData].reverse()} 
//           columns={columns} 
//           rowKey="_id" 
//           loading={isLoading} 
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
//     </div>
//   );
// }





import React, { useState } from 'react';
import { Table, Button, Card, App, Typography, Tag, Space, Input, Tooltip, Row, Col } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orders } from '../api';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileDoneOutlined, 
  SearchOutlined, 
  FileExcelOutlined,
  PlusOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function AdminOrders() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');

  // 1. DATA FETCHING
  const { data: allOrders = [], isLoading } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orders.list(),
    refetchInterval: 10000,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => orders.approve(id),
    onSuccess: () => {
      message.success("Order Approved & Stock Deducted");
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['inventory']);
    },
  });

  // HELPER: Flatten order data for Excel
  const formatDataForExcel = (ordersList) => {
    const rows = [];
    ordersList.forEach(order => {
      order.items.forEach(item => {
        rows.push({
          'Date': dayjs(order.createdAt).format('DD-MM-YYYY HH:mm'),
          'Ordered By': order.orderedBy || 'Kitchen Staff',
          'Item Name': item.itemName,
          'Quantity': item.quantity,
          'Unit': item.unit || 'pcs',
          'Status': order.status,
          'Order ID': order._id.slice(-6).toUpperCase()
        });
      });
    });
    return rows;
  };

  const handleExportExcel = () => {
    const dataToExport = formatDataForExcel(filteredData);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");
    XLSX.writeFile(workbook, `Kitchen_Orders_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  const filteredData = allOrders.filter(order => {
    const searchLower = searchText.toLowerCase();
    return (
      (order.orderedBy || '').toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.items.some(i => i.itemName.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { 
      title: 'Ticket Details', 
      key: 'details',
      render: (_, record) => (
        <div>
          <Text strong>{record.orderedBy || 'Kitchen Staff'}</Text><br/>
          <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record._id.slice(-6).toUpperCase()}</Text>
        </div>
      )
    },
    { 
      title: 'Items Requested', 
      dataIndex: 'items', 
      key: 'items',
      render: (items) => (
        <Space wrap>
          {items.map((i, idx) => (
            <Tag color="blue" key={i.itemId || idx}>
              {i.itemName} x{i.quantity}
            </Tag>
          ))}
        </Space>
      ) 
    },
    { 
      title: 'Status', 
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          icon={status === 'Approved' ? <CheckCircleOutlined /> : <ClockCircleOutlined spin={status === 'Pending'} />} 
          color={status === 'Approved' ? 'success' : 'orange'}
          style={{ borderRadius: '20px', padding: '0 10px' }}
        >
          {status === 'Approved' ? 'RESOLVED' : 'PENDING'}
        </Tag>
      ) 
    },
    { 
      title: 'Actions', 
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'Approved' ? (
            <Tag icon={<FileDoneOutlined />} color="default">Done</Tag>
          ) : (
            <Button 
              type="primary" 
              size="small"
              onClick={() => approveMutation.mutate(record._id)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', borderRadius: '4px' }}
            >
              Approve & Deduct
            </Button>
          )}
        </Space>
      ) 
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 32 }}>Kitchen Requests Management</Title>
      
      <Card variant="borderless" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '16px' }}>
        
        {/* Filter Section - Matches image */}
        <div style={{ marginBottom: '24px' }}>
            <Text type="secondary">Filter by Status:</Text>
            <div style={{ 
                background: '#f5f5f5', 
                padding: '4px', 
                borderRadius: '8px', 
                display: 'inline-flex', 
                width: '100%', 
                marginTop: '8px',
                justifyContent: 'space-between'
            }}>
                <Button type="text" style={{ flex: 1, background: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>All</Button>
                <Button type="text" style={{ flex: 1 }}>Pending</Button>
                <Button type="text" style={{ flex: 1 }}>Approved</Button>
                <Button type="text" style={{ flex: 1 }}>Resolved</Button>
                <Button type="text" style={{ flex: 1 }}>Rejected</Button>
            </div>
        </div>

        {/* Search and Buttons Row - Matches image */}
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '32px' }}>
          <Col xs={24} md={14}>
            <Input
              placeholder="Search by ticket title or ID..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              size="large"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} md={5}>
            <Button 
              icon={<FileExcelOutlined />} 
              size="large"
              block
              onClick={handleExportExcel}
              style={{ borderRadius: '8px', fontWeight: 500 }}
            >
              Export Excel
            </Button>
          </Col>
          <Col xs={12} md={5}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="large"
              block
              style={{ 
                borderRadius: '8px', 
                background: '#1890ff', 
                fontWeight: 600 
              }}
            >
              Raise New Ticket
            </Button>
          </Col>
        </Row>

        <Table 
          dataSource={[...filteredData].reverse()} 
          columns={columns} 
          rowKey="_id" 
          loading={isLoading} 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}