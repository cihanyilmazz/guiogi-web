// pages/admin/AdminLayout.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Drawer, List, Empty, Divider, Tag, Spin } from 'antd';
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
  FileTextOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

interface NotificationItem {
  id: string;
  type: 'user' | 'booking';
  title: string;
  description: string;
  date: string;
  status?: string;
  link: string;
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

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

  useEffect(() => {
    fetchNotifications();
    // Her 30 saniyede bir bildirimleri güncelle
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      
      // Kullanıcıları çek
      const usersResponse = await fetch('http://guiaogi.com/users');
      const users = usersResponse.ok ? await usersResponse.json() : [];
      
      // Rezervasyonları çek
      const bookingsResponse = await fetch('http://guiaogi.com/bookings');
      const bookings = bookingsResponse.ok ? await bookingsResponse.json() : [];

      const notificationList: NotificationItem[] = [];

      // Son 7 gün içinde eklenen onay bekleyen kullanıcılar
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const newPendingUsers = users
        .filter((u: any) => 
          u.role === 'user' && 
          !u.isApproved && 
          new Date(u.createdAt) >= sevenDaysAgo
        )
        .sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((u: any) => ({
          id: `user-${u.id}`,
          type: 'user' as const,
          title: t('admin.newUserRegistration'),
          description: `${u.name} (${u.email}) ${t('admin.pendingApproval')}`,
          date: u.createdAt,
          status: 'pending',
          link: '/admin/users',
        }));

      // Son 7 gün içinde eklenen bekleyen rezervasyonlar
      const newPendingBookings = bookings
        .filter((b: any) => 
          b.status === 'pending' && 
          new Date(b.createdAt) >= sevenDaysAgo
        )
        .sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((b: any) => ({
          id: `booking-${b.id}`,
          type: 'booking' as const,
          title: t('admin.newBooking'),
          description: `${b.tourTitle} - ${b.persons} kişi`,
          date: b.createdAt,
          status: 'pending',
          link: '/admin/bookings',
        }));

      notificationList.push(...newPendingUsers, ...newPendingBookings);
      
      // Tarihe göre sırala (en yeni önce)
      notificationList.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setNotifications(notificationList.slice(0, 10)); // En fazla 10 bildirim
      setNotificationCount(notificationList.length);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    navigate(notification.link);
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('admin.justNow');
    if (diffMins < 60) return `${diffMins} ${t('admin.minutesAgo')}`;
    if (diffHours < 24) return `${diffHours} ${t('admin.hoursAgo')}`;
    if (diffDays < 7) return `${diffDays} ${t('admin.daysAgo')}`;
    return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'tr-TR');
  };

  const userNotifications = notifications.filter(n => n.type === 'user');
  const bookingNotifications = notifications.filter(n => n.type === 'booking');

  const notificationMenu = (
    <div 
      className={isMobile ? 'notification-menu-mobile' : ''}
      style={{ 
        width: isMobile ? 'calc(100vw - 32px)' : 380, 
        maxWidth: isMobile ? 'calc(100vw - 32px)' : 380,
        maxHeight: isMobile ? 'calc(100vh - 120px)' : 600, 
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: '#fff',
        borderRadius: isMobile ? '12px' : '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        margin: 0,
        padding: 0
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: isMobile ? '12px 16px' : '16px 20px', 
        borderBottom: '2px solid #f0f0f0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellOutlined style={{ fontSize: isMobile ? '16px' : '18px' }} />
          <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 600 }}>{t('admin.notifications')}</span>
        </div>
        {notificationCount > 0 && (
          <Badge 
            count={notificationCount} 
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.5)'
            }}
          />
        )}
      </div>

      {loadingNotifications ? (
        <div style={{ padding: isMobile ? '40px 20px' : '60px', textAlign: 'center' }}>
          <Spin size={isMobile ? 'default' : 'large'} />
          <div style={{ marginTop: '16px', color: '#666', fontSize: isMobile ? '13px' : '14px' }}>Yükleniyor...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: isMobile ? '40px 16px' : '60px 20px', textAlign: 'center' }}>
          <div style={{ 
            fontSize: isMobile ? '36px' : '48px', 
            marginBottom: '16px',
            opacity: 0.3
          }}>🔔</div>
          <div style={{ color: '#999', fontSize: isMobile ? '13px' : '14px' }}>{t('admin.noNotifications')}</div>
        </div>
      ) : (
        <div>
          {/* Kullanıcı Bildirimleri */}
          {userNotifications.length > 0 && (
            <div>
              <div style={{ 
                padding: isMobile ? '10px 16px' : '12px 20px', 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <UserOutlined style={{ color: '#1890ff', fontSize: isMobile ? '14px' : '16px' }} />
                <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: 600, color: '#495057' }}>
                  {t('admin.newUsers')} ({userNotifications.length})
                </span>
              </div>
              {userNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    padding: isMobile ? '12px 16px' : '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.paddingLeft = '24px';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.paddingLeft = '20px';
                    }
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onTouchEnd={(e) => {
                    setTimeout(() => {
                      e.currentTarget.style.backgroundColor = '#fff';
                    }, 200);
                  }}
                >
                  <div style={{ display: 'flex', gap: isMobile ? '10px' : '12px' }}>
                    <div style={{
                      width: isMobile ? 40 : 48,
                      height: isMobile ? 40 : 48,
                      borderRadius: isMobile ? '10px' : '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      color: 'white',
                      fontSize: isMobile ? '18px' : '20px',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(24,144,255,0.3)'
                    }}>
                      <UserOutlined />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '6px',
                        flexWrap: 'wrap',
                        gap: '4px'
                      }}>
                        <span style={{ 
                          fontSize: isMobile ? '13px' : '14px', 
                          fontWeight: 600,
                          color: '#262626',
                          lineHeight: '1.4'
                        }}>
                          {item.title}
                        </span>
                        {item.status === 'pending' && (
                          <Tag 
                            color="orange" 
                            style={{ 
                              margin: 0,
                              borderRadius: '12px',
                              fontSize: isMobile ? '10px' : '11px',
                              padding: '2px 8px'
                            }}
                          >
                            {t('admin.pending')}
                          </Tag>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '12px' : '13px', 
                        color: '#595959',
                        marginBottom: '6px',
                        lineHeight: '1.4',
                        wordBreak: 'break-word'
                      }}>
                        {item.description}
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '11px' : '12px', 
                        color: '#8c8c8c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ClockCircleOutlined style={{ fontSize: isMobile ? '10px' : '11px' }} />
                        {formatNotificationDate(item.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rezervasyon Bildirimleri */}
          {bookingNotifications.length > 0 && (
            <div>
              {userNotifications.length > 0 && (
                <Divider style={{ margin: 0, backgroundColor: '#f0f0f0' }} />
              )}
              <div style={{ 
                padding: isMobile ? '10px 16px' : '12px 20px', 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BookOutlined style={{ color: '#52c41a', fontSize: isMobile ? '14px' : '16px' }} />
                <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: 600, color: '#495057' }}>
                  {t('admin.newBookings')} ({bookingNotifications.length})
                </span>
              </div>
              {bookingNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    padding: isMobile ? '12px 16px' : '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#fff'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.paddingLeft = '24px';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.paddingLeft = '20px';
                    }
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onTouchEnd={(e) => {
                    setTimeout(() => {
                      e.currentTarget.style.backgroundColor = '#fff';
                    }, 200);
                  }}
                >
                  <div style={{ display: 'flex', gap: isMobile ? '10px' : '12px' }}>
                    <div style={{
                      width: isMobile ? 40 : 48,
                      height: isMobile ? 40 : 48,
                      borderRadius: isMobile ? '10px' : '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                      color: 'white',
                      fontSize: isMobile ? '18px' : '20px',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(82,196,26,0.3)'
                    }}>
                      <BookOutlined />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '6px',
                        flexWrap: 'wrap',
                        gap: '4px'
                      }}>
                        <span style={{ 
                          fontSize: isMobile ? '13px' : '14px', 
                          fontWeight: 600,
                          color: '#262626',
                          lineHeight: '1.4'
                        }}>
                          {item.title}
                        </span>
                        {item.status === 'pending' && (
                          <Tag 
                            color="orange" 
                            style={{ 
                              margin: 0,
                              borderRadius: '12px',
                              fontSize: isMobile ? '10px' : '11px',
                              padding: '2px 8px'
                            }}
                          >
                            {t('admin.pending')}
                          </Tag>
                        )}
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '12px' : '13px', 
                        color: '#595959',
                        marginBottom: '6px',
                        lineHeight: '1.4',
                        wordBreak: 'break-word'
                      }}>
                        {item.description}
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '11px' : '12px', 
                        color: '#8c8c8c',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ClockCircleOutlined style={{ fontSize: isMobile ? '10px' : '11px' }} />
                        {formatNotificationDate(item.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Divider style={{ margin: 0, backgroundColor: '#f0f0f0' }} />
          <div style={{ 
            padding: isMobile ? '10px 16px' : '12px 20px', 
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }}>
            <Button 
              type="primary" 
              size={isMobile ? 'small' : 'middle'}
              onClick={() => {
                navigate('/admin');
                fetchNotifications();
              }}
              style={{
                borderRadius: '6px',
                fontWeight: 500,
                width: isMobile ? '100%' : 'auto'
              }}
            >
              {t('admin.goToDashboard')}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const menuItems = useMemo(() => [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: t('admin.dashboard'),
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: t('admin.userManagement'),
    },
    {
      key: '/admin/tours',
      icon: <AppstoreOutlined />,
      label: t('admin.tourManagement'),
    },
    {
      key: '/admin/bookings',
      icon: <BookOutlined />,
      label: t('admin.bookingManagement'),
    },
    {
      key: '/admin/about',
      icon: <InfoCircleOutlined />,
      label: t('admin.aboutManagement'),
    },
    {
      key: '/admin/contact',
      icon: <PhoneFilled />,
      label: t('admin.contactManagement'),
    },
    {
      key: '/admin/blogs',
      icon: <FileTextOutlined />,
      label: t('admin.blogManagement'),
    },
    {
      key: '/admin/languages',
      icon: <GlobalOutlined />,
      label: t('admin.languageManagement'),
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
      <div className={`admin-sidebar-header ${collapsed && !isMobile ? 'collapsed' : ''}`}>
        {!collapsed || isMobile ? (
          <div className="admin-sidebar-title-wrapper">
            <h2 className="admin-sidebar-title">{t('admin.adminPanel')}</h2>
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
                {t('admin.adminPanel')}
              </h3>
            </div>

            {/* Right Side */}
            <div className={`admin-header-right ${isMobile ? 'mobile' : ''}`}>
              <Dropdown 
                overlay={notificationMenu} 
                placement={isMobile ? "bottomRight" : "bottomRight"}
                trigger={['click']}
                overlayStyle={{ 
                  padding: 0,
                  position: isMobile ? 'fixed' : 'absolute',
                  zIndex: 1050,
                  ...(isMobile && {
                    right: '16px',
                    left: '16px',
                    width: 'calc(100vw - 32px)',
                    maxWidth: 'calc(100vw - 32px)',
                    top: '70px'
                  })
                }}
                getPopupContainer={isMobile ? () => document.body : (trigger) => trigger.parentElement || document.body}
                overlayClassName={isMobile ? 'notification-dropdown-mobile' : ''}
                destroyOnHidden={false}
                align={isMobile ? { offset: [0, 8] } : undefined}
              >
                <Badge count={notificationCount} showZero={false} offset={isMobile ? [-3, 3] : [-5, 5]}>
                  <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    className="admin-header-button"
                    loading={loadingNotifications}
                    size={isMobile ? 'small' : 'middle'}
                  />
                </Badge>
              </Dropdown>
              {!isMobile && (
                <Button 
                  type="text" 
                  icon={<SettingOutlined />} 
                  className="admin-header-button"
                />
              )}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
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
                {t('admin.systemManagement')}
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
