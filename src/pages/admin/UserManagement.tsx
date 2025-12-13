// pages/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Popconfirm, message, Input, Select } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'agent' | 'user';
  isApproved: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3005/users');
      if (response.ok) {
        const data = await response.json();
        const usersArray = Array.isArray(data) ? data : [];
        // Yeni eklenen kullanıcılar üstte gösterilsin (ID'ye göre ters sıralama)
        const sortedUsers = usersArray.sort((a: User, b: User) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
          return idB - idA; // Büyükten küçüğe (yeni kullanıcılar üstte)
        });
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      message.error('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const response = await fetch(`http://localhost:3005/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: true }),
      });

      if (response.ok) {
        message.success('Kullanıcı onaylandı');
        fetchUsers();
      } else {
        message.error('Kullanıcı onaylanırken bir hata oluştu');
      }
    } catch (error) {
      console.error('Onay hatası:', error);
      message.error('Kullanıcı onaylanırken bir hata oluştu');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const response = await fetch(`http://localhost:3005/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved: false }),
      });

      if (response.ok) {
        message.success('Kullanıcı onayı reddedildi');
        fetchUsers();
      } else {
        message.error('İşlem sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Red hatası:', error);
      message.error('İşlem sırasında bir hata oluştu');
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3005/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Kullanıcı silindi');
        fetchUsers();
      } else {
        message.error('Kullanıcı silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      message.error('Kullanıcı silinirken bir hata oluştu');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'agent' | 'user') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Sadece kendi rolünü değiştirmesini engelle
      if (currentUser?.id === userId) {
        message.warning('Kendi rolünüzü değiştiremezsiniz');
        return;
      }

      const response = await fetch(`http://localhost:3005/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          role: newRole,
          // Agent ve admin rolleri otomatik onaylı
          isApproved: newRole === 'admin' || newRole === 'agent' ? true : user.isApproved,
          updatedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const roleLabels: Record<string, string> = {
          admin: 'Admin',
          agent: 'Acente',
          user: 'Kullanıcı',
        };
        message.success(`Kullanıcı rolü "${roleLabels[newRole]}" olarak güncellendi`);
        fetchUsers();
      } else {
        message.error('Rol güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Rol değiştirme hatası:', error);
      message.error('Rol güncellenirken bir hata oluştu');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: ColumnsType<User> = [
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
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => {
        const colors: Record<string, string> = {
          admin: 'red',
          agent: 'blue',
          user: 'default',
        };
        const labels: Record<string, string> = {
          admin: 'Admin',
          agent: 'Acente',
          user: 'Kullanıcı',
        };
        
        // Sadece kendi rolünü değiştirmesini engelle
        const isCurrentUser = currentUser?.id === record.id;
        
        return (
          <Space>
            <Select
              value={role}
              onChange={(value) => handleRoleChange(record.id, value)}
              style={{ minWidth: 120 }}
              size="small"
              disabled={isCurrentUser}
            >
              <Select.Option value="user">Kullanıcı</Select.Option>
              <Select.Option value="agent">Acente</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
            <Tag color={colors[role]}>{labels[role]}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Durum',
      dataIndex: 'isApproved',
      key: 'isApproved',
      render: (isApproved, record) => {
        if (record.role === 'admin' || record.role === 'agent') {
          return <Tag color="green">Onaylı</Tag>;
        }
        return (
          <Tag color={isApproved ? 'green' : 'orange'}>
            {isApproved ? 'Onaylandı' : 'Onay Bekliyor'}
          </Tag>
        );
      },
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          {record.role === 'user' && !record.isApproved && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={() => handleApprove(record.id)}
            >
              Onayla
            </Button>
          )}
          {record.role === 'user' && record.isApproved && (
            <Button
              type="default"
              icon={<CloseOutlined />}
              size="small"
              onClick={() => handleReject(record.id)}
            >
              Onayı Kaldır
            </Button>
          )}
          {record.role !== 'admin' && (
            <Popconfirm
              title="Kullanıcıyı silmek istediğinize emin misiniz?"
              onConfirm={() => handleDelete(record.id)}
              okText="Evet"
              cancelText="Hayır"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              >
                Sil
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: 'clamp(20px, 4vw, 24px)' }}>Kullanıcı Yönetimi</h1>
      
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: '16px' 
      }}>
        <Input
          placeholder="Kullanıcı ara (ad, e-posta)"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: isMobile ? '100%' : 300 }}
        />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          style={{ width: isMobile ? '100%' : 200 }}
        >
          <Select.Option value="all">Tüm Roller</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="agent">Acente</Select.Option>
          <Select.Option value="user">Kullanıcı</Select.Option>
        </Select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: false,
            responsive: true,
          }}
          scroll={{ x: 800 }}
          size={isMobile ? 'small' : 'middle'}
        />
      </div>
    </div>
  );
};

export default UserManagement;
