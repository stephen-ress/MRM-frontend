// // import { useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { 
// //   Card, 
// //   Descriptions, 
// //   Button, 
// //   Space, 
// //   Tag, 
// //   Modal, 
// //   InputNumber, 
// //   message, 
// //   Alert, 
// //   Divider,
// //   Input 
// // } from 'antd';
// // import { 
// //   DownloadOutlined, 
// //   CheckCircleOutlined, 
// //   ArrowLeftOutlined, 
// //   FileTextOutlined,
// //   CloseCircleOutlined 
// // } from '@ant-design/icons';
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import { useAuth } from '../context/AuthContext';
// // import { tickets } from '../api';

// // const { TextArea } = Input;

// // export default function TicketDetail() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const queryClient = useQueryClient();
  
// //   // States
// //   const [resolveModal, setResolveModal] = useState(false);
// //   const [rejectModal, setRejectModal] = useState(false);
// //   const [resolveCost, setResolveCost] = useState(null);
// //   const [rejectionReason, setRejectionReason] = useState('');

// //   // --- DATA FETCHING ---
// //   const { data: ticket, isLoading } = useQuery({
// //     queryKey: ['tickets', id],
// //     queryFn: () => tickets.get(id),
// //     enabled: !!id,
// //   });

// //   // --- MUTATIONS ---
  
// //   // 1. Resolve Mutation (Updated for reliability)
// //   const resolveMu = useMutation({
// //     mutationFn: (cost) => tickets.resolve(id, cost),
// //     onSuccess: () => {
// //       // Invalidate first, then show message and close modal
// //       queryClient.invalidateQueries(['tickets', id]).then(() => {
// //         message.success('Ticket Resolved Successfully');
// //         setResolveModal(false); 
// //         setResolveCost(null);
// //       });
// //     },
// //     onError: (e) => message.error(e.response?.data?.message || 'Resolution failed'),
// //   });

// //   // 2. Approve Mutation
// //   const approveMu = useMutation({
// //     mutationFn: () => tickets.approve(id),
// //     onSuccess: () => {
// //       queryClient.invalidateQueries(['tickets', id]);
// //       message.success('Ticket Approved successfully');
// //     },
// //     onError: (e) => message.error(e.response?.data?.message || 'Approval failed'),
// //   });

// //   // 3. Reject Mutation (New)
// //   const rejectMu = useMutation({
// //     mutationFn: (reason) => tickets.reject(id, reason), // Ensure this exists in your api.js
// //     onSuccess: () => {
// //       queryClient.invalidateQueries(['tickets', id]);
// //       message.error('Ticket Rejected');
// //       setRejectModal(false);
// //       setRejectionReason('');
// //     },
// //     onError: (e) => message.error(e.response?.data?.message || 'Rejection failed'),
// //   });

// //   if (isLoading || !ticket) return <div style={{ padding: '24px' }}>Loading...</div>;

// //   // --- PERMISSIONS LOGIC ---
// //   const isSuperAdmin = user?.role === 'Super-Admin';
// //   const isAdminOrSuper = user?.role === 'Admin' || user?.role === 'Super-Admin';
// //   const isOwner = user?._id === ticket.raisedBy?._id;
// //   const canSeeFiles = isAdminOrSuper || isOwner;

// //   return (
// //     <div style={{ padding: '24px' }}>
// //       <Button 
// //         icon={<ArrowLeftOutlined />} 
// //         onClick={() => navigate('/tickets')} 
// //         style={{ marginBottom: 16 }}
// //       >
// //         Back to List
// //       </Button>
      
// //       <Card 
// //         title={`Ticket: ${ticket.ticketNumber}`} 
// //         extra={
// //           <Tag color={ticket.status === 'Resolved' ? 'green' : ticket.status === 'Rejected' ? 'red' : 'blue'}>
// //             {ticket.status}
// //           </Tag>
// //         }
// //       >
// //         <Descriptions bordered column={1} size="small">
// //           <Descriptions.Item label="Raised By">
// //             {ticket.raisedBy?.name} ({ticket.raisedBy?.email})
// //           </Descriptions.Item>
// //           <Descriptions.Item label="Department">
// //             {ticket.departmentId?.name}
// //           </Descriptions.Item>
// //           <Descriptions.Item label="Subject">
// //             {ticket.title}
// //           </Descriptions.Item>
// //           <Descriptions.Item label="Description">
// //             {ticket.description || "No description provided."}
// //           </Descriptions.Item>
// //           <Descriptions.Item label="Final Cost">
// //             {ticket.cost ? `₹${ticket.cost.toLocaleString('en-IN')}` : 'Pending'}
// //           </Descriptions.Item>
// //           {ticket.status === 'Rejected' && (
// //              <Descriptions.Item label="Rejection Reason">
// //                <span style={{ color: 'red' }}>{ticket.rejectionReason || "No reason specified."}</span>
// //              </Descriptions.Item>
// //           )}
// //         </Descriptions>

