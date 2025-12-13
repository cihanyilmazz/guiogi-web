import React, { useState } from 'react';
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

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

// Harita Bileşeni
const MapComponent: React.FC = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.674188611382!2d29.020215315718!3d41.04487432529929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a24975fe5d%3A0x2d35cb6d8a30dd8f!2sLevent%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1234567890"
      width="100%"
      height="400"
      style={{ border: 0, borderRadius: '8px' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="GuiaOgi İstanbul Ofisi"
    />
  );
};

const ContactPage: React.FC = () => {
  React.useEffect(() => {
    document.title = "İletişim | GuiaOgi";
  }, []);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Form values:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağız.');
      form.resetFields();
    } catch (error) {
      message.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <PhoneFilled className="text-blue-500 text-2xl" />,
      title: 'Telefon',
      content: '+90 555 555 55 55',
      subtitle: '7/24 Destek Hattı',
      action: 'tel:+905555555555'
    },
    {
      icon: <MailFilled className="text-green-500 text-2xl" />,
      title: 'E-posta',
      content: 'info@guiaogi.com.tr',
      subtitle: '24 saat içinde yanıt',
      action: 'mailto:info@guiaogi.com.tr'
    },
    {
      icon: <EnvironmentFilled className="text-red-500 text-2xl" />,
      title: 'Adres',
      content: 'Levent, İstanbul',
      subtitle: 'Merkez Ofis',
      action: 'https://maps.google.com/?q=Levent,İstanbul'
    },
    {
      icon: <ClockCircleFilled className="text-purple-500 text-2xl" />,
      title: 'Çalışma Saatleri',
      content: 'Pzt - Cuma: 09:00 - 18:00',
      subtitle: 'Cumartesi: 10:00 - 16:00',
      action: null
    }
  ];

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            İletişim
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Size nasıl yardımcı olabiliriz? Sorularınız, önerileriniz veya rezervasyon talepleriniz için 
            bizimle iletişime geçmekten çekinmeyin.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <Row gutter={[32, 32]}>
            {/* İletişim Bilgileri */}
            <Col xs={24} lg={8}>
              <div className="space-y-6">
                <Card className="shadow-lg border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
                  
                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {item.icon}
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
                    <h3 className="font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
                    <div className="flex space-x-4">
                      <Button 
                        type="primary" 
                        icon={<WhatsAppOutlined />}
                        className="bg-green-500 hover:bg-green-600 border-green-500"
                        href="https://wa.me/905555555555"
                        target="_blank"
                      >
                        WhatsApp
                      </Button>
                      <Button 
                        icon={<SkypeOutlined />}
                        href="skype:guiaogi?call"
                      >
                        Skype
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Acil Durum */}
                <Card className="shadow-lg border bg-blue-50 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-900 mb-2">🆘 Acil Durum</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    Yurtdışında acil durumlarda 7/24 ulaşabileceğiniz destek hattı:
                  </p>
                  <a 
                    href="tel:+905555555556" 
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
                  >
                    +90 555 555 55 56
                  </a>
                </Card>
              </div>
            </Col>

            {/* İletişim Formu */}
            <Col xs={24} lg={16}>
              <Card className="shadow-lg border">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bize Ulaşın</h2>
                <p className="text-gray-600 mb-6">
                  Aşağıdaki formu doldurarak bize ulaşabilirsiniz. En kısa sürede sizinle iletişime geçeceğiz.
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
                        label="Adınız"
                        rules={[{ required: true, message: 'Lütfen adınızı giriniz' }]}
                      >
                        <Input placeholder="Adınız" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Soyadınız"
                        rules={[{ required: true, message: 'Lütfen soyadınızı giriniz' }]}
                      >
                        <Input placeholder="Soyadınız" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="E-posta Adresiniz"
                        rules={[
                          { required: true, message: 'Lütfen e-posta adresinizi giriniz' },
                          { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' }
                        ]}
                      >
                        <Input placeholder="ornek@email.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Telefon Numaranız"
                        rules={[{ required: true, message: 'Lütfen telefon numaranızı giriniz' }]}
                      >
                        <Input placeholder="+90 555 555 55 55" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="subject"
                    label="Konu"
                    rules={[{ required: true, message: 'Lütfen konu seçiniz' }]}
                  >
                    <Select placeholder="Konu seçiniz">
                      <Option value="tour-info">Tur Bilgisi</Option>
                      <Option value="reservation">Rezervasyon</Option>
                      <Option value="complaint">Şikayet</Option>
                      <Option value="suggestion">Öneri</Option>
                      <Option value="corporate">Kurumsal İşbirliği</Option>
                      <Option value="other">Diğer</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Mesajınız"
                    rules={[{ required: true, message: 'Lütfen mesajınızı yazınız' }]}
                  >
                    <TextArea 
                      rows={6} 
                      placeholder="Mesajınızı detaylı bir şekilde yazınız..."
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
                      Mesajı Gönder
                    </Button>
                  </Form.Item>
                </Form>
              </Card>

              {/* Harita - GÜNCELLENMİŞ */}
              <Card className="shadow-lg border mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Ofisimiz</h3>
                  <a 
                    href="https://maps.google.com/?q=Levent,İstanbul" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <EnvironmentFilled className="mr-2" />
                    Haritada Görüntüle
                  </a>
                </div>
                <MapComponent />
                <div className="mt-4 text-center text-gray-600">
                  <p><strong>Adres:</strong> Levent Mahallesi, Büyükdere Caddesi, No:123, 34330 Levent/İstanbul</p>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Sık Sorulan Sorular */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Sık Sorulan Sorular
            </h2>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card className="shadow-md border-0 h-full">
                  <h3 className="font-semibold text-lg mb-2">📞 Telefonla nasıl rezervasyon yapabilirim?</h3>
                  <p className="text-gray-600">
                    +90 555 555 55 55 numaralı hattımızdan 7/24 rezervasyon yapabilirsiniz. 
                    Operatörlerimiz size yardımcı olacaktır.
                  </p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card className="shadow-md border-0 h-full">
                  <h3 className="font-semibold text-lg mb-2">⏰ Çalışma saatleriniz nedir?</h3>
                  <p className="text-gray-600">
                    Hafta içi 09:00 - 18:00, Cumartesi 10:00 - 16:00 saatleri arasında hizmet vermekteyiz. 
                    Acil durumlarda 7/24 ulaşılabilirsiniz.
                  </p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card className="shadow-md border-0 h-full">
                  <h3 className="font-semibold text-lg mb-2">🌍 Yurtdışı turlarınız var mı?</h3>
                  <p className="text-gray-600">
                    Evet, 50'den fazla ülkede tur paketlerimiz bulunmaktadır. 
                    Detaylı bilgi için iletişim formunu doldurabilirsiniz.
                  </p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card className="shadow-md border-0 h-full">
                  <h3 className="font-semibold text-lg mb-2">💼 Kurumsal iş birlikleri için kiminle görüşebilirim?</h3>
                  <p className="text-gray-600">
                    Kurumsal iş birlikleri için corporate@guiaogi.com.tr adresine mail atabilir 
                    veya 0212 555 55 55 numaralı hattımızdan kurumsal satış departmanımıza ulaşabilirsiniz.
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ContactPage;