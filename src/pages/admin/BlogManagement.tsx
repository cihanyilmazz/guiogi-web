// pages/admin/BlogManagement.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select, Row, Col, Switch, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { blogService, BlogPost } from '../../services/blogService';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

const BlogManagement: React.FC = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
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
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const allBlogs = await blogService.getAllBlogsForAdmin();
      setBlogs(allBlogs);
    } catch (error) {
      console.error('Bloglar yüklenirken hata:', error);
      message.error('Bloglar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBlog(null);
    form.resetFields();
    form.setFieldsValue({
      tags: [],
      isPublished: false,
      category: 'Seyahat İpuçları',
    });
    setModalVisible(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    form.setFieldsValue({
      ...blog,
      tags: blog.tags || [],
    });
    setModalVisible(true);
  };

  const handleDelete = async (blogId: string | number) => {
    try {
      await blogService.deleteBlog(blogId);
      message.success('Blog silindi');
      fetchBlogs();
    } catch (error) {
      console.error('Silme hatası:', error);
      message.error('Blog silinirken bir hata oluştu');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const blogData = {
        ...values,
        tags: values.tags || [],
        isPublished: values.isPublished !== undefined ? values.isPublished : false,
      };

      if (editingBlog) {
        // Güncelleme
        await blogService.updateBlog(editingBlog.id, blogData);
        message.success('Blog güncellendi');
      } else {
        // Yeni ekleme
        await blogService.createBlog(blogData);
        message.success('Blog başarıyla eklendi');
      }

      setModalVisible(false);
      form.resetFields();
      fetchBlogs();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      message.error('İşlem sırasında bir hata oluştu');
    }
  };

  const categories = [
    'Seyahat İpuçları',
    'Seyahat Rehberi',
    'Destinasyon Rehberi',
    'Haberler',
    'Müşteri Hikayeleri',
  ];

  const columns: ColumnsType<BlogPost> = [
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Yazar',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Durum',
      key: 'status',
      render: (_: any, record: BlogPost) => (
        <Tag color={record.isPublished ? 'green' : 'orange'}>
          {record.isPublished ? 'Yayında' : 'Taslak'}
        </Tag>
      ),
    },
    {
      title: 'Görüntülenme',
      dataIndex: 'views',
      key: 'views',
      render: (views) => views || 0,
    },
    {
      title: 'Yayın Tarihi',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: BlogPost) => (
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
            title="Blog yazısını silmek istediğinize emin misiniz?"
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
        <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 24px)' }}>Blog Yönetimi</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAdd}
          block={isMobile}
        >
          Yeni Blog Yazısı Ekle
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={blogs}
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
        title={editingBlog ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı Ekle'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={isMobile ? '95%' : 900}
        style={{ top: isMobile ? 20 : 50 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            tags: [],
            isPublished: false,
            category: 'Seyahat İpuçları',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Başlık"
                rules={[{ required: true, message: 'Başlık gerekli' }]}
              >
                <Input placeholder="Blog yazısı başlığı" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="category"
                label="Kategori"
                rules={[{ required: true, message: t("admin.categoryRequired") }]}
              >
                <Select placeholder={t("admin.selectCategory")}>
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="excerpt"
            label="Özet"
                rules={[{ required: true, message: t("admin.summaryRequired") }]}
          >
            <TextArea
              rows={3}
              placeholder={t("admin.blogExcerptPlaceholder")}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="İçerik"
                rules={[{ required: true, message: t("admin.contentRequired") }]}
          >
            <TextArea
              rows={10}
              placeholder={t("admin.blogContentPlaceholder")}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="featuredImage"
                label="Öne Çıkan Görsel URL"
                rules={[{ required: true, message: t("admin.imageUrlRequired") }]}
              >
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="author"
                label="Yazar"
                rules={[{ required: true, message: t("admin.authorRequired") }]}
              >
                <Input placeholder={t("admin.authorName")} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="authorAvatar"
                label="Yazar Avatar URL (Opsiyonel)"
              >
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="publishedAt"
                label="Yayın Tarihi"
              >
                <Input
                  type="datetime-local"
                  placeholder="Yayın tarihi (boş bırakılırsa şu anki tarih kullanılır)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Etiketler (virgülle ayırın)"
          >
            <Select
              mode="tags"
              placeholder="Etiket ekleyin (Enter'a basarak)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="seoTitle"
                label="SEO Başlık (Opsiyonel)"
              >
                <Input placeholder="SEO için özel başlık" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="seoDescription"
                label="SEO Açıklama (Opsiyonel)"
              >
                <Input placeholder="SEO için açıklama" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isPublished"
            label="Yayın Durumu"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yayında" unCheckedChildren="Taslak" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBlog ? 'Güncelle' : 'Kaydet'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement;

