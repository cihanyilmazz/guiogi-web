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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <div className="text-center">
            <LockOutlined className="text-yellow-500 text-2xl sm:text-3xl mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
              Fiyatı Görmek İçin Giriş Yapın
            </h3>
            <p className="text-yellow-600 text-sm sm:text-base mb-3 sm:mb-4">
              Tur fiyatlarını görmek ve rezervasyon yapmak için giriş
              yapmalısınız.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Button
                type="primary"
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                onClick={() => setLoginModalVisible(true)}
              >
                Giriş Yap
              </Button>
              <Button
                className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700 w-full sm:w-auto"
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
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {tour?.discount ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center">
                <span className="line-through text-gray-400 text-xl sm:text-2xl mr-2">
                  {tour.price} TL
                </span>
                <span className="text-red-600">
                  {Math.round(tour.price! * (1 - tour.discount / 100))} TL
                </span>
              </div>
              <Tag color="red" className="text-xs sm:text-sm">
                %{tour.discount} İNDİRİM
              </Tag>
            </div>
          ) : (
            `${tour?.price} TL`
          )}
        </div>
        <div className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4">Kişi Başı</div>
        <Button
          type="primary"
          size="large"
          block
          className="bg-blue-600 hover:bg-blue-700 h-10 sm:h-12 text-base sm:text-lg font-semibold"
          onClick={handleBookTour}
        >
          Şimdi Rezervasyon Yap
        </Button>
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
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
        {/* Tur Detayları */}
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Geri Dön Butonu */}
          <div className="mb-4 sm:mb-6">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md transition-all duration-200 px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium rounded-lg"
              size="middle"
            >
              Geri Dön
            </Button>
          </div>
          {/* Ana Bilgiler */}
          <Card 
            className="mb-4 sm:mb-6 md:mb-8 [&_.ant-card-body]:p-4 sm:[&_.ant-card-body]:p-6" 
          >
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
              {/* Tur Görseli */}
              <div className="w-full lg:w-2/3">
                <img
                  src={tour.coverImage}
                  alt={tour.title}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('placeholder')) {
                      target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
                    }
                  }}
                />

                {/* Küçük Bilgiler */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <Tag color="blue" className="text-xs sm:text-sm md:text-base py-1 px-2 sm:px-3">
                    {tour.category}
                  </Tag>
                  <Tag color="green" className="text-xs sm:text-sm md:text-base py-1 px-2 sm:px-3">
                    {tour.specialOffer}
                  </Tag>
                  <Tag color="orange" className="text-xs sm:text-sm md:text-base py-1 px-2 sm:px-3">
                    {tour.season} Mevsimi
                  </Tag>
                  <div className="flex items-center w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                    <StarFilled className="text-yellow-500 text-base sm:text-lg md:text-xl mr-1" />
                    <span className="text-sm sm:text-base md:text-lg font-bold">{tour.rating}</span>
                    <span className="text-gray-500 text-xs sm:text-sm md:text-base ml-1">
                      ({tour.reviewCount} yorum)
                    </span>
                  </div>
                </div>
              </div>

              {/* Tur Bilgileri */}
              <div className="w-full lg:w-1/3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {tour.title}
                </h1>

                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start">
                    <EnvironmentOutlined className="text-blue-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm md:text-base">Lokasyon</div>
                      <div className="text-gray-600 text-xs sm:text-sm md:text-base break-words">{tour.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CalendarOutlined className="text-green-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm md:text-base">Süre</div>
                      <div className="text-gray-600 text-xs sm:text-sm md:text-base break-words">{tour.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <UserOutlined className="text-purple-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm md:text-base">Grup Büyüklüğü</div>
                      <div className="text-gray-600 text-xs sm:text-sm md:text-base break-words">{tour.groupSize}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <UserOutlined className="text-orange-500 text-base sm:text-lg md:text-xl mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm md:text-base">Rehber</div>
                      <div className="text-gray-600 text-xs sm:text-sm md:text-base break-words">{tour.guide}</div>
                    </div>
                  </div>
                </div>

                {/* Fiyat ve Rezervasyon - GÜNCELLENDİ */}
                {showPriceInfo()}
              </div>
            </div>
          </Card>

          {/* Detaylı Bilgiler Tabs */}
          <Tabs 
            defaultActiveKey="1" 
            className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow"
            tabBarStyle={{ marginBottom: '16px' }}
            size="small"
          >
            <TabPane tab="Tur Açıklaması" key="1">
              <div className="prose max-w-none">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Tur Hakkında</h3>
                <div className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed space-y-3 sm:space-y-4">
                  <p>{tour.description}</p>
                  <p>
                    Bu tur, deneyimli rehberlerimiz eşliğinde gerçekleştirilmektedir. 
                    Tüm güvenlik önlemleri alınmış olup, sigorta kapsamındadır. 
                    Grup halinde yapılan bu turda, diğer katılımcılarla birlikte unutulmaz anılar biriktireceksiniz.
                  </p>
                  <p>
                    Tur süresince konforlu ulaşım araçları kullanılmakta, tüm giriş ücretleri 
                    ve rehberlik hizmetleri paket fiyata dahildir. Özel diyet gereksinimleriniz varsa 
                    lütfen rezervasyon sırasında belirtiniz.
                  </p>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Önemli Notlar:</h4>
                    <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-blue-800 text-xs sm:text-sm md:text-base">
                      <li>Tur başlangıç saatinden 15 dakika önce buluşma noktasında olmanız gerekmektedir.</li>
                      <li>Rahat yürüyüş ayakkabıları ve mevsim koşullarına uygun kıyafetler getirmenizi öneririz.</li>
                      <li>Fotoğraf çekimi için kamera veya telefon getirebilirsiniz.</li>
                      <li>Tur süresince rehberimizin talimatlarına uymanız güvenliğiniz için önemlidir.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane tab="Tur Programı" key="2">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Tur Programı</h3>
                <List
                  dataSource={tour.highlights}
                  renderItem={(item, index) => {
                    // Her highlight için uygun açıklama oluştur
                    const getDescription = (highlight: string, tourTitle: string) => {
                      const highlightLower = highlight.toLowerCase();
                      const titleLower = tourTitle.toLowerCase();
                      
                      // Kapadokya turları için
                      if (titleLower.includes('kapadokya') || titleLower.includes('balon')) {
                        if (highlightLower.includes('gün doğumu') || highlightLower.includes('güneş')) {
                          return "Sabahın erken saatlerinde sıcak hava balonları ile gökyüzüne yükselerek eşsiz gün doğumu manzarasını izleyeceksiniz. Binlerce balonun gökyüzünü süslediği bu muhteşem anı fotoğraflayabilirsiniz.";
                        }
                        if (highlightLower.includes('peri bacası') || highlightLower.includes('peri')) {
                          return "Kapadokya'nın eşsiz peri bacalarını yakından görme fırsatı. Milyonlarca yıllık doğal oluşumların arasında yürüyüş yaparak bölgenin jeolojik yapısını keşfedeceksiniz.";
                        }
                        if (highlightLower.includes('açık hava') || highlightLower.includes('müze')) {
                          return "Göreme Açık Hava Müzesi'nde kayalara oyulmuş kiliseleri ve manastırları ziyaret edeceksiniz. Bizans döneminden kalma freskler ve tarihi yapıları görme şansı.";
                        }
                        if (highlightLower.includes('yeraltı') || highlightLower.includes('şehir')) {
                          return "Derinkuyu veya Kaymaklı Yeraltı Şehri'ni keşfederek antik dönemlerde insanların nasıl yaşadığını öğreneceksiniz. Tüneller, odalar ve yaşam alanlarını gezeceksiniz.";
                        }
                      }
                      
                      // Pamukkale turları için
                      if (titleLower.includes('pamukkale') || titleLower.includes('termal')) {
                        if (highlightLower.includes('traverten') || highlightLower.includes('beyaz')) {
                          return "Pamukkale'nin dünyaca ünlü beyaz travertenlerinde yürüyüş yaparak doğal termal suların oluşturduğu eşsiz manzarayı keşfedeceksiniz. Ayaklarınızı termal suya sokarak rahatlayabilirsiniz.";
                        }
                        if (highlightLower.includes('antik') || highlightLower.includes('havuz')) {
                          return "Hierapolis Antik Kenti'ndeki antik havuzda yüzme fırsatı. Kleopatra'nın da yüzdüğü bu havuzda tarihi sütunlar arasında yüzmenin keyfini çıkaracaksınız.";
                        }
                        if (highlightLower.includes('hierapolis')) {
                          return "Hierapolis Antik Kenti'ni gezerek Roma döneminden kalma tiyatro, hamam ve nekropol alanlarını keşfedeceksiniz. Tarihi yapıların büyüleyici atmosferini yaşayacaksınız.";
                        }
                      }
                      
                      // Efes turları için
                      if (titleLower.includes('efes')) {
                        if (highlightLower.includes('kütüphane') || highlightLower.includes('celsus')) {
                          return "Efes'in simgesi olan Celsus Kütüphanesi'ni ziyaret ederek antik dönemin en büyük kütüphanelerinden birini göreceksiniz. İki katlı görkemli yapının mimarisini inceleyeceksiniz.";
                        }
                        if (highlightLower.includes('tiyatro') || highlightLower.includes('büyük')) {
                          return "25.000 kişilik Büyük Tiyatro'yu gezerek antik dönemdeki gösterilerin nasıl yapıldığını öğreneceksiniz. Akustiğin mükemmelliğini deneyimleyeceksiniz.";
                        }
                        if (highlightLower.includes('meryem ana')) {
                          return "Meryem Ana Evi'ni ziyaret ederek Hristiyanlık için kutsal sayılan bu mekanı göreceksiniz. Huzurlu atmosferi ve doğal çevresiyle unutulmaz bir deneyim.";
                        }
                      }
                      
                      // İstanbul turları için
                      if (titleLower.includes('istanbul') || titleLower.includes('boğaz')) {
                        if (highlightLower.includes('boğaz') || highlightLower.includes('köprü')) {
                          return "Boğaz Köprüsü'nün altından geçerek İstanbul'un iki yakasını birbirine bağlayan bu muhteşem yapıyı yakından göreceksiniz. Asya ve Avrupa kıtalarını bir arada görme fırsatı.";
                        }
                        if (highlightLower.includes('dolmabahçe') || highlightLower.includes('saray')) {
                          return "Dolmabahçe Sarayı'nın önünden geçerek Osmanlı döneminin ihtişamını göreceksiniz. Barok ve Rokoko mimarisinin en güzel örneklerinden birini izleyeceksiniz.";
                        }
                        if (highlightLower.includes('kız kulesi')) {
                          return "Kız Kulesi'ni yakından görerek İstanbul'un efsanevi simgelerinden birini keşfedeceksiniz. Boğaz'ın ortasındaki bu tarihi yapının hikayesini dinleyeceksiniz.";
                        }
                      }
                      
                      // Genel açıklamalar
                      if (highlightLower.includes('yürüyüş') || highlightLower.includes('doğa')) {
                        return "Rehber eşliğinde doğa yürüyüşü yaparak bölgenin doğal güzelliklerini keşfedeceksiniz. Temiz hava ve muhteşem manzaralar eşliğinde unutulmaz bir deneyim.";
                      }
                      if (highlightLower.includes('fotoğraf') || highlightLower.includes('çekim')) {
                        return "Profesyonel fotoğraf çekimi için özel olarak belirlenmiş noktalarda durarak eşsiz anılarınızı ölümsüzleştireceksiniz. En güzel kareleri yakalama fırsatı.";
                      }
                      if (highlightLower.includes('yemek') || highlightLower.includes('kahvaltı')) {
                        return "Yöresel lezzetlerden oluşan özel menü ile damak zevkinize hitap edecek bir yemek deneyimi. Taze malzemelerle hazırlanmış geleneksel tatları keşfedeceksiniz.";
                      }
                      if (highlightLower.includes('konaklama')) {
                        return "Rahat ve konforlu konaklama imkanı. Bölgenin en iyi otellerinden birinde geceyi geçirerek ertesi güne dinlenmiş olarak başlayacaksınız.";
                      }
                      
                      // Varsayılan açıklama
                      return `${item} aktivitesi ile ilgili detaylı bilgi ve rehber eşliğinde keşif. Bu özel deneyim ile bölgenin en önemli özelliklerinden birini yakından tanıma fırsatı bulacaksınız.`;
                    };
                    
                    return (
                      <List.Item className="px-0 sm:px-4">
                        <div className="flex items-start w-full">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 text-xs sm:text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 break-words">{item}</div>
                            <div className="text-gray-600 text-sm sm:text-base leading-relaxed break-words">
                              {getDescription(item, tour.title)}
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </div>
            </TabPane>

            <TabPane tab="Dahil Olanlar" key="3">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
                  Pakete Dahil Olanlar
                </h3>
                {(tour.included?.length ?? 0) > 0 ? (
                  <Row gutter={[12, 12]} className="sm:gutter-[16px]">
                    {tour.included?.map((item, index) => (
                      <Col xs={24} sm={12} md={8} lg={8} key={index}>
                        <div className="flex items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                          <CheckCircleOutlined className="text-green-500 text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-sm sm:text-base break-words">{item}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div className="text-center p-6 sm:p-8 text-gray-500 text-sm sm:text-base">
                    Bu tur için dahil olanlar listesi bulunmamaktadır.
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Benzer Turlar - Sayfanın En Altı */}
        {relatedTours.length > 0 && (
          <div className="bg-white py-6 sm:py-8 md:py-12 mt-6 sm:mt-8 md:mt-12">
            <div className="container mx-auto px-3 sm:px-4 md:px-6">
              <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Benzer Turlar
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Aynı kategorideki diğer turları keşfedin
                </p>
              </div>

              <Row gutter={[16, 16]} className="sm:gutter-[24px]">
                {relatedTours.map((relatedTour) => (
                  <Col xs={24} sm={12} md={12} lg={8} xl={6} key={relatedTour.id}>
                    <Card
                      hoverable
                      className="h-full shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden border-0"
                      cover={
                        <div className="relative overflow-hidden">
                          <img
                            alt={relatedTour.title}
                            src={relatedTour.coverImage}
                            className="h-48 sm:h-56 w-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('placeholder')) {
                                target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
                              }
                            }}
                          />
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                            <Tag color="red" className="text-xs sm:text-sm font-semibold">
                              {relatedTour.specialOffer}
                            </Tag>
                          </div>
                          {relatedTour.discount && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                              <Tag color="red" className="text-xs sm:text-sm font-bold">
                                %{relatedTour.discount} İndirim
                              </Tag>
                            </div>
                          )}
                        </div>
                      }
                      onClick={() => navigate(`/tour/${relatedTour.id}`)}
                    >
                      <div className="space-y-2 sm:space-y-3 p-2 sm:p-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2 break-words">
                            {relatedTour.title}
                          </h3>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                            <EnvironmentOutlined className="mr-1 sm:mr-1.5 text-blue-500 text-xs sm:text-sm" />
                            <span className="truncate">{relatedTour.location}</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                            <CalendarOutlined className="mr-1 sm:mr-1.5 text-green-500 text-xs sm:text-sm" />
                            <span>{relatedTour.duration}</span>
                          </div>
                        </div>

                        <Divider className="my-2 sm:my-3" />

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center">
                            <StarFilled className="text-yellow-500 text-base sm:text-lg mr-1" />
                            <span className="font-semibold text-gray-800 text-sm sm:text-base">
                              {relatedTour.rating}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm ml-1">
                              ({relatedTour.reviewCount})
                            </span>
                          </div>
                          <Tag color="blue" className="text-xs">
                            {relatedTour.category}
                          </Tag>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          {isAuthenticated ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                              <div className="flex-1 min-w-0">
                                {relatedTour.discount ? (
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                    <span className="line-through text-gray-400 text-xs sm:text-sm">
                                      {relatedTour.price} TL
                                    </span>
                                    <span className="text-blue-600 font-bold text-base sm:text-lg">
                                      {Math.round(
                                        relatedTour.price! *
                                          (1 - relatedTour.discount / 100)
                                      )}{" "}
                                      TL
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-blue-600 font-bold text-base sm:text-lg">
                                    {relatedTour.price
                                      ? `${relatedTour.price} TL`
                                      : "Fiyat bilgisi yok"}
                                  </span>
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                  Kişi başı
                                </div>
                              </div>
                              <Button
                                type="primary"
                                size="small"
                                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/tour/${relatedTour.id}`);
                                }}
                              >
                                Detaylar
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-gray-500 text-xs sm:text-sm mb-2">
                                Fiyatı görmek için giriş yapın
                              </p>
                              <Button
                                type="default"
                                size="small"
                                block
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLoginModalVisible(true);
                                }}
                              >
                                Giriş Yap
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}
      </Content>

      {/* Giriş Modalı */}
      <Modal
        title="Giriş Yap"
        open={loginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
        destroyOnClose
        width="90%"
        style={{ maxWidth: '400px' }}
        className="mobile-modal"
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
        width="90%"
        style={{ maxWidth: '400px' }}
        className="mobile-modal"
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
