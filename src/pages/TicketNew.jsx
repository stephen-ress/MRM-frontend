import { useState } from 'react';
import { Form, Input, Button, Card, Select, App, Space, Typography } from 'antd'; 
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tickets } from '../api';
import { useAuth } from '../context/AuthContext';

export default function TicketNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [excelFile, setExcelFile] = useState(null);

  // Use the App hook for context-aware messages
  const { message } = App.useApp(); 

  const createMu = useMutation({
    mutationFn: (fd) => tickets.create(fd),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tickets']);
      message.success('Ticket submitted successfully');
      navigate(`/tickets/${data._id}`);
    },
    onError: (e) => {
      console.error("Upload Error:", e);
      message.error(e.response?.data?.message || 'Failed to raise ticket.');
    },
  });

  const onFinish = (v) => {
    const deptId = user?.departmentId?._id || user?.departmentId;
    
    if (!deptId) {
      return message.error("Your profile is not linked to a department.");
    }

    if (v.type === 'Requisition' && !excelFile) {
      return message.error("Please upload an Excel sheet for Requisitions.");
    }

    const formData = new FormData();
    formData.append('type', v.type);
    formData.append('title', v.title);
    formData.append('description', v.description || '');
    formData.append('departmentId', deptId); 
    
    if (excelFile) {
      formData.append('excelFile', excelFile);
    }

    createMu.mutate(formData);
  };

  return (
    <Card title="Raise New Ticket">
      <div style={{ marginBottom: 20, padding: '12px', background: '#f0f5ff', borderRadius: '8px', border: '1px solid #adc6ff' }}>
        <Typography.Text strong>Raising for Department: </Typography.Text>
        <Typography.Text code>{user?.departmentId?.name || "Detecting..."}</Typography.Text>
      </div>
      
      <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 560 }}>
        <Form.Item name="type" label="Ticket Type" rules={[{ required: true, message: 'Select a type' }]}>
          <Select placeholder="Select type" options={[
            { value: 'Service', label: 'Service (Repair)' },
            { value: 'Requisition', label: 'Requisition (New Items)' },
          ]} />
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
          <Input placeholder="E.g., Laptop repair" />
        </Form.Item>

        <Form.Item name="description" label="Detailed Description">
          <Input.TextArea rows={4} placeholder="Provide details..." />
        </Form.Item>

        <Form.Item label="Upload Excel Sheet (Required for Requisition)">
          <Input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={(e) => setExcelFile(e.target.files[0])} 
            style={{ padding: '4px' }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={createMu.isPending} size="large">
              Submit Ticket
            </Button>
            <Button onClick={() => navigate('/tickets')} size="large">Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}