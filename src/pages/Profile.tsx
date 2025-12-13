// pages/Profile.tsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Avatar,
  Tabs,
  List,
  Tag,
  Modal,
  message,
  Spin,
  Alert,
  Divider,
  Descriptions,
  Badge,
  Timeline,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  SaveOutlined,
  HistoryOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Item } = Form;

// Rezervasyon veri tipi
interface Booking {
  id: number;
  tourId: number;
  tourTitle: string;
  tourImage: string;
  bookingDate: string;
  travelDate: string;
  persons: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentStatus: "paid" | "pending" | "refunded";
  bookingNumber: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Oturum kontrolü
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning("Bu sayfayı görüntülemek için giriş yapmalısınız.");
      navigate("/giris");
    }
  }, [isAuthenticated, navigate]);

  // Kullanıcı bilgilerini forma yükle
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        preferences: user.preferences || "",
      });
    }
  }, [user, form]);

  // Rezervasyonları yükle (mock data)
  useEffect(() => {
    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        // Burada API'den rezervasyonları çekeceksiniz
        // Şimdilik mock data kullanıyoruz
        const mockBookings: Booking[] = [
          {
            id: 1,
            tourId: 101,
            tourTitle: "Kapadokya Balon Turu",
            tourImage:
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            bookingDate: "2024-01-15",
            travelDate: "2024-03-20",
            persons: 2,
            totalPrice: 2500,
            status: "confirmed",
            paymentStatus: "paid",
            bookingNumber: "BKG-2024-001",
          },
          {
            id: 2,
            tourId: 102,
            tourTitle: "Pamukkale Günübirlik Tur",
            tourImage:
              "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            bookingDate: "2024-01-10",
            travelDate: "2024-02-25",
            persons: 4,
            totalPrice: 1800,
            status: "completed",
            paymentStatus: "paid",
            bookingNumber: "BKG-2024-002",
          },
          {
            id: 3,
            tourId: 103,
            tourTitle: "Efes Antik Kenti Turu",
            tourImage:
              "https://images.unsplash.com/photo-1593693399021-8ddfc4db6e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            bookingDate: "2024-01-05",
            travelDate: "2024-04-15",
            persons: 3,
            totalPrice: 3200,
            status: "pending",
            paymentStatus: "pending",
            bookingNumber: "BKG-2024-003",
          },
          {
            id: 4,
            tourId: 104,
            tourTitle: "İstanbul Boğaz Turu",
            tourImage:
              "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            bookingDate: "2023-12-20",
            travelDate: "2024-01-10",
            persons: 2,
            totalPrice: 1200,
            status: "cancelled",
            paymentStatus: "refunded",
            bookingNumber: "BKG-2023-045",
          },
        ];

        setBookings(mockBookings);
      } catch (error) {
        console.error("Rezervasyonlar yüklenirken hata:", error);
        message.error("Rezervasyonlar yüklenirken bir hata oluştu");
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Profil bilgilerini kaydet
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      // Burada API'ye profil güncelleme isteği gönderilecek
      await updateUser({
        ...user,
        ...values,
      });

      message.success("Profil bilgileriniz başarıyla güncellendi");
      setEditMode(false);
    } catch (error) {
      message.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Rezervasyon iptal et
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      // Burada API'ye iptal isteği gönderilecek
      message.success(
        `Rezervasyon #${selectedBooking.bookingNumber} iptal edildi`,
      );
      setCancelModalVisible(false);

      // Rezervasyon durumunu güncelle
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "cancelled", paymentStatus: "refunded" }
            : booking,
        ),
      );
    } catch (error) {
      message.error("Rezervasyon iptal edilirken bir hata oluştu");
    }
  };

  // Rezervasyon detayına git
  const goToBookingDetail = (booking: Booking) => {
    navigate(`/booking/${booking.id}`);
  };

  // Tur detayına git
  const goToTourDetail = (tourId: number) => {
    navigate(`/tour/${tourId}`);
  };

  // Durum etiketi renkleri
  const getStatusTag = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Tag color="green">Onaylandı</Tag>;
      case "pending":
        return <Tag color="orange">Beklemede</Tag>;
      case "cancelled":
        return <Tag color="red">İptal Edildi</Tag>;
      case "completed":
        return <Tag color="blue">Tamamlandı</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Ödeme durumu etiketi
  const getPaymentTag = (status: string) => {
    switch (status) {
      case "paid":
        return <Tag color="success">Ödendi</Tag>;
      case "pending":
        return <Tag color="warning">Ödeme Bekleniyor</Tag>;
      case "refunded":
        return <Tag color="default">İade Edildi</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Aktif rezervasyonları filtrele
  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );

  // Geçmiş rezervasyonları filtrele
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled",
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content>
        <div className="container mx-auto px-4 py-8">
          {/* Başlık */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profilim</h1>
            <p className="text-gray-600">
              Hesap bilgilerinizi yönetin ve rezervasyonlarınızı görüntüleyin
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {/* Sol Sütun - Profil Bilgileri */}
            <Col xs={24} lg={8}>
              <Card className="sticky top-24">
                <div className="text-center mb-6">
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    className="bg-blue-100 text-blue-600 mb-4"
                  />
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {user?.name}
                  </h2>
                  <p className="text-gray-500">{user?.email}</p>
                  <div className="mt-2">
                    <Tag color="blue" className="text-sm">
                      Premium Üye
                    </Tag>
                  </div>
                </div>

                <Divider />

                {/* Hızlı İstatistikler */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Toplam Rezervasyon</span>
                    <span className="font-bold text-gray-800">
                      {bookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Aktif Rezervasyon</span>
                    <span className="font-bold text-green-600">
                      {bookings.filter((b) => b.status === "confirmed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Geçmiş Rezervasyon</span>
                    <span className="font-bold text-blue-600">
                      {bookings.filter((b) => b.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Üyelik Tarihi</span>
                    <span className="text-gray-800">01.01.2024</span>
                  </div>
                </div>

                <Divider />

                {/* İletişim Bilgileri */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MailOutlined className="text-gray-400 mr-3" />
                    <span className="text-gray-700">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center">
                      <PhoneOutlined className="text-gray-400 mr-3" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center">
                      <EnvironmentOutlined className="text-gray-400 mr-3" />
                      <span className="text-gray-700">{user.address}</span>
                    </div>
                  )}
                </div>
              </Card>
            </Col>

            {/* Sağ Sütun - Detaylar */}
            <Col xs={24} lg={16}>
              <Card>
                <Tabs defaultActiveKey="profile">
                  {/* Profil Düzenleme Tab'ı */}
                  <TabPane
                    tab={
                      <span>
                        <UserOutlined />
                        Profil Bilgileri
                      </span>
                    }
                    key="profile"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">
                        Kişisel Bilgiler
                      </h3>
                      <Button
                        type={editMode ? "default" : "primary"}
                        icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                        onClick={() => {
                          if (editMode) {
                            form.submit();
                          } else {
                            setEditMode(true);
                          }
                        }}
                        loading={loading}
                      >
                        {editMode ? "Kaydet" : "Düzenle"}
                      </Button>
                    </div>

                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSave}
                      disabled={!editMode}
                    >
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Item
                            name="name"
                            label="Ad Soyad"
                            rules={[
                              {
                                required: true,
                                message: "Lütfen adınızı girin",
                              },
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined />}
                              placeholder="Adınız Soyadınız"
                            />
                          </Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Item
                            name="email"
                            label="E-posta"
                            rules={[
                              {
                                required: true,
                                message: "Lütfen e-posta adresinizi girin",
                              },
                              {
                                type: "email",
                                message: "Geçerli bir e-posta adresi girin",
                              },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined />}
                              placeholder="ornek@email.com"
                              type="email"
                            />
                          </Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Item name="phone" label="Telefon">
                            <Input
                              prefix={<PhoneOutlined />}
                              placeholder="(555) 123 45 67"
                            />
                          </Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Item name="address" label="Adres">
                            <Input
                              prefix={<EnvironmentOutlined />}
                              placeholder="Adresiniz"
                            />
                          </Item>
                        </Col>
                      </Row>

                      <Item name="preferences" label="Tercihler (Opsiyonel)">
                        <Input.TextArea
                          rows={3}
                          placeholder="Özel tercihleriniz, alerjileriniz, diyet kısıtlamalarınız vb..."
                        />
                      </Item>

                      {editMode && (
                        <div className="flex justify-end space-x-3 mt-6">
                          <Button onClick={() => setEditMode(false)}>
                            İptal
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                          >
                            Güncelle
                          </Button>
                        </div>
                      )}
                    </Form>
                  </TabPane>

                  {/* Rezervasyonlar Tab'ı */}
                  <TabPane
                    tab={
                      <span>
                        <HistoryOutlined />
                        Rezervasyonlarım
                        <Badge
                          count={activeBookings.length}
                          style={{ marginLeft: 8 }}
                        />
                      </span>
                    }
                    key="bookings"
                  >
                    {bookingsLoading ? (
                      <div className="text-center py-12">
                        <Spin size="large" />
                        <p className="mt-4 text-gray-500">
                          Rezervasyonlar yükleniyor...
                        </p>
                      </div>
                    ) : (
                      <div>
                        {/* Aktif Rezervasyonlar */}
                        {activeBookings.length > 0 && (
                          <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              Aktif Rezervasyonlar
                            </h4>
                            <List
                              dataSource={activeBookings}
                              renderItem={(booking) => (
                                <List.Item
                                  actions={[
                                    <Button
                                      type="link"
                                      onClick={() => goToBookingDetail(booking)}
                                    >
                                      Detay
                                    </Button>,
                                    booking.status === "confirmed" && (
                                      <Button
                                        danger
                                        type="link"
                                        onClick={() => {
                                          setSelectedBooking(booking);
                                          setCancelModalVisible(true);
                                        }}
                                      >
                                        İptal Et
                                      </Button>
                                    ),
                                  ]}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      <img
                                        src={booking.tourImage}
                                        alt={booking.tourTitle}
                                        className="w-24 h-16 object-cover rounded cursor-pointer"
                                        onClick={() =>
                                          goToTourDetail(booking.tourId)
                                        }
                                      />
                                    }
                                    title={
                                      <div className="flex items-center">
                                        <span
                                          className="font-medium cursor-pointer hover:text-blue-600"
                                          onClick={() =>
                                            goToTourDetail(booking.tourId)
                                          }
                                        >
                                          {booking.tourTitle}
                                        </span>
                                        <div className="ml-4">
                                          {getStatusTag(booking.status)}
                                          {getPaymentTag(booking.paymentStatus)}
                                        </div>
                                      </div>
                                    }
                                    description={
                                      <div className="space-y-1">
                                        <div className="flex items-center text-sm">
                                          <CalendarOutlined className="mr-2 text-gray-400" />
                                          <span className="text-gray-600">
                                            Seyahat Tarihi: {booking.travelDate}
                                          </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                          <UserOutlined className="mr-2 text-gray-400" />
                                          <span className="text-gray-600">
                                            {booking.persons} Kişi
                                          </span>
                                        </div>
                                        <div className="text-sm">
                                          <span className="text-gray-600">
                                            Rezervasyon No:{" "}
                                          </span>
                                          <span className="font-medium">
                                            {booking.bookingNumber}
                                          </span>
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">
                                          {booking.totalPrice} TL
                                        </div>
                                      </div>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </div>
                        )}

                        {/* Geçmiş Rezervasyonlar */}
                        {pastBookings.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              Geçmiş Rezervasyonlar
                            </h4>
                            <Timeline>
                              {pastBookings.map((booking) => (
                                <Timeline.Item
                                  key={booking.id}
                                  color={
                                    booking.status === "completed"
                                      ? "green"
                                      : booking.status === "cancelled"
                                      ? "red"
                                      : "gray"
                                  }
                                  dot={
                                    booking.status === "completed" ? (
                                      <CheckCircleOutlined />
                                    ) : booking.status === "cancelled" ? (
                                      <CloseCircleOutlined />
                                    ) : (
                                      <ClockCircleOutlined />
                                    )
                                  }
                                >
                                  <Card size="small">
                                    <Descriptions column={1} size="small">
                                      <Descriptions.Item label="Tur">
                                        <span
                                          className="cursor-pointer text-blue-600 hover:underline"
                                          onClick={() =>
                                            goToTourDetail(booking.tourId)
                                          }
                                        >
                                          {booking.tourTitle}
                                        </span>
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Rezervasyon No">
                                        {booking.bookingNumber}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Seyahat Tarihi">
                                        {booking.travelDate}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Durum">
                                        {getStatusTag(booking.status)}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Tutar">
                                        <span className="font-medium">
                                          {booking.totalPrice} TL
                                        </span>
                                      </Descriptions.Item>
                                    </Descriptions>
                                    <Button
                                      type="link"
                                      size="small"
                                      onClick={() => goToBookingDetail(booking)}
                                      className="mt-2"
                                    >
                                      Detayları Gör
                                    </Button>
                                  </Card>
                                </Timeline.Item>
                              ))}
                            </Timeline>
                          </div>
                        )}

                        {/* Rezervasyon yoksa */}
                        {bookings.length === 0 && (
                          <div className="text-center py-12">
                            <HistoryOutlined className="text-4xl text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-600 mb-2">
                              Henüz rezervasyonunuz bulunmuyor
                            </h4>
                            <p className="text-gray-500 mb-6">
                              İlk rezervasyonunuzu yaparak unutulmaz bir seyahat
                              deneyimi yaşayın.
                            </p>
                            <Button
                              type="primary"
                              onClick={() => navigate("/turlar")}
                            >
                              Turları Keşfet
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Rezervasyon İptal Modal'ı */}
      <Modal
        title="Rezervasyon İptali"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCancelModalVisible(false)}>
            Vazgeç
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleCancelBooking}
          >
            Evet, İptal Et
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <Alert
              message="Dikkat"
              description={
                <div>
                  <p className="mb-2">
                    <strong>{selectedBooking.tourTitle}</strong> turu için
                    yapmış olduğunuz rezervasyonu iptal etmek istediğinize emin
                    misiniz?
                  </p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>
                      Rezervasyon numarası: {selectedBooking.bookingNumber}
                    </li>
                    <li>Seyahat tarihi: {selectedBooking.travelDate}</li>
                    <li>Kişi sayısı: {selectedBooking.persons}</li>
                    <li>Toplam tutar: {selectedBooking.totalPrice} TL</li>
                  </ul>
                  <p className="mt-3 text-red-600 font-medium">
                    İptal işleminden sonra ödemeniz iade edilecektir.
                  </p>
                </div>
              }
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
            />
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Profile;
