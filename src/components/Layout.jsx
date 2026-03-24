import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  InboxOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
  BellOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { inventory } from '../api';

const { Header, Sider, Content } = AntLayout;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Super-Admin';
  const isSuperAdmin = user?.role === 'Super-Admin';

  // --- Sidebar Logic ---
  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: '/tickets', icon: <FileTextOutlined />, label: <Link to="/tickets">My Tickets</Link> },
   

    
    ...(isAdmin ? [
      { key: '/admin-approvals', icon: <ShoppingOutlined />, label: <Link to="/admin-approvals">Kitchen Orders</Link> },
      // { key: '/users', icon: <TeamOutlined />, label: <Link to="/users">Users</Link> },
    ] : []),

 { key: '/inventory', icon: <InboxOutlined />, label: <Link to="/inventory">Inventory</Link> },



  ...(isAdmin ? [
      // { key: '/admin-approvals', icon: <ShoppingOutlined />, label: <Link to="/admin-approvals">Kitchen Orders</Link> },
      { key: '/users', icon: <TeamOutlined />, label: <Link to="/users">Users</Link> },
    ] : []),


    ...(isSuperAdmin ? [
      { key: '/director', icon: <BarChartOutlined />, label: <Link to="/director">Director Dashboard</Link> },
    ] : []),
  ];

  const { data: belowThreshold = [] } = useQuery({
    queryKey: ['inventory', 'below-threshold'],
    queryFn: inventory.belowThreshold,
    enabled: !!user,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        {/* Branding Section */}
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '8px',
          overflow: 'hidden' // Prevents text overflow during animation
        }}>
          <img 
            src="/Logo-50.png" 
            alt="" 
            style={{ 
              width: collapsed ? '70px' : '100px', 
              transition: 'all 0.2s',
              display: 'block'
            }} 
          />
          
          {!collapsed && (
            <h1 style={{ 
              color: '#fff', 
              fontSize: '30px', 
              margin: 0, 
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}>
              Montessori
            </h1>
          )}
        </div>

        <Menu 
          theme="dark" 
          selectedKeys={[location.pathname]} 
          mode="inline" 
          items={menuItems} 
        />
      </Sider>

      <AntLayout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          gap: 20 
        }}>
          <Badge count={belowThreshold.length} size="small">
            <Link to="/inventory">
              <Space>
                <BellOutlined style={{ fontSize: 18 }} />
                <span>Threshold alerts</span>
              </Space>
            </Link>
          </Badge>
          
          <Dropdown menu={{ items: [{ key: '1', label: 'Logout', onClick: handleLogout }] }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name} ({user?.role})</span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ 
          margin: '24px', 
          background: '#fff', 
          padding: 24, 
          borderRadius: 8,
          minHeight: 280 
        }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}