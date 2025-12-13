// pages/TourDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Tag,
  Button,
  Row,
  Col,
  Spin,
  Alert,
  Tabs,
  List,
  Divider,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  StarFilled,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { tourService, Tour } from "../services/tourService";
import { useAuth } from "../context/AuthContext"; // BU SATIRI EKLEYİN

const { Content } = Layout;
const { TabPane } = Tabs;
const { Item } = Form;

const TourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, login, user } = useAuth(); // useAuth hook'unu kullan
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  useEffect(() => {
    const fetchTourData = async () => {
      if (!id) {
        setError("Tur ID bulunamadı");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const tourId = parseInt(id);
        const tourData = await tourService.getTourById(tourId);
        setTour(tourData);

        // İlgili turları getir
        const relatedTours = await tourService.getRelatedTours(
          tourData.category,
          tourId,
        );
        setRelatedTours(relatedTours);
      } catch (err: any) {
        console.error("Hata:", err);
        setError(err.message || "Tur detayları yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  const handleBookTour = () => {
    if (!isAuthenticated) {
      message.warning(
        "Fiyatları görmek ve rezervasyon yapmak için giriş yapmalısınız.",
      );
      setLoginModalVisible(true);
      return;
    }

    // Giriş yapmışsa rezervasyon işlemi
    alert(`Sayın ${user?.name}, rezervasyon sayfasına yönlendiriliyorsunuz...`);
    // navigate('/rezervasyon', { state: { tour } });
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoginLoading(true);
      await login(values.email, values.password);
      message.success("Giriş başarılı!");
      setLoginModalVisible(false);
      loginForm.resetFields();
    } catch (err) {
      message.error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setRegisterLoading(true);
      // Burada register fonksiyonunu çağır
      // Örnek: await register(values.name, values.email, values.password);
      message.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      setRegisterModalVisible(false);
      registerForm.resetFields();
      setLoginModalVisible(true);
    } catch (err) {
      message.error("Kayıt başarısız. Lütfen tekrar deneyin.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const showPriceInfo = () => {
    if (!isAuthenticated) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-center">
            <LockOutlined className="text-yellow-500 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Fiyatı Görmek İçin Giriş Yapın
            </h3>
            <p className="text-yellow-600 mb-4">
              Tur fiyatlarını görmek ve rezervasyon yapmak için giriş
              yapmalısınız.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="primary"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setLoginModalVisible(true)}
              >
                Giriş Yap
              </Button>
              <Button
                className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"
                onClick={() => setRegisterModalVisible(true)}
              >
                Kayıt Ol
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Giriş yapmışsa fiyatı göster
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="text-3xl font-bold text-gray-800 mb-2">
          {tour?.discount ? (
            <>
              <span className="line-through text-gray-400 text-2xl mr-2">
                {tour.price} TL
              </span>
              <span className="text-red-600">
                {Math.round(tour.price! * (1 - tour.discount / 100))} TL
              </span>
              <Tag color="red" className="ml-2">
                %{tour.discount} İNDİRİM
              </Tag>
            </>
          ) : (
            `${tour?.price} TL`
          )}
        </div>
        <div className="text-gray-500 mb-4">Kişi Başı</div>
        <Button
          type="primary"
          size="large"
          block
          className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
          onClick={handleBookTour}
        >
          Şimdi Rezervasyon Yap
        </Button>
        <div className="mt-4 text-sm text-gray-500 text-center">
          Hoş geldiniz, <span className="font-semibold">{user?.name}</span>!
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Tur detayları yükleniyor..." />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert
          message="Hata"
          description={error || "Tur bulunamadı"}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate("/")}>
              Ana Sayfaya Dön
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content>
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="text-gray-600"
            >
              Geri Dön
            </Button>
          </div>
        </div>

        {/* Tur Detayları */}
        <div className="container mx-auto px-4 py-8">
          {/* Ana Bilgiler */}
          <Card className="mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Tur Görseli */}
              <div className="lg:w-2/3">
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg"
                />

                {/* Küçük Bilgiler */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <Tag color="blue" className="text-base py-1 px-3">
                    {tour.category}
                  </Tag>
                  <Tag color="green" className="text-base py-1 px-3">
                    {tour.specialOffer}
                  </Tag>
                  <Tag color="orange" className="text-base py-1 px-3">
                    {tour.season} Mevsimi
                  </Tag>
                  <div className="flex items-center ml-auto">
                    <StarFilled className="text-yellow-500 text-xl mr-1" />
                    <span className="text-lg font-bold">{tour.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({tour.reviewCount} yorum)
                    </span>
                  </div>
                </div>
              </div>

              {/* Tur Bilgileri */}
              <div className="lg:w-1/3">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {tour.title}
                </h1>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <EnvironmentOutlined className="text-blue-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">Lokasyon</div>
                      <div className="text-gray-600">{tour.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CalendarOutlined className="text-green-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">Süre</div>
                      <div className="text-gray-600">{tour.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <UserOutlined className="text-purple-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">Grup Büyüklüğü</div>
                      <div className="text-gray-600">{tour.groupSize}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <UserOutlined className="text-orange-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">Rehber</div>
                      <div className="text-gray-600">{tour.guide}</div>
                    </div>
                  </div>
                </div>

                {/* Fiyat ve Rezervasyon - GÜNCELLENDİ */}
                {showPriceInfo()}
              </div>
            </div>
          </Card>

          {/* Detaylı Bilgiler Tabs */}
          <Tabs defaultActiveKey="1" className="bg-white p-6 rounded-lg shadow">
            <TabPane tab="Tur Açıklaması" key="1">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4">Tur Hakkında</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {tour.description}
                </p>
              </div>
            </TabPane>

            <TabPane tab="Tur Programı" key="2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">Tur Programı</h3>
                <List
                  dataSource={tour.highlights}
                  renderItem={(item, index) => (
                    <List.Item>
                      <div className="flex items-start">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item}</div>
                          <div className="text-gray-600 mt-1">
                            Bu aktivite ile ilgili detaylı açıklama...
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>

            <TabPane tab="Dahil Olanlar" key="3">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">
                  Pakete Dahil Olanlar
                </h3>
                {(tour.included?.length ?? 0) > 0 ? (
                  <Row gutter={[16, 16]}>
                    {tour.included?.map((item, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <CheckCircleOutlined className="text-green-500 text-xl mr-3" />
                          <span>{item}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    Bu tur için dahil olanlar listesi bulunmamaktadır.
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>

          {/* İlgili Turlar */}
          {relatedTours.length > 0 && (
            <div className="mt-8">
              <Divider orientation="left">
                <h3 className="text-2xl font-bold">Benzer Turlar</h3>
              </Divider>

              <Row gutter={[16, 16]}>
                {relatedTours.map((relatedTour) => (
                  <Col xs={24} md={12} lg={8} key={relatedTour.id}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={relatedTour.title}
                          src={relatedTour.coverImage}
                          className="h-48 object-cover"
                        />
                      }
                      onClick={() => navigate(`/tour/${relatedTour.id}`)}
                    >
                      <Card.Meta
                        title={relatedTour.title}
                        description={
                          <div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <EnvironmentOutlined className="mr-1" />
                              {relatedTour.location}
                            </div>
                            <div className="flex justify-between items-center">
                              {isAuthenticated ? (
                                <span className="text-blue-600 font-bold">
                                  {relatedTour.price
                                    ? `${relatedTour.price} TL`
                                    : "Fiyat bilgisi yok"}
                                </span>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  Fiyatı görmek için giriş yapın
                                </span>
                              )}
                              <div className="flex items-center">
                                <StarFilled className="text-yellow-500 mr-1" />
                                <span>{relatedTour.rating}</span>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      </Content>

      {/* Giriş Modalı */}
      <Modal
        title="Giriş Yap"
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
          <Item
            name="email"
            label="E-posta"
            rules={[
              { required: true, message: "Lütfen e-posta adresinizi girin" },
              { type: "email", message: "Geçerli bir e-posta adresi girin" },
            ]}
          >
            <Input placeholder="ornek@email.com" />
          </Item>

          <Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: "Lütfen şifrenizi girin" }]}
          >
            <Input.Password
              placeholder="Şifreniz"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Item>

          <Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginLoading}
              block
            >
              Giriş Yap
            </Button>
          </Item>

          <div className="text-center">
            <Button
              type="link"
              onClick={() => {
                setLoginModalVisible(false);
                setRegisterModalVisible(true);
              }}
            >
              Hesabınız yok mu? Kayıt Olun
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Kayıt Modalı */}
      <Modal
        title="Kayıt Ol"
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={registerForm} layout="vertical" onFinish={handleRegister}>
          <Item
            name="name"
            label="Ad Soyad"
            rules={[
              { required: true, message: "Lütfen adınızı ve soyadınızı girin" },
            ]}
          >
            <Input placeholder="Adınız Soyadınız" />
          </Item>

          <Item
            name="email"
            label="E-posta"
            rules={[
              { required: true, message: "Lütfen e-posta adresinizi girin" },
              { type: "email", message: "Geçerli bir e-posta adresi girin" },
            ]}
          >
            <Input placeholder="ornek@email.com" />
          </Item>

          <Item
            name="password"
            label="Şifre"
            rules={[
              { required: true, message: "Lütfen şifrenizi girin" },
              { min: 6, message: "Şifre en az 6 karakter olmalı" },
            ]}
          >
            <Input.Password
              placeholder="Şifreniz"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Item>

          <Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerLoading}
              block
            >
              Kayıt Ol
            </Button>
          </Item>

          <div className="text-center">
            <Button
              type="link"
              onClick={() => {
                setRegisterModalVisible(false);
                setLoginModalVisible(true);
              }}
            >
              Zaten hesabınız var mı? Giriş Yapın
            </Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default TourDetail;
