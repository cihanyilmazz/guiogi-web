// pages/agent/AgentTourManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

interface Tour {
  id: string | number;
  title: string;
  description: string;
  coverImage?: string;
  location: string;
  duration: string;
  groupSize?: string;
  category: string;
  season?: string;
  guide?: string;
  rating?: number;
  reviewCount?: number;
  specialOffer?: string;
  included?: string[];
  highlights?: string[];
  price: number;
  discount?: number;
}

const AgentTourManagement: React.FC = () => {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/tours`);
      if (response.ok) {
        const data = await response.json();
        const toursArray = Array.isArray(data) ? data : [];
        // Yeni eklenen turlar üstte gösterilsin (ID'ye göre ters sıralama)
        const sortedTours = toursArray.sort((a: Tour, b: Tour) => {
          const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
          const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
          return idB - idA; // Büyükten küçüğe (yeni turlar üstte)
        });
        setTours(sortedTours);
      }
    } catch (error) {
      console.error('Turlar yüklenirken hata:', error);
      message.error('Turlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTour(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    // Array alanlarını boş değilse set et, yoksa boş array
    form.setFieldsValue({
      ...tour,
      included: tour.included && tour.included.length > 0 ? tour.included : [''],
      highlights: tour.highlights && tour.highlights.length > 0 ? tour.highlights : [''],
    });
    setModalVisible(true);
  };

  const handleDelete = async (tourId: string | number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/tours/${tourId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('Tur silindi');
        fetchTours();
      } else {
        message.error('Tur silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      message.error('Tur silinirken bir hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Array alanlarını düzenle
      const tourData = {
        ...values,
        included: values.included && values.included.length > 0
          ? values.included.filter((item: string) => item && item.trim() !== '')
          : [],
        highlights: values.highlights && values.highlights.length > 0
          ? values.highlights.filter((item: string) => item && item.trim() !== '')
          : [],
        rating: values.rating || 0,
        reviewCount: values.reviewCount || 0,
      };

      if (editingTour) {
        // Güncelleme
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/tours/${editingTour.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...editingTour, ...tourData }),
        });

        if (response.ok) {
          message.success('Tur güncellendi');
          setModalVisible(false);
          form.resetFields();
          fetchTours();
        } else {
          message.error('Tur güncellenirken bir hata oluştu');
        }
      } else {
        // Yeni ekleme
        const newTour = {
          ...tourData,
          id: Date.now().toString(),
          coverImage: values.coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
        };

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/tours`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTour),
        });

        if (response.ok) {
          message.success('Tur başarıyla eklendi');
          setModalVisible(false);
          form.resetFields();
          fetchTours();
        } else {
          const errorData = await response.json().catch(() => ({}));
          message.error(errorData.message || 'Tur eklenirken bir hata oluştu');
        }
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      message.error('İşlem sırasında bir hata oluştu');
    }
  };

  const columns: ColumnsType<Tour> = [
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Lokasyon',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Süre',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price} TL`,
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Tour) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title={t('agent.deleteTour')}
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
        </Space>
      ),
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
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '24px',
        gap: isMobile ? '16px' : '0'
      }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 24px)' }}>{t('agent.tourManagement')}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          block={isMobile}
        >
          {t('agent.newTour')}
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={tours}
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

      <Modal
        title={editingTour ? t('agent.editTour') : t('agent.newTour')}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={isMobile ? '95%' : 800}
        style={{ top: isMobile ? 20 : 50 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            included: [''],
            highlights: [''],
            rating: 0,
            reviewCount: 0,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Tur Başlığı"
                rules={[{ required: true, message: 'Tur başlığı gerekli' }]}
              >
                <Input placeholder="Örn: Kapadokya Balon Turu" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="location"
                label="Lokasyon"
                rules={[{ required: true, message: 'Lokasyon gerekli' }]}
              >
                <Input placeholder="Örn: Nevşehir, Türkiye" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: 'Açıklama gerekli' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Tur hakkında detaylı açıklama..."
            />
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="Kapak Görseli URL"
            rules={[{ type: 'url', message: 'Geçerli bir URL girin' }]}
          >
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: 'Kategori gerekli' }]}
              >
                <Select placeholder={t("admin.selectCategory")}>
                  <Select.Option value="Doğa">Doğa</Select.Option>
                  <Select.Option value="Kültür">Kültür</Select.Option>
                  <Select.Option value="Deniz">Deniz</Select.Option>
                  <Select.Option value="Spor">Spor</Select.Option>
                  <Select.Option value="Termal">Termal</Select.Option>
                  <Select.Option value="Macera">Macera</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="duration"
                label="Süre"
                rules={[{ required: true, message: 'Süre gerekli' }]}
              >
                <Input placeholder="Örn: 2 Gece 3 Gün" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="groupSize"
                label="Grup Büyüklüğü"
              >
                <Input placeholder="Örn: 12 Kişi" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="season"
                label="Mevsim"
              >
                <Select placeholder={t("admin.selectSeason")}>
                  <Select.Option value="Tüm Yıl">Tüm Yıl</Select.Option>
                  <Select.Option value="Yaz">Yaz</Select.Option>
                  <Select.Option value="Kış">Kış</Select.Option>
                  <Select.Option value="İlkbahar">İlkbahar</Select.Option>
                  <Select.Option value="Sonbahar">Sonbahar</Select.Option>
                  <Select.Option value="Yaz-İlkbahar">Yaz-İlkbahar</Select.Option>
                  <Select.Option value="İlkbahar-Yaz">İlkbahar-Yaz</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="guide"
                label="Rehber"
              >
                <Input placeholder={t("admin.guideName")} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="specialOffer"
                label="Özel Teklif"
              >
                <Input placeholder="Örn: Erken Rezervasyon Fırsatı" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="Fiyat (TL)"
                rules={[{ required: true, message: 'Fiyat gerekli' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="discount"
                label="İndirim (%)"
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="rating"
                label="Değerlendirme (0-5)"
              >
                <InputNumber
                  min={0}
                  max={5}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="reviewCount"
                label="Yorum Sayısı"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Dahil Olanlar"
            name="included"
          >
            <Form.List name="included">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[{ required: false }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder="Dahil olan hizmet" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusCircleOutlined />}
                    >
                      Hizmet Ekle
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            label="Öne Çıkanlar"
            name="highlights"
          >
            <Form.List name="highlights">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[{ required: false }]}
                        style={{ flex: 1, marginBottom: 0 }}
                      >
                        <Input placeholder="Öne çıkan özellik" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusCircleOutlined />}
                    >
                      Özellik Ekle
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingTour ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }} size="large">
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgentTourManagement;
