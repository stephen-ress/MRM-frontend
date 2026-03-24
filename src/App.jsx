// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { ProtectedRoute } from './components/ProtectedRoute';
// import Layout from './components/Layout';

// // Base Pages
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Inventory from './pages/Inventory';

// // Ticket System
// import Tickets from './pages/Tickets';
// import TicketNew from './pages/TicketNew';
// import TicketDetail from './pages/TicketDetail';

// // Admin & Management
// import Audits from './pages/Audits';
// import Users from './pages/Users';
// import Admins from './pages/Admins';
// import DirectorDashboard from './pages/DirectorDashboard';

// // --- KITCHEN ORDERING SYSTEM PAGES ---
// import KitchenOrder from './pages/KitchenOrder';
// import AdminOrders from './pages/AdminOrders';


// import ResetPassword from './pages/ResetPassword';


// function AppRoutes() {
//   const { user, loading } = useAuth();
  
//   if (loading) return null;

//   return (
//     <Routes>
//       {/* Auth Routes */}
//       <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
//       <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      
//       {/* Protected App Routes (Inside Layout) */}
//       <Route
//         path="/"
//         element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }
//       ><Route path="/reset-password/:token" element={<ResetPassword />} />
//         {/* Dashboard & Inventory */}
//         <Route index element={<Dashboard />} />
//         <Route path="inventory" element={<Inventory />} />
        
//         {/* Ticket Management */}
//         <Route path="tickets" element={<Tickets />} />
//         <Route path="tickets/new" element={<TicketNew />} />
//         <Route path="tickets/:id" element={<TicketDetail />} />

//         {/* --- KITCHEN SYSTEM INTEGRATION --- */}
        
//         {/* Accessible to Kitchen staff, Admins, and Ram (Staff role) */}
//         <Route 
//           path="kitchen-order" 
//           element={
//             <ProtectedRoute roles={['Kitchen', 'Admin', 'Super-Admin', 'Staff']}>
//               <KitchenOrder />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Admin Approval Dashboard */}
//         <Route 
//           path="admin-approvals" 
//           element={
//             <ProtectedRoute roles={['Admin', 'Super-Admin']}>
//               <AdminOrders />
//             </ProtectedRoute>
//           } 
//         />

//         {/* --- ADMIN & SUPER-ADMIN ONLY --- */}
//         <Route
//           path="audits"
//           element={
//             <ProtectedRoute roles={['Admin', 'Super-Admin']}>
//               <Audits />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="users"
//           element={
//             <ProtectedRoute roles={['Admin', 'Super-Admin']}>
//               <Users />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="admins"
//           element={
//             <ProtectedRoute roles={['Super-Admin']}>
//               <Admins />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="director"
//           element={
//             <ProtectedRoute roles={['Super-Admin']}>
//               <DirectorDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Route>
      
//       {/* Fallback Catch-all */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }




















import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// Base Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ResetPassword from './pages/ResetPassword';

// Ticket System
import Tickets from './pages/Tickets';
import TicketNew from './pages/TicketNew';
import TicketDetail from './pages/TicketDetail';

// Admin & Management
import Audits from './pages/Audits';
import Users from './pages/Users';
import Admins from './pages/Admins';
import DirectorDashboard from './pages/DirectorDashboard';

// Kitchen & Orders
import KitchenOrder from './pages/KitchenOrder';
import AdminOrders from './pages/AdminOrders';

function AppRoutes() {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  return (
    <Routes>
      {/* --- PUBLIC ROUTES (No Login Required) --- */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <Register />} 
      />
      
      {/* CRITICAL: Reset Password must be PUBLIC and OUTSIDE the Layout */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* --- PROTECTED ROUTES (Requires Login & Inside Layout) --- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard & Inventory */}
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        
        {/* Ticket Management */}
        <Route path="tickets" element={<Tickets />} />
        <Route path="tickets/new" element={<TicketNew />} />
        <Route path="tickets/:id" element={<TicketDetail />} />

        {/* Kitchen System */}
        <Route 
          path="kitchen-order" 
          element={
            <ProtectedRoute roles={['Kitchen', 'Admin', 'Super-Admin', 'Staff']}>
              <KitchenOrder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin-approvals" 
          element={
            <ProtectedRoute roles={['Admin', 'Super-Admin']}>
              <AdminOrders />
            </ProtectedRoute>
          } 
        />

        {/* Admin & Management */}
        <Route
          path="audits"
          element={
            <ProtectedRoute roles={['Admin', 'Super-Admin']}>
              <Audits />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={['Admin', 'Super-Admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="admins"
          element={
            <ProtectedRoute roles={['Super-Admin']}>
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path="director"
          element={
            <ProtectedRoute roles={['Super-Admin']}>
              <DirectorDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      
      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}