// pages/admin/BookingManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

interface Booking {
  id: string | number;
  userId: string;
  tourId: number;
  tourTitle: string;
  bookingDate: string;
  travelDate: string;
  persons: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingNumber: string;
}

const BookingManagement: React.FC = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings`);
      if (response.ok) {
        const data = await response.json();
        const bookingsArray = Array.isArray(data) ? data : [];
        // Yeni eklenen rezervasyonlar üstte gösterilsin (ID'ye göre ters sıralama)
        const sortedBookings = bookingsArray.sort((a: Booking, b: Booking) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
          return idB - idA; // Büyükten küçüğe (yeni rezervasyonlar üstte)
        });
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
      message.error('Rezervasyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      confirmed: { color: 'green', label: t('admin.confirmed') },
      pending: { color: 'orange', label: t('admin.pending') },
      cancelled: { color: 'red', label: t('admin.cancelled') },
      completed: { color: 'blue', label: t('admin.completed') },
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getPaymentTag = (status: string) => {
    const paymentConfig: Record<string, { color: string; label: string }> = {
      paid: { color: 'green', label: t('agent.paid') },
      pending: { color: 'orange', label: t('agent.paymentPending') },
      refunded: { color: 'default', label: t('agent.refunded') },
    };
    const config = paymentConfig[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const handleStatusChange = async (bookingId: string | number, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        message.success('Rezervasyon durumu güncellendi');
        fetchBookings();
      } else {
        message.error('Durum güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      message.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const handlePaymentStatusChange = async (bookingId: string | number, newPaymentStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (response.ok) {
        message.success('Ödeme durumu güncellendi');
        fetchBookings();
      } else {
        message.error('Ödeme durumu güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Ödeme durumu güncelleme hatası:', error);
      message.error('Ödeme durumu güncellenirken bir hata oluştu');
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: t('admin.bookingNumber'),
      dataIndex: 'bookingNumber',
      key: 'bookingNumber',
    },
    {
      title: t('admin.tour'),
      dataIndex: 'tourTitle',
      key: 'tourTitle',
    },
    {
      title: t('admin.userId'),
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: t('admin.travelDate'),
      dataIndex: 'travelDate',
      key: 'travelDate',
      render: (date) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: t('admin.persons'),
      dataIndex: 'persons',
      key: 'persons',
    },
    {
      title: t('admin.totalPrice'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price} TL`,
    },
    {
      title: t('admin.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 140 }}
          size="small"
        >
          <Select.Option value="pending">{t('admin.pending')}</Select.Option>
          <Select.Option value="confirmed">{t('admin.confirmed')}</Select.Option>
          <Select.Option value="cancelled">{t('admin.cancelled')}</Select.Option>
          <Select.Option value="completed">{t('admin.completed')}</Select.Option>
        </Select>
      ),
    },
    {
      title: t('agent.paymentStatus'),
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus, record) => (
        <Select
          value={paymentStatus}
          onChange={(value) => handlePaymentStatusChange(record.id, value)}
          style={{ width: 140 }}
          size="small"
        >
          <Select.Option value="pending">{t('agent.paymentPending')}</Select.Option>
          <Select.Option value="paid">{t('agent.paid')}</Select.Option>
          <Select.Option value="refunded">{t('agent.refunded')}</Select.Option>
        </Select>
      ),
    },
    {
      title: t('admin.bookingDate'),
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => new Date(date).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div style={{
      padding: isMobile ? '16px' : '24px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      minHeight: '100%'
    }}>
      <h1 style={{ marginBottom: '24px', fontSize: 'clamp(20px, 4vw, 24px)' }}>{t('admin.bookingManagement')}</h1>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            responsive: true,
          }}
          scroll={{ x: 1200 }}
          size={isMobile ? 'small' : 'middle'}
        />
      </div>
    </div>
  );
};

export default BookingManagement;
