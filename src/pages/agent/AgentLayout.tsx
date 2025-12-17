// pages/agent/AgentLayout.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Drawer } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  AppstoreOutlined,
  BookOutlined,
  LogoutOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  CloseOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './AgentLayout.css';

const { Header, Sider, Content } = Layout;

const AgentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
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

  const menuItems = useMemo(() => [
    {
      key: '/agent/tours',
      icon: <AppstoreOutlined />,
      label: t('agent.tourManagement'),
    },
    {
      key: '/agent/bookings',
      icon: <BookOutlined />,
      label: t('agent.bookings'),
    },
  ], [t]);

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

  const userMenuItems = useMemo(() => [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: t('common.home'),
      onClick: () => navigate('/')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('common.logout'),
      onClick: handleLogout
    }
  ], [t, navigate]);

  const sidebarContent = (
    <>
      <div className={`agent-sidebar-header ${collapsed && !isMobile ? 'collapsed' : ''}`}>
        {!collapsed || isMobile ? (
          <div className="agent-sidebar-title-wrapper">
            <h2 className="agent-sidebar-title">{t('agent.agentPanel')}</h2>
            <p className="agent-sidebar-subtitle">GuiaOgi Turizm</p>
          </div>
        ) : (
          <div className="agent-sidebar-icon">A</div>
        )}
        {isMobile && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setMobileMenuOpen(false)}
            className="agent-close-button"
          />
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        theme="dark"
        className="agent-menu"
      />
      <div className={isMobile ? 'agent-sidebar-footer-mobile' : 'agent-sidebar-footer'}>
        <div className="agent-user-info">
          <Avatar 
            icon={<UserOutlined />} 
            className="agent-avatar"
            size="small"
          />
          {(!collapsed || isMobile) && (
            <div className="agent-user-details">
              <div className="agent-user-name">
                {user?.name}
              </div>
              <div className="agent-user-role">
                Acente
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const getMainLayoutClass = () => {
    if (isMobile) return 'agent-main-layout mobile';
    if (collapsed) return 'agent-main-layout collapsed';
    return 'agent-main-layout expanded';
  };

  return (
    <Layout className="agent-layout">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          className="agent-sidebar"
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
        <Header className="agent-header">
          {/* Main Header Bar */}
          <div className={`agent-header-main ${isMobile ? 'mobile' : ''}`}>
            {/* Left Side */}
            <div className={`agent-header-left ${isMobile ? 'mobile' : ''}`}>
              {isMobile ? (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={toggleMobileMenu}
                  className="agent-header-button"
                />
              ) : (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="agent-header-button"
                />
              )}
              <h3 className={`agent-header-title ${isMobile ? 'mobile' : ''}`}>
                {t('agent.agentPanel')}
              </h3>
            </div>

            {/* Right Side */}
            <div className={`agent-header-right ${isMobile ? 'mobile' : ''}`}>
              {!isMobile && (
                <>
                  <Badge count={0} showZero={false}>
                    <Button 
                      type="text" 
                      icon={<BellOutlined />} 
                      className="agent-header-button"
                    />
                  </Badge>
                  <Button 
                    type="text" 
                    icon={<SettingOutlined />} 
                    className="agent-header-button"
                  />
                </>
              )}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                <div className={`agent-user-dropdown ${isMobile ? 'mobile' : ''}`}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    className="agent-avatar"
                    size={isMobile ? 'small' : 'default'}
                  />
                  {!isMobile && (
                    <span className="agent-user-name-text">
                      {user?.name || 'Acente Kullanıcı'}
                    </span>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>
          
          {/* Sub Header Bar */}
          {!isMobile && (
            <div className="agent-header-sub">
              <span className="agent-header-sub-text">
                Tur ve Rezervasyon Yönetimi
              </span>
              <span className="agent-header-sub-text">
                {user?.email || 'acente@guiaogi.com'}
              </span>
            </div>
          )}
        </Header>
        <Content className={`agent-content ${isMobile ? 'mobile' : ''}`}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AgentLayout;
