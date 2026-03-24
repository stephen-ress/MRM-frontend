// // // import client from './client';
// // // import axios from 'axios'; // 👈 Add this line!

// // // export const auth = {
// // //   login: (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data),
// // //   register: (data) => client.post('/auth/register', data).then((r) => r.data),
// // //   me: () => client.get('/auth/me').then((r) => r.data),
// // //   logout: () => client.post('/auth/logout').then((r) => r.data),
// // // };

// // // export const departments = {
// // //   list: () => client.get('/departments').then((r) => r.data),
// // //   get: (id) => client.get(`/departments/${id}`).then((r) => r.data),
// // // };

// // // export const inventory = {
// // //   list: (params) => client.get('/inventory', { params }).then((r) => r.data),
// // //   belowThreshold: () => client.get('/inventory/below-threshold').then((r) => r.data),
// // //   get: (id) => client.get(`/inventory/${id}`).then((r) => r.data),
// // //   create: (data) => client.post('/inventory', data).then((r) => r.data),
// // //   update: (id, data) => client.patch(`/inventory/${id}`, data).then((r) => r.data),
// // //   delete: (id) => client.delete(`/inventory/${id}`).then((r) => r.data),
// // // };



// // // export const audits = {
// // //   list: (params) => client.get('/audits', { params }).then((r) => r.data),
// // //   get: (id) => client.get(`/audits/${id}`).then((r) => r.data),
// // //   create: (data) => client.post('/audits', data).then((r) => r.data),
// // // };

// // // export const users = {
// // //   list: (params) => client.get('/users', { params }).then((r) => r.data),
// // //   admins: () => client.get('/users/admins').then((r) => r.data),
// // //   deactivate: (id) => client.patch(`/users/${id}/deactivate`).then((r) => r.data),
// // // };

// // // export const dashboard = {
// // //   spending: () => client.get('/dashboard/spending').then((r) => r.data),
// // //   totalSpent: () => client.get('/dashboard/total-spent').then((r) => r.data),
// // //   ticketStats: () => client.get('/dashboard/ticket-stats').then((r) => r.data),
// // // };


// // // export const tickets = {
// // //   list: (params) => client.get('/tickets', { params }).then((r) => r.data),
// // //   get: (id) => client.get(`/tickets/${id}`).then((r) => r.data),
  
// // //   // FIX: Remove { headers: {} } so the interceptor can work and 
// // //   // Axios can set the multi-part boundary correctly.
// // //   create: (formData) => client.post('/tickets', formData).then((r) => r.data),
  
// // //   approve: (id) => client.patch(`/tickets/${id}/approve`).then((r) => r.data),
// // //   reject: (id, reason) => client.patch(`/tickets/${id}/reject`, { rejectionReason: reason }).then((r) => r.data),
// // //   resolve: (id, cost) => client.patch(`/tickets/${id}/resolve`, { cost }).then((r) => r.data),
// // // };



// // // // frontend/src/api/index.js (Add this line)
// // // export const kitchen = {
// // //   getOrders: () => axios.get('/api/kitchen/orders'),
// // //   createOrder: (data) => axios.post('/api/kitchen/order', data),
// // //   approveOrder: (id) => axios.patch(`/api/kitchen/order/${id}/approve`),
// // // };



// // // // ... existing inventory and department exports ...
// // // export const orders = {
// // //   // Use 'client' to ensure the /api prefix and tokens are handled automatically
// // //   create: (data) => client.post('/orders/kitchen/request', data).then(res => res.data),
  
// // //   listPending: () => client.get('/orders/admin/pending').then(res => res.data),
  
// // //   approve: (id) => client.patch(`/orders/admin/approve/${id}`).then(res => res.data),
// // // };





// // import client from './client';
// // import axios from 'axios'; 

// // // --- Auth API ---
// // export const auth = {
// //   login: (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data),
// //   register: (data) => client.post('/auth/register', data).then((r) => r.data),
// //   me: () => client.get('/auth/me').then((r) => r.data),
// //   logout: () => client.post('/auth/logout').then((r) => r.data),
// // };

// // // --- Departments API ---
// // export const departments = {
// //   // Updated to ensure it returns the data directly for your Register component
// //   list: () => client.get('/departments').then((r) => r.data),
// //   get: (id) => client.get(`/departments/${id}`).then((r) => r.data),
// //   create: (newDept) => client.post('/departments', newDept).then((r) => r.data),
// // };

// // // --- Inventory API ---
// // export const inventory = {
// //   list: (params) => client.get('/inventory', { params }).then((r) => r.data),
// //   belowThreshold: () => client.get('/inventory/below-threshold').then((r) => r.data),
// //   get: (id) => client.get(`/inventory/${id}`).then((r) => r.data),
// //   create: (data) => client.post('/inventory', data).then((r) => r.data),
// //   update: (id, data) => client.patch(`/inventory/${id}`, data).then((r) => r.data),
// //   delete: (id) => client.delete(`/inventory/${id}`).then((r) => r.data),
// // };

