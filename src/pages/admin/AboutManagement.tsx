// pages/admin/AboutManagement.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Spin, Divider } from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { aboutService, AboutContent } from '../../services/aboutService';

const { TextArea: AntTextArea } = Input;

const AboutManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const content = await aboutService.getAboutContent();
      form.setFieldsValue({
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        stats: content.stats || [
          { number: '', text: '' },
          { number: '', text: '' },
          { number: '', text: '' },
          { number: '', text: '' },
        ],
        storyTitle: content.storyTitle,
        storyParagraphs: content.storyParagraphs || [''],
        storyImage: content.storyImage,
        featuresTitle: content.featuresTitle,
        featuresSubtitle: content.featuresSubtitle,
        features: content.features || [
          { title: '', description: '' },
          { title: '', description: '' },
          { title: '', description: '' },
          { title: '', description: '' },
        ],
        visionTitle: content.visionTitle,
        visionText: content.visionText,
        missionTitle: content.missionTitle,
        missionText: content.missionText,
      });
    } catch (error) {
      console.error('About içeriği yüklenirken hata:', error);
      message.error('İçerik yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      
      const aboutContent: AboutContent = {
        heroTitle: values.heroTitle,
        heroSubtitle: values.heroSubtitle,
        stats: values.stats.filter((stat: any) => stat.number && stat.text),
        storyTitle: values.storyTitle,
        storyParagraphs: values.storyParagraphs.filter((p: string) => p && p.trim()),
        storyImage: values.storyImage,
        featuresTitle: values.featuresTitle,
        featuresSubtitle: values.featuresSubtitle,
        features: values.features.filter((f: any) => f.title && f.description),
        visionTitle: values.visionTitle,
        visionText: values.visionText,
        missionTitle: values.missionTitle,
        missionText: values.missionText,
      };

      await aboutService.updateAboutContent(aboutContent);
      message.success('About sayfası başarıyla güncellendi');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      message.error('Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        marginBottom: '24px',
        gap: isMobile ? '16px' : '0'
      }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 24px)' }}>Hakkımızda Sayfası Yönetimi</h1>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={() => form.submit()}
          loading={saving}
          block={isMobile}
          size="large"
        >
          Değişiklikleri Kaydet
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          stats: [
            { number: '', text: '' },
            { number: '', text: '' },
            { number: '', text: '' },
            { number: '', text: '' },
          ],
          storyParagraphs: [''],
          features: [
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' },
            { title: '', description: '' },
          ],
        }}
      >
        {/* Hero Section */}
        <Card title="Hero Bölümü" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="heroTitle"
                label="Hero Başlık"
                rules={[{ required: true, message: 'Hero başlık gerekli' }]}
              >
                <Input placeholder="Örn: Guiogi" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="heroSubtitle"
                label="Hero Alt Başlık"
                rules={[{ required: true, message: 'Hero alt başlık gerekli' }]}
              >
                <Input placeholder="Örn: Yolculuk çağınızı birlikte keşfedelim" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Stats Section */}
        <Card title="İstatistikler" style={{ marginBottom: '24px' }}>
          <Form.List name="stats">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={16} key={key} style={{ marginBottom: '16px' }}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'number']}
                        label="Sayı"
                        rules={[{ required: true, message: 'Sayı gerekli' }]}
                      >
                        <Input placeholder="Örn: 15.000+" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={11}>
                      <Form.Item
                        {...restField}
                        name={[name, 'text']}
                        label="Açıklama"
                        rules={[{ required: true, message: 'Açıklama gerekli' }]}
                      >
                        <Input placeholder="Örn: Mutlu Müşteri" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={1}>
                      <Form.Item label=" " style={{ marginTop: isMobile ? 0 : '30px' }}>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{ fontSize: '20px', color: '#ff4d4f', cursor: 'pointer' }}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
                {fields.length < 6 && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    İstatistik Ekle
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Card>

        {/* Story Section */}
        <Card title="Hikayemiz Bölümü" style={{ marginBottom: '24px' }}>
          <Form.Item
            name="storyTitle"
            label="Hikaye Başlığı"
            rules={[{ required: true, message: 'Hikaye başlığı gerekli' }]}
          >
            <Input placeholder="Örn: Hikayemiz" />
          </Form.Item>
          
          <Form.Item
            name="storyImage"
            label="Hikaye Görsel URL"
            rules={[{ required: true, message: 'Görsel URL gerekli' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.List name="storyParagraphs">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item
                    key={key}
                    {...restField}
                    name={name}
                    label={`Paragraf ${name + 1}`}
                    rules={[{ required: true, message: 'Paragraf gerekli' }]}
                  >
                    <AntTextArea
                      rows={4}
                      placeholder="Paragraf metnini girin..."
                    />
                  </Form.Item>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: '16px' }}
                >
                  Paragraf Ekle
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Features Section */}
        <Card title="Özellikler Bölümü" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="featuresTitle"
                label="Özellikler Başlığı"
                rules={[{ required: true, message: 'Başlık gerekli' }]}
              >
                <Input placeholder="Örn: Neden Bizi Seçmelisiniz?" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="featuresSubtitle"
                label="Özellikler Alt Başlığı"
                rules={[{ required: true, message: 'Alt başlık gerekli' }]}
              >
                <Input placeholder="Örn: Farkımızı yaratan özelliklerimizle tanışın" />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="features">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    type="inner"
                    style={{ marginBottom: '16px' }}
                    extra={
                      fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ fontSize: '18px', color: '#ff4d4f', cursor: 'pointer' }}
                        />
                      )
                    }
                  >
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Başlık"
                          rules={[{ required: true, message: 'Başlık gerekli' }]}
                        >
                          <Input placeholder="Örn: Hızlı Rezervasyon" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          label="Açıklama"
                          rules={[{ required: true, message: 'Açıklama gerekli' }]}
                        >
                          <Input placeholder="Örn: 3 dakikada rezervasyon işleminizi tamamlayın" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                {fields.length < 8 && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Özellik Ekle
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Card>

        {/* Vision & Mission Section */}
        <Card title="Vizyon & Misyon" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="visionTitle"
                label="Vizyon Başlığı"
                rules={[{ required: true, message: 'Vizyon başlığı gerekli' }]}
              >
                <Input placeholder="Örn: Vizyonumuz" />
              </Form.Item>
              <Form.Item
                name="visionText"
                label="Vizyon Metni"
                rules={[{ required: true, message: 'Vizyon metni gerekli' }]}
              >
                <AntTextArea
                  rows={4}
                  placeholder="Vizyon metnini girin..."
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="missionTitle"
                label="Misyon Başlığı"
                rules={[{ required: true, message: 'Misyon başlığı gerekli' }]}
              >
                <Input placeholder="Örn: Misyonumuz" />
              </Form.Item>
              <Form.Item
                name="missionText"
                label="Misyon Metni"
                rules={[{ required: true, message: 'Misyon metni gerekli' }]}
              >
                <AntTextArea
                  rows={4}
                  placeholder="Misyon metnini girin..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider />

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={() => form.submit()}
            loading={saving}
            size="large"
            block={isMobile}
          >
            Değişiklikleri Kaydet
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AboutManagement;

