import { useState } from 'react';
import { Table, Button, Card, Select, Form, InputNumber, Input, Space, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { audits, departments, inventory } from '../api';

export default function Audits() {
  const [deptFilter, setDeptFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { data: deptList = [] } = useQuery({ queryKey: ['departments'], queryFn: departments.list });
  const { data: list = [], isLoading } = useQuery({
    queryKey: ['audits', deptFilter],
    queryFn: () => audits.list(deptFilter ? { departmentId: deptFilter } : {}),
  });
  const selectedDeptId = Form.useWatch('departmentId', form);
  const { data: invList = [] } = useQuery({
    queryKey: ['inventory', selectedDeptId],
    queryFn: () => inventory.list(selectedDeptId ? { departmentId: selectedDeptId } : {}),
    enabled: !!selectedDeptId,
  });

  const createMu = useMutation({
    mutationFn: (data) => audits.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['audits']); setModalOpen(false); form.resetFields(); message.success('Audit created'); },
    onError: (e) => message.error(e.response?.data?.message || 'Failed'),
  });

  const onFinish = (v) => {
    const discrepancies = (v.discrepancies || []).filter((d) => d.inventoryId && (d.systemStock != null || d.physicalStock != null)).map((d) => ({
      inventoryId: d.inventoryId,
      itemName: invList.find((i) => i._id === d.inventoryId)?.itemName || d.itemName,
      systemStock: d.systemStock,
      physicalStock: d.physicalStock,
      variance: (d.physicalStock ?? 0) - (d.systemStock ?? 0),
      notes: d.notes,
    }));
    createMu.mutate({ departmentId: v.departmentId, auditDate: v.auditDate, discrepancies, notes: v.notes });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Audits</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }}>New audit</Button>
          <Select
          placeholder="Department"
          allowClear
          style={{ width: 260 }}
          value={deptFilter || undefined}
          onChange={setDeptFilter}
          options={deptList.map((d) => ({ value: d._id, label: d.name }))}
        />
        </Space>
      </div>
      <Table
        loading={isLoading}
        rowKey="_id"
        dataSource={list}
        expandable={{
          expandedRowRender: (r) => (
            <div style={{ marginLeft: 24 }}>
              {r.discrepancies?.length > 0 ? (
                <Table
                  size="small"
                  dataSource={r.discrepancies}
                  rowKey={(_, i) => i}
                  columns={[
                    { title: 'Item', dataIndex: 'itemName' },
                    { title: 'System', dataIndex: 'systemStock' },
                    { title: 'Physical', dataIndex: 'physicalStock' },
                    { title: 'Variance', dataIndex: 'variance' },
                    { title: 'Notes', dataIndex: 'notes' },
                  ]}
                  pagination={false}
                />
              ) : (
                <span>No discrepancies recorded</span>
              )}
              {r.notes && <p style={{ marginTop: 8 }}><strong>Notes:</strong> {r.notes}</p>}
            </div>
          ),
        }}
        columns={[
          { title: 'Department', dataIndex: ['departmentId', 'name'] },
          { title: 'Conducted by', dataIndex: ['conductedBy', 'name'] },
          { title: 'Date', dataIndex: 'auditDate', render: (d) => d ? new Date(d).toLocaleDateString() : '-' },
          { title: 'Discrepancies', dataIndex: 'discrepancies', render: (d) => (d?.length ?? 0) },
        ]}
      />
      <Modal
        title="New audit"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        footer={null}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="departmentId" label="Department" rules={[{ required: true }]}>
            <Select options={deptList.map((d) => ({ value: d._id, label: d.name }))} placeholder="Select department" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.List name="discrepancies">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...rest} name={[name, 'inventoryId']} label="Item" rules={[{ required: true }]}>
                      <Select
                        placeholder="Item"
                        style={{ width: 200 }}
                        options={invList.map((i) => ({ value: i._id, label: `${i.itemName} (sys: ${i.currentQuantity})` }))}
                      />
                    </Form.Item>
                    <Form.Item {...rest} name={[name, 'systemStock']} label="System">
                      <InputNumber min={0} placeholder="System" />
                    </Form.Item>
                    <Form.Item {...rest} name={[name, 'physicalStock']} label="Physical">
                      <InputNumber min={0} placeholder="Physical" />
                    </Form.Item>
                    <Form.Item {...rest} name={[name, 'notes']}>
                      <Input placeholder="Notes" style={{ width: 100 }} />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>Remove</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>+ Add discrepancy</Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMu.isPending}>Create audit</Button>
              <Button onClick={() => { setModalOpen(false); form.resetFields(); }}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
