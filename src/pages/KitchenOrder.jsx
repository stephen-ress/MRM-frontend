import { useState } from 'react';
import { Table, Button, InputNumber, Card, App, Typography, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { inventory, orders } from '../api'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

export default function KitchenOrder() {
  const [cart, setCart] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { message } = App.useApp(); 
  
  const { data: list = [], isLoading } = useQuery({ 
    queryKey: ['inventory', 'kitchen-selection'], 
    queryFn: () => {
      const deptId = user?.departmentId?._id || user?.departmentId;
      return inventory.list({ departmentId: deptId });
    }
  });

  const handleQtyChange = (id, val, name) => {
    setCart(prev => ({
      ...prev,
      [id]: { itemId: id, itemName: name, quantity: val }
    }));
  };

  const submitRequest = async () => {
    // Transform cart to match the Backend Schema: { itemId, itemName, quantity }
    const orderItems = Object.values(cart)
      .filter(i => i.quantity > 0)
      .map(item => ({
        itemId: item.itemId, // Matches backend schema
        itemName: item.itemName,
        quantity: item.quantity
      }));

    if (orderItems.length === 0) return message.error("Please select at least one item");

    try {
      await orders.create({ 
        items: orderItems, 
        orderedBy: user?.name || "Ram (Staff)" // Passing user info
      }); 
      message.success("Request sent to Admin for approval");
      navigate('/inventory');
    } catch (err) {
      console.error("Submission Error:", err);
      message.error(err.response?.data?.error || "Failed to send request");
    }
  };

  const columns = [
    { title: 'Item', dataIndex: 'itemName', key: 'itemName', style: { fontWeight: 'bold' } },
    { 
      title: 'In Stock', 
      dataIndex: 'currentQuantity', 
      key: 'stock',
      render: (q, r) => `${q} ${r.unit}` 
    },
    { 
      title: 'Order Quantity', 
      key: 'orderQty',
      render: (_, r) => (
        <InputNumber 
          min={0} 
          max={r.currentQuantity} 
          placeholder="0"
          style={{ width: '100%' }}
          onChange={(val) => handleQtyChange(r._id, val, r.itemName)} 
        />
      ) 
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventory')} type="text">
          Back to Inventory
        </Button>
        
        <Card variant="borderless" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
          <Title level={2} style={{ marginBottom: '24px' }}>Kitchen Daily Cooking Order</Title>
          <Table 
            dataSource={list} 
            columns={columns} 
            rowKey="_id" 
            loading={isLoading} 
            pagination={false} 
          />
          <Button 
            type="primary" block size="large" 
            onClick={submitRequest} 
            style={{ marginTop: 32, backgroundColor: '#52c41a', borderColor: '#52c41a', height: '54px', fontWeight: '600' }}
          >
            Send to Admin for Approval
          </Button>
        </Card>
      </Space>
    </div>
  );
}