// // // --- Audits API ---
// // export const audits = {
// //   list: (params) => client.get('/audits', { params }).then((r) => r.data),
// //   get: (id) => client.get(`/audits/${id}`).then((r) => r.data),
// //   create: (data) => client.post('/audits', data).then((r) => r.data),
// // };

// // // --- Users API ---
// // export const users = {
// //   list: (params) => client.get('/users', { params }).then((r) => r.data),
// //   admins: () => client.get('/users/admins').then((r) => r.data),
// //   deactivate: (id) => client.patch(`/users/${id}/deactivate`).then((r) => r.data),
// // };

// // // --- Dashboard API ---
// // export const dashboard = {
// //   spending: () => client.get('/dashboard/spending').then((r) => r.data),
// //   totalSpent: () => client.get('/dashboard/total-spent').then((r) => r.data),
// //   ticketStats: () => client.get('/dashboard/ticket-stats').then((r) => r.data),
// // };

// // // --- Tickets API ---
// // export const tickets = {
// //   list: (params) => client.get('/tickets', { params }).then((r) => r.data),
// //   get: (id) => client.get(`/tickets/${id}`).then((r) => r.data),
// //   // Axios handles multipart/form-data automatically when passed FormData
// //   create: (formData) => client.post('/tickets', formData).then((r) => r.data),
// //   approve: (id) => client.patch(`/tickets/${id}/approve`).then((r) => r.data),
// //   reject: (id, reason) => client.patch(`/tickets/${id}/reject`, { rejectionReason: reason }).then((r) => r.data),
// //   resolve: (id, cost) => client.patch(`/tickets/${id}/resolve`, { cost }).then((r) => r.data),
// // };

// // // --- Kitchen & Orders API ---
// // export const kitchen = {
// //   // Changed to use 'client' for consistent URL prefixing
// //   getOrders: () => client.get('/kitchen/orders').then((r) => r.data),
// //   createOrder: (data) => client.post('/kitchen/order', data).then((r) => r.data),
// //   approveOrder: (id) => client.patch(`/kitchen/order/${id}/approve`).then((r) => r.data),
// // };

// // export const orders = {
// //   create: (data) => client.post('/orders/kitchen/request', data).then(res => res.data),
// //   listPending: () => client.get('/orders/admin/pending').then(res => res.data),
// //   approve: (id) => client.patch(`/orders/admin/approve/${id}`).then(res => res.data),
// // };















// import client from './client';
// import axios from 'axios'; 

// // --- Auth API ---
// export const auth = {
//   login: (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data),
//   register: (data) => client.post('/auth/register', data).then((r) => r.data),
//   me: () => client.get('/auth/me').then((r) => r.data),
//   logout: () => client.post('/auth/logout').then((r) => r.data),
//   // New Methods for Registration Control & Password Recovery
 
//   getRegStatus: () => client.get('/auth/registration-status').then((r) => r.data),
//   forgotPassword: (email) => client.post('/auth/forgot-password', { email }).then((r) => r.data),
//   // Add this inside the export const auth = { ... } object
// resetPassword: (token, password) => client.post(`/auth/reset-password/${token}`, { password }).then(r => r.data),
// };

// // --- Departments API ---
// export const departments = {
//   list: () => client.get('/departments').then((r) => r.data),
//   get: (id) => client.get(`/departments/${id}`).then((r) => r.data),
//   create: (newDept) => client.post('/departments', newDept).then((r) => r.data),
// };

// // --- Inventory API ---
// export const inventory = {
//   list: (params) => client.get('/inventory', { params }).then((r) => r.data),
//   belowThreshold: () => client.get('/inventory/below-threshold').then((r) => r.data),
//   get: (id) => client.get(`/inventory/${id}`).then((r) => r.data),
//   create: (data) => client.post('/inventory', data).then((r) => r.data),
//   update: (id, data) => client.patch(`/inventory/${id}`, data).then((r) => r.data),
//   delete: (id) => client.delete(`/inventory/${id}`).then((r) => r.data),
// };

// // --- Audits API ---
// export const audits = {
//   list: (params) => client.get('/audits', { params }).then((r) => r.data),
//   get: (id) => client.get(`/audits/${id}`).then((r) => r.data),
//   create: (data) => client.post('/audits', data).then((r) => r.data),
// };

// // --- Users API ---
// export const users = {
//   list: (params) => client.get('/users', { params }).then((r) => r.data),
//   admins: () => client.get('/users/admins').then((r) => r.data),
//   deactivate: (id) => client.patch(`/users/${id}/deactivate`).then((r) => r.data),
// };

// // --- Dashboard API ---
// export const dashboard = {
//   spending: () => client.get('/dashboard/spending').then((r) => r.data),
//   totalSpent: () => client.get('/dashboard/total-spent').then((r) => r.data),
//   ticketStats: () => client.get('/dashboard/ticket-stats').then((r) => r.data),
// };

