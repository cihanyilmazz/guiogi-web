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
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalTours: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

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
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Durum',
      key: 'status',
      render: (_: any, record: any) => (
        <Tag color={record.isApproved ? 'green' : 'orange'}>
          {record.isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
        </Tag>
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: 'clamp(20px, 4vw, 24px)' }}>Dashboard</h1>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Kullanıcı"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Onay Bekleyen"
              value={stats.pendingUsers}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Tur"
              value={stats.totalTours}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Toplam Rezervasyon"
              value={stats.totalBookings}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Son Eklenen Kullanıcılar" style={{ marginBottom: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={userColumns}
            dataSource={recentUsers}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
