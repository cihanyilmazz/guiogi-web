import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  DatePicker, 
  InputNumber, 
  message, 
  Spin,
  Alert,
  Divider
} from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  DollarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { tourService, Tour } from '../services/tourService';
import { bookingService, Booking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

const { TextArea } = Input;

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [form] = Form.useForm();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [persons, setPersons] = useState<number>(1);
  const [travelDate, setTravelDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Rezervasyon yapmak için giriş yapmalısınız.');
      navigate('/giris');
      return;
    }

    const fetchTour = async () => {
      try {
        setLoading(true);
        const tourId = location.state?.tourId || new URLSearchParams(location.search).get('tourId');
        
        if (!tourId) {
          setError('Tur bilgisi bulunamadı');
          setLoading(false);
          return;
        }

        const tourData = await tourService.getTourById(parseInt(tourId));
        setTour(tourData);
        
        // Form varsayılan değerlerini ayarla
        form.setFieldsValue({
          persons: 1,
        });
      } catch (err: any) {
        console.error('Tur yüklenirken hata:', err);
        setError(err.message || 'Tur bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [location, isAuthenticated, navigate, form]);

  const calculateTotalPrice = (): number => {
    if (!tour || !tour.price) return 0;
    
    const basePrice = tour.price;
    const discount = tour.discount || 0;
    const discountedPrice = discount > 0 
      ? Math.round(basePrice * (1 - discount / 100))
      : basePrice;
    
    return discountedPrice * persons;
  };

  const handleSubmit = async (values: any) => {
    if (!tour || !user) return;

    try {
      setSubmitting(true);

      const bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'> = {
        userId: user.id,
        tourId: tour.id,
        tourTitle: tour.title,
        tourImage: tour.coverImage,
        bookingDate: dayjs().format('YYYY-MM-DD'),
        travelDate: travelDate ? travelDate.format('YYYY-MM-DD') : dayjs().add(7, 'day').format('YYYY-MM-DD'),
        persons: values.persons || 1,
        totalPrice: calculateTotalPrice(),
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: values.specialRequests || '',
      };

      const newBooking = await bookingService.createBooking(bookingData);
      
      message.success('Rezervasyonunuz başarıyla oluşturuldu!');
      navigate('/profil', { 
        state: { 
          bookingNumber: newBooking.bookingNumber,
          success: true 
        } 
      });
    } catch (err: any) {
      console.error('Rezervasyon hatası:', err);
      message.error(err.message || 'Rezervasyon oluşturulurken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Tur bilgileri yükleniyor..." />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert
          message="Hata"
          description={error || 'Tur bulunamadı'}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/turlar')}>
              Turlara Dön
            </Button>
          }
        />
      </div>
    );
  }

  const basePrice = tour.price || 0;
  const discount = tour.discount || 0;
  const discountedPrice = discount > 0 
    ? Math.round(basePrice * (1 - discount / 100))
    : basePrice;
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Geri Dön Butonu */}
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          Geri Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sol Taraf - Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg rounded-xl border-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Rezervasyon Formu
              </h2>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  persons: 1,
                }}
              >
                {/* Tur Bilgileri Özeti */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">{tour.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <UserOutlined className="mr-2" />
                      <span>{tour.location}</span>
                    </div>
                  </div>
                </div>

                {/* Kişi Sayısı */}
                <Form.Item
                  label="Kişi Sayısı"
                  name="persons"
                  rules={[
                    { required: true, message: 'Lütfen kişi sayısını girin' },
                    { type: 'number', min: 1, max: 20, message: 'Kişi sayısı 1-20 arasında olmalıdır' }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={20}
                    className="w-full"
                    size="large"
                    onChange={(value) => setPersons(value || 1)}
                  />
                </Form.Item>

                {/* Seyahat Tarihi */}
                <Form.Item
                  label="Seyahat Tarihi"
                  name="travelDate"
                  rules={[
                    { required: true, message: 'Lütfen seyahat tarihini seçin' }
                  ]}
                >
                  <DatePicker
                    className="w-full"
                    size="large"
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                    onChange={(date) => setTravelDate(date)}
                  />
                </Form.Item>

                {/* Özel İstekler */}
                <Form.Item
                  label="Özel İstekler (Opsiyonel)"
                  name="specialRequests"
                >
                  <TextArea
                    rows={4}
                    placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                    className="resize-none"
                  />
                </Form.Item>

                {/* İletişim Bilgileri */}
                <Divider orientation="left" className="mt-8">
                  <span className="text-gray-700 font-semibold">İletişim Bilgileri</span>
                </Divider>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Ad Soyad:</strong> {user?.name}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <strong>E-posta:</strong> {user?.email}
                  </p>
                </div>

                {/* Gönder Butonu */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={submitting}
                    className="bg-[#9E0102] hover:bg-[#8B0000] h-12 text-lg font-semibold"
                  >
                    {submitting ? 'Rezervasyon Yapılıyor...' : 'Rezervasyonu Tamamla'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>

          {/* Sağ Taraf - Fiyat Özeti */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg rounded-xl border-0 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarOutlined className="mr-2 text-[#9E0102]" />
                Fiyat Özeti
              </h3>

              <div className="space-y-4">
                {/* Birim Fiyat */}
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Birim Fiyat</span>
                  <div className="text-right">
                    {discount > 0 ? (
                      <div>
                        <div className="line-through text-gray-400 text-sm">
                          {basePrice} TL
                        </div>
                        <div className="text-[#9E0102] font-semibold">
                          {discountedPrice} TL
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#9E0102] font-semibold">
                        {basePrice} TL
                      </span>
                    )}
                  </div>
                </div>

                {/* Kişi Sayısı */}
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Kişi Sayısı</span>
                  <span className="font-semibold text-gray-800">{persons}</span>
                </div>

                {/* İndirim */}
                {discount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">İndirim</span>
                    <span className="text-green-600 font-semibold">%{discount}</span>
                  </div>
                )}

                {/* Toplam */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                  <span className="text-lg font-bold text-gray-900">Toplam</span>
                  <span className="text-2xl font-bold text-[#9E0102]">
                    {totalPrice.toLocaleString('tr-TR')} TL
                  </span>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <CheckCircleOutlined className="text-green-600 text-lg mr-2 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">Güvenli Rezervasyon</p>
                      <p className="text-xs">
                        Rezervasyonunuz onaylandıktan sonra ödeme bilgileri e-posta adresinize gönderilecektir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

