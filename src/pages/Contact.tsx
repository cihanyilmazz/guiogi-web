import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  message,
  Divider 
} from 'antd';
import { 
  PhoneFilled, 
  MailFilled, 
  EnvironmentFilled, 
  ClockCircleFilled,
  SendOutlined,
  WhatsAppOutlined,
  SkypeOutlined
} from '@ant-design/icons';
import { contactService, ContactContent } from '../services/contactService';
import { useTranslation } from 'react-i18next';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;


const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContactContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    document.title = "İletişim | GuiaOgi";
    loadContactContent();
  }, []);

  const loadContactContent = async () => {
    try {
      setContentLoading(true);
      const contactContent = await contactService.getContactContent();
      setContent(contactContent);
    } catch (error) {
      console.error('Contact içeriği yüklenirken hata:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(t('contact.messageSent'));
      form.resetFields();
    } catch (error) {
      message.error(t('contact.errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  // İkon mapping
  const getContactIcon = (title: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'Telefon': <PhoneFilled className="text-blue-500 text-2xl" />,
      'E-posta': <MailFilled className="text-green-500 text-2xl" />,
      'Adres': <EnvironmentFilled className="text-red-500 text-2xl" />,
      'Çalışma Saatleri': <ClockCircleFilled className="text-purple-500 text-2xl" />,
    };
    return iconMap[title] || <PhoneFilled className="text-blue-500 text-2xl" />;
  };

  if (contentLoading || !content) {
    return (
      <Layout className="min-h-screen bg-gray-100">
        <Content className="py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("common.loading")}</p>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.heroSubtitle}
          </p>
        </div>

        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            {/* İletişim Bilgileri */}
            <Col xs={24} lg={8}>
              <div className="space-y-6">
                <Card className="shadow-lg border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.contactInfo')}</h2>
                  
                  <div className="space-y-6">
                    {content.contactInfo.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getContactIcon(item.title)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.action ? (
                            <a 
                              href={item.action} 
                              className="text-blue-600 hover:text-blue-800 transition-colors block"
                              target={item.action.startsWith('http') ? '_blank' : '_self'}
                              rel={item.action.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-gray-700">{item.content}</p>
                          )}
                          <p className="text-gray-500 text-sm">{item.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Divider />

                  {/* Sosyal Medya */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">{t("contact.socialMedia")}</h3>
                    <div className="flex space-x-4">
                      <Button 
                        type="primary" 
                        icon={<WhatsAppOutlined />}
                        className="bg-green-500 hover:bg-green-600 border-green-500"
                        href={content.whatsappLink}
                        target="_blank"
                      >
                        WhatsApp
                      </Button>
                      <Button 
                        icon={<SkypeOutlined />}
                        href={content.skypeLink}
                      >
                        Skype
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Acil Durum */}
                <Card className="shadow-lg border bg-blue-50 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-900 mb-2">{content.emergencyTitle}</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    {content.emergencyDescription}
                  </p>
                  <a 
                    href={`tel:${content.emergencyPhone.replace(/\s/g, '')}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
                  >
                    {content.emergencyPhone}
                  </a>
                </Card>
              </div>
            </Col>

            {/* İletişim Formu */}
            <Col xs={24} lg={16}>
              <Card className="shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.formTitle}</h2>
                <p className="text-gray-600 mb-6">
                  {content.formDescription}
                </p>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  size="large"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label={t("contact.firstName")}
                        rules={[{ required: true, message: t("contact.firstNameRequired") }]}
                      >
                        <Input placeholder={t("contact.firstNamePlaceholder")} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label={t("contact.lastName")}
                        rules={[{ required: true, message: t("contact.lastNameRequired") }]}
                      >
                        <Input placeholder={t("contact.lastNamePlaceholder")} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={t('contact.emailLabel')}
                        rules={[
                          { required: true, message: t("contact.emailRequired") },
                          { type: 'email', message: t("contact.emailInvalid") }
                        ]}
                      >
                        <Input placeholder={t("auth.emailPlaceholder")} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label={t('contact.phoneLabel')}
                        rules={[{ required: true, message: t("contact.phoneRequired") }]}
                      >
                        <Input placeholder={t("contact.phonePlaceholder")} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="subject"
                    label={t("contact.subject")}
                    rules={[{ required: true, message: t("contact.subjectRequired") }]}
                  >
                    <Select placeholder={t("contact.selectSubject")}>
                      <Option value="tour-info">{t("contact.tourInfo")}</Option>
                      <Option value="reservation">{t("contact.reservation")}</Option>
                      <Option value="complaint">{t("contact.complaint")}</Option>
                      <Option value="suggestion">{t("contact.suggestion")}</Option>
                      <Option value="corporate">{t("contact.corporate")}</Option>
                      <Option value="other">{t("contact.other")}</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label={t('contact.messageLabel')}
                    rules={[{ required: true, message: t('contact.messageRequired') }]}
                  >
                    <TextArea 
                      rows={6} 
                      placeholder={t('contact.messagePlaceholder')}
                      showCount 
                      maxLength={1000}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SendOutlined />}
                      size="large"
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 border-blue-600"
                    >
                      {t('contact.sendButton')}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>

              {/* Harita - GÜNCELLENMİŞ */}
              <Card className="shadow-lg border mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{t("contact.ourOffice")}</h3>
                  <a 
                    href={content.contactInfo.find(ci => ci.title === 'Adres')?.action || 'https://maps.google.com'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <EnvironmentFilled className="mr-2" />
                    {t("contact.viewOnMap")}
                  </a>
                </div>
                <iframe
                  src={content.mapEmbedUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GuiaOgi İstanbul Ofisi"
                />
                <div className="mt-4 text-center text-gray-600">
                  <p><strong>Adres:</strong> {content.officeAddress}</p>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Sık Sorulan Sorular */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              {content.faqTitle}
            </h2>
            <Row gutter={[24, 24]}>
              {content.faqs.map((faq, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card className="shadow-md border-0 h-full">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ContactPage;