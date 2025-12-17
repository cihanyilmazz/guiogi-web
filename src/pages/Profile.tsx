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
import { bookingService } from "../services/bookingService";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      message.warning(t("profile.mustLogin"));
      navigate("/giris");
    }
  }, [isAuthenticated, navigate, t]);

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

  // Rezervasyonları yükle (API'den)
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      setBookingsLoading(true);
      try {
        const userBookings = await bookingService.getUserBookings(user.id);
        setBookings(userBookings);
      } catch (error) {
        console.error("Rezervasyonlar yüklenirken hata:", error);
        message.error("Rezervasyonlar yüklenirken bir hata oluştu");
      } finally {
        setBookingsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [user, isAuthenticated]);

  // Profil bilgilerini kaydet
  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      // Burada API'ye profil güncelleme isteği gönderilecek
      await updateUser({
        ...user,
        ...values,
      });

      message.success(t("profile.updateSuccess"));
      setEditMode(false);
    } catch (error) {
      message.error(t("profile.updateError"));
    } finally {
      setLoading(false);
    }
  };

  // Rezervasyon iptal et
  const handleCancelBooking = async () => {
    if (!selectedBooking || !user?.id) {
      message.error(t("profile.cancelError"));
      return;
    }

    const bookingId = selectedBooking.id;
    const bookingNumber = selectedBooking.bookingNumber;

    setBookingsLoading(true);
    try {
      console.log('İptal ediliyor:', bookingId, user.id);
      
      // API çağrısını yap
      await bookingService.cancelBooking(bookingId, user.id);
      
      // Rezervasyonları yeniden yükle (güncel veriyi almak için)
      const userBookings = await bookingService.getUserBookings(user.id);
      setBookings(userBookings);
      
      message.success({
        content: `${t("profile.bookingNumber")} #${bookingNumber} ${t("profile.status.cancelled")}. ${t("profile.cancelledReservations")} ${t("profile.viewDetails")}.`,
        duration: 4,
      });
      
      setCancelModalVisible(false);
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('İptal hatası:', error);
      
      const errorMessage = error.message || t("profile.cancelError");
      message.error(errorMessage);
      
      // Hata durumunda rezervasyonları yeniden yükle
      try {
        const userBookings = await bookingService.getUserBookings(user.id);
        setBookings(userBookings);
      } catch (reloadError) {
        console.error('Rezervasyonlar yeniden yüklenirken hata:', reloadError);
      }
      
      setCancelModalVisible(false);
      setSelectedBooking(null);
    } finally {
      setBookingsLoading(false);
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
        return <Tag color="green">{t("profile.status.confirmed")}</Tag>;
      case "pending":
        return <Tag color="orange">{t("profile.status.pending")}</Tag>;
      case "cancelled":
        return <Tag color="red">{t("profile.status.cancelled")}</Tag>;
      case "completed":
        return <Tag color="blue">{t("profile.status.completed")}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Ödeme durumu etiketi
  const getPaymentTag = (status: string) => {
    switch (status) {
      case "paid":
        return <Tag color="success">{t("profile.payment.paid")}</Tag>;
      case "pending":
        return <Tag color="warning">{t("profile.payment.pending")}</Tag>;
      case "refunded":
        return <Tag color="default">{t("profile.payment.refunded")}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Aktif rezervasyonları filtrele
  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  );

  // Geçmiş rezervasyonları filtrele (sadece tamamlananlar)
  const pastBookings = bookings.filter(
    (b) => b.status === "completed",
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
            <h1 className="text-3xl font-bold text-gray-800">{t("profile.title")}</h1>
            <p className="text-gray-600">
              {t("profile.subtitle")}
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
                      {t("profile.premiumMember")}
                    </Tag>
                  </div>
                </div>

                <Divider />

                {/* Hızlı İstatistikler */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">{t("profile.totalReservations")}</span>
                    <span className="font-bold text-gray-800 text-lg">
                      {bookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">{t("profile.activeReservations")}</span>
                    <span className="font-bold text-green-600 text-lg">
                      {bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">{t("profile.completed")}</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {bookings.filter((b) => b.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">{t("profile.cancelled")}</span>
                    <span className="font-bold text-red-600 text-lg">
                      {bookings.filter((b) => b.status === "cancelled").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600 font-medium">{t("profile.membershipDate")}</span>
                    <span className="text-gray-800 font-semibold">
                      {user?.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('tr-TR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })
                        : t("profile.unknown")}
                    </span>
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
                        {t("profile.personalInfo")}
                      </span>
                    }
                    key="profile"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">
                        {t("profile.personalInfo")}
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
                        {editMode ? t("profile.save") : t("profile.edit")}
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
                            label={t("profile.name")}
                            rules={[
                              {
                                required: true,
                                message: t("profile.nameRequired"),
                              },
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined />}
                              placeholder={t("profile.namePlaceholder")}
                            />
                          </Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Item
                            name="email"
                            label={t("profile.email")}
                            rules={[
                              {
                                required: true,
                                message: t("profile.emailRequired"),
                              },
                              {
                                type: "email",
                                message: t("profile.emailInvalid"),
                              },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined />}
                              placeholder={t("profile.emailPlaceholder")}
                              type="email"
                            />
                          </Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Item name="phone" label={t("profile.phone")}>
                            <Input
                              prefix={<PhoneOutlined />}
                              placeholder={t("profile.phonePlaceholder")}
                            />
                          </Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Item name="address" label={t("profile.address")}>
                            <Input
                              prefix={<EnvironmentOutlined />}
                              placeholder={t("profile.addressPlaceholder")}
                            />
                          </Item>
                        </Col>
                      </Row>

                      <Item name="preferences" label={t("profile.preferences")}>
                        <Input.TextArea
                          rows={3}
                          placeholder={t("profile.preferencesPlaceholder")}
                        />
                      </Item>

                      {editMode && (
                        <div className="flex justify-end space-x-3 mt-6">
                          <Button onClick={() => setEditMode(false)}>
                            {t("profile.cancel")}
                          </Button>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                          >
                            {t("profile.update")}
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
                        {t("profile.myReservations")}
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
                          {t("profile.loadingReservations")}
                        </p>
                      </div>
                    ) : (
                      <div>
                        {/* Aktif Rezervasyonlar */}
                        {activeBookings.length > 0 && (
                          <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              {t("profile.activeReservationsTitle")}
                            </h4>
                            <List
                              dataSource={activeBookings}
                              renderItem={(booking) => (
                                <List.Item
                                  actions={[
                                    <Button
                                      key="detail"
                                      type="link"
                                      onClick={() => goToTourDetail(booking.tourId)}
                                    >
                                      {t("profile.tourDetail")}
                                    </Button>,
                                    (booking.status === "confirmed" || booking.status === "pending") && (
                                      <Button
                                        key="cancel"
                                        danger
                                        type="link"
                                        onClick={() => {
                                          setSelectedBooking(booking);
                                          setCancelModalVisible(true);
                                        }}
                                      >
                                        {t("profile.cancelReservation")}
                                      </Button>
                                    ),
                                  ].filter(Boolean)}
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

                        {/* İptal Edilen Rezervasyonlar */}
                        <div className="mt-8">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            {t("profile.cancelledReservations")}
                          </h4>
                          {bookings.filter(b => b.status === 'cancelled').length > 0 ? (
                            <List
                              dataSource={bookings.filter(b => b.status === 'cancelled')}
                              renderItem={(booking) => (
                                <List.Item
                                  actions={[
                                    <Button
                                      key="detail"
                                      type="link"
                                      onClick={() => goToTourDetail(booking.tourId)}
                                    >
                                      Tur Detayı
                                    </Button>,
                                    <Button
                                      key="booking-detail"
                                      type="link"
                                      onClick={() => goToBookingDetail(booking)}
                                    >
                                      Detayları Gör
                                    </Button>,
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
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <CloseCircleOutlined className="text-3xl text-gray-300 mb-3" />
                              <p className="text-gray-500">
                                {t("profile.noCancelledReservations")}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Geçmiş Rezervasyonlar (Tamamlanan) */}
                        {bookings.filter(b => b.status === 'completed').length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                              {t("profile.pastReservations")}
                            </h4>
                            <List
                              dataSource={bookings.filter(b => b.status === 'completed')}
                              renderItem={(booking) => (
                                <List.Item
                                  actions={[
                                    <Button
                                      key="detail"
                                      type="link"
                                      onClick={() => goToTourDetail(booking.tourId)}
                                    >
                                      Tur Detayı
                                    </Button>,
                                    <Button
                                      key="booking-detail"
                                      type="link"
                                      onClick={() => goToBookingDetail(booking)}
                                    >
                                      Detayları Gör
                                    </Button>,
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

                        {/* Rezervasyon yoksa */}
                        {bookings.length === 0 && (
                          <div className="text-center py-12">
                            <HistoryOutlined className="text-4xl text-gray-300 mb-4" />
                            <h4 className="text-lg font-medium text-gray-600 mb-2">
                              {t("profile.noReservationsYet")}
                            </h4>
                            <p className="text-gray-500 mb-6">
                              {t("profile.noReservationsDesc")}
                            </p>
                            <Button
                              type="primary"
                              onClick={() => navigate("/turlar")}
                            >
                              {t("profile.exploreTours")}
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
        title={t("profile.reservationCancel")}
        open={cancelModalVisible}
        onCancel={() => {
          setCancelModalVisible(false);
          setSelectedBooking(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setCancelModalVisible(false);
              setSelectedBooking(null);
            }}
          >
            {t("profile.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={(e) => {
              e.preventDefault();
              handleCancelBooking();
            }}
          >
            {t("profile.cancelButton")}
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <Alert
              message={t("profile.reservationCancel")}
              description={
                <div>
                  <p className="mb-2">
                    <strong>{selectedBooking.tourTitle}</strong> {t("profile.cancelConfirm")}
                  </p>
                  <ul className="list-disc pl-5 text-gray-600">
                    <li>
                      {t("profile.reservationNumber")} {selectedBooking.bookingNumber}
                    </li>
                    <li>{t("profile.travelDate")} {selectedBooking.travelDate}</li>
                    <li>{t("profile.persons")}: {selectedBooking.persons}</li>
                    <li>{t("profile.totalAmount")} {selectedBooking.totalPrice} TL</li>
                  </ul>
                  <p className="mt-3 text-red-600 font-medium">
                    {t("profile.refundNote")}
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
