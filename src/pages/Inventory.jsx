// // // // // // // // // // // // // import { useState } from 'react';
// // // // // // // // // // // // // import { 
// // // // // // // // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // // // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // // // // // // // //   Segmented, Select, Card 
// // // // // // // // // // // // // } from 'antd';
// // // // // // // // // // // // // import { 
// // // // // // // // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // // // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // // // // // // // //   ShoppingOutlined // Import for Today's Order
// // // // // // // // // // // // // } from '@ant-design/icons';
// // // // // // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // // // // // // // import { inventory, departments } from '../api';
// // // // // // // // // // // // // import { useNavigate } from 'react-router-dom'; // Added for navigation
// // // // // // // // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // // // // // // export default function Inventory() {
// // // // // // // // // // // // //   const { user } = useAuth();
// // // // // // // // // // // // //   const navigate = useNavigate();
// // // // // // // // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // // // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // // // // // // // //   const [form] = Form.useForm();
// // // // // // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // // // // // //   // Role & Department Checks
// // // // // // // // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // // // // // // // //   const isStaff = user?.role === 'Staff';
// // // // // // // // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
  
// // // // // // // // // // // // //   // STRICT LOGIC: Only show "Today's Order" to users assigned to the Kitchen department
// // // // // // // // // // // // //   const isKitchenUser = user?.departmentId?.name === 'Kitchen' || user?.departmentName === 'Kitchen';

// // // // // // // // // // // // //   // --- Data Fetching ---
// // // // // // // // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // // // // // // // //     queryKey: ['departments'], 
// // // // // // // // // // // // //     queryFn: departments.list,
// // // // // // // // // // // // //     enabled: !isStaff 
// // // // // // // // // // // // //   });

// // // // // // // // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // // // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId],
// // // // // // // // // // // // //     queryFn: () => {
// // // // // // // // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // // // // // // // //     },
// // // // // // // // // // // // //   });

// // // // // // // // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // // // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // // // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // // // // // // // //   });
// // // // // // // // // // // // //   const belowIds = new Set(belowThreshold.map((i) => i._id));

// // // // // // // // // // // // //   // --- Excel Export Logic ---
// // // // // // // // // // // // //   const handleExportExcel = () => {
// // // // // // // // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // // // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // // // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // // // // // // // //       'Item Name': item.itemName,
// // // // // // // // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // // // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // // // // // // // //       'Unit': item.unit,
// // // // // // // // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // // // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // // // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // // // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // // // // // // // //     }));
// // // // // // // // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // // // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // // // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // // // // // // // //     XLSX.writeFile(workbook, `Inventory_Report_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // // // // // // // //     message.success('Excel file downloaded');
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   // --- Mutations ---
// // // // // // // // // // // // //   const createMu = useMutation({
// // // // // // // // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // // // // // // // //   });

// // // // // // // // // // // // //   const updateMu = useMutation({
// // // // // // // // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // // // // // // // //   });

// // // // // // // // // // // // //   const deleteMu = useMutation({
// // // // // // // // // // // // //     mutationFn: inventory.delete,
// // // // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // // // // // // // //   });

