// pages/admin/AdminLayout.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Drawer } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  BookOutlined,
  LogoutOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  PhoneFilled,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Kullanıcı Yönetimi',
    },
    {
      key: '/admin/tours',
      icon: <AppstoreOutlined />,
      label: 'Tur Yönetimi',
    },
    {
      key: '/admin/bookings',
      icon: <BookOutlined />,
      label: 'Rezervasyon Yönetimi',
    },
    {
      key: '/admin/about',
      icon: <InfoCircleOutlined />,
      label: 'Hakkımızda Yönetimi',
    },
    {
      key: '/admin/contact',
      icon: <PhoneFilled />,
      label: 'İletişim Yönetimi',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
        Ana Sayfaya Dön
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Çıkış Yap
      </Menu.Item>
    </Menu>
  );

  const sidebarContent = (
    <>
      <div className={`admin-sidebar-header ${collapsed && !isMobile ? 'collapsed' : ''}`}>
        {!collapsed || isMobile ? (
          <div className="admin-sidebar-title-wrapper">
            <h2 className="admin-sidebar-title">Admin Panel</h2>
            <p className="admin-sidebar-subtitle">GuiaOgi Turizm</p>
          </div>
        ) : (
          <div className="admin-sidebar-icon">A</div>
        )}
        {isMobile && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setMobileMenuOpen(false)}
            className="admin-close-button"
          />
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        theme="dark"
        className="admin-menu"
      />
      <div className={isMobile ? 'admin-sidebar-footer-mobile' : 'admin-sidebar-footer'}>
        <div className="admin-user-info">
          <Avatar 
            icon={<UserOutlined />} 
            className="admin-avatar"
            size="small"
          />
          {(!collapsed || isMobile) && (
            <div className="admin-user-details">
              <div className="admin-user-name">
                {user?.name}
              </div>
              <div className="admin-user-role">
                Admin
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const getMainLayoutClass = () => {
    if (isMobile) return 'admin-main-layout mobile';
    if (collapsed) return 'admin-main-layout collapsed';
    return 'admin-main-layout expanded';
  };

  return (
    <Layout className="admin-layout">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          className="admin-sidebar"
          theme="dark"
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          closable={false}
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0, background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
          width={280}
          zIndex={1001}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Layout className={getMainLayoutClass()}>
        <Header className="admin-header">
          {/* Main Header Bar */}
          <div className={`admin-header-main ${isMobile ? 'mobile' : ''}`}>
            {/* Left Side */}
            <div className={`admin-header-left ${isMobile ? 'mobile' : ''}`}>
              {isMobile ? (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={toggleMobileMenu}
                  className="admin-header-button"
                />
              ) : (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="admin-header-button"
                />
              )}
              <h3 className={`admin-header-title ${isMobile ? 'mobile' : ''}`}>
                Admin Panel
              </h3>
            </div>

            {/* Right Side */}
            <div className={`admin-header-right ${isMobile ? 'mobile' : ''}`}>
              {!isMobile && (
                <>
                  <Badge count={0} showZero={false}>
                    <Button 
                      type="text" 
                      icon={<BellOutlined />} 
                      className="admin-header-button"
                    />
                  </Badge>
                  <Button 
                    type="text" 
                    icon={<SettingOutlined />} 
                    className="admin-header-button"
                  />
                </>
              )}
              <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
                <div className={`admin-user-dropdown ${isMobile ? 'mobile' : ''}`}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="admin-avatar"
                    size={isMobile ? 'small' : 'default'}
                  />
                  {!isMobile && (
                    <span className="admin-user-name-text">
                      {user?.name || 'Admin Kullanıcı'}
                    </span>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
          
          {/* Sub Header Bar */}
          {!isMobile && (
            <div className="admin-header-sub">
              <span className="admin-header-sub-text">
                Sistem Yönetimi
              </span>
              <span className="admin-header-sub-text">
                {user?.email || 'admin@guiaogi.com'}
              </span>
            </div>
          )}
        </Header>
        <Content className={`admin-content ${isMobile ? 'mobile' : ''}`}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