// //         {/* ATTACHMENTS */}
// //         {canSeeFiles && (
// //           <div style={{ marginTop: 20 }}>
// //             <Divider orientation="left">Documents</Divider>
// //             {ticket.excelFile ? (
// //               <Alert
// //                 message="Excel Requisition"
// //                 type="info"
// //                 showIcon
// //                 action={
// //                   <Button type="primary" icon={<DownloadOutlined />} href={ticket.excelFile} target="_blank">
// //                     Download
// //                   </Button>
// //                 }
// //               />
// //             ) : (
// //               <Alert message="No Excel file attached." type="warning" showIcon />
// //             )}
// //           </div>
// //         )}

// //         {/* ACTION BUTTONS */}
// //         <Space style={{ marginTop: 24 }}>
// //           {/* Super-Admin Approval/Rejection */}
// //           {isSuperAdmin && ticket.status === 'Pending' && (
// //             <>
// //               <Button 
// //                 type="primary" 
// //                 icon={<CheckCircleOutlined />} 
// //                 onClick={() => approveMu.mutate()}
// //                 loading={approveMu.isPending}
// //               >
// //                 Approve
// //               </Button>
// //               <Button 
// //                 danger
// //                 icon={<CloseCircleOutlined />} 
// //                 onClick={() => setRejectModal(true)}
// //               >
// //                 Reject
// //               </Button>
// //             </>
// //           )}
          
// //           {/* Resolution gate */}
// //           {isAdminOrSuper && ticket.status === 'Approved by Director' && (
// //             <Button 
// //               type="primary" 
// //               icon={<CheckCircleOutlined />}
// //               onClick={() => setResolveModal(true)}
// //               loading={resolveMu.isPending}
// //             >
// //               Resolve & Close
// //             </Button>
// //           )}
// //         </Space>
// //       </Card>

// //       {/* MODAL: RESOLVE */}
// //       <Modal
// //         title="Finalize Resolution"
// //         open={resolveModal}
// //         onCancel={() => setResolveModal(false)}
// //         onOk={() => {
// //           if (resolveCost === null) return message.warning("Please enter the final cost");
// //           resolveMu.mutate(resolveCost);
// //         }}
// //         confirmLoading={resolveMu.isPending}
// //         okText="Confirm Resolution"
// //       >
// //         <p>Enter the final verified cost (₹):</p>
// //         <InputNumber
// //           style={{ width: '100%' }}
// //           min={0}
// //           placeholder="0.00"
// //           value={resolveCost}
// //           onChange={setResolveCost}
// //         />
// //       </Modal>

// //       {/* MODAL: REJECT */}
// //       <Modal
// //         title="Reject Ticket"
// //         open={rejectModal}
// //         onCancel={() => setRejectModal(false)}
// //         onOk={() => {
// //           if (!rejectionReason.trim()) return message.warning("Please provide a reason");
// //           rejectMu.mutate(rejectionReason);
// //         }}
// //         confirmLoading={rejectMu.isPending}
// //         okText="Confirm Rejection"
// //         okButtonProps={{ danger: true }}
// //       >
// //         <p>Reason for rejection:</p>
// //         <TextArea 
// //           rows={4} 
// //           value={rejectionReason} 
// //           onChange={(e) => setRejectionReason(e.target.value)} 
// //           placeholder="e.g., Budget exceeded or incorrect documentation"
// //         />
// //       </Modal>
// //     </div>
// //   );
// // }







// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Descriptions, Button, Space, Tag, Modal, InputNumber, message, Alert, Divider, Input } from 'antd';
// import { DownloadOutlined, CheckCircleOutlined, ArrowLeftOutlined, CloseCircleOutlined } from '@ant-design/icons';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuth } from '../context/AuthContext';
// import { tickets } from '../api';

// const { TextArea } = Input;

// export default function TicketDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
  
//   const [resolveModal, setResolveModal] = useState(false);
//   const [rejectModal, setRejectModal] = useState(false);
//   const [resolveCost, setResolveCost] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState('');

//   const { data: ticket, isLoading } = useQuery({
//     queryKey: ['tickets', id],
//     queryFn: () => tickets.get(id),
//     enabled: !!id,
//   });

//   // --- RECTIFIED RESOLVE MUTATION ---
//   const resolveMu = useMutation({
//     mutationFn: (cost) => tickets.resolve(id, cost),
//     onSuccess: () => {
//       // 1. Immediate UI Feedback
//       message.success('Ticket Resolved Successfully');
//       setResolveModal(false);
//       setResolveCost(null);
      
