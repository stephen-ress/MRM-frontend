import { useState, useMemo } from 'react';
import { 
  Button, Space, Tag, Typography, Card, 
  Input, Segmented, Table, Tooltip, message 
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SolutionOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { tickets } from '../api';
import * as XLSX from 'xlsx';

const { Text, Title } = Typography;

export default function Tickets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // --- Data Fetching ---
  const { data: list = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => tickets.list({}), 
  });

  // --- Filter logic ---
  const filteredData = useMemo(() => {
    return list.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item._id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [list, searchQuery, activeTab]);

  // --- Excel Export Logic ---
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      return message.warning("No tickets found to export");
    }

    // Map data to user-friendly Excel format
    const excelData = filteredData.map(item => ({
      'Ticket ID': item._id.toUpperCase(),
      'Title': item.title,
      'Department': item.departmentId?.name || 'General',
      'Status': item.status,
      'Estimated Cost (₹)': item.cost || 0,
      'Date Created': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets Report");

    // Download the file
    const fileName = `Tickets_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    message.success(`${activeTab} tickets exported successfully`);
  };

  // --- Column Definitions ---
  const columns = [
    {
      title: 'Ticket Details',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record._id.slice(-6).toUpperCase()}</Text>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: ['departmentId', 'name'],
      key: 'department',
      render: (name) => name || 'General',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        let icon = null;
        if (status === 'Pending') { color = 'gold'; icon = <ClockCircleOutlined />; }
        if (status === 'Approved by Director') { color = 'blue'; icon = <SolutionOutlined />; }
        if (status === 'Resolved') { color = 'green'; icon = <CheckCircleOutlined />; }
        if (status === 'Rejected') { color = 'red'; icon = <CloseCircleOutlined />; }
        
        return (
          <Tag icon={icon} color={color} style={{ borderRadius: '4px', fontWeight: 500 }}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Estimated Cost',
      dataIndex: 'cost',
      key: 'cost',
      align: 'right',
      render: (cost) => (
        <Text strong style={{ color: cost > 0 ? '#52c41a' : '#8c8c8c' }}>
          {cost ? `₹${cost.toLocaleString('en-IN')}` : '₹0'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            icon={<EyeOutlined style={{ color: '#1677ff' }} />} 
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click trigger
              navigate(`/tickets/${record._id}`);
            }} 
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Ticket Management</Title>
      </div>

      <Card 
        styles={{ body: { padding: '20px' } }} 
        style={{ borderRadius: '12px', marginBottom: 24, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          <div style={{ width: '100%' }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Filter by Status:</Text>
            <Segmented
              block
              value={activeTab}
              onChange={setActiveTab}
              options={['All', 'Pending', 'Approved by Director', 'Resolved', 'Rejected']}
              style={{ padding: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Input
              placeholder="Search by ticket title or ID..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              size="large"
              style={{ flex: 1, borderRadius: '8px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <Space size="middle">
              {/* Excel Export Button */}
              <Button 
                icon={<FileExcelOutlined />} 
                size="large"
                onClick={handleExportExcel}
                disabled={isLoading || filteredData.length === 0}
                style={{ borderRadius: '8px', fontWeight: 500 }}
              >
                Export Excel
              </Button>

              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                size="large"
                style={{ borderRadius: '8px', padding: '0 32px', height: '40px', fontWeight: 600 }}
                onClick={() => navigate('/tickets/new')}
              >
                Raise New Ticket
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      <Card 
        styles={{ body: { padding: 0 } }} 
        style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}
      >
        <Table 
          dataSource={filteredData} 
          columns={columns} 
          rowKey="_id"
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          onRow={(record) => ({
            onClick: () => navigate(`/tickets/${record._id}`),
            style: { cursor: 'pointer' }
          })}
        />
      </Card>
    </div>
  );
}







