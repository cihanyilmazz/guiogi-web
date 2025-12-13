// pages/admin/BookingManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
      const response = await fetch('http://localhost:3005/bookings');
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
      confirmed: { color: 'green', label: 'Onaylandı' },
      pending: { color: 'orange', label: 'Beklemede' },
      cancelled: { color: 'red', label: 'İptal Edildi' },
      completed: { color: 'blue', label: 'Tamamlandı' },
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getPaymentTag = (status: string) => {
    const paymentConfig: Record<string, { color: string; label: string }> = {
      paid: { color: 'green', label: 'Ödendi' },
      pending: { color: 'orange', label: 'Ödeme Bekleniyor' },
      refunded: { color: 'default', label: 'İade Edildi' },
    };
    const config = paymentConfig[status] || { color: 'default', label: status };
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const handleStatusChange = async (bookingId: string | number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3005/bookings/${bookingId}`, {
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
      const response = await fetch(`http://localhost:3005/bookings/${bookingId}`, {
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
      title: 'Rezervasyon No',
      dataIndex: 'bookingNumber',
      key: 'bookingNumber',
    },
    {
      title: 'Tur',
      dataIndex: 'tourTitle',
      key: 'tourTitle',
    },
    {
      title: 'Kullanıcı ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Seyahat Tarihi',
      dataIndex: 'travelDate',
      key: 'travelDate',
      render: (date) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'Kişi Sayısı',
      dataIndex: 'persons',
      key: 'persons',
    },
    {
      title: 'Toplam Fiyat',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price} TL`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 140 }}
          size="small"
        >
          <Select.Option value="pending">Beklemede</Select.Option>
          <Select.Option value="confirmed">Onaylandı</Select.Option>
          <Select.Option value="cancelled">İptal Edildi</Select.Option>
          <Select.Option value="completed">Tamamlandı</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ödeme Durumu',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus, record) => (
        <Select
          value={paymentStatus}
          onChange={(value) => handlePaymentStatusChange(record.id, value)}
          style={{ width: 140 }}
          size="small"
        >
          <Select.Option value="pending">Ödeme Bekleniyor</Select.Option>
          <Select.Option value="paid">Ödendi</Select.Option>
          <Select.Option value="refunded">İade Edildi</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Rezervasyon Tarihi',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date) => new Date(date).toLocaleDateString('tr-TR'),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: 'clamp(20px, 4vw, 24px)' }}>Rezervasyon Yönetimi</h1>
      
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