//       // 2. Background Sync
//       queryClient.invalidateQueries({ queryKey: ['tickets', id] });
//       queryClient.invalidateQueries({ queryKey: ['tickets'] }); // Refresh the main list too
//     },
//     onError: (e) => {
//       message.error(e.response?.data?.message || 'Resolution failed');
//     },
//   });

//   const approveMu = useMutation({
//     mutationFn: () => tickets.approve(id),
//     onSuccess: () => {
//       message.success('Ticket Approved successfully');
//       queryClient.invalidateQueries({ queryKey: ['tickets', id] });
//     },
//   });

//   const rejectMu = useMutation({
//     mutationFn: (reason) => tickets.reject(id, reason),
//     onSuccess: () => {
//       message.warning('Ticket Rejected');
//       setRejectModal(false);
//       setRejectionReason('');
//       queryClient.invalidateQueries({ queryKey: ['tickets', id] });
//     },
//   });

//   if (isLoading || !ticket) return <div style={{ padding: '24px' }}>Loading...</div>;

//   const isSuperAdmin = user?.role === 'Super-Admin';
//   const isAdminOrSuper = user?.role === 'Admin' || user?.role === 'Super-Admin';

//   return (
//     <div style={{ padding: '24px' }}>
//       <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tickets')} style={{ marginBottom: 16 }}>
//         Back to List
//       </Button>
      
//       <Card 
//         title={`Ticket: ${ticket.ticketNumber}`} 
//         extra={<Tag color={ticket.status === 'Resolved' ? 'green' : ticket.status === 'Rejected' ? 'red' : 'blue'}>{ticket.status}</Tag>}
//       >
//         <Descriptions bordered column={1} size="small">
//           <Descriptions.Item label="Raised By">{ticket.raisedBy?.name} ({ticket.raisedBy?.email})</Descriptions.Item>
//           <Descriptions.Item label="Department">{ticket.departmentId?.name}</Descriptions.Item>
//           <Descriptions.Item label="Subject">{ticket.title}</Descriptions.Item>
//           <Descriptions.Item label="Description">{ticket.description || "No description provided."}</Descriptions.Item>
//           <Descriptions.Item label="Final Cost">
//             {ticket.cost !== null ? `₹${ticket.cost.toLocaleString('en-IN')}` : 'Pending'}
//           </Descriptions.Item>
//         </Descriptions>

//         <Space style={{ marginTop: 24 }}>
//           {isSuperAdmin && ticket.status === 'Pending' && (
//             <>
//               <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => approveMu.mutate()} loading={approveMu.isPending}>
//                 Approve
//               </Button>
//               <Button danger icon={<CloseCircleOutlined />} onClick={() => setRejectModal(true)}>
//                 Reject
//               </Button>
//             </>
//           )}
          
//           {isAdminOrSuper && ticket.status === 'Approved by Director' && (
//             <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => setResolveModal(true)} loading={resolveMu.isPending}>
//               Resolve & Close
//             </Button>
//           )}
//         </Space>
//       </Card>

//       {/* MODAL: RESOLVE */}
//       <Modal
//         title="Finalize Resolution"
//         open={resolveModal}
//         onCancel={() => setResolveModal(false)}
//         onOk={() => {
//           if (resolveCost === null) return message.warning("Please enter the final cost");
//           resolveMu.mutate(resolveCost);
//         }}
//         confirmLoading={resolveMu.isPending}
//       >
//         <p>Enter the final verified cost (₹):</p>
//         <InputNumber
//           style={{ width: '100%' }}
//           min={0}
//           placeholder="0.00"
//           value={resolveCost}
//           onChange={setResolveCost}
//         />
//       </Modal>

//       {/* MODAL: REJECT */}
//       <Modal
//         title="Reject Ticket"
//         open={rejectModal}
//         onCancel={() => setRejectModal(false)}
//         onOk={() => {
//           if (!rejectionReason.trim()) return message.warning("Please provide a reason");
//           rejectMu.mutate(rejectionReason);
//         }}
//         confirmLoading={rejectMu.isPending}
//         okButtonProps={{ danger: true }}
//       >
//         <TextArea rows={4} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." />
//       </Modal>
//     </div>
//   );
// }










