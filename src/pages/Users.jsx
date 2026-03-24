import { useState } from 'react';
import { Table, Button, Select, Space, message, Popconfirm } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { users, departments } from '../api';

export default function Users() {
  const [deptFilter, setDeptFilter] = useState('');
  const queryClient = useQueryClient();
  const { data: deptList = [] } = useQuery({ queryKey: ['departments'], queryFn: departments.list });
  const { data: list = [], isLoading } = useQuery({
    queryKey: ['users', deptFilter],
    queryFn: () => users.list(deptFilter ? { departmentId: deptFilter } : {}),
  });

  const deactivateMu = useMutation({
    mutationFn: users.deactivate,
    onSuccess: () => { queryClient.invalidateQueries(['users']); message.success('User removed from list'); },
    onError: (e) => message.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Users (department-wise)</h1>
        <Select
          placeholder="Department"
          allowClear
          style={{ width: 280 }}
          value={deptFilter || undefined}
          onChange={setDeptFilter}
          options={deptList.map((d) => ({ value: d._id, label: d.name }))}
        />
      </div>
      <Table
        loading={isLoading}
        rowKey="_id"
        dataSource={list}
        columns={[
          { title: 'Name', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Role', dataIndex: 'role' },
          { title: 'Department', dataIndex: ['departmentId', 'name'] },
          {
            title: 'Actions',
            render: (_, r) => (
              <Popconfirm
                title="Remove user from list? (Deactivate)"
                onConfirm={() => deactivateMu.mutate(r._id)}
              >
                <Button size="small" danger>Remove</Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </div>
  );
}