// // --- Tickets API ---
// export const tickets = {
//   list: (params) => client.get('/tickets', { params }).then((r) => r.data),
//   get: (id) => client.get(`/tickets/${id}`).then((r) => r.data),
//   create: (formData) => client.post('/tickets', formData).then((r) => r.data),
//   approve: (id) => client.patch(`/tickets/${id}/approve`).then((r) => r.data),
//   reject: (id, reason) => client.patch(`/tickets/${id}/reject`, { rejectionReason: reason }).then((r) => r.data),
//   resolve: (id, cost) => client.patch(`/tickets/${id}/resolve`, { cost }).then((r) => r.data),
// };

// // --- Kitchen & Orders API ---
// export const kitchen = {
//   getOrders: () => client.get('/kitchen/orders').then((r) => r.data),
//   createOrder: (data) => client.post('/kitchen/order', data).then((r) => r.data),
//   approveOrder: (id) => client.patch(`/kitchen/order/${id}/approve`).then((r) => r.data),
// };

// export const orders = {
//   create: (data) => client.post('/orders/kitchen/request', data).then(res => res.data),
//   listPending: () => client.get('/orders/admin/pending').then(res => res.data),
//   approve: (id) => client.patch(`/orders/admin/approve/${id}`).then(res => res.data),
// };






import client from './client';

// --- Auth API ---
export const auth = {
  login: (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data),
  register: (data) => client.post('/auth/register', data).then((r) => r.data),
  me: () => client.get('/auth/me').then((r) => r.data),
  logout: () => client.post('/auth/logout').then((r) => r.data),
  
  // Registration Control & Password Recovery
  getRegStatus: () => client.get('/auth/registration-status').then((r) => r.data),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token, password) => client.post(`/auth/reset-password/${token}`, { password }).then(r => r.data),
};

// --- Departments API ---
export const departments = {
  list: () => client.get('/departments').then((r) => r.data),
  get: (id) => client.get(`/departments/${id}`).then((r) => r.data),
  create: (newDept) => client.post('/departments', newDept).then((r) => r.data),
  
  /**
   * FIX: Added update method for "Allot Budget"
   * Updates specific fields like budgetAllocated
   */
  update: (id, data) => client.patch(`/departments/${id}`, data).then((r) => r.data),
};

// --- Inventory API ---
export const inventory = {
  list: (params) => client.get('/inventory', { params }).then((r) => r.data),
  belowThreshold: () => client.get('/inventory/below-threshold').then((r) => r.data),
  get: (id) => client.get(`/inventory/${id}`).then((r) => r.data),
  create: (data) => client.post('/inventory', data).then((r) => r.data),
  update: (id, data) => client.patch(`/inventory/${id}`, data).then((r) => r.data),
  delete: (id) => client.delete(`/inventory/${id}`).then((r) => r.data),
};

// --- Audits API ---
export const audits = {
  list: (params) => client.get('/audits', { params }).then((r) => r.data),
  get: (id) => client.get(`/audits/${id}`).then((r) => r.data),
  create: (data) => client.post('/audits', data).then((r) => r.data),
};

// --- Users API ---
export const users = {
  list: (params) => client.get('/users', { params }).then((r) => r.data),
  admins: () => client.get('/users/admins').then((r) => r.data),
  deactivate: (id) => client.patch(`/users/${id}/deactivate`).then((r) => r.data),
};

// --- Dashboard API ---
export const dashboard = {
  spending: () => client.get('/dashboard/spending').then((r) => r.data),
  totalSpent: () => client.get('/dashboard/total-spent').then((r) => r.data),
  ticketStats: () => client.get('/dashboard/ticket-stats').then((r) => r.data),
};

// --- Tickets API ---
export const tickets = {
  list: (params) => client.get('/tickets', { params }).then((r) => r.data),
  get: (id) => client.get(`/tickets/${id}`).then((r) => r.data),
  create: (formData) => client.post('/tickets', formData).then((r) => r.data),
  approve: (id) => client.patch(`/tickets/${id}/approve`).then((r) => r.data),
  reject: (id, reason) => client.patch(`/tickets/${id}/reject`, { rejectionReason: reason }).then((r) => r.data),
  resolve: (id, cost) => client.patch(`/tickets/${id}/resolve`, { cost }).then((r) => r.data),
};

// --- Kitchen & Orders API ---
export const kitchen = {
  getOrders: () => client.get('/kitchen/orders').then((r) => r.data),
  createOrder: (data) => client.post('/kitchen/order', data).then((r) => r.data),
  approveOrder: (id) => client.patch(`/kitchen/order/${id}/approve`).then((r) => r.data),
};

export const orders = {
  create: (data) => client.post('/orders/kitchen/request', data).then(res => res.data),
  listPending: () => client.get('/orders/admin/pending').then(res => res.data),
  approve: (id) => client.patch(`/orders/admin/approve/${id}`).then(res => res.data),
};