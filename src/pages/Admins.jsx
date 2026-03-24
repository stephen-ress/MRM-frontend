import { Table } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { users } from '../api';

export default function Admins() {
  const { data: list = [], isLoading } = useQuery({
    queryKey: ['users', 'admins'],
    queryFn: users.admins,
  });

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Admins</h1>
      <Table
        loading={isLoading}
        rowKey="_id"
        dataSource={list}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Department', dataIndex: ['departmentId', 'name'] },
        ]}
      />
    </div>
  );
}
