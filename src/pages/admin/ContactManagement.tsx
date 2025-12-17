// pages/admin/ContactManagement.tsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Spin, Divider } from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { contactService, ContactContent } from '../../services/contactService';

const { TextArea } = Input;

const ContactManagement: React.FC = () => {
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
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setLoading(true);
      const content = await contactService.getContactContent();
      form.setFieldsValue({
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        contactInfo: content.contactInfo || [
          { title: '', content: '', subtitle: '', action: '' },
          { title: '', content: '', subtitle: '', action: '' },
          { title: '', content: '', subtitle: '', action: '' },
          { title: '', content: '', subtitle: '', action: '' },
        ],
        whatsappLink: content.whatsappLink,
        skypeLink: content.skypeLink,
        emergencyTitle: content.emergencyTitle,
        emergencyDescription: content.emergencyDescription,
        emergencyPhone: content.emergencyPhone,
        formTitle: content.formTitle,
        formDescription: content.formDescription,
        mapEmbedUrl: content.mapEmbedUrl,
        officeAddress: content.officeAddress,
        faqTitle: content.faqTitle,
        faqs: content.faqs || [
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
        ],
      });
    } catch (error) {
      console.error('Contact içeriği yüklenirken hata:', error);
      message.error('İçerik yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      
      const contactContent: ContactContent = {
        heroTitle: values.heroTitle,
        heroSubtitle: values.heroSubtitle,
        contactInfo: values.contactInfo.filter((info: any) => info.title && info.content),
        whatsappLink: values.whatsappLink,
        skypeLink: values.skypeLink,
        emergencyTitle: values.emergencyTitle,
        emergencyDescription: values.emergencyDescription,
        emergencyPhone: values.emergencyPhone,
        formTitle: values.formTitle,
        formDescription: values.formDescription,
        mapEmbedUrl: values.mapEmbedUrl,
        officeAddress: values.officeAddress,
        faqTitle: values.faqTitle,
        faqs: values.faqs.filter((faq: any) => faq.question && faq.answer),
      };

      await contactService.updateContactContent(contactContent);
      message.success('İletişim sayfası başarıyla güncellendi');
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
        <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 24px)' }}>İletişim Sayfası Yönetimi</h1>
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
          contactInfo: [
            { title: '', content: '', subtitle: '', action: '' },
            { title: '', content: '', subtitle: '', action: '' },
            { title: '', content: '', subtitle: '', action: '' },
            { title: '', content: '', subtitle: '', action: '' },
          ],
          faqs: [
            { question: '', answer: '' },
            { question: '', answer: '' },
            { question: '', answer: '' },
            { question: '', answer: '' },
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
                <Input placeholder="Örn: İletişim" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="heroSubtitle"
                label="Hero Alt Başlık"
                rules={[{ required: true, message: 'Hero alt başlık gerekli' }]}
              >
                <Input placeholder="Alt başlık metni..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Contact Info Section */}
        <Card title="İletişim Bilgileri" style={{ marginBottom: '24px' }}>
          <Form.List name="contactInfo">
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
                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Başlık"
                          rules={[{ required: true, message: 'Başlık gerekli' }]}
                        >
                          <Input placeholder="Örn: Telefon" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'content']}
                          label="İçerik"
                          rules={[{ required: true, message: 'İçerik gerekli' }]}
                        >
                          <Input placeholder="Örn: +90 555 555 55 55" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'subtitle']}
                          label="Alt Başlık"
                          rules={[{ required: true, message: 'Alt başlık gerekli' }]}
                        >
                          <Input placeholder="Örn: 7/24 Destek Hattı" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'action']}
                          label="Link (opsiyonel)"
                        >
                          <Input placeholder="tel: veya mailto: veya URL" />
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
                    İletişim Bilgisi Ekle
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Card>

        {/* Social Media Section */}
        <Card title="Sosyal Medya Linkleri" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="whatsappLink"
                label="WhatsApp Link"
                rules={[{ required: true, message: 'WhatsApp linki gerekli' }]}
              >
                <Input placeholder="https://wa.me/905555555555" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="skypeLink"
                label="Skype Link"
                rules={[{ required: true, message: 'Skype linki gerekli' }]}
              >
                <Input placeholder="skype:guiaogi?call" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Emergency Section */}
        <Card title="Acil Durum Bölümü" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="emergencyTitle"
                label="Başlık"
                rules={[{ required: true, message: 'Başlık gerekli' }]}
              >
                <Input placeholder="Örn: 🆘 Acil Durum" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="emergencyPhone"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon gerekli' }]}
              >
                <Input placeholder="+90 555 555 55 56" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="emergencyDescription"
                label="Açıklama"
                rules={[{ required: true, message: 'Açıklama gerekli' }]}
              >
                <Input placeholder="Açıklama metni..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Form Section */}
        <Card title="İletişim Formu Bölümü" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="formTitle"
                label="Form Başlığı"
                rules={[{ required: true, message: 'Form başlığı gerekli' }]}
              >
                <Input placeholder="Örn: Bize Ulaşın" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="formDescription"
                label="Form Açıklaması"
                rules={[{ required: true, message: 'Form açıklaması gerekli' }]}
              >
                <Input placeholder="Form açıklama metni..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Map Section */}
        <Card title="Harita Bölümü" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="mapEmbedUrl"
                label="Harita Embed URL"
                rules={[{ required: true, message: 'Harita URL gerekli' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Google Maps embed URL'i..."
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="officeAddress"
                label="Ofis Adresi"
                rules={[{ required: true, message: 'Ofis adresi gerekli' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Tam adres bilgisi..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* FAQ Section */}
        <Card title="Sık Sorulan Sorular (SSS)" style={{ marginBottom: '24px' }}>
          <Form.Item
            name="faqTitle"
            label="SSS Başlığı"
            rules={[{ required: true, message: 'SSS başlığı gerekli' }]}
          >
            <Input placeholder="Örn: Sık Sorulan Sorular" />
          </Form.Item>

          <Form.List name="faqs">
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
                          name={[name, 'question']}
                          label="Soru"
                          rules={[{ required: true, message: 'Soru gerekli' }]}
                        >
                          <Input placeholder="Örn: 📞 Telefonla nasıl rezervasyon yapabilirim?" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'answer']}
                          label="Cevap"
                          rules={[{ required: true, message: 'Cevap gerekli' }]}
                        >
                          <TextArea
                            rows={3}
                            placeholder="Cevap metni..."
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                {fields.length < 10 && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    SSS Ekle
                  </Button>
                )}
              </>
            )}
          </Form.List>
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

export default ContactManagement;