import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  InputNumber, 
  message, 
  Alert, 
  Divider, 
  Input 
} from 'antd';
import { 
  DownloadOutlined, 
  CheckCircleOutlined, 
  ArrowLeftOutlined, 
  CloseCircleOutlined,
  FileExcelOutlined 
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { tickets } from '../api';

const { TextArea } = Input;

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // --- UI STATES ---
  const [resolveModal, setResolveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [resolveCost, setResolveCost] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- DATA FETCHING ---
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => tickets.get(id),
    enabled: !!id,
  });

  // --- MUTATIONS ---
  const resolveMu = useMutation({
    mutationFn: (cost) => tickets.resolve(id, cost),
    onSuccess: () => {
      message.success('Ticket Resolved Successfully');
      setResolveModal(false);
      setResolveCost(null);
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (e) => message.error(e.response?.data?.message || 'Resolution failed'),
  });

  const approveMu = useMutation({
    mutationFn: () => tickets.approve(id),
    onSuccess: () => {
      message.success('Ticket Approved successfully');
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
    onError: (e) => message.error(e.response?.data?.message || 'Approval failed'),
  });

  const rejectMu = useMutation({
    mutationFn: (reason) => tickets.reject(id, reason),
    onSuccess: () => {
      message.warning('Ticket Rejected');
      setRejectModal(false);
      setRejectionReason('');
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
    onError: (e) => message.error(e.response?.data?.message || 'Rejection failed'),
  });

  if (isLoading || !ticket) return <div style={{ padding: '24px' }}>Loading...</div>;

  // --- PERMISSIONS ---
  const isSuperAdmin = user?.role === 'Super-Admin';
  const isAdmin = user?.role === 'Admin';
  const isAdminOrSuper = isAdmin || isSuperAdmin;
  const isOwner = user?._id === ticket.raisedBy?._id;
  
  // Admins and Super-Admins should always see the Excel file
  const canSeeFiles = isAdminOrSuper || isOwner;

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/tickets')} 
        style={{ marginBottom: 16 }}
      >
        Back to List
      </Button>
      
      <Card 
        title={`Ticket: ${ticket.ticketNumber}`} 
        extra={
          <Tag color={ticket.status === 'Resolved' ? 'green' : ticket.status === 'Rejected' ? 'red' : 'blue'}>
            {ticket.status}
          </Tag>
        }
      >
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Raised By">
            {ticket.raisedBy?.name} ({ticket.raisedBy?.email})
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            {ticket.departmentId?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Subject">
            {ticket.title}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {ticket.description || "No description provided."}
          </Descriptions.Item>
          <Descriptions.Item label="Final Cost">
            {ticket.cost !== null ? `₹${ticket.cost.toLocaleString('en-IN')}` : 'Pending'}
          </Descriptions.Item>
          {ticket.status === 'Rejected' && (
            <Descriptions.Item label="Rejection Reason">
              <span style={{ color: 'red' }}>{ticket.rejectionReason || "No reason specified."}</span>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* --- DOCUMENTS SECTION (RESTORED) --- */}
        {canSeeFiles && (
          <div style={{ marginTop: 20 }}>
            <Divider orientation="left">Documents & Requisitions</Divider>
            {ticket.excelFile ? (
              <Alert
                message="Excel Requisition File"
                description="Click download to review the items requested in this ticket."
                type="info"
                showIcon
                icon={<FileExcelOutlined />}
                action={
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    href={ticket.excelFile} 
                    target="_blank"
                  >
                    Download Excel
                  </Button>
                }
              />
            ) : (
              <Alert message="No Excel file attached to this ticket." type="warning" showIcon />
            )}
          </div>
        )}

        {/* --- ACTION BUTTONS --- */}
        <Space style={{ marginTop: 24 }}>
          {isSuperAdmin && ticket.status === 'Pending' && (
            <>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                onClick={() => approveMu.mutate()} 
                loading={approveMu.isPending}
              >
                Approve
              </Button>
              <Button 
                danger 
                icon={<CloseCircleOutlined />} 
                onClick={() => setRejectModal(true)}
              >
                Reject
              </Button>
            </>
          )}
          
          {isAdminOrSuper && ticket.status === 'Approved by Director' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => setResolveModal(true)} 
              loading={resolveMu.isPending}
            >
              Resolve & Close
            </Button>
          )}
        </Space>
      </Card>

      {/* MODAL: RESOLVE */}
      <Modal
        title="Finalize Resolution"
        open={resolveModal}
        onCancel={() => setResolveModal(false)}
        onOk={() => {
          if (resolveCost === null) return message.warning("Please enter the final cost");
          resolveMu.mutate(resolveCost);
        }}
        confirmLoading={resolveMu.isPending}
        okText="Confirm Resolution"
      >
        <p>Enter the final verified cost (₹):</p>
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          placeholder="0.00"
          value={resolveCost}
          onChange={setResolveCost}
        />
      </Modal>

      {/* MODAL: REJECT */}
      <Modal
        title="Reject Ticket"
        open={rejectModal}
        onCancel={() => setRejectModal(false)}
        onOk={() => {
          if (!rejectionReason.trim()) return message.warning("Please provide a reason");
          rejectMu.mutate(rejectionReason);
        }}
        confirmLoading={rejectMu.isPending}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true }}
      >
        <p>Reason for rejection:</p>
        <TextArea 
          rows={4} 
          value={rejectionReason} 
          onChange={(e) => setRejectionReason(e.target.value)} 
          placeholder="e.g., Budget exceeded or items unavailable" 
        />
      </Modal>
    </div>
  );
}