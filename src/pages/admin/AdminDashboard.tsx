// pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Spin } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalTours: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Kullanıcıları çek
      const usersResponse = await fetch('http://localhost:3005/users');
      const users = usersResponse.ok ? await usersResponse.json() : [];
      
      // Turları çek
      const toursResponse = await fetch('http://localhost:3005/tours');
      const tours = toursResponse.ok ? await toursResponse.json() : [];
      
      // Rezervasyonları çek
      const bookingsResponse = await fetch('http://localhost:3005/bookings');
      const bookings = bookingsResponse.ok ? await bookingsResponse.json() : [];

      const totalUsers = users.filter((u: any) => u.role === 'user').length;
      const pendingUsers = users.filter((u: any) => u.role === 'user' && !u.isApproved).length;
      const totalTours = Array.isArray(tours) ? tours.length : 0;
      const totalBookings = Array.isArray(bookings) ? bookings.length : 0;
      const pendingBookings = Array.isArray(bookings) 
        ? bookings.filter((b: any) => b.status === 'pending').length 
        : 0;

      // Son eklenen kullanıcılar
      const recentUsersList = users
        .filter((u: any) => u.role === 'user')
        .sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      setStats({
        totalUsers,
        pendingUsers,
        totalTours,
        totalBookings,
        pendingBookings,
      });
      setRecentUsers(recentUsersList);
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    {
      title: 'Ad Soyad',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: isMobile ? 120 : undefined,
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      width: isMobile ? 150 : undefined,
    },
    {
      title: 'Durum',
      key: 'status',
      width: isMobile ? 100 : undefined,
      render: (_: any, record: any) => (
        <Tag color={record.isApproved ? 'green' : 'orange'} style={{ fontSize: isMobile ? '11px' : '12px' }}>
          {record.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
        </Tag>
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: isMobile ? 100 : undefined,
      render: (date: string) => (
        <span style={{ fontSize: isMobile ? '12px' : '14px' }}>
          {isMobile 
            ? new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })
            : new Date(date).toLocaleDateString('tr-TR')
          }
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: isMobile ? '30px 20px' : '50px' }}>
        <Spin size={isMobile ? 'default' : 'large'} />
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '0' : '0' }}>
      <h1 style={{ 
        marginBottom: isMobile ? '16px' : '24px', 
        fontSize: isMobile ? '20px' : 'clamp(20px, 4vw, 24px)',
        fontWeight: 600
      }}>
        Dashboard
      </h1>
      
      <Row 
        gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]} 
        style={{ marginBottom: isMobile ? '16px' : '24px' }}
        align="stretch"
      >
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card 
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '120px' : '140px'
            }}
            bodyStyle={{ 
              padding: isMobile ? '16px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              height: '100%'
            }}
          >
            <Statistic
              title={<span style={{ fontSize: isMobile ? '13px' : '14px', marginBottom: '8px', display: 'block' }}>Toplam Kullanıcı</span>}
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ fontSize: isMobile ? '18px' : '24px' }} />}
              valueStyle={{ 
                color: '#1890ff',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 600
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card 
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '120px' : '140px'
            }}
            bodyStyle={{ 
              padding: isMobile ? '16px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              height: '100%'
            }}
          >
            <Statistic
              title={<span style={{ fontSize: isMobile ? '13px' : '14px', marginBottom: '8px', display: 'block' }}>Onay Bekleyen</span>}
              value={stats.pendingUsers}
              prefix={<ClockCircleOutlined style={{ fontSize: isMobile ? '18px' : '24px' }} />}
              valueStyle={{ 
                color: '#faad14',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 600
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card 
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '120px' : '140px'
            }}
            bodyStyle={{ 
              padding: isMobile ? '16px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              height: '100%'
            }}
          >
            <Statistic
              title={<span style={{ fontSize: isMobile ? '13px' : '14px', marginBottom: '8px', display: 'block' }}>Toplam Tur</span>}
              value={stats.totalTours}
              prefix={<AppstoreOutlined style={{ fontSize: isMobile ? '18px' : '24px' }} />}
              valueStyle={{ 
                color: '#52c41a',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 600
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} style={{ display: 'flex' }}>
          <Card 
            style={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: isMobile ? '120px' : '140px'
            }}
            bodyStyle={{ 
              padding: isMobile ? '16px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              height: '100%'
            }}
          >
            <Statistic
              title={<span style={{ fontSize: isMobile ? '13px' : '14px', marginBottom: '8px', display: 'block' }}>Toplam Rezervasyon</span>}
              value={stats.totalBookings}
              prefix={<BookOutlined style={{ fontSize: isMobile ? '18px' : '24px' }} />}
              valueStyle={{ 
                color: '#722ed1',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 600
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={<span style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600 }}>Son Eklenen Kullanıcılar</span>} 
        style={{ 
          marginBottom: isMobile ? '16px' : '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table
            columns={userColumns}
            dataSource={recentUsers}
            rowKey="id"
            pagination={false}
            size={isMobile ? 'small' : 'middle'}
            scroll={{ x: isMobile ? 500 : 600 }}
            style={{ fontSize: isMobile ? '12px' : '14px' }}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