// // // // // // // // // // // // //   const handleCloseModal = () => {
// // // // // // // // // // // // //     setModalOpen(false);
// // // // // // // // // // // // //     setEditing(null);
// // // // // // // // // // // // //     form.resetFields();
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const openEdit = (record) => {
// // // // // // // // // // // // //     setEditing(record);
// // // // // // // // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id });
// // // // // // // // // // // // //     setModalOpen(true);
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const onFinish = (v) => {
// // // // // // // // // // // // //     const finalDeptId = isStaff ? staffDeptId : (deptFilter || v.departmentId);
// // // // // // // // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // // // // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // // // // // // // //     else createMu.mutate(finalData);
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const columns = [
// // // // // // // // // // // // //     {
// // // // // // // // // // // // //       title: 'Item Name',
// // // // // // // // // // // // //       dataIndex: 'itemName',
// // // // // // // // // // // // //       sorter: (a, b) => a.itemName.localeCompare(b.itemName),
// // // // // // // // // // // // //       render: (name, r) => (
// // // // // // // // // // // // //         <Space direction="vertical" size={0}>
// // // // // // // // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // // // // // // // //           {belowIds.has(r._id) && (
// // // // // // // // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // // // // // // // //           )}
// // // // // // // // // // // // //         </Space>
// // // // // // // // // // // // //       ),
// // // // // // // // // // // // //     },
// // // // // // // // // // // // //     { title: 'Department', dataIndex: ['departmentId', 'name'], hidden: isStaff || !!deptFilter },
// // // // // // // // // // // // //     { 
// // // // // // // // // // // // //       title: 'Current Stock', 
// // // // // // // // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // // // // // // // //       align: 'right',
// // // // // // // // // // // // //       sorter: (a, b) => a.currentQuantity - b.currentQuantity,
// // // // // // // // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // // // // // // // //     },
// // // // // // // // // // // // //     { 
// // // // // // // // // // // // //       title: 'Unit Price', 
// // // // // // // // // // // // //       dataIndex: 'unitPrice', 
// // // // // // // // // // // // //       align: 'right',
// // // // // // // // // // // // //       hidden: isStaff,
// // // // // // // // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // // // // // // // //     },
// // // // // // // // // // // // //     { 
// // // // // // // // // // // // //       title: 'Total Value', 
// // // // // // // // // // // // //       align: 'right',
// // // // // // // // // // // // //       hidden: isStaff,
// // // // // // // // // // // // //       render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
// // // // // // // // // // // // //     },
// // // // // // // // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // // // // // // // //     ...(isAdmin ? [{
// // // // // // // // // // // // //       title: 'Actions',
// // // // // // // // // // // // //       align: 'center',
// // // // // // // // // // // // //       width: 100,
// // // // // // // // // // // // //       render: (_, r) => (
// // // // // // // // // // // // //         <Space>
// // // // // // // // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
// // // // // // // // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // // // // // // // //             Modal.confirm({
// // // // // // // // // // // // //               title: 'Delete Item',
// // // // // // // // // // // // //               content: `Are you sure you want to delete ${r.itemName}?`,
// // // // // // // // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // // // // // // // //             });
// // // // // // // // // // // // //           }} />
// // // // // // // // // // // // //         </Space>
// // // // // // // // // // // // //       ),
// // // // // // // // // // // // //     }] : []),
// // // // // // // // // // // // //   ];

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // // // // // // // //       <h1 style={{ marginBottom: 20 }}>Inventory Management</h1>
      
// // // // // // // // // // // // //       <Card styles={{ body: { padding: '16px' } }} style={{ marginBottom: 24, borderRadius: '12px' }}>
// // // // // // // // // // // // //         <Space direction="vertical" style={{ width: '100%' }} size="large">
// // // // // // // // // // // // //           {!isStaff && (
// // // // // // // // // // // // //             <div>
// // // // // // // // // // // // //               <span style={{ fontWeight: 600, display: 'block', marginBottom: 12 }}>Filter by Department:</span>
// // // // // // // // // // // // //               <Segmented
// // // // // // // // // // // // //                 size="large"
// // // // // // // // // // // // //                 block
// // // // // // // // // // // // //                 options={[{ label: 'All Items', value: '' }, ...deptList.map(d => ({ label: d.name, value: d._id }))]}
// // // // // // // // // // // // //                 value={deptFilter}
// // // // // // // // // // // // //                 onChange={setDeptFilter}
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //           )}

// // // // // // // // // // // // //           <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
// // // // // // // // // // // // //             <Input
// // // // // // // // // // // // //               placeholder="Search items..."
// // // // // // // // // // // // //               prefix={<SearchOutlined />}
// // // // // // // // // // // // //               size="large"
// // // // // // // // // // // // //               style={{ maxWidth: '400px' }}
// // // // // // // // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // // // // // // // //               allowClear
// // // // // // // // // // // // //             />
// // // // // // // // // // // // //             <Space>
// // // // // // // // // // // // //               {/* BUTTON LOGIC: Strict check for Kitchen Department */}
// // // // // // // // // // // // //               {isKitchenUser && (
// // // // // // // // // // // // //                 <Button 
// // // // // // // // // // // // //                   type="primary" 
// // // // // // // // // // // // //                   size="large" 
// // // // // // // // // // // // //                   icon={<ShoppingOutlined />} 
// // // // // // // // // // // // //                   style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // // // // // // // //                   onClick={() => navigate('/kitchen-order')}
// // // // // // // // // // // // //                 >
// // // // // // // // // // // // //                   Today's Order
// // // // // // // // // // // // //                 </Button>
// // // // // // // // // // // // //               )}

// // // // // // // // // // // // //               <Button 
// // // // // // // // // // // // //                 icon={<FileExcelOutlined />} 
// // // // // // // // // // // // //                 size="large" 
// // // // // // // // // // // // //                 onClick={handleExportExcel}
// // // // // // // // // // // // //                 disabled={isLoading || list.length === 0}
// // // // // // // // // // // // //               >
// // // // // // // // // // // // //                 Export Excel
// // // // // // // // // // // // //               </Button>

// // // // // // // // // // // // //               {isAdmin && (
// // // // // // // // // // // // //                 <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // // // // // // // //                   Add New Item
// // // // // // // // // // // // //                 </Button>
// // // // // // // // // // // // //               )}
// // // // // // // // // // // // //             </Space>
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //         </Space>
// // // // // // // // // // // // //       </Card>

// // // // // // // // // // // // //       <Table
// // // // // // // // // // // // //         loading={isLoading}
// // // // // // // // // // // // //         rowKey="_id"
// // // // // // // // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // // // // // // // //         columns={columns}
// // // // // // // // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // // // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // // // // // // // //       />

// // // // // // // // // // // // //       <Modal
// // // // // // // // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // // // // // // // //         open={modalOpen}
// // // // // // // // // // // // //         onCancel={handleCloseModal}
// // // // // // // // // // // // //         footer={null}
// // // // // // // // // // // // //         destroyOnClose
// // // // // // // // // // // // //       >
// // // // // // // // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // // // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // // // // // // // //             <Input placeholder="e.g. Rice, Football, Pens" />
// // // // // // // // // // // // //           </Form.Item>

// // // // // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // // //             <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
// // // // // // // // // // // // //               <Select showSearch placeholder="Select unit">
// // // // // // // // // // // // //                 <Select.OptGroup label="Mass"><Select.Option value="kg">kg</Select.Option><Select.Option value="gm">gm</Select.Option></Select.OptGroup>
// // // // // // // // // // // // //                 <Select.OptGroup label="Volume"><Select.Option value="liters">liters</Select.Option><Select.Option value="ml">ml</Select.Option></Select.OptGroup>
// // // // // // // // // // // // //                 <Select.OptGroup label="Count"><Select.Option value="pcs">pcs (Pieces)</Select.Option><Select.Option value="pkt">packets</Select.Option><Select.Option value="units">units</Select.Option></Select.OptGroup>
// // // // // // // // // // // // //               </Select>
// // // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // // //           </div>

// // // // // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // // //             <Form.Item name="unitPrice" label="Price per Unit">
// // // // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
// // // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // // //           </div>

// // // // // // // // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
// // // // // // // // // // // // //             <Space>
// // // // // // // // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // // // // // // // //               <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
// // // // // // // // // // // // //                 Save Item
// // // // // // // // // // // // //               </Button>
// // // // // // // // // // // // //             </Space>
// // // // // // // // // // // // //           </Form.Item>
// // // // // // // // // // // // //         </Form>
// // // // // // // // // // // // //       </Modal>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }






// // // // // // // // // // // // import { useState } from 'react';
// // // // // // // // // // // // import { 
// // // // // // // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // // // // // // //   Select, Card 
// // // // // // // // // // // // } from 'antd';
// // // // // // // // // // // // import { 
// // // // // // // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // // // // // // //   ShoppingOutlined, FilterOutlined
// // // // // // // // // // // // } from '@ant-design/icons';
// // // // // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // // // // // // import { inventory, departments } from '../api';
// // // // // // // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // // // // // export default function Inventory() {
// // // // // // // // // // // //   const { user } = useAuth();
// // // // // // // // // // // //   const navigate = useNavigate();
// // // // // // // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // // // // // // //   const [form] = Form.useForm();
// // // // // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // // // // // // //   const isStaff = user?.role === 'Staff';
// // // // // // // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // // // // // // // // //   const isKitchenUser = user?.departmentId?.name === 'Kitchen' || user?.departmentName === 'Kitchen';

// // // // // // // // // // // //   // --- Data Fetching ---
// // // // // // // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // // // // // // //     queryKey: ['departments'], 
// // // // // // // // // // // //     queryFn: departments.list,
// // // // // // // // // // // //     enabled: !isStaff 
// // // // // // // // // // // //   });

// // // // // // // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId],
// // // // // // // // // // // //     queryFn: () => {
// // // // // // // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // // // // // // //     },
// // // // // // // // // // // //   });

// // // // // // // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // // // // // // //   });
// // // // // // // // // // // //   const belowIds = new Set(belowThreshold.map((i) => i._id));

// // // // // // // // // // // //   // --- Excel Export ---
// // // // // // // // // // // //   const handleExportExcel = () => {
// // // // // // // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // // // // // // //       'Item Name': item.itemName,
// // // // // // // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // // // // // // //       'Unit': item.unit,
// // // // // // // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // // // // // // //     }));
// // // // // // // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // // // // // // //     XLSX.writeFile(workbook, `Inventory_Report_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // // // // // // //     message.success('Excel file downloaded');
// // // // // // // // // // // //   };

// // // // // // // // // // // //   // --- Mutations ---
// // // // // // // // // // // //   const createMu = useMutation({
// // // // // // // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // // // // // // //   });

// // // // // // // // // // // //   const updateMu = useMutation({
// // // // // // // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // // // // // // //   });

// // // // // // // // // // // //   const deleteMu = useMutation({
// // // // // // // // // // // //     mutationFn: inventory.delete,
// // // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // // // // // // //   });

// // // // // // // // // // // //   const handleCloseModal = () => {
// // // // // // // // // // // //     setModalOpen(false);
// // // // // // // // // // // //     setEditing(null);
// // // // // // // // // // // //     form.resetFields();
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const openEdit = (record) => {
// // // // // // // // // // // //     setEditing(record);
// // // // // // // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id });
// // // // // // // // // // // //     setModalOpen(true);
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const onFinish = (v) => {
// // // // // // // // // // // //     const finalDeptId = isStaff ? staffDeptId : (deptFilter || v.departmentId);
// // // // // // // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // // // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // // // // // // //     else createMu.mutate(finalData);
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const columns = [
// // // // // // // // // // // //     {
// // // // // // // // // // // //       title: 'Item Name',
// // // // // // // // // // // //       dataIndex: 'itemName',
// // // // // // // // // // // //       sorter: (a, b) => a.itemName.localeCompare(b.itemName),
// // // // // // // // // // // //       render: (name, r) => (
// // // // // // // // // // // //         <Space direction="vertical" size={0}>
// // // // // // // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // // // // // // //           {belowIds.has(r._id) && (
// // // // // // // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // // // // // // //           )}
// // // // // // // // // // // //         </Space>
// // // // // // // // // // // //       ),
// // // // // // // // // // // //     },
// // // // // // // // // // // //     { title: 'Department', dataIndex: ['departmentId', 'name'], hidden: isStaff || !!deptFilter },
// // // // // // // // // // // //     { 
// // // // // // // // // // // //       title: 'Current Stock', 
// // // // // // // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // // // // // // //       align: 'right',
// // // // // // // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // // // // // // //     },
// // // // // // // // // // // //     { 
// // // // // // // // // // // //       title: 'Unit Price', 
// // // // // // // // // // // //       dataIndex: 'unitPrice', 
// // // // // // // // // // // //       align: 'right',
// // // // // // // // // // // //       hidden: isStaff,
// // // // // // // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // // // // // // //     },
// // // // // // // // // // // //     { 
// // // // // // // // // // // //       title: 'Total Value', 
// // // // // // // // // // // //       align: 'right',
// // // // // // // // // // // //       hidden: isStaff,
// // // // // // // // // // // //       render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
// // // // // // // // // // // //     },
// // // // // // // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // // // // // // //     ...(isAdmin ? [{
// // // // // // // // // // // //       title: 'Actions',
// // // // // // // // // // // //       align: 'center',
// // // // // // // // // // // //       width: 100,
// // // // // // // // // // // //       render: (_, r) => (
// // // // // // // // // // // //         <Space>
// // // // // // // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
// // // // // // // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // // // // // // //             Modal.confirm({
// // // // // // // // // // // //               title: 'Delete Item',
// // // // // // // // // // // //               content: `Are you sure you want to delete ${r.itemName}?`,
// // // // // // // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // // // // // // //             });
// // // // // // // // // // // //           }} />
// // // // // // // // // // // //         </Space>
// // // // // // // // // // // //       ),
// // // // // // // // // // // //     }] : []),
// // // // // // // // // // // //   ];

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // // // // // // //       <h1 style={{ marginBottom: 20 }}>Inventory Management</h1>
      
// // // // // // // // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
// // // // // // // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
// // // // // // // // // // // //           <Space size="middle">
// // // // // // // // // // // //             {/* SEARCH BOX */}
// // // // // // // // // // // //             <Input
// // // // // // // // // // // //               placeholder="Search items..."
// // // // // // // // // // // //               prefix={<SearchOutlined />}
// // // // // // // // // // // //               size="large"
// // // // // // // // // // // //               style={{ width: '300px' }}
// // // // // // // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // // // // // // //               allowClear
// // // // // // // // // // // //             />

// // // // // // // // // // // //             {/* IMPROVED DEPARTMENT FILTER: Select instead of Segmented */}
// // // // // // // // // // // //             {!isStaff && (
// // // // // // // // // // // //               <Select
// // // // // // // // // // // //                 showSearch
// // // // // // // // // // // //                 size="large"
// // // // // // // // // // // //                 style={{ width: '280px' }}
// // // // // // // // // // // //                 placeholder={<span><FilterOutlined /> Filter by Department</span>}
// // // // // // // // // // // //                 optionFilterProp="label"
// // // // // // // // // // // //                 value={deptFilter || undefined}
// // // // // // // // // // // //                 onChange={setDeptFilter}
// // // // // // // // // // // //                 allowClear
// // // // // // // // // // // //                 options={[
// // // // // // // // // // // //                   { label: 'All Departments', value: '' },
// // // // // // // // // // // //                   ...deptList.map(d => ({ label: d.name, value: d._id }))
// // // // // // // // // // // //                 ]}
// // // // // // // // // // // //               />
// // // // // // // // // // // //             )}
// // // // // // // // // // // //           </Space>

// // // // // // // // // // // //           <Space size="small">
// // // // // // // // // // // //             {isKitchenUser && (
// // // // // // // // // // // //               <Button 
// // // // // // // // // // // //                 type="primary" 
// // // // // // // // // // // //                 size="large" 
// // // // // // // // // // // //                 icon={<ShoppingOutlined />} 
// // // // // // // // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // // // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // // // // // // // //               >
// // // // // // // // // // // //                 Today's Order
// // // // // // // // // // // //               </Button>
// // // // // // // // // // // //             )}

// // // // // // // // // // // //             <Button 
// // // // // // // // // // // //               icon={<FileExcelOutlined />} 
// // // // // // // // // // // //               size="large" 
// // // // // // // // // // // //               onClick={handleExportExcel}
// // // // // // // // // // // //               disabled={isLoading || list.length === 0}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               Export Excel
// // // // // // // // // // // //             </Button>

// // // // // // // // // // // //             {isAdmin && (
// // // // // // // // // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // // // // // // //                 Add New Item
// // // // // // // // // // // //               </Button>
// // // // // // // // // // // //             )}
// // // // // // // // // // // //           </Space>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </Card>

// // // // // // // // // // // //       <Table
// // // // // // // // // // // //         loading={isLoading}
// // // // // // // // // // // //         rowKey="_id"
// // // // // // // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // // // // // // //         columns={columns}
// // // // // // // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // // // // // // //       />

// // // // // // // // // // // //       <Modal
// // // // // // // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // // // // // // //         open={modalOpen}
// // // // // // // // // // // //         onCancel={handleCloseModal}
// // // // // // // // // // // //         footer={null}
// // // // // // // // // // // //         destroyOnClose
// // // // // // // // // // // //       >
// // // // // // // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // // // // // // //             <Input placeholder="e.g. Rice, Football, Pens" />
// // // // // // // // // // // //           </Form.Item>

// // // // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // //             <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
// // // // // // // // // // // //               <Select showSearch placeholder="Select unit">
// // // // // // // // // // // //                 <Select.OptGroup label="Mass"><Select.Option value="kg">kg</Select.Option><Select.Option value="gm">gm</Select.Option></Select.OptGroup>
// // // // // // // // // // // //                 <Select.OptGroup label="Volume"><Select.Option value="liters">liters</Select.Option><Select.Option value="ml">ml</Select.Option></Select.OptGroup>
// // // // // // // // // // // //                 <Select.OptGroup label="Count"><Select.Option value="pcs">pcs (Pieces)</Select.Option><Select.Option value="pkt">packets</Select.Option><Select.Option value="units">units</Select.Option></Select.OptGroup>
// // // // // // // // // // // //               </Select>
// // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // //           </div>

// // // // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // //             <Form.Item name="unitPrice" label="Price per Unit">
// // // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
// // // // // // // // // // // //             </Form.Item>
// // // // // // // // // // // //           </div>

// // // // // // // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
// // // // // // // // // // // //             <Space>
// // // // // // // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // // // // // // //               <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
// // // // // // // // // // // //                 Save Item
// // // // // // // // // // // //               </Button>
// // // // // // // // // // // //             </Space>
// // // // // // // // // // // //           </Form.Item>
// // // // // // // // // // // //         </Form>
// // // // // // // // // // // //       </Modal>
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }















// // // // // // // // // // // import { useState, useMemo } from 'react';
// // // // // // // // // // // import { 
// // // // // // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // // // // // //   Select, Card 
// // // // // // // // // // // } from 'antd';
// // // // // // // // // // // import { 
// // // // // // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // // // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // // // // // // // } from '@ant-design/icons';
// // // // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // // // // // import { inventory, departments } from '../api';
// // // // // // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // // // // export default function Inventory() {
// // // // // // // // // // //   const { user } = useAuth();
// // // // // // // // // // //   const navigate = useNavigate();
// // // // // // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // // // // // //   const [form] = Form.useForm();
// // // // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // // // //   // Role & Department Extraction
// // // // // // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // // // // // //   const isStaff = user?.role === 'Staff';
  
// // // // // // // // // // //   // Extract ID safely whether it's populated or just a string
// // // // // // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // // // // // // // //   const staffDeptName = user?.departmentId?.name || "Your Department";

// // // // // // // // // // //   const isKitchenUser = user?.departmentId?.name === 'Kitchen' || user?.departmentName === 'Kitchen';

// // // // // // // // // // //   // --- Data Fetching ---
// // // // // // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // // // // // //     queryKey: ['departments'], 
// // // // // // // // // // //     queryFn: departments.list,
// // // // // // // // // // //     enabled: isAdmin // Only Admins need to fetch the full list of departments for the filter
// // // // // // // // // // //   });

// // // // // // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // // // // // // // //     queryFn: () => {
// // // // // // // // // // //       // LOGIC: If Staff, FORCE their departmentId. If Admin, use the filter.
// // // // // // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
      
// // // // // // // // // // //       if (isStaff && !staffDeptId) {
// // // // // // // // // // //         return []; // Safety check: if staff has no dept assigned, show nothing
// // // // // // // // // // //       }
      
// // // // // // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // // // // // //     },
// // // // // // // // // // //   });

// // // // // // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // // // // // //   });
// // // // // // // // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // // // // // // // //   // --- Excel Export ---
// // // // // // // // // // //   const handleExportExcel = () => {
// // // // // // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // // // // // //       'Item Name': item.itemName,
// // // // // // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // // // // // //       'Unit': item.unit,
// // // // // // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // // // // // //     }));
// // // // // // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // // // // // //     XLSX.writeFile(workbook, `${isStaff ? staffDeptName : 'Full'}_Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // // // // // //     message.success('Report downloaded');
// // // // // // // // // // //   };

// // // // // // // // // // //   // --- Mutations ---
// // // // // // // // // // //   const createMu = useMutation({
// // // // // // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // // // // // //   });

// // // // // // // // // // //   const updateMu = useMutation({
// // // // // // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // // // // // //   });

// // // // // // // // // // //   const deleteMu = useMutation({
// // // // // // // // // // //     mutationFn: inventory.delete,
// // // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // // // // // //   });

// // // // // // // // // // //   const handleCloseModal = () => {
// // // // // // // // // // //     setModalOpen(false);
// // // // // // // // // // //     setEditing(null);
// // // // // // // // // // //     form.resetFields();
// // // // // // // // // // //   };

// // // // // // // // // // //   const openEdit = (record) => {
// // // // // // // // // // //     setEditing(record);
// // // // // // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // // // // // // // //     setModalOpen(true);
// // // // // // // // // // //   };

// // // // // // // // // // //   const onFinish = (v) => {
// // // // // // // // // // //     // Force the item to belong to the Staff's department if they are creating it
// // // // // // // // // // //     const finalDeptId = isStaff ? staffDeptId : v.departmentId;
// // // // // // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
    
// // // // // // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // // // // // //     else createMu.mutate(finalData);
// // // // // // // // // // //   };

// // // // // // // // // // //   const columns = [
// // // // // // // // // // //     {
// // // // // // // // // // //       title: 'Item Name',
// // // // // // // // // // //       dataIndex: 'itemName',
// // // // // // // // // // //       sorter: (a, b) => a.itemName.localeCompare(b.itemName),
// // // // // // // // // // //       render: (name, r) => (
// // // // // // // // // // //         <Space direction="vertical" size={0}>
// // // // // // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // // // // // //           {belowIds.has(r._id) && (
// // // // // // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // // // // // //           )}
// // // // // // // // // // //         </Space>
// // // // // // // // // // //       ),
// // // // // // // // // // //     },
// // // // // // // // // // //     // Only show Department column to Admins viewing "All Items"
// // // // // // // // // // //     { 
// // // // // // // // // // //       title: 'Department', 
// // // // // // // // // // //       dataIndex: ['departmentId', 'name'], 
// // // // // // // // // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // // // // // // // // //     },
// // // // // // // // // // //     { 
// // // // // // // // // // //       title: 'Current Stock', 
// // // // // // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // // // // // //       align: 'right',
// // // // // // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // // // // // //     },
// // // // // // // // // // //     { 
// // // // // // // // // // //       title: 'Unit Price', 
// // // // // // // // // // //       dataIndex: 'unitPrice', 
// // // // // // // // // // //       align: 'right',
// // // // // // // // // // //       hidden: isStaff, // Hide financial data from Staff
// // // // // // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // // // // // //     },
// // // // // // // // // // //     { 
// // // // // // // // // // //       title: 'Total Value', 
// // // // // // // // // // //       align: 'right',
// // // // // // // // // // //       hidden: isStaff, // Hide financial data from Staff
// // // // // // // // // // //       render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
// // // // // // // // // // //     },
// // // // // // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // // // // // //     ...(isAdmin ? [{
// // // // // // // // // // //       title: 'Actions',
// // // // // // // // // // //       align: 'center',
// // // // // // // // // // //       width: 100,
// // // // // // // // // // //       render: (_, r) => (
// // // // // // // // // // //         <Space>
// // // // // // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
// // // // // // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // // // // // //             Modal.confirm({
// // // // // // // // // // //               title: 'Delete Item',
// // // // // // // // // // //               content: `Are you sure you want to delete ${r.itemName}?`,
// // // // // // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // // // // // //             });
// // // // // // // // // // //           }} />
// // // // // // // // // // //         </Space>
// // // // // // // // // // //       ),
// // // // // // // // // // //     }] : []),
// // // // // // // // // // //   ];

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // // // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // // // // // // // //         <h1 style={{ margin: 0 }}>Inventory Management</h1>
// // // // // // // // // // //         {isStaff && <Tag color="blue" icon={<HomeOutlined />} style={{ fontSize: '14px', padding: '4px 12px' }}>{staffDeptName}</Tag>}
// // // // // // // // // // //       </div>
      
// // // // // // // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
// // // // // // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
// // // // // // // // // // //           <Space size="middle">
// // // // // // // // // // //             <Input
// // // // // // // // // // //               placeholder="Search items..."
// // // // // // // // // // //               prefix={<SearchOutlined />}
// // // // // // // // // // //               size="large"
// // // // // // // // // // //               style={{ width: '300px' }}
// // // // // // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // // // // // //               allowClear
// // // // // // // // // // //             />

// // // // // // // // // // //             {/* Admin only sees the department switcher */}
// // // // // // // // // // //             {isAdmin && (
// // // // // // // // // // //               <Select
// // // // // // // // // // //                 showSearch
// // // // // // // // // // //                 size="large"
// // // // // // // // // // //                 style={{ width: '280px' }}
// // // // // // // // // // //                 placeholder={<span><FilterOutlined /> All Departments</span>}
// // // // // // // // // // //                 optionFilterProp="label"
// // // // // // // // // // //                 value={deptFilter || undefined}
// // // // // // // // // // //                 onChange={setDeptFilter}
// // // // // // // // // // //                 allowClear
// // // // // // // // // // //                 options={[
// // // // // // // // // // //                   { label: 'All Departments', value: '' },
// // // // // // // // // // //                   ...deptList.map(d => ({ label: d.name, value: d._id }))
// // // // // // // // // // //                 ]}
// // // // // // // // // // //               />
// // // // // // // // // // //             )}
// // // // // // // // // // //           </Space>

// // // // // // // // // // //           <Space size="small">
// // // // // // // // // // //             {isKitchenUser && (
// // // // // // // // // // //               <Button 
// // // // // // // // // // //                 type="primary" 
// // // // // // // // // // //                 size="large" 
// // // // // // // // // // //                 icon={<ShoppingOutlined />} 
// // // // // // // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // // // // // // //               >
// // // // // // // // // // //                 Today's Order
// // // // // // // // // // //               </Button>
// // // // // // // // // // //             )}

// // // // // // // // // // //             <Button 
// // // // // // // // // // //               icon={<FileExcelOutlined />} 
// // // // // // // // // // //               size="large" 
// // // // // // // // // // //               onClick={handleExportExcel}
// // // // // // // // // // //               disabled={isLoading || list.length === 0}
// // // // // // // // // // //             >
// // // // // // // // // // //               Export {isStaff ? 'Dept' : 'Full'} List
// // // // // // // // // // //             </Button>

// // // // // // // // // // //             {isAdmin && (
// // // // // // // // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // // // // // //                 Add New Item
// // // // // // // // // // //               </Button>
// // // // // // // // // // //             )}
// // // // // // // // // // //           </Space>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </Card>

// // // // // // // // // // //       <Table
// // // // // // // // // // //         loading={isLoading}
// // // // // // // // // // //         rowKey="_id"
// // // // // // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // // // // // //         columns={columns}
// // // // // // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // // // // // //       />

// // // // // // // // // // //       <Modal
// // // // // // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // // // // // //         open={modalOpen}
// // // // // // // // // // //         onCancel={handleCloseModal}
// // // // // // // // // // //         footer={null}
// // // // // // // // // // //         destroyOnClose
// // // // // // // // // // //       >
// // // // // // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // // // // // //             <Input placeholder="e.g. Rice, Football, Pens" />
// // // // // // // // // // //           </Form.Item>

// // // // // // // // // // //           {/* Admin must select which department an item belongs to when adding */}
// // // // // // // // // // //           {isAdmin && !editing && (
// // // // // // // // // // //              <Form.Item name="departmentId" label="Assign to Department" rules={[{ required: true }]}>
// // // // // // // // // // //                 <Select 
// // // // // // // // // // //                   placeholder="Select Department" 
// // // // // // // // // // //                   options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // // // // // // // // //                 />
// // // // // // // // // // //              </Form.Item>
// // // // // // // // // // //           )}

// // // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // // //             </Form.Item>
// // // // // // // // // // //             <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
// // // // // // // // // // //               <Select showSearch placeholder="Select unit">
// // // // // // // // // // //                 <Select.OptGroup label="Mass"><Select.Option value="kg">kg</Select.Option><Select.Option value="gm">gm</Select.Option></Select.OptGroup>
// // // // // // // // // // //                 <Select.OptGroup label="Volume"><Select.Option value="liters">liters</Select.Option><Select.Option value="ml">ml</Select.Option></Select.OptGroup>
// // // // // // // // // // //                 <Select.OptGroup label="Count"><Select.Option value="pcs">pcs (Pieces)</Select.Option><Select.Option value="pkt">packets</Select.Option><Select.Option value="units">units</Select.Option></Select.OptGroup>
// // // // // // // // // // //               </Select>
// // // // // // // // // // //             </Form.Item>
// // // // // // // // // // //           </div>

// // // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // // //             </Form.Item>
// // // // // // // // // // //             <Form.Item name="unitPrice" label="Price per Unit">
// // // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
// // // // // // // // // // //             </Form.Item>
// // // // // // // // // // //           </div>

// // // // // // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
// // // // // // // // // // //             <Space>
// // // // // // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // // // // // //               <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
// // // // // // // // // // //                 Save Item
// // // // // // // // // // //               </Button>
// // // // // // // // // // //             </Space>
// // // // // // // // // // //           </Form.Item>
// // // // // // // // // // //         </Form>
// // // // // // // // // // //       </Modal>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // }






// // // // // // // // // // import { useState, useMemo } from 'react';
// // // // // // // // // // import { 
// // // // // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // // // // //   Select, Card 
// // // // // // // // // // } from 'antd';
// // // // // // // // // // import { 
// // // // // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // // // // // // } from '@ant-design/icons';
// // // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // // // // import { inventory, departments } from '../api';
// // // // // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // // // export default function Inventory() {
// // // // // // // // // //   const { user } = useAuth();
// // // // // // // // // //   const navigate = useNavigate();
// // // // // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // // // // //   const [form] = Form.useForm();
// // // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // // //   // Role & Department Extraction
// // // // // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // // // // //   const isStaff = user?.role === 'Staff';
  
// // // // // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // // // // // // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "Your Department";

// // // // // // // // // //   // Check if user belongs to Kitchen
// // // // // // // // // //   const isKitchenUser = staffDeptName === 'Kitchen';

// // // // // // // // // //   // --- Data Fetching ---
// // // // // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // // // // //     queryKey: ['departments'], 
// // // // // // // // // //     queryFn: departments.list,
// // // // // // // // // //     enabled: isAdmin 
// // // // // // // // // //   });

// // // // // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // // // // // // //     queryFn: () => {
// // // // // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // // // //       if (isStaff && !staffDeptId) return []; 
// // // // // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // // // // //     },
// // // // // // // // // //   });

// // // // // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // // // // //   });
// // // // // // // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // // // // // // //   // --- Excel Export ---
// // // // // // // // // //   const handleExportExcel = () => {
// // // // // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // // // // //       'Item Name': item.itemName,
// // // // // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // // // // //       'Unit': item.unit,
// // // // // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // // // // //     }));
// // // // // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // // // // //     XLSX.writeFile(workbook, `${isStaff ? staffDeptName : 'Full'}_Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // // // // //     message.success('Report downloaded');
// // // // // // // // // //   };

// // // // // // // // // //   // --- Mutations ---
// // // // // // // // // //   const createMu = useMutation({
// // // // // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // // // // //   });

// // // // // // // // // //   const updateMu = useMutation({
// // // // // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // // // // //   });

// // // // // // // // // //   const deleteMu = useMutation({
// // // // // // // // // //     mutationFn: inventory.delete,
// // // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // // // // //   });

// // // // // // // // // //   const handleCloseModal = () => {
// // // // // // // // // //     setModalOpen(false);
// // // // // // // // // //     setEditing(null);
// // // // // // // // // //     form.resetFields();
// // // // // // // // // //   };

// // // // // // // // // //   const openEdit = (record) => {
// // // // // // // // // //     setEditing(record);
// // // // // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // // // // // // //     setModalOpen(true);
// // // // // // // // // //   };

// // // // // // // // // //   const onFinish = (v) => {
// // // // // // // // // //     // Priority: 1. Staff Dept ID, 2. Admin's Active Filter, 3. Form Selection
// // // // // // // // // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // // // //     const finalDeptId = autoDeptId || v.departmentId;

// // // // // // // // // //     if (!finalDeptId) return message.error("Please select a department");

// // // // // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // // // // //     else createMu.mutate(finalData);
// // // // // // // // // //   };

// // // // // // // // // //   const columns = [
// // // // // // // // // //     {
// // // // // // // // // //       title: 'Item Name',
// // // // // // // // // //       dataIndex: 'itemName',
// // // // // // // // // //       sorter: (a, b) => a.itemName.localeCompare(b.itemName),
// // // // // // // // // //       render: (name, r) => (
// // // // // // // // // //         <Space direction="vertical" size={0}>
// // // // // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // // // // //           {belowIds.has(r._id) && (
// // // // // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // // // // //           )}
// // // // // // // // // //         </Space>
// // // // // // // // // //       ),
// // // // // // // // // //     },
// // // // // // // // // //     { 
// // // // // // // // // //       title: 'Department', 
// // // // // // // // // //       dataIndex: ['departmentId', 'name'], 
// // // // // // // // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // // // // // // // //     },
// // // // // // // // // //     { 
// // // // // // // // // //       title: 'Current Stock', 
// // // // // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // // // // //       align: 'right',
// // // // // // // // // //       sorter: (a, b) => a.currentQuantity - b.currentQuantity,
// // // // // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // // // // //     },
// // // // // // // // // //     { 
// // // // // // // // // //       title: 'Unit Price', 
// // // // // // // // // //       dataIndex: 'unitPrice', 
// // // // // // // // // //       align: 'right',
// // // // // // // // // //       hidden: isStaff,
// // // // // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // // // // //     },
// // // // // // // // // //     { 
// // // // // // // // // //       title: 'Total Value', 
// // // // // // // // // //       align: 'right',
// // // // // // // // // //       hidden: isStaff,
// // // // // // // // // //       render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
// // // // // // // // // //     },
// // // // // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // // // // //     ...(isAdmin ? [{
// // // // // // // // // //       title: 'Actions',
// // // // // // // // // //       align: 'center',
// // // // // // // // // //       width: 100,
// // // // // // // // // //       render: (_, r) => (
// // // // // // // // // //         <Space>
// // // // // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
// // // // // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // // // // //             Modal.confirm({
// // // // // // // // // //               title: 'Delete Item',
// // // // // // // // // //               content: `Are you sure you want to delete ${r.itemName}?`,
// // // // // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // // // // //             });
// // // // // // // // // //           }} />
// // // // // // // // // //         </Space>
// // // // // // // // // //       ),
// // // // // // // // // //     }] : []),
// // // // // // // // // //   ];

// // // // // // // // // //   return (
// // // // // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // // // // // // //         <h1 style={{ margin: 0 }}>Inventory Management</h1>
// // // // // // // // // //         {isStaff && <Tag color="blue" icon={<HomeOutlined />} style={{ fontSize: '14px', padding: '4px 12px' }}>{staffDeptName}</Tag>}
// // // // // // // // // //       </div>
      
// // // // // // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
// // // // // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
// // // // // // // // // //           <Space size="middle">
// // // // // // // // // //             <Input
// // // // // // // // // //               placeholder="Search items..."
// // // // // // // // // //               prefix={<SearchOutlined />}
// // // // // // // // // //               size="large"
// // // // // // // // // //               style={{ width: '300px' }}
// // // // // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // // // // //               allowClear
// // // // // // // // // //             />

// // // // // // // // // //             {isAdmin && (
// // // // // // // // // //               <Select
// // // // // // // // // //                 showSearch
// // // // // // // // // //                 size="large"
// // // // // // // // // //                 style={{ width: '280px' }}
// // // // // // // // // //                 placeholder={<span><FilterOutlined /> All Departments</span>}
// // // // // // // // // //                 optionFilterProp="label"
// // // // // // // // // //                 value={deptFilter || undefined}
// // // // // // // // // //                 onChange={setDeptFilter}
// // // // // // // // // //                 allowClear
// // // // // // // // // //                 options={[
// // // // // // // // // //                   { label: 'All Departments', value: '' },
// // // // // // // // // //                   ...deptList.map(d => ({ label: d.name, value: d._id }))
// // // // // // // // // //                 ]}
// // // // // // // // // //               />
// // // // // // // // // //             )}
// // // // // // // // // //           </Space>

// // // // // // // // // //           <Space size="small">
// // // // // // // // // //             {isKitchenUser && (
// // // // // // // // // //               <Button 
// // // // // // // // // //                 type="primary" 
// // // // // // // // // //                 size="large" 
// // // // // // // // // //                 icon={<ShoppingOutlined />} 
// // // // // // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // // // // // //               >
// // // // // // // // // //                 Today's Order
// // // // // // // // // //               </Button>
// // // // // // // // // //             )}

// // // // // // // // // //             <Button 
// // // // // // // // // //               icon={<FileExcelOutlined />} 
// // // // // // // // // //               size="large" 
// // // // // // // // // //               onClick={handleExportExcel}
// // // // // // // // // //               disabled={isLoading || list.length === 0}
// // // // // // // // // //             >
// // // // // // // // // //               Export {isStaff ? 'Dept' : 'Full'} List
// // // // // // // // // //             </Button>

// // // // // // // // // //             {isAdmin && (
// // // // // // // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // // // // //                 Add New Item
// // // // // // // // // //               </Button>
// // // // // // // // // //             )}
// // // // // // // // // //           </Space>
// // // // // // // // // //         </div>
// // // // // // // // // //       </Card>

// // // // // // // // // //       <Table
// // // // // // // // // //         loading={isLoading}
// // // // // // // // // //         rowKey="_id"
// // // // // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // // // // //         columns={columns}
// // // // // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // // // // //       />

// // // // // // // // // //       <Modal
// // // // // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // // // // //         open={modalOpen}
// // // // // // // // // //         onCancel={handleCloseModal}
// // // // // // // // // //         footer={null}
// // // // // // // // // //         destroyOnClose
// // // // // // // // // //       >
// // // // // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // // // // //             <Input placeholder="e.g. Rice, Football, Pens" />
// // // // // // // // // //           </Form.Item>

// // // // // // // // // //           {/* Department field ONLY shows if Admin hasn't selected a filter and it's a new item */}
// // // // // // // // // //           {isAdmin && !editing && !deptFilter && (
// // // // // // // // // //              <Form.Item name="departmentId" label="Assign to Department" rules={[{ required: true }]}>
// // // // // // // // // //                 <Select 
// // // // // // // // // //                   placeholder="Select Department" 
// // // // // // // // // //                   options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // // // // // // // //                 />
// // // // // // // // // //              </Form.Item>
// // // // // // // // // //           )}

// // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // //             </Form.Item>
// // // // // // // // // //             <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
// // // // // // // // // //               <Select showSearch placeholder="Select unit">
// // // // // // // // // //                 <Select.OptGroup label="Mass"><Select.Option value="kg">kg</Select.Option><Select.Option value="gm">gm</Select.Option></Select.OptGroup>
// // // // // // // // // //                 <Select.OptGroup label="Volume"><Select.Option value="liters">liters</Select.Option><Select.Option value="ml">ml</Select.Option></Select.OptGroup>
// // // // // // // // // //                 <Select.OptGroup label="Count"><Select.Option value="pcs">pcs (Pieces)</Select.Option><Select.Option value="pkt">packets</Select.Option><Select.Option value="units">units</Select.Option></Select.OptGroup>
// // // // // // // // // //               </Select>
// // // // // // // // // //             </Form.Item>
// // // // // // // // // //           </div>

// // // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // // //             </Form.Item>
// // // // // // // // // //             <Form.Item name="unitPrice" label="Price per Unit">
// // // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
// // // // // // // // // //             </Form.Item>
// // // // // // // // // //           </div>

// // // // // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
// // // // // // // // // //             <Space>
// // // // // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // // // // //               <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
// // // // // // // // // //                 Save Item
// // // // // // // // // //               </Button>
// // // // // // // // // //             </Space>
// // // // // // // // // //           </Form.Item>
// // // // // // // // // //         </Form>
// // // // // // // // // //       </Modal>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }















// // // // // // // // // import { useState, useMemo } from 'react';
// // // // // // // // // import { 
// // // // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // // // //   Select, Card 
// // // // // // // // // } from 'antd';
// // // // // // // // // import { 
// // // // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // // // // // } from '@ant-design/icons';
// // // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // // // import { inventory, departments } from '../api';
// // // // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // // export default function Inventory() {
// // // // // // // // //   const { user } = useAuth();
// // // // // // // // //   const navigate = useNavigate();
// // // // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // // // //   const [form] = Form.useForm();
// // // // // // // // //   const queryClient = useQueryClient();

// // // // // // // // //   // Role & Department Extraction
// // // // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // // // //   const isStaff = user?.role === 'Staff';
  
// // // // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // // // // // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "Your Department";

// // // // // // // // //   // Check if user belongs to Kitchen
// // // // // // // // //   const isKitchenUser = staffDeptName === 'Kitchen';

// // // // // // // // //   // --- Data Fetching ---
// // // // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // // // //     queryKey: ['departments'], 
// // // // // // // // //     queryFn: departments.list,
// // // // // // // // //     enabled: isAdmin 
// // // // // // // // //   });

// // // // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // // // // // //     queryFn: () => {
// // // // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // // //       if (isStaff && !staffDeptId) return []; 
// // // // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // // // //     },
// // // // // // // // //   });

// // // // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // // // //   });
// // // // // // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // // // // // //   // --- Excel Export ---
// // // // // // // // //   const handleExportExcel = () => {
// // // // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // // // //       'Item Name': item.itemName,
// // // // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // // // //       'Unit': item.unit,
// // // // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // // // //     }));
// // // // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // // // //     XLSX.writeFile(workbook, `${isStaff ? staffDeptName : 'Full'}_Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // // // //     message.success('Report downloaded');
// // // // // // // // //   };

// // // // // // // // //   // --- Mutations ---
// // // // // // // // //   const createMu = useMutation({
// // // // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // // // //   });

// // // // // // // // //   const updateMu = useMutation({
// // // // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // // // //   });

// // // // // // // // //   const deleteMu = useMutation({
// // // // // // // // //     mutationFn: inventory.delete,
// // // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // // // //   });

// // // // // // // // //   const handleCloseModal = () => {
// // // // // // // // //     setModalOpen(false);
// // // // // // // // //     setEditing(null);
// // // // // // // // //     form.resetFields();
// // // // // // // // //   };

// // // // // // // // //   const openEdit = (record) => {
// // // // // // // // //     setEditing(record);
// // // // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // // // // // //     setModalOpen(true);
// // // // // // // // //   };

// // // // // // // // //   const onFinish = (v) => {
// // // // // // // // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // // //     const finalDeptId = autoDeptId || v.departmentId;

// // // // // // // // //     if (!finalDeptId) return message.error("Please select a department");

// // // // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // // // //     else createMu.mutate(finalData);
// // // // // // // // //   };

// // // // // // // // //   const columns = [
// // // // // // // // //     {
// // // // // // // // //       title: 'Item Name',
// // // // // // // // //       dataIndex: 'itemName',
// // // // // // // // //       sorter: (a, b) => a.itemName.localeCompare(b.itemName),
// // // // // // // // //       render: (name, r) => (
// // // // // // // // //         <Space direction="vertical" size={0}>
// // // // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // // // //           {belowIds.has(r._id) && (
// // // // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // // // //           )}
// // // // // // // // //         </Space>
// // // // // // // // //       ),
// // // // // // // // //     },
// // // // // // // // //     { 
// // // // // // // // //       title: 'Department', 
// // // // // // // // //       dataIndex: ['departmentId', 'name'], 
// // // // // // // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // // // // // // //     },
// // // // // // // // //     { 
// // // // // // // // //       title: 'Current Stock', 
// // // // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // // // //       align: 'right',
// // // // // // // // //       sorter: (a, b) => a.currentQuantity - b.currentQuantity,
// // // // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // // // //     },
// // // // // // // // //     { 
// // // // // // // // //       title: 'Unit Price', 
// // // // // // // // //       dataIndex: 'unitPrice', 
// // // // // // // // //       align: 'right',
// // // // // // // // //       hidden: isStaff,
// // // // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // // // //     },
// // // // // // // // //     { 
// // // // // // // // //       title: 'Total Value', 
// // // // // // // // //       align: 'right',
// // // // // // // // //       hidden: isStaff,
// // // // // // // // //       render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
// // // // // // // // //     },
// // // // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // // // //     ...(isAdmin ? [{
// // // // // // // // //       title: 'Actions',
// // // // // // // // //       align: 'center',
// // // // // // // // //       width: 100,
// // // // // // // // //       render: (_, r) => (
// // // // // // // // //         <Space>
// // // // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
// // // // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // // // //             Modal.confirm({
// // // // // // // // //               title: 'Delete Item',
// // // // // // // // //               content: `Are you sure you want to delete ${r.itemName}?`,
// // // // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // // // //             });
// // // // // // // // //           }} />
// // // // // // // // //         </Space>
// // // // // // // // //       ),
// // // // // // // // //     }] : []),
// // // // // // // // //   ];

// // // // // // // // //   return (
// // // // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // // // //       {/* HEADER WITH DEPARTMENT NAME DISPLAY */}
// // // // // // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // // // // // //         <h1 style={{ margin: 0 }}>Inventory Management</h1>
// // // // // // // // //         {isStaff && (
// // // // // // // // //           <Tag color="blue" icon={<HomeOutlined />} style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '6px' }}>
// // // // // // // // //             {staffDeptName}
// // // // // // // // //           </Tag>
// // // // // // // // //         )}
// // // // // // // // //       </div>
      
// // // // // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
// // // // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
// // // // // // // // //           <Space size="middle">
// // // // // // // // //             <Input
// // // // // // // // //               placeholder="Search items..."
// // // // // // // // //               prefix={<SearchOutlined />}
// // // // // // // // //               size="large"
// // // // // // // // //               style={{ width: '300px' }}
// // // // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // // // //               allowClear
// // // // // // // // //             />

// // // // // // // // //             {isAdmin && (
// // // // // // // // //               <Select
// // // // // // // // //                 showSearch
// // // // // // // // //                 size="large"
// // // // // // // // //                 style={{ width: '280px' }}
// // // // // // // // //                 placeholder={<span><FilterOutlined /> All Departments</span>}
// // // // // // // // //                 optionFilterProp="label"
// // // // // // // // //                 value={deptFilter || undefined}
// // // // // // // // //                 onChange={setDeptFilter}
// // // // // // // // //                 allowClear
// // // // // // // // //                 options={[
// // // // // // // // //                   { label: 'All Departments', value: '' },
// // // // // // // // //                   ...deptList.map(d => ({ label: d.name, value: d._id }))
// // // // // // // // //                 ]}
// // // // // // // // //               />
// // // // // // // // //             )}
// // // // // // // // //           </Space>

// // // // // // // // //           <Space size="small">
// // // // // // // // //             {/* RESTORED TODAY'S ORDER BUTTON */}
// // // // // // // // //             {isKitchenUser && (
// // // // // // // // //               <Button 
// // // // // // // // //                 type="primary" 
// // // // // // // // //                 size="large" 
// // // // // // // // //                 icon={<ShoppingOutlined />} 
// // // // // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // // // // //               >
// // // // // // // // //                 Today's Order
// // // // // // // // //               </Button>
// // // // // // // // //             )}

// // // // // // // // //             <Button 
// // // // // // // // //               icon={<FileExcelOutlined />} 
// // // // // // // // //               size="large" 
// // // // // // // // //               onClick={handleExportExcel}
// // // // // // // // //               disabled={isLoading || list.length === 0}
// // // // // // // // //             >
// // // // // // // // //               Export {isStaff ? 'Dept' : 'Full'} List
// // // // // // // // //             </Button>

// // // // // // // // //             {isAdmin && (
// // // // // // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // // // //                 Add New Item
// // // // // // // // //               </Button>
// // // // // // // // //             )}
// // // // // // // // //           </Space>
// // // // // // // // //         </div>
// // // // // // // // //       </Card>

// // // // // // // // //       <Table
// // // // // // // // //         loading={isLoading}
// // // // // // // // //         rowKey="_id"
// // // // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // // // //         columns={columns}
// // // // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // // // //       />

// // // // // // // // //       <Modal
// // // // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // // // //         open={modalOpen}
// // // // // // // // //         onCancel={handleCloseModal}
// // // // // // // // //         footer={null}
// // // // // // // // //         destroyOnClose
// // // // // // // // //       >
// // // // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // // // //             <Input placeholder="e.g. Rice, Football, Pens" />
// // // // // // // // //           </Form.Item>

// // // // // // // // //           {isAdmin && !editing && !deptFilter && (
// // // // // // // // //              <Form.Item name="departmentId" label="Assign to Department" rules={[{ required: true }]}>
// // // // // // // // //                 <Select 
// // // // // // // // //                   placeholder="Select Department" 
// // // // // // // // //                   options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // // // // // // //                 />
// // // // // // // // //              </Form.Item>
// // // // // // // // //           )}

// // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // //             </Form.Item>
// // // // // // // // //             <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
// // // // // // // // //               <Select showSearch placeholder="Select unit">
// // // // // // // // //                 <Select.OptGroup label="Mass"><Select.Option value="kg">kg</Select.Option><Select.Option value="gm">gm</Select.Option></Select.OptGroup>
// // // // // // // // //                 <Select.OptGroup label="Volume"><Select.Option value="liters">liters</Select.Option><Select.Option value="ml">ml</Select.Option></Select.OptGroup>
// // // // // // // // //                 <Select.OptGroup label="Count"><Select.Option value="pcs">pcs (Pieces)</Select.Option><Select.Option value="pkt">packets</Select.Option><Select.Option value="units">units</Select.Option></Select.OptGroup>
// // // // // // // // //               </Select>
// // // // // // // // //             </Form.Item>
// // // // // // // // //           </div>

// // // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // // //             </Form.Item>
// // // // // // // // //             <Form.Item name="unitPrice" label="Price per Unit">
// // // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
// // // // // // // // //             </Form.Item>
// // // // // // // // //           </div>

// // // // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
// // // // // // // // //             <Space>
// // // // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // // // //               <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
// // // // // // // // //                 Save Item
// // // // // // // // //               </Button>
// // // // // // // // //             </Space>
// // // // // // // // //           </Form.Item>
// // // // // // // // //         </Form>
// // // // // // // // //       </Modal>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }






// // // // // // // // import { useState, useMemo, useEffect } from 'react';
// // // // // // // // import { 
// // // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // // //   Select, Card 
// // // // // // // // } from 'antd';
// // // // // // // // import { 
// // // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // // // // } from '@ant-design/icons';
// // // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // // import { inventory, departments } from '../api';
// // // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // // import * as XLSX from 'xlsx';

// // // // // // // // export default function Inventory() {
// // // // // // // //   const { user } = useAuth();
// // // // // // // //   const navigate = useNavigate();
// // // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // // //   const [form] = Form.useForm();
// // // // // // // //   const queryClient = useQueryClient();

// // // // // // // //   // 1. Extract Role
// // // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // // //   const isStaff = user?.role === 'Staff';
  
// // // // // // // //   // 2. Extract Department ID and Name accurately
// // // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // // // // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

// // // // // // // //   // 3. LOGIC FIX: Robust check for Kitchen (Case Insensitive)
// // // // // // // //   const isKitchenUser = staffDeptName?.toLowerCase().trim() === 'kitchen';

// // // // // // // //   // Debugging: Check your console to see what 'staffDeptName' actually is
// // // // // // // //   useEffect(() => {
// // // // // // // //     console.log("Current User Dept Name:", staffDeptName);
// // // // // // // //     console.log("Is Kitchen User?", isKitchenUser);
// // // // // // // //   }, [staffDeptName, isKitchenUser]);

// // // // // // // //   // --- Data Fetching ---
// // // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // // //     queryKey: ['departments'], 
// // // // // // // //     queryFn: departments.list,
// // // // // // // //     enabled: isAdmin 
// // // // // // // //   });

// // // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // // // // //     queryFn: () => {
// // // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // //       if (isStaff && !staffDeptId) return []; 
// // // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // // //     },
// // // // // // // //   });

// // // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // // //   });
// // // // // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // // // // //   // --- Excel Export ---
// // // // // // // //   const handleExportExcel = () => {
// // // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // // //       'Item Name': item.itemName,
// // // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // // //       'Unit': item.unit,
// // // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // // //     }));
// // // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // // //     XLSX.writeFile(workbook, `${isStaff ? staffDeptName : 'Full'}_Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // // //     message.success('Report downloaded');
// // // // // // // //   };

// // // // // // // //   // --- Mutations ---
// // // // // // // //   const createMu = useMutation({
// // // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // // //   });

// // // // // // // //   const updateMu = useMutation({
// // // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // // //   });

// // // // // // // //   const deleteMu = useMutation({
// // // // // // // //     mutationFn: inventory.delete,
// // // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // // //   });

// // // // // // // //   const handleCloseModal = () => {
// // // // // // // //     setModalOpen(false);
// // // // // // // //     setEditing(null);
// // // // // // // //     form.resetFields();
// // // // // // // //   };

// // // // // // // //   const openEdit = (record) => {
// // // // // // // //     setEditing(record);
// // // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // // // // //     setModalOpen(true);
// // // // // // // //   };

// // // // // // // //   const onFinish = (v) => {
// // // // // // // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // // //     const finalDeptId = autoDeptId || v.departmentId;
// // // // // // // //     if (!finalDeptId) return message.error("Please select a department");

// // // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // // //     else createMu.mutate(finalData);
// // // // // // // //   };

// // // // // // // //   const columns = [
// // // // // // // //     {
// // // // // // // //       title: 'Item Name',
// // // // // // // //       dataIndex: 'itemName',
// // // // // // // //       sorter: (a, b) => a.itemName.localeCompare(b.itemName),
// // // // // // // //       render: (name, r) => (
// // // // // // // //         <Space direction="vertical" size={0}>
// // // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // // //           {belowIds.has(r._id) && (
// // // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // // //           )}
// // // // // // // //         </Space>
// // // // // // // //       ),
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       title: 'Department', 
// // // // // // // //       dataIndex: ['departmentId', 'name'], 
// // // // // // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       title: 'Current Stock', 
// // // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // // //       align: 'right',
// // // // // // // //       sorter: (a, b) => a.currentQuantity - b.currentQuantity,
// // // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       title: 'Unit Price', 
// // // // // // // //       dataIndex: 'unitPrice', 
// // // // // // // //       align: 'right',
// // // // // // // //       hidden: isStaff,
// // // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // // //     },
// // // // // // // //     { 
// // // // // // // //       title: 'Total Value', 
// // // // // // // //       align: 'right',
// // // // // // // //       hidden: isStaff,
// // // // // // // //       render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
// // // // // // // //     },
// // // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // // //     ...(isAdmin ? [{
// // // // // // // //       title: 'Actions',
// // // // // // // //       align: 'center',
// // // // // // // //       width: 100,
// // // // // // // //       render: (_, r) => (
// // // // // // // //         <Space>
// // // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
// // // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // // //             Modal.confirm({
// // // // // // // //               title: 'Delete Item',
// // // // // // // //               content: `Are you sure you want to delete ${r.itemName}?`,
// // // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // // //             });
// // // // // // // //           }} />
// // // // // // // //         </Space>
// // // // // // // //       ),
// // // // // // // //     }] : []),
// // // // // // // //   ];

// // // // // // // //   return (
// // // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // // // // //         <h1 style={{ margin: 0 }}>Inventory Management</h1>
// // // // // // // //         {/* SHOWING DEPT NAME TAG */}
// // // // // // // //         {staffDeptName && (
// // // // // // // //           <Tag color="blue" icon={<HomeOutlined />} style={{ fontSize: '14px', padding: '4px 12px' }}>
// // // // // // // //             {staffDeptName}
// // // // // // // //           </Tag>
// // // // // // // //         )}
// // // // // // // //       </div>
      
// // // // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
// // // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          
// // // // // // // //           <Space size="middle">
// // // // // // // //             <Input
// // // // // // // //               placeholder="Search items..."
// // // // // // // //               prefix={<SearchOutlined />}
// // // // // // // //               size="large"
// // // // // // // //               style={{ width: '300px' }}
// // // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // // //               allowClear
// // // // // // // //             />

// // // // // // // //             {isAdmin && (
// // // // // // // //               <Select
// // // // // // // //                 showSearch
// // // // // // // //                 size="large"
// // // // // // // //                 style={{ width: '280px' }}
// // // // // // // //                 placeholder={<span><FilterOutlined /> All Departments</span>}
// // // // // // // //                 optionFilterProp="label"
// // // // // // // //                 value={deptFilter || undefined}
// // // // // // // //                 onChange={setDeptFilter}
// // // // // // // //                 allowClear
// // // // // // // //                 options={[
// // // // // // // //                   { label: 'All Departments', value: '' },
// // // // // // // //                   ...deptList.map(d => ({ label: d.name, value: d._id }))
// // // // // // // //                 ]}
// // // // // // // //               />
// // // // // // // //             )}
// // // // // // // //           </Space>

// // // // // // // //           <Space size="small">
// // // // // // // //             {/* THE BUTTON LOGIC */}
// // // // // // // //             {isKitchenUser && (
// // // // // // // //               <Button 
// // // // // // // //                 type="primary" 
// // // // // // // //                 size="large" 
// // // // // // // //                 icon={<ShoppingOutlined />} 
// // // // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // // // //               >
// // // // // // // //                 Today's Order
// // // // // // // //               </Button>
// // // // // // // //             )}

// // // // // // // //             <Button 
// // // // // // // //               icon={<FileExcelOutlined />} 
// // // // // // // //               size="large" 
// // // // // // // //               onClick={handleExportExcel}
// // // // // // // //               disabled={isLoading || list.length === 0}
// // // // // // // //             >
// // // // // // // //               Export List
// // // // // // // //             </Button>

// // // // // // // //             {isAdmin && (
// // // // // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // // //                 Add New Item
// // // // // // // //               </Button>
// // // // // // // //             )}
// // // // // // // //           </Space>
// // // // // // // //         </div>
// // // // // // // //       </Card>

// // // // // // // //       <Table
// // // // // // // //         loading={isLoading}
// // // // // // // //         rowKey="_id"
// // // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // // //         columns={columns}
// // // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // // //       />

// // // // // // // //       <Modal
// // // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // // //         open={modalOpen}
// // // // // // // //         onCancel={handleCloseModal}
// // // // // // // //         footer={null}
// // // // // // // //         destroyOnClose
// // // // // // // //       >
// // // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // // //             <Input placeholder="e.g. Rice, Football, Pens" />
// // // // // // // //           </Form.Item>

// // // // // // // //           {isAdmin && !editing && !deptFilter && (
// // // // // // // //              <Form.Item name="departmentId" label="Assign to Department" rules={[{ required: true }]}>
// // // // // // // //                 <Select 
// // // // // // // //                   placeholder="Select Department" 
// // // // // // // //                   options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // // // // // //                 />
// // // // // // // //              </Form.Item>
// // // // // // // //           )}

// // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // //             </Form.Item>
// // // // // // // //             <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
// // // // // // // //               <Select showSearch placeholder="Select unit">
// // // // // // // //                 <Select.OptGroup label="Mass"><Select.Option value="kg">kg</Select.Option><Select.Option value="gm">gm</Select.Option></Select.OptGroup>
// // // // // // // //                 <Select.OptGroup label="Volume"><Select.Option value="liters">liters</Select.Option><Select.Option value="ml">ml</Select.Option></Select.OptGroup>
// // // // // // // //                 <Select.OptGroup label="Count"><Select.Option value="pcs">pcs (Pieces)</Select.Option><Select.Option value="pkt">packets</Select.Option><Select.Option value="units">units</Select.Option></Select.OptGroup>
// // // // // // // //               </Select>
// // // // // // // //             </Form.Item>
// // // // // // // //           </div>

// // // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} />
// // // // // // // //             </Form.Item>
// // // // // // // //             <Form.Item name="unitPrice" label="Price per Unit">
// // // // // // // //               <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
// // // // // // // //             </Form.Item>
// // // // // // // //           </div>

// // // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
// // // // // // // //             <Space>
// // // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // // //               <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
// // // // // // // //                 Save Item
// // // // // // // //               </Button>
// // // // // // // //             </Space>
// // // // // // // //           </Form.Item>
// // // // // // // //         </Form>
// // // // // // // //       </Modal>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }















// // // // // // // import { useState, useMemo, useEffect } from 'react';
// // // // // // // import { 
// // // // // // //   Table, Button, Space, Modal, Form, 
// // // // // // //   Input, InputNumber, message, Tag, 
// // // // // // //   Select, Card 
// // // // // // // } from 'antd';
// // // // // // // import { 
// // // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // // // } from '@ant-design/icons';
// // // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // import { inventory, departments } from '../api';
// // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // import * as XLSX from 'xlsx';

// // // // // // // export default function Inventory() {
// // // // // // //   const { user } = useAuth();
// // // // // // //   const navigate = useNavigate();
// // // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // // //   const [searchText, setSearchText] = useState('');
// // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // //   const [editing, setEditing] = useState(null);
// // // // // // //   const [form] = Form.useForm();
// // // // // // //   const queryClient = useQueryClient();

// // // // // // //   // 1. Logic for Role & Department Extraction
// // // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // // //   const isStaff = user?.role === 'Staff';
  
// // // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // // // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

// // // // // // //   // 2. UPDATED BUTTON LOGIC: 
// // // // // // //   // Visible if: You are an Admin OR your department is "Kitchen" (case-insensitive)
// // // // // // //   const isKitchenUser = staffDeptName?.toLowerCase().trim() === 'kitchen' || 
// // // // // // //                         user?.departmentName?.toLowerCase().trim() === 'kitchen';
  
// // // // // // //   const showOrderButton = isAdmin || isKitchenUser;

// // // // // // //   // Debugging log - open your browser console (F12) to see this
// // // // // // //   useEffect(() => {
// // // // // // //     console.log("User Object:", user);
// // // // // // //     console.log("Dept Name detected:", staffDeptName);
// // // // // // //     console.log("Show Button?:", showOrderButton);
// // // // // // //   }, [user, staffDeptName, showOrderButton]);

// // // // // // //   // --- Data Fetching ---
// // // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // // //     queryKey: ['departments'], 
// // // // // // //     queryFn: departments.list,
// // // // // // //     enabled: isAdmin 
// // // // // // //   });

// // // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // // // //     queryFn: () => {
// // // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // //       if (isStaff && !staffDeptId) return []; 
// // // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // // //     },
// // // // // // //   });

// // // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // // //     queryFn: inventory.belowThreshold,
// // // // // // //   });
  
// // // // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // // // //   // --- Excel Export ---
// // // // // // //   const handleExportExcel = () => {
// // // // // // //     if (list.length === 0) return message.warning("No data available to export");
// // // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // // //     const worksheetData = filteredData.map(item => ({
// // // // // // //       'Item Name': item.itemName,
// // // // // // //       'Department': item.departmentId?.name || 'N/A',
// // // // // // //       'Current Stock': item.currentQuantity,
// // // // // // //       'Unit': item.unit,
// // // // // // //       'Unit Price (₹)': item.unitPrice || 0,
// // // // // // //       'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
// // // // // // //       'Alert Level': item.thresholdLevel,
// // // // // // //       'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
// // // // // // //     }));
// // // // // // //     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
// // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // // //     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // // // //     message.success('Report downloaded');
// // // // // // //   };

// // // // // // //   // --- Mutations ---
// // // // // // //   const createMu = useMutation({
// // // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // // // //   });

// // // // // // //   const updateMu = useMutation({
// // // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // // // //   });

// // // // // // //   const deleteMu = useMutation({
// // // // // // //     mutationFn: inventory.delete,
// // // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // // // //   });

// // // // // // //   const handleCloseModal = () => {
// // // // // // //     setModalOpen(false);
// // // // // // //     setEditing(null);
// // // // // // //     form.resetFields();
// // // // // // //   };

// // // // // // //   const openEdit = (record) => {
// // // // // // //     setEditing(record);
// // // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // // // //     setModalOpen(true);
// // // // // // //   };

// // // // // // //   const onFinish = (v) => {
// // // // // // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // // //     const finalDeptId = autoDeptId || v.departmentId;
// // // // // // //     if (!finalDeptId) return message.error("Please select a department");

// // // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // // //     else createMu.mutate(finalData);
// // // // // // //   };

// // // // // // //   const columns = [
// // // // // // //     {
// // // // // // //       title: 'Item Name',
// // // // // // //       dataIndex: 'itemName',
// // // // // // //       render: (name, r) => (
// // // // // // //         <Space direction="vertical" size={0}>
// // // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // // //           {belowIds.has(r._id) && (
// // // // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // // // //           )}
// // // // // // //         </Space>
// // // // // // //       ),
// // // // // // //     },
// // // // // // //     { 
// // // // // // //       title: 'Department', 
// // // // // // //       dataIndex: ['departmentId', 'name'], 
// // // // // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // // // // //     },
// // // // // // //     { 
// // // // // // //       title: 'Stock', 
// // // // // // //       dataIndex: 'currentQuantity', 
// // // // // // //       align: 'right',
// // // // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // // // //     },
// // // // // // //     { 
// // // // // // //       title: 'Unit Price', 
// // // // // // //       dataIndex: 'unitPrice', 
// // // // // // //       align: 'right',
// // // // // // //       hidden: isStaff,
// // // // // // //       render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
// // // // // // //     },
// // // // // // //     { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
// // // // // // //     ...(isAdmin ? [{
// // // // // // //       title: 'Actions',
// // // // // // //       align: 'center',
// // // // // // //       render: (_, r) => (
// // // // // // //         <Space>
// // // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
// // // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
// // // // // // //             Modal.confirm({
// // // // // // //               title: 'Delete Item',
// // // // // // //               content: `Delete ${r.itemName}?`,
// // // // // // //               onOk: () => deleteMu.mutate(r._id),
// // // // // // //             });
// // // // // // //           }} />
// // // // // // //         </Space>
// // // // // // //       ),
// // // // // // //     }] : []),
// // // // // // //   ];

// // // // // // //   return (
// // // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // // // //         <h1 style={{ margin: 0 }}>Inventory Management</h1>
// // // // // // //         {staffDeptName && <Tag color="blue" icon={<HomeOutlined />}>{staffDeptName}</Tag>}
// // // // // // //       </div>
      
// // // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
// // // // // // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between' }}>
          
// // // // // // //           <Space size="middle">
// // // // // // //             <Input
// // // // // // //               placeholder="Search items..."
// // // // // // //               prefix={<SearchOutlined />}
// // // // // // //               size="large"
// // // // // // //               style={{ width: '250px' }}
// // // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // // //               allowClear
// // // // // // //             />

// // // // // // //             {isAdmin && (
// // // // // // //               <Select
// // // // // // //                 showSearch
// // // // // // //                 size="large"
// // // // // // //                 style={{ width: '220px' }}
// // // // // // //                 placeholder="Filter Dept"
// // // // // // //                 value={deptFilter || undefined}
// // // // // // //                 onChange={setDeptFilter}
// // // // // // //                 allowClear
// // // // // // //                 options={[{ label: 'All', value: '' }, ...deptList.map(d => ({ label: d.name, value: d._id }))]}
// // // // // // //               />
// // // // // // //             )}
// // // // // // //           </Space>

// // // // // // //           <Space size="small">
// // // // // // //             {/* THE BUTTON: showOrderButton handles the visibility */}
// // // // // // //             {showOrderButton && (
// // // // // // //               <Button 
// // // // // // //                 type="primary" 
// // // // // // //                 size="large" 
// // // // // // //                 icon={<ShoppingOutlined />} 
// // // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // // //               >
// // // // // // //                 Today's Order
// // // // // // //               </Button>
// // // // // // //             )}

// // // // // // //             <Button icon={<FileExcelOutlined />} size="large" onClick={handleExportExcel}>
// // // // // // //               Export List
// // // // // // //             </Button>

// // // // // // //             {isAdmin && (
// // // // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // // // //                 Add Item
// // // // // // //               </Button>
// // // // // // //             )}
// // // // // // //           </Space>
// // // // // // //         </div>
// // // // // // //       </Card>

// // // // // // //       <Table
// // // // // // //         loading={isLoading}
// // // // // // //         rowKey="_id"
// // // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // // //         columns={columns}
// // // // // // //         pagination={{ pageSize: 10 }}
// // // // // // //         style={{ background: '#fff', borderRadius: '8px' }}
// // // // // // //       />

// // // // // // //       <Modal
// // // // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // // // //         open={modalOpen}
// // // // // // //         onCancel={handleCloseModal}
// // // // // // //         footer={null}
// // // // // // //         destroyOnClose
// // // // // // //       >
// // // // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // // // //             <Input />
// // // // // // //           </Form.Item>

// // // // // // //           {isAdmin && !editing && !deptFilter && (
// // // // // // //              <Form.Item name="departmentId" label="Assign to Department" rules={[{ required: true }]}>
// // // // // // //                 <Select options={deptList.map(d => ({ label: d.name, value: d._id }))} />
// // // // // // //              </Form.Item>
// // // // // // //           )}

// // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // // // //               <InputNumber style={{ width: '100%' }} />
// // // // // // //             </Form.Item>
// // // // // // //             <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
// // // // // // //               <Select>
// // // // // // //                 <Select.Option value="kg">kg</Select.Option>
// // // // // // //                 <Select.Option value="pcs">pcs</Select.Option>
// // // // // // //                 <Select.Option value="liters">liters</Select.Option>
// // // // // // //               </Select>
// // // // // // //             </Form.Item>
// // // // // // //           </div>

// // // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // // // //             <Form.Item name="thresholdLevel" label="Alert Level" rules={[{ required: true }]}>
// // // // // // //               <InputNumber style={{ width: '100%' }} />
// // // // // // //             </Form.Item>
// // // // // // //             <Form.Item name="unitPrice" label="Price">
// // // // // // //               <InputNumber style={{ width: '100%' }} prefix="₹" />
// // // // // // //             </Form.Item>
// // // // // // //           </div>

// // // // // // //           <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
// // // // // // //             <Space>
// // // // // // //               <Button onClick={handleCloseModal}>Cancel</Button>
// // // // // // //               <Button type="primary" htmlType="submit">Save</Button>
// // // // // // //             </Space>
// // // // // // //           </Form.Item>
// // // // // // //         </Form>
// // // // // // //       </Modal>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }








// // // // // // import { useState, useMemo, useEffect } from 'react';
// // // // // // import { 
// // // // // //   Table, Button, Space, Modal, Form, 
// // // // // //   Input, InputNumber, message, Tag, 
// // // // // //   Select, Card 
// // // // // // } from 'antd';
// // // // // // import { 
// // // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // // } from '@ant-design/icons';
// // // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // import { inventory, departments } from '../api';
// // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // import * as XLSX from 'xlsx';

// // // // // // export default function Inventory() {
// // // // // //   const { user } = useAuth();
// // // // // //   const navigate = useNavigate();
// // // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // // //   const [searchText, setSearchText] = useState('');
// // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // //   const [editing, setEditing] = useState(null);
// // // // // //   const [form] = Form.useForm();
// // // // // //   const queryClient = useQueryClient();

// // // // // //   // 1. EXTRACT DATA WITH FALLBACKS
// // // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // // //   const isStaff = user?.role === 'Staff';
  
// // // // // //   // Try to find the name in multiple common places
// // // // // //   const currentDeptName = 
// // // // // //     user?.departmentId?.name || 
// // // // // //     user?.departmentName || 
// // // // // //     user?.deptName || 
// // // // // //     "";

// // // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;

// // // // // //   // 2. BULLETPROOF VISIBILITY CHECK
// // // // // //   // We check for 'kitchen' anywhere in the department strings
// // // // // //   const isKitchen = currentDeptName.toLowerCase().includes('kitchen');
// // // // // //   const showOrderButton = isAdmin || isKitchen;

// // // // // //   // 3. --- Data Fetching ---
// // // // // //   const { data: deptList = [] } = useQuery({ 
// // // // // //     queryKey: ['departments'], 
// // // // // //     queryFn: departments.list,
// // // // // //     enabled: isAdmin 
// // // // // //   });

// // // // // //   const { data: list = [], isLoading } = useQuery({
// // // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // // //     queryFn: () => {
// // // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // // //       if (isStaff && !staffDeptId) return []; 
// // // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // // //     },
// // // // // //   });

// // // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // // //     queryFn: inventory.belowThreshold,
// // // // // //   });
// // // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // // //   // --- Excel Export ---
// // // // // //   const handleExportExcel = () => {
// // // // // //     if (list.length === 0) return message.warning("No data available");
// // // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // // //     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
// // // // // //       'Item': item.itemName,
// // // // // //       'Stock': item.currentQuantity,
// // // // // //       'Unit': item.unit,
// // // // // //       'Status': belowIds.has(item._id) ? 'Low' : 'OK'
// // // // // //     })));
// // // // // //     const workbook = XLSX.utils.book_new();
// // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // // //     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // // //   };

// // // // // //   // --- Mutations ---
// // // // // //   const createMu = useMutation({
// // // // // //     mutationFn: (v) => inventory.create(v),
// // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Created'); },
// // // // // //   });

// // // // // //   const updateMu = useMutation({
// // // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Updated'); },
// // // // // //   });

// // // // // //   const deleteMu = useMutation({
// // // // // //     mutationFn: inventory.delete,
// // // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Deleted'); },
// // // // // //   });

// // // // // //   const handleCloseModal = () => {
// // // // // //     setModalOpen(false);
// // // // // //     setEditing(null);
// // // // // //     form.resetFields();
// // // // // //   };

// // // // // //   const openEdit = (record) => {
// // // // // //     setEditing(record);
// // // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // // //     setModalOpen(true);
// // // // // //   };

// // // // // //   const onFinish = (v) => {
// // // // // //     const finalDeptId = isStaff ? staffDeptId : (deptFilter || v.departmentId);
// // // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // // //     else createMu.mutate(finalData);
// // // // // //   };

// // // // // //   const columns = [
// // // // // //     {
// // // // // //       title: 'Item Name',
// // // // // //       dataIndex: 'itemName',
// // // // // //       render: (name, r) => (
// // // // // //         <Space direction="vertical" size={0}>
// // // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // // //           {belowIds.has(r._id) && <Tag color="error">Low Stock</Tag>}
// // // // // //         </Space>
// // // // // //       ),
// // // // // //     },
// // // // // //     { title: 'Stock', dataIndex: 'currentQuantity', align: 'right', render: (qty, r) => <b>{qty} {r.unit}</b> },
// // // // // //     ...(isAdmin ? [{
// // // // // //       title: 'Actions',
// // // // // //       align: 'center',
// // // // // //       render: (_, r) => (
// // // // // //         <Space>
// // // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
// // // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMu.mutate(r._id)} />
// // // // // //         </Space>
// // // // // //       ),
// // // // // //     }] : []),
// // // // // //   ];

// // // // // //   return (
// // // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // // //         <h1 style={{ margin: 0 }}>Inventory</h1>
// // // // // //         {currentDeptName && <Tag color="blue" icon={<HomeOutlined />}>{currentDeptName}</Tag>}
// // // // // //       </div>
      
// // // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
// // // // // //         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
// // // // // //           <Space size="middle">
// // // // // //             <Input
// // // // // //               placeholder="Search..."
// // // // // //               prefix={<SearchOutlined />}
// // // // // //               style={{ width: 200 }}
// // // // // //               onChange={(e) => setSearchText(e.target.value)}
// // // // // //               allowClear
// // // // // //             />
// // // // // //             {isAdmin && (
// // // // // //               <Select
// // // // // //                 placeholder="All Depts"
// // // // // //                 style={{ width: 150 }}
// // // // // //                 value={deptFilter || undefined}
// // // // // //                 onChange={setDeptFilter}
// // // // // //                 allowClear
// // // // // //                 options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // // // //               />
// // // // // //             )}
// // // // // //           </Space>

// // // // // //           <Space>
// // // // // //             {/* THE BUTTON: Using the bulletproof check */}
// // // // // //             {showOrderButton && (
// // // // // //               <Button 
// // // // // //                 type="primary" 
// // // // // //                 icon={<ShoppingOutlined />} 
// // // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // // //               >
// // // // // //                 Today's Order
// // // // // //               </Button>
// // // // // //             )}

// // // // // //             <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Export</Button>
// // // // // //             {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>Add</Button>}
// // // // // //           </Space>
// // // // // //         </div>
// // // // // //       </Card>

// // // // // //       <Table
// // // // // //         loading={isLoading}
// // // // // //         rowKey="_id"
// // // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // // //         columns={columns}
// // // // // //         pagination={{ pageSize: 10 }}
// // // // // //       />

// // // // // //       <Modal title={editing ? 'Edit' : 'Add'} open={modalOpen} onCancel={handleCloseModal} footer={null}>
// // // // // //         <Form form={form} layout="vertical" onFinish={onFinish}>
// // // // // //           <Form.Item name="itemName" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
// // // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
// // // // // //              <Form.Item name="currentQuantity" label="Qty"><InputNumber style={{ width: '100%' }} /></Form.Item>
// // // // // //              <Form.Item name="unit" label="Unit"><Input /></Form.Item>
// // // // // //           </div>
// // // // // //           <Button type="primary" htmlType="submit" block>Save</Button>
// // // // // //         </Form>
// // // // // //       </Modal>
// // // // // //     </div>
// // // // // //   );
// // // // // // }










// // // // // import { useState, useMemo, useEffect } from 'react';
// // // // // import { 
// // // // //   Table, Button, Space, Modal, Form, 
// // // // //   Input, InputNumber, message, Tag, 
// // // // //   Select, Card 
// // // // // } from 'antd';
// // // // // import { 
// // // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // // } from '@ant-design/icons';
// // // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // // import { useAuth } from '../context/AuthContext';
// // // // // import { inventory, departments } from '../api';
// // // // // import { useNavigate } from 'react-router-dom';
// // // // // import * as XLSX from 'xlsx';

// // // // // export default function Inventory() {
// // // // //   const { user } = useAuth();
// // // // //   const navigate = useNavigate();
// // // // //   const [deptFilter, setDeptFilter] = useState('');
// // // // //   const [searchText, setSearchText] = useState('');
// // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // //   const [editing, setEditing] = useState(null);
// // // // //   const [form] = Form.useForm();
// // // // //   const queryClient = useQueryClient();

// // // // //   // 1. Role & Department Extraction
// // // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // // //   const isStaff = user?.role === 'Staff';
// // // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

// // // // //   // 2. Button Visibility Logic
// // // // //   const isKitchen = staffDeptName?.toLowerCase().includes('kitchen');
// // // // //   const showOrderButton = isAdmin || isKitchen;

// // // // //   // --- Data Fetching ---
// // // // //   const { data: deptList = [] } = useQuery({ 
// // // // //     queryKey: ['departments'], 
// // // // //     queryFn: departments.list,
// // // // //     enabled: isAdmin 
// // // // //   });

// // // // //   const { data: list = [], isLoading } = useQuery({
// // // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // // //     queryFn: () => {
// // // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // // //       if (isStaff && !staffDeptId) return []; 
// // // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // // //     },
// // // // //   });

// // // // //   const { data: belowThreshold = [] } = useQuery({
// // // // //     queryKey: ['inventory', 'below-threshold'],
// // // // //     queryFn: inventory.belowThreshold,
// // // // //   });
// // // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // // //   // --- Excel Export ---
// // // // //   const handleExportExcel = () => {
// // // // //     if (list.length === 0) return message.warning("No data available");
// // // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // // //     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
// // // // //       'Item': item.itemName,
// // // // //       'Stock': item.currentQuantity,
// // // // //       'Unit': item.unit,
// // // // //       'Status': belowIds.has(item._id) ? 'Low' : 'OK'
// // // // //     })));
// // // // //     const workbook = XLSX.utils.book_new();
// // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // // //     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // // //   };

// // // // //   // --- Mutations ---
// // // // //   const createMu = useMutation({
// // // // //     mutationFn: (v) => inventory.create(v),
// // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // // //   });

// // // // //   const updateMu = useMutation({
// // // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // // //   });

// // // // //   const deleteMu = useMutation({
// // // // //     mutationFn: inventory.delete,
// // // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // // //   });

// // // // //   const handleCloseModal = () => {
// // // // //     setModalOpen(false);
// // // // //     setEditing(null);
// // // // //     form.resetFields();
// // // // //   };

// // // // //   const openEdit = (record) => {
// // // // //     setEditing(record);
// // // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // // //     setModalOpen(true);
// // // // //   };

// // // // //   const onFinish = (v) => {
// // // // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // // // //     const finalDeptId = autoDeptId || v.departmentId;
// // // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // // //     else createMu.mutate(finalData);
// // // // //   };

// // // // //   const columns = [
// // // // //     {
// // // // //       title: 'Item Name',
// // // // //       dataIndex: 'itemName',
// // // // //       render: (name, r) => (
// // // // //         <Space direction="vertical" size={0}>
// // // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // // //           {belowIds.has(r._id) && (
// // // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // // //           )}
// // // // //         </Space>
// // // // //       ),
// // // // //     },
// // // // //     { 
// // // // //       title: 'Department', 
// // // // //       dataIndex: ['departmentId', 'name'], 
// // // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // // //     },
// // // // //     { 
// // // // //       title: 'Stock', 
// // // // //       dataIndex: 'currentQuantity', 
// // // // //       align: 'right',
// // // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // // //     },
// // // // //     ...(isAdmin ? [{
// // // // //       title: 'Actions',
// // // // //       align: 'center',
// // // // //       render: (_, r) => (
// // // // //         <Space>
// // // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
// // // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMu.mutate(r._id)} />
// // // // //         </Space>
// // // // //       ),
// // // // //     }] : []),
// // // // //   ];

// // // // //   return (
// // // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // // //         <h1 style={{ margin: 0 }}>Inventory</h1>
// // // // //         {staffDeptName && (
// // // // //           <Tag color="blue" icon={<HomeOutlined />}>
// // // // //             {staffDeptName}
// // // // //           </Tag>
// // // // //         )}
// // // // //       </div>
      
// // // // //       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
// // // // //         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
// // // // //           {/* 1. Full Width Search Bar matching Tickets Page */}
// // // // //           <Input
// // // // //             placeholder="Search items..."
// // // // //             prefix={<SearchOutlined />}
// // // // //             size="large"
// // // // //             style={{ width: '100%' }}
// // // // //             onChange={(e) => setSearchText(e.target.value)}
// // // // //             allowClear
// // // // //           />

// // // // //           {/* 2. Action Buttons row matching the Tickets Page structure */}
// // // // //           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
// // // // //             {isAdmin && (
// // // // //               <Select
// // // // //                 showSearch
// // // // //                 size="large"
// // // // //                 style={{ width: '220px', marginRight: 'auto' }}
// // // // //                 placeholder="Filter by Department"
// // // // //                 value={deptFilter || undefined}
// // // // //                 onChange={setDeptFilter}
// // // // //                 allowClear
// // // // //                 options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // // //               />
// // // // //             )}

// // // // //             {showOrderButton && (
// // // // //               <Button 
// // // // //                 type="primary" 
// // // // //                 size="large" 
// // // // //                 icon={<ShoppingOutlined />} 
// // // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // // //                 onClick={() => navigate('/kitchen-order')}
// // // // //               >
// // // // //                 Today's Order
// // // // //               </Button>
// // // // //             )}

// // // // //             <Button 
// // // // //               icon={<FileExcelOutlined />} 
// // // // //               size="large" 
// // // // //               onClick={handleExportExcel}
// // // // //               disabled={isLoading || list.length === 0}
// // // // //             >
// // // // //               Export
// // // // //             </Button>

// // // // //             {isAdmin && (
// // // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // // //                 Add New Item
// // // // //               </Button>
// // // // //             )}
// // // // //           </div>
// // // // //         </Space>
// // // // //       </Card>

// // // // //       <Table
// // // // //         loading={isLoading}
// // // // //         rowKey="_id"
// // // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // // //         columns={columns}
// // // // //         pagination={{ pageSize: 10 }}
// // // // //       />

// // // // //       <Modal
// // // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // // //         open={modalOpen}
// // // // //         onCancel={handleCloseModal}
// // // // //         footer={null}
// // // // //         destroyOnClose
// // // // //       >
// // // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // // //             <Input />
// // // // //           </Form.Item>
// // // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // // //               <InputNumber style={{ width: '100%' }} />
// // // // //             </Form.Item>
// // // // //             <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
// // // // //               <Input placeholder="e.g. kg, pcs" />
// // // // //             </Form.Item>
// // // // //           </div>
// // // // //           <Button type="primary" htmlType="submit" size="large" block>
// // // // //             Save Item
// // // // //           </Button>
// // // // //         </Form>
// // // // //       </Modal>
// // // // //     </div>
// // // // //   );
// // // // // }























// // // // import { useState, useMemo, useEffect } from 'react';
// // // // import { 
// // // //   Table, Button, Space, Modal, Form, 
// // // //   Input, InputNumber, message, Tag, 
// // // //   Select, Card 
// // // // } from 'antd';
// // // // import { 
// // // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // // //   ShoppingOutlined, FilterOutlined, HomeOutlined
// // // // } from '@ant-design/icons';
// // // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // // import { useAuth } from '../context/AuthContext';
// // // // import { inventory, departments } from '../api';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import * as XLSX from 'xlsx';

// // // // export default function Inventory() {
// // // //   const { user } = useAuth();
// // // //   const navigate = useNavigate();
// // // //   const [deptFilter, setDeptFilter] = useState('');
// // // //   const [searchText, setSearchText] = useState('');
// // // //   const [modalOpen, setModalOpen] = useState(false);
// // // //   const [editing, setEditing] = useState(null);
// // // //   const [form] = Form.useForm();
// // // //   const queryClient = useQueryClient();

// // // //   // 1. Role & Department Extraction
// // // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // // //   const isStaff = user?.role === 'Staff';
// // // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

// // // //   // 2. Button Visibility Logic - ONLY Kitchen and Mess
// // // //   const isKitchenOrMess = 
// // // //     staffDeptName?.toLowerCase().includes('kitchen') || 
// // // //     staffDeptName?.toLowerCase().includes('mess');
  
// // // //   // Button is now hidden for Admin/Super-Admin
// // // //   const showOrderButton = isKitchenOrMess; 

// // // //   // --- Data Fetching ---
// // // //   const { data: deptList = [] } = useQuery({ 
// // // //     queryKey: ['departments'], 
// // // //     queryFn: departments.list,
// // // //     enabled: isAdmin 
// // // //   });

// // // //   const { data: list = [], isLoading } = useQuery({
// // // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // // //     queryFn: () => {
// // // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // // //       if (isStaff && !staffDeptId) return []; 
// // // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // // //     },
// // // //   });

// // // //   const { data: belowThreshold = [] } = useQuery({
// // // //     queryKey: ['inventory', 'below-threshold'],
// // // //     queryFn: inventory.belowThreshold,
// // // //   });
// // // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // // //   // --- Excel Export ---
// // // //   const handleExportExcel = () => {
// // // //     if (list.length === 0) return message.warning("No data available");
// // // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // // //     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
// // // //       'Item': item.itemName,
// // // //       'Stock': item.currentQuantity,
// // // //       'Unit': item.unit,
// // // //       'Status': belowIds.has(item._id) ? 'Low' : 'OK'
// // // //     })));
// // // //     const workbook = XLSX.utils.book_new();
// // // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // // //     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // // //   };

// // // //   // --- Mutations ---
// // // //   const createMu = useMutation({
// // // //     mutationFn: (v) => inventory.create(v),
// // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // // //   });

// // // //   const updateMu = useMutation({
// // // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // // //   });

// // // //   const deleteMu = useMutation({
// // // //     mutationFn: inventory.delete,
// // // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // // //   });

// // // //   const handleCloseModal = () => {
// // // //     setModalOpen(false);
// // // //     setEditing(null);
// // // //     form.resetFields();
// // // //   };

// // // //   const openEdit = (record) => {
// // // //     setEditing(record);
// // // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // // //     setModalOpen(true);
// // // //   };

// // // //   const onFinish = (v) => {
// // // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // // //     const finalDeptId = autoDeptId || v.departmentId;
// // // //     const finalData = { ...v, departmentId: finalDeptId };
// // // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // // //     else createMu.mutate(finalData);
// // // //   };

// // // //   const columns = [
// // // //     {
// // // //       title: 'Item Name',
// // // //       dataIndex: 'itemName',
// // // //       render: (name, r) => (
// // // //         <Space direction="vertical" size={0}>
// // // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // // //           {belowIds.has(r._id) && (
// // // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // // //           )}
// // // //         </Space>
// // // //       ),
// // // //     },
// // // //     { 
// // // //       title: 'Department', 
// // // //       dataIndex: ['departmentId', 'name'], 
// // // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // // //     },
// // // //     { 
// // // //       title: 'Stock', 
// // // //       dataIndex: 'currentQuantity', 
// // // //       align: 'right',
// // // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // // //     },
// // // //     ...(isAdmin ? [{
// // // //       title: 'Actions',
// // // //       align: 'center',
// // // //       render: (_, r) => (
// // // //         <Space>
// // // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
// // // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMu.mutate(r._id)} />
// // // //         </Space>
// // // //       ),
// // // //     }] : []),
// // // //   ];

// // // //   return (
// // // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // // //         <h1 style={{ margin: 0 }}>Inventory</h1>
// // // //         {staffDeptName && (
// // // //           <Tag color="blue" icon={<HomeOutlined />}>
// // // //             {staffDeptName}
// // // //           </Tag>
// // // //         )}
// // // //       </div>
      
// // // //       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
// // // //         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
// // // //           <Input
// // // //             placeholder="Search items..."
// // // //             prefix={<SearchOutlined />}
// // // //             size="large"
// // // //             style={{ width: '100%' }}
// // // //             onChange={(e) => setSearchText(e.target.value)}
// // // //             allowClear
// // // //           />

// // // //           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
// // // //             {isAdmin && (
// // // //               <Select
// // // //                 showSearch
// // // //                 size="large"
// // // //                 style={{ width: '220px', marginRight: 'auto' }}
// // // //                 placeholder="Filter by Department"
// // // //                 value={deptFilter || undefined}
// // // //                 onChange={setDeptFilter}
// // // //                 allowClear
// // // //                 options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // // //               />
// // // //             )}

// // // //             {/* Now ONLY visible if currentDeptName contains Kitchen or Mess */}
// // // //             {showOrderButton && (
// // // //               <Button 
// // // //                 type="primary" 
// // // //                 size="large" 
// // // //                 icon={<ShoppingOutlined />} 
// // // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // // //                 onClick={() => navigate('/kitchen-order')}
// // // //               >
// // // //                 Today's Order
// // // //               </Button>
// // // //             )}

// // // //             <Button 
// // // //               icon={<FileExcelOutlined />} 
// // // //               size="large" 
// // // //               onClick={handleExportExcel}
// // // //               disabled={isLoading || list.length === 0}
// // // //             >
// // // //               Export
// // // //             </Button>

// // // //             {isAdmin && (
// // // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // // //                 Add New Item
// // // //               </Button>
// // // //             )}
// // // //           </div>
// // // //         </Space>
// // // //       </Card>

// // // //       <Table
// // // //         loading={isLoading}
// // // //         rowKey="_id"
// // // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // // //         columns={columns}
// // // //         pagination={{ pageSize: 10 }}
// // // //       />

// // // //       <Modal
// // // //         title={editing ? 'Update Item' : 'Add New Item'}
// // // //         open={modalOpen}
// // // //         onCancel={handleCloseModal}
// // // //         footer={null}
// // // //         destroyOnClose
// // // //       >
// // // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // // //             <Input />
// // // //           </Form.Item>
// // // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // // //               <InputNumber style={{ width: '100%' }} />
// // // //             </Form.Item>
// // // //             <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
// // // //               <Input placeholder="e.g. kg, pcs" />
// // // //             </Form.Item>
// // // //           </div>
// // // //           <Button type="primary" htmlType="submit" size="large" block>
// // // //             Save Item
// // // //           </Button>
// // // //         </Form>
// // // //       </Modal>
// // // //     </div>
// // // //   );
// // // // }







// // // import { useState, useMemo, useEffect } from 'react';
// // // import { 
// // //   Table, Button, Space, Modal, Form, 
// // //   Input, InputNumber, message, Tag, 
// // //   Select, Card 
// // // } from 'antd';
// // // import { 
// // //   PlusOutlined, EditOutlined, DeleteOutlined, 
// // //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// // //   ShoppingOutlined, HomeOutlined
// // // } from '@ant-design/icons';
// // // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // // import { useAuth } from '../context/AuthContext';
// // // import { inventory, departments } from '../api';
// // // import { useNavigate } from 'react-router-dom';
// // // import * as XLSX from 'xlsx';

// // // export default function Inventory() {
// // //   const { user } = useAuth();
// // //   const navigate = useNavigate();
// // //   const [deptFilter, setDeptFilter] = useState('');
// // //   const [searchText, setSearchText] = useState('');
// // //   const [modalOpen, setModalOpen] = useState(false);
// // //   const [editing, setEditing] = useState(null);
// // //   const [form] = Form.useForm();
// // //   const queryClient = useQueryClient();

// // //   // 1. Role & Department Extraction
// // //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// // //   const isStaff = user?.role === 'Staff';
// // //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// // //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

// // //   // 2. STRICT Visibility Logic (Only Kitchen/Mess staff, NOT Admin)
// // //   const isKitchenOrMess = 
// // //     staffDeptName?.toLowerCase().includes('kitchen') || 
// // //     staffDeptName?.toLowerCase().includes('mess');
  
// // //   // Logic updated: Must be Kitchen/Mess AND specifically not an Admin role
// // //   const showOrderButton = isKitchenOrMess && !isAdmin;

// // //   // --- Data Fetching ---
// // //   const { data: deptList = [] } = useQuery({ 
// // //     queryKey: ['departments'], 
// // //     queryFn: departments.list,
// // //     enabled: isAdmin 
// // //   });

// // //   const { data: list = [], isLoading } = useQuery({
// // //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// // //     queryFn: () => {
// // //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// // //       if (isStaff && !staffDeptId) return []; 
// // //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// // //     },
// // //   });

// // //   const { data: belowThreshold = [] } = useQuery({
// // //     queryKey: ['inventory', 'below-threshold'],
// // //     queryFn: inventory.belowThreshold,
// // //   });
// // //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// // //   // --- Excel Export ---
// // //   const handleExportExcel = () => {
// // //     if (list.length === 0) return message.warning("No data available");
// // //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// // //     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
// // //       'Item': item.itemName,
// // //       'Stock': item.currentQuantity,
// // //       'Unit': item.unit,
// // //       'Status': belowIds.has(item._id) ? 'Low' : 'OK'
// // //     })));
// // //     const workbook = XLSX.utils.book_new();
// // //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// // //     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
// // //   };

// // //   // --- Mutations ---
// // //   const createMu = useMutation({
// // //     mutationFn: (v) => inventory.create(v),
// // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// // //   });

// // //   const updateMu = useMutation({
// // //     mutationFn: ({ id, data }) => inventory.update(id, data),
// // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// // //   });

// // //   const deleteMu = useMutation({
// // //     mutationFn: inventory.delete,
// // //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// // //   });

// // //   const handleCloseModal = () => {
// // //     setModalOpen(false);
// // //     setEditing(null);
// // //     form.resetFields();
// // //   };

// // //   const openEdit = (record) => {
// // //     setEditing(record);
// // //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// // //     setModalOpen(true);
// // //   };

// // //   const onFinish = (v) => {
// // //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// // //     const finalDeptId = autoDeptId || v.departmentId;
// // //     const finalData = { ...v, departmentId: finalDeptId };
// // //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// // //     else createMu.mutate(finalData);
// // //   };

// // //   const columns = [
// // //     {
// // //       title: 'Item Name',
// // //       dataIndex: 'itemName',
// // //       render: (name, r) => (
// // //         <Space direction="vertical" size={0}>
// // //           <span style={{ fontWeight: 600 }}>{name}</span>
// // //           {belowIds.has(r._id) && (
// // //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// // //           )}
// // //         </Space>
// // //       ),
// // //     },
// // //     { 
// // //       title: 'Department', 
// // //       dataIndex: ['departmentId', 'name'], 
// // //       hidden: isStaff || (isAdmin && !!deptFilter) 
// // //     },
// // //     { 
// // //       title: 'Stock', 
// // //       dataIndex: 'currentQuantity', 
// // //       align: 'right',
// // //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// // //     },
// // //     ...(isAdmin ? [{
// // //       title: 'Actions',
// // //       align: 'center',
// // //       render: (_, r) => (
// // //         <Space>
// // //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
// // //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMu.mutate(r._id)} />
// // //         </Space>
// // //       ),
// // //     }] : []),
// // //   ];

// // //   return (
// // //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// // //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// // //         <h1 style={{ margin: 0 }}>Inventory</h1>
// // //         {staffDeptName && (
// // //           <Tag color="blue" icon={<HomeOutlined />}>
// // //             {staffDeptName}
// // //           </Tag>
// // //         )}
// // //       </div>
      
// // //       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
// // //         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
// // //           {/* SEARCH BAR POSITION MAINTAINED */}
// // //           <Input
// // //             placeholder="Search items..."
// // //             prefix={<SearchOutlined />}
// // //             size="large"
// // //             style={{ width: '100%' }}
// // //             onChange={(e) => setSearchText(e.target.value)}
// // //             allowClear
// // //           />

// // //           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
// // //             {/* DEPARTMENT FILTER POSITION MAINTAINED */}
// // //             {isAdmin && (
// // //               <Select
// // //                 showSearch
// // //                 size="large"
// // //                 style={{ width: '220px', marginRight: 'auto' }}
// // //                 placeholder="Filter by Department"
// // //                 value={deptFilter || undefined}
// // //                 onChange={setDeptFilter}
// // //                 allowClear
// // //                 options={deptList.map(d => ({ label: d.name, value: d._id }))}
// // //               />
// // //             )}

// // //             {showOrderButton && (
// // //               <Button 
// // //                 type="primary" 
// // //                 size="large" 
// // //                 icon={<ShoppingOutlined />} 
// // //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// // //                 onClick={() => navigate('/kitchen-order')}
// // //               >
// // //                 Today's Order
// // //               </Button>
// // //             )}

// // //             <Button 
// // //               icon={<FileExcelOutlined />} 
// // //               size="large" 
// // //               onClick={handleExportExcel}
// // //               disabled={isLoading || list.length === 0}
// // //             >
// // //               Export
// // //             </Button>

// // //             {/* ADD NEW ITEM POSITION MAINTAINED */}
// // //             {isAdmin && (
// // //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// // //                 Add New Item
// // //               </Button>
// // //             )}
// // //           </div>
// // //         </Space>
// // //       </Card>

// // //       <Table
// // //         loading={isLoading}
// // //         rowKey="_id"
// // //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// // //         columns={columns}
// // //         pagination={{ pageSize: 10 }}
// // //       />

// // //       <Modal
// // //         title={editing ? 'Update Item' : 'Add New Item'}
// // //         open={modalOpen}
// // //         onCancel={handleCloseModal}
// // //         footer={null}
// // //         destroyOnClose
// // //       >
// // //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// // //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// // //             <Input />
// // //           </Form.Item>
// // //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// // //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// // //               <InputNumber style={{ width: '100%' }} />
// // //             </Form.Item>
// // //             <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
// // //               <Input placeholder="e.g. kg, pcs" />
// // //             </Form.Item>
// // //           </div>
// // //           <Button type="primary" htmlType="submit" size="large" block>
// // //             Save Item
// // //           </Button>
// // //         </Form>
// // //       </Modal>
// // //     </div>
// // //   );
// // // }






// // import { useState, useMemo } from 'react';
// // import { 
// //   Table, Button, Space, Modal, Form, 
// //   Input, InputNumber, message, Tag, 
// //   Select, Card 
// // } from 'antd';
// // import { 
// //   PlusOutlined, EditOutlined, DeleteOutlined, 
// //   WarningOutlined, SearchOutlined, FileExcelOutlined,
// //   ShoppingOutlined, HomeOutlined
// // } from '@ant-design/icons';
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { useAuth } from '../context/AuthContext';
// // import { inventory, departments } from '../api';
// // import { useNavigate } from 'react-router-dom';
// // import * as XLSX from 'xlsx';

// // export default function Inventory() {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
// //   const [deptFilter, setDeptFilter] = useState('');
// //   const [searchText, setSearchText] = useState('');
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [editing, setEditing] = useState(null);
// //   const [form] = Form.useForm();
// //   const queryClient = useQueryClient();

// //   // 1. Role & Department Extraction
// //   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
// //   const isStaff = user?.role === 'Staff';
// //   const staffDeptId = user?.departmentId?._id || user?.departmentId;
// //   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

// //   // 2. Button Visibility Logic - Strictly Kitchen/Mess Staff only
// //   const isKitchenOrMess = 
// //     staffDeptName?.toLowerCase().includes('kitchen') || 
// //     staffDeptName?.toLowerCase().includes('mess');
  
// //   // Restricted: Admins cannot see this button even if they manage these departments
// //   const showOrderButton = isKitchenOrMess && !isAdmin;

// //   // --- Data Fetching ---
// //   const { data: deptList = [] } = useQuery({ 
// //     queryKey: ['departments'], 
// //     queryFn: departments.list,
// //     enabled: isAdmin 
// //   });

// //   const { data: list = [], isLoading } = useQuery({
// //     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
// //     queryFn: () => {
// //       const finalDeptId = isStaff ? staffDeptId : deptFilter;
// //       if (isStaff && !staffDeptId) return []; 
// //       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
// //     },
// //   });

// //   const { data: belowThreshold = [] } = useQuery({
// //     queryKey: ['inventory', 'below-threshold'],
// //     queryFn: inventory.belowThreshold,
// //   });
// //   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

// //   // --- Excel Export ---
// //   const handleExportExcel = () => {
// //     if (list.length === 0) return message.warning("No data available");
// //     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
// //     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
// //       'Item': item.itemName,
// //       'Stock': item.currentQuantity,
// //       'Unit': item.unit,
// //       'Status': belowIds.has(item._id) ? 'Low' : 'OK'
// //     })));
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
// //     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
// //   };

// //   // --- Mutations ---
// //   const createMu = useMutation({
// //     mutationFn: (v) => inventory.create(v),
// //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
// //   });

// //   const updateMu = useMutation({
// //     mutationFn: ({ id, data }) => inventory.update(id, data),
// //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
// //   });

// //   const deleteMu = useMutation({
// //     mutationFn: inventory.delete,
// //     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
// //   });

// //   const handleCloseModal = () => {
// //     setModalOpen(false);
// //     setEditing(null);
// //     form.resetFields();
// //   };

// //   const openEdit = (record) => {
// //     setEditing(record);
// //     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
// //     setModalOpen(true);
// //   };

// //   const onFinish = (v) => {
// //     const autoDeptId = isStaff ? staffDeptId : deptFilter;
// //     const finalDeptId = autoDeptId || v.departmentId;
// //     const finalData = { ...v, departmentId: finalDeptId };
// //     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
// //     else createMu.mutate(finalData);
// //   };

// //   const columns = [
// //     {
// //       title: 'Item Name',
// //       dataIndex: 'itemName',
// //       render: (name, r) => (
// //         <Space direction="vertical" size={0}>
// //           <span style={{ fontWeight: 600 }}>{name}</span>
// //           {belowIds.has(r._id) && (
// //             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
// //           )}
// //         </Space>
// //       ),
// //     },
// //     { 
// //       title: 'Department', 
// //       dataIndex: ['departmentId', 'name'], 
// //       hidden: isStaff || (isAdmin && !!deptFilter) 
// //     },
// //     { 
// //       title: 'Stock', 
// //       dataIndex: 'currentQuantity', 
// //       align: 'right',
// //       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
// //     },
// //     ...(isAdmin ? [{
// //       title: 'Actions',
// //       align: 'center',
// //       render: (_, r) => (
// //         <Space>
// //           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
// //           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMu.mutate(r._id)} />
// //         </Space>
// //       ),
// //     }] : []),
// //   ];

// //   return (
// //     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
// //       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
// //         <h1 style={{ margin: 0 }}>Inventory</h1>
// //         {staffDeptName && (
// //           <Tag color="blue" icon={<HomeOutlined />}>
// //             {staffDeptName}
// //           </Tag>
// //         )}
// //       </div>
      
// //       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
// //         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
// //           {/* --- 1. SEARCH BAR (STAYS TOP) --- */}
// //           <Input
// //             placeholder="Search items..."
// //             prefix={<SearchOutlined />}
// //             size="large"
// //             style={{ width: '100%' }}
// //             onChange={(e) => setSearchText(e.target.value)}
// //             allowClear
// //           />

// //           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
// //             {/* --- 2. DEPARTMENT FILTER (STAYS LEFT IN ROW) --- */}
// //             {isAdmin && (
// //               <Select
// //                 showSearch
// //                 size="large"
// //                 style={{ width: '220px', marginRight: 'auto' }}
// //                 placeholder="Filter by Department"
// //                 value={deptFilter || undefined}
// //                 onChange={setDeptFilter}
// //                 allowClear
// //                 options={deptList.map(d => ({ label: d.name, value: d._id }))}
// //               />
// //             )}

// //             {/* --- 3. ACTION BUTTONS --- */}
// //             {showOrderButton && (
// //               <Button 
// //                 type="primary" 
// //                 size="large" 
// //                 icon={<ShoppingOutlined />} 
// //                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
// //                 onClick={() => navigate('/kitchen-order')}
// //               >
// //                 Today's Order
// //               </Button>
// //             )}

// //             <Button 
// //               icon={<FileExcelOutlined />} 
// //               size="large" 
// //               onClick={handleExportExcel}
// //               disabled={isLoading || list.length === 0}
// //             >
// //               Export
// //             </Button>

// //             {isAdmin && (
// //               <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
// //                 Add New Item
// //               </Button>
// //             )}
// //           </div>
// //         </Space>
// //       </Card>

// //       <Table
// //         loading={isLoading}
// //         rowKey="_id"
// //         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
// //         columns={columns}
// //         pagination={{ pageSize: 10 }}
// //       />

// //       <Modal
// //         title={editing ? 'Update Item' : 'Add New Item'}
// //         open={modalOpen}
// //         onCancel={handleCloseModal}
// //         footer={null}
// //         destroyOnClose
// //       >
// //         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
// //           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
// //             <Input />
// //           </Form.Item>
// //           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
// //             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
// //               <InputNumber style={{ width: '100%' }} />
// //             </Form.Item>
// //             <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
// //               <Input placeholder="e.g. kg, pcs" />
// //             </Form.Item>
// //           </div>
// //           <Button type="primary" htmlType="submit" size="large" block>
// //             Save Item
// //           </Button>
// //         </Form>
// //       </Modal>
// //     </div>
// //   );
// // }








// import { useState, useMemo } from 'react';
// import { 
//   Table, Button, Space, Modal, Form, 
//   Input, InputNumber, message, Tag, 
//   Select, Card 
// } from 'antd';
// import { 
//   PlusOutlined, EditOutlined, DeleteOutlined, 
//   WarningOutlined, SearchOutlined, FileExcelOutlined,
//   ShoppingOutlined, HomeOutlined
// } from '@ant-design/icons';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuth } from '../context/AuthContext';
// import { inventory, departments } from '../api';
// import { useNavigate } from 'react-router-dom';
// import * as XLSX from 'xlsx';

// export default function Inventory() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [deptFilter, setDeptFilter] = useState('');
//   const [searchText, setSearchText] = useState('');
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form] = Form.useForm();
//   const queryClient = useQueryClient();

//   // 1. Role & Department Extraction
//   const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
//   const isStaff = user?.role === 'Staff';
//   const staffDeptId = user?.departmentId?._id || user?.departmentId;
//   const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

//   // 2. Visibility Logic (Strictly Kitchen/Mess Staff, NOT Admin)
//   const isKitchenOrMess = 
//     staffDeptName?.toLowerCase().includes('kitchen') || 
//     staffDeptName?.toLowerCase().includes('mess');
  
//   const showOrderButton = isKitchenOrMess && !isAdmin;

//   // --- Data Fetching ---
//   const { data: deptList = [] } = useQuery({ 
//     queryKey: ['departments'], 
//     queryFn: departments.list,
//     enabled: isAdmin 
//   });

//   const { data: list = [], isLoading } = useQuery({
//     queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
//     queryFn: () => {
//       const finalDeptId = isStaff ? staffDeptId : deptFilter;
//       if (isStaff && !staffDeptId) return []; 
//       return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
//     },
//   });

//   const { data: belowThreshold = [] } = useQuery({
//     queryKey: ['inventory', 'below-threshold'],
//     queryFn: inventory.belowThreshold,
//   });
//   const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

//   // --- Excel Export ---
//   const handleExportExcel = () => {
//     if (list.length === 0) return message.warning("No data available");
//     const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
//     const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
//       'Item': item.itemName,
//       'Stock': item.currentQuantity,
//       'Unit': item.unit,
//       'Status': belowIds.has(item._id) ? 'Low' : 'OK'
//     })));
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
//     XLSX.writeFile(workbook, `Inventory_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   // --- Mutations ---
//   const createMu = useMutation({
//     mutationFn: (v) => inventory.create(v),
//     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
//   });

//   const updateMu = useMutation({
//     mutationFn: ({ id, data }) => inventory.update(id, data),
//     onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
//   });

//   const deleteMu = useMutation({
//     mutationFn: inventory.delete,
//     onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
//   });

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setEditing(null);
//     form.resetFields();
//   };

//   const openEdit = (record) => {
//     setEditing(record);
//     form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
//     setModalOpen(true);
//   };

//   const onFinish = (v) => {
//     const autoDeptId = isStaff ? staffDeptId : deptFilter;
//     const finalDeptId = autoDeptId || v.departmentId;
//     const finalData = { ...v, departmentId: finalDeptId };
//     if (editing) updateMu.mutate({ id: editing._id, data: finalData });
//     else createMu.mutate(finalData);
//   };

//   const columns = [
//     {
//       title: 'Item Name',
//       dataIndex: 'itemName',
//       render: (name, r) => (
//         <Space direction="vertical" size={0}>
//           <span style={{ fontWeight: 600 }}>{name}</span>
//           {belowIds.has(r._id) && (
//             <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
//           )}
//         </Space>
//       ),
//     },
//     { 
//       title: 'Department', 
//       dataIndex: ['departmentId', 'name'], 
//       hidden: isStaff || (isAdmin && !!deptFilter) 
//     },
//     { 
//       title: 'Stock', 
//       dataIndex: 'currentQuantity', 
//       align: 'right',
//       render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
//     },
//     ...(isAdmin ? [{
//       title: 'Actions',
//       align: 'center',
//       render: (_, r) => (
//         <Space>
//           <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
//           <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteMu.mutate(r._id)} />
//         </Space>
//       ),
//     }] : []),
//   ];

//   return (
//     <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
//         <h1 style={{ margin: 0 }}>Inventory</h1>
//         {staffDeptName && (
//           <Tag color="blue" icon={<HomeOutlined />}>
//             {staffDeptName}
//           </Tag>
//         )}
//       </div>
      
//       <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
//           {/* 1. Search Bar - Flex 1 makes it take available space */}
//           <Input
//             placeholder="Search items..."
//             prefix={<SearchOutlined />}
//             size="large"
//             style={{ flex: 1, minWidth: '250px' }}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//           />

//           {/* 2. Department Filter */}
//           {isAdmin && (
//             <Select
//               showSearch
//               size="large"
//               style={{ width: '220px' }}
//               placeholder="All Departments"
//               value={deptFilter || undefined}
//               onChange={setDeptFilter}
//               allowClear
//               options={deptList.map(d => ({ label: d.name, value: d._id }))}
//             />
//           )}

//           {/* 3. Action Buttons Group */}
//           <Space size="small">
//             {showOrderButton && (
//               <Button 
//                 type="primary" 
//                 size="large" 
//                 icon={<ShoppingOutlined />} 
//                 style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
//                 onClick={() => navigate('/kitchen-order')}
//               >
//                 Today's Order
//               </Button>
//             )}

//             <Button 
//               icon={<FileExcelOutlined />} 
//               size="large" 
//               onClick={handleExportExcel}
//               disabled={isLoading || list.length === 0}
//             >
//               Export
//             </Button>

//             {isAdmin && (
//               <Button 
//                 type="primary" 
//                 size="large" 
//                 icon={<PlusOutlined />} 
//                 onClick={() => setModalOpen(true)}
//               >
//                 Add New Item
//               </Button>
//             )}
//           </Space>
//         </div>
//       </Card>

//       <Table
//         loading={isLoading}
//         rowKey="_id"
//         dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
//         columns={columns}
//         pagination={{ pageSize: 10 }}
//       />

//       <Modal
//         title={editing ? 'Update Item' : 'Add New Item'}
//         open={modalOpen}
//         onCancel={handleCloseModal}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
//           <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
//             <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
//               <InputNumber style={{ width: '100%' }} />
//             </Form.Item>
//             <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
//               <Input placeholder="e.g. kg, pcs" />
//             </Form.Item>
//           </div>
//           <Button type="primary" htmlType="submit" size="large" block>
//             Save Item
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// }






import { useState, useMemo } from 'react';
import { 
  Table, Button, Space, Modal, Form, 
  Input, InputNumber, message, Tag, 
  Select, Card 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  WarningOutlined, SearchOutlined, FileExcelOutlined,
  ShoppingOutlined, HomeOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { inventory, departments } from '../api';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

export default function Inventory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deptFilter, setDeptFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 1. Role & Department Extraction
  const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
  const isStaff = user?.role === 'Staff';
  const staffDeptId = user?.departmentId?._id || user?.departmentId;
  const staffDeptName = user?.departmentId?.name || user?.departmentName || "";

  // 2. Visibility Logic (Strictly Kitchen/Mess Staff, NOT Admin)
  const isKitchenUser = staffDeptName?.toLowerCase().includes('kitchen') || 
                        staffDeptName?.toLowerCase().includes('mess');
  
  const showOrderButton = isKitchenUser && !isAdmin;

  // --- Data Fetching ---
  const { data: deptList = [] } = useQuery({ 
    queryKey: ['departments'], 
    queryFn: departments.list,
    enabled: isAdmin 
  });

  const { data: list = [], isLoading } = useQuery({
    queryKey: ['inventory', deptFilter, staffDeptId, isStaff],
    queryFn: () => {
      const finalDeptId = isStaff ? staffDeptId : deptFilter;
      if (isStaff && !staffDeptId) return []; 
      return inventory.list(finalDeptId ? { departmentId: finalDeptId } : {});
    },
  });

  const { data: belowThreshold = [] } = useQuery({
    queryKey: ['inventory', 'below-threshold'],
    queryFn: inventory.belowThreshold,
  });
  const belowIds = useMemo(() => new Set(belowThreshold.map((i) => i._id)), [belowThreshold]);

  // --- Excel Export (Advanced Logic) ---
  const handleExportExcel = () => {
    if (list.length === 0) return message.warning("No data available");
    const filteredData = list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()));
    const worksheetData = filteredData.map(item => ({
      'Item Name': item.itemName,
      'Department': item.departmentId?.name || 'N/A',
      'Current Stock': item.currentQuantity,
      'Unit': item.unit,
      'Unit Price (₹)': item.unitPrice || 0,
      'Total Value (₹)': (item.currentQuantity || 0) * (item.unitPrice || 0),
      'Alert Level': item.thresholdLevel,
      'Status': belowIds.has(item._id) ? 'Low Stock' : 'In Stock'
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, `Inventory_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  // --- Mutations ---
  const createMu = useMutation({
    mutationFn: (v) => inventory.create(v),
    onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Created'); },
  });

  const updateMu = useMutation({
    mutationFn: ({ id, data }) => inventory.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['inventory']); handleCloseModal(); message.success('Item Updated'); },
  });

  const deleteMu = useMutation({
    mutationFn: inventory.delete,
    onSuccess: () => { queryClient.invalidateQueries(['inventory']); message.success('Item Deleted'); },
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ ...record, departmentId: record.departmentId?._id || record.departmentId });
    setModalOpen(true);
  };

  const onFinish = (v) => {
    const autoDeptId = isStaff ? staffDeptId : deptFilter;
    const finalDeptId = autoDeptId || v.departmentId;
    const finalData = { ...v, departmentId: finalDeptId };
    if (editing) updateMu.mutate({ id: editing._id, data: finalData });
    else createMu.mutate(finalData);
  };

  // --- Table Columns (Advanced Logic) ---
  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
      render: (name, r) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {belowIds.has(r._id) && (
            <Tag color="error" icon={<WarningOutlined />} style={{ borderRadius: '4px' }}>Low Stock</Tag>
          )}
        </Space>
      ),
    },
    { 
      title: 'Department', 
      dataIndex: ['departmentId', 'name'], 
      hidden: isStaff || (isAdmin && !!deptFilter) 
    },
    { 
      title: 'Stock', 
      dataIndex: 'currentQuantity', 
      align: 'right',
      sorter: (a, b) => a.currentQuantity - b.currentQuantity,
      render: (qty, r) => <b>{qty} <small style={{ color: '#8c8c8c' }}>{r.unit}</small></b>
    },
    { 
      title: 'Unit Price', 
      dataIndex: 'unitPrice', 
      align: 'right',
      hidden: isStaff,
      render: (v) => v ? `₹${v.toLocaleString()}` : '-' 
    },
    { 
      title: 'Total Value', 
      align: 'right',
      hidden: isStaff,
      render: (_, r) => <span style={{ color: '#52c41a', fontWeight: 600 }}>₹{((r.currentQuantity || 0) * (r.unitPrice || 0)).toLocaleString()}</span>
    },
    { title: 'Alert Level', dataIndex: 'thresholdLevel', align: 'center', hidden: isStaff },
    ...(isAdmin ? [{
      title: 'Actions',
      align: 'center',
      render: (_, r) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#1890ff' }} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => {
            Modal.confirm({
              title: 'Delete Item',
              content: `Are you sure you want to delete ${r.itemName}?`,
              onOk: () => deleteMu.mutate(r._id),
            });
          }} />
        </Space>
      ),
    }] : []),
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Inventory Management</h1>
        {isStaff && staffDeptName && (
          <Tag color="blue" icon={<HomeOutlined />} style={{ fontSize: '14px', padding: '4px 8px' }}>
            {staffDeptName}
          </Tag>
        )}
      </div>
      
      <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* 1. Search Bar - Elastic (takes up space) */}
          <Input
            placeholder="Search items..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ flex: 1, minWidth: '250px' }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          {/* 2. Department Filter (Only for Admin) */}
          {isAdmin && (
            <Select
              showSearch
              size="large"
              style={{ width: '220px' }}
              placeholder="All Departments"
              value={deptFilter || undefined}
              onChange={setDeptFilter}
              allowClear
              options={[{ label: 'All Items', value: '' }, ...deptList.map(d => ({ label: d.name, value: d._id }))]}
            />
          )}

          {/* 3. Action Buttons Group */}
          <Space size="small">
            {showOrderButton && (
              <Button 
                type="primary" 
                size="large" 
                icon={<ShoppingOutlined />} 
                style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                onClick={() => navigate('/kitchen-order')}
              >
                Today's Order
              </Button>
            )}

            <Button 
              icon={<FileExcelOutlined />} 
              size="large" 
              onClick={handleExportExcel}
              disabled={isLoading || list.length === 0}
            >
              Export
            </Button>

            {isAdmin && (
              <Button 
                type="primary" 
                size="large" 
                icon={<PlusOutlined />} 
                onClick={() => setModalOpen(true)}
              >
                Add New Item
              </Button>
            )}
          </Space>
        </div>
      </Card>

      <Table
        loading={isLoading}
        rowKey="_id"
        dataSource={list.filter(i => i.itemName.toLowerCase().includes(searchText.toLowerCase()))}
        columns={columns}
        pagination={{ pageSize: 10 }}
        style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden' }}
      />

      <Modal
        title={editing ? 'Update Item' : 'Add New Item'}
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'pcs' }}>
          <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Rice, Football, Pens" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="currentQuantity" label="Quantity" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true }]}>
              <Select showSearch placeholder="Select unit">
                <Select.OptGroup label="Mass">
                  <Select.Option value="kg">kg</Select.Option>
                  <Select.Option value="gm">gm</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="Volume">
                  <Select.Option value="liters">liters</Select.Option>
                  <Select.Option value="ml">ml</Select.Option>
                </Select.OptGroup>
                <Select.OptGroup label="Count">
                  <Select.Option value="pcs">pcs</Select.Option>
                  <Select.Option value="pkt">packets</Select.Option>
                  <Select.Option value="units">units</Select.Option>
                </Select.OptGroup>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="thresholdLevel" label="Alert Level (Low Stock)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unitPrice" label="Price per Unit">
              <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
            </Form.Item>
          </div>

          <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={createMu.isPending || updateMu.isPending}>
                Save Item
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}