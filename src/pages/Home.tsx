import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Layout, Tag, Button, Spin, Alert } from "antd";
const { Content } = Layout;
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  StarFilled,
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import HeroBanner from "../components/banner";
import { tourService, Tour } from "../services/tourService";
import { useTranslation } from "react-i18next";

const { Meta } = Card;

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Anasayfada gösterilecek tur sayısı
  const TOURS_TO_DISPLAY = 12;

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = "Ana Sayfa | GuiaOgi";
  }, []);

  // API'den turları çek
useEffect(() => {
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // LocalStorage'dan turları çek
      const data = await tourService.getAllTours();
      // Yeni eklenen turlar üstte gösterilsin (ID'ye göre ters sıralama)
      const sortedData = data.sort((a, b) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
        const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
        return idB - idA; // Büyükten küçüğe (yeni turlar üstte)
      });
      setTours(sortedData);
      
    } catch (err: any) {
      console.error("Turlar yüklenirken hata:", err);
      setError("Turlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      
      // Hata durumunda bile mock verileri göster
      const mockTours = await tourService.getAllTours();
      // Yeni eklenen turlar üstte gösterilsin (ID'ye göre ters sıralama)
      const sortedMockTours = mockTours.sort((a, b) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id) || 0 : a.id;
        const idB = typeof b.id === 'string' ? parseInt(b.id) || 0 : b.id;
        return idB - idA; // Büyükten küçüğe (yeni turlar üstte)
      });
      setTours(sortedMockTours);
    } finally {
      setLoading(false);
    }
  };

  fetchTours();
}, []);

  const features = [
    {
      icon: <SafetyOutlined />,
      title: t("home.safeTravel"),
      description: t("home.safeTravelDesc"),
    },
    {
      icon: <ClockCircleOutlined />,
      title: t("home.support24"),
      description: t("home.support24Desc"),
    },
    {
      icon: <CheckCircleOutlined />,
      title: t("home.qualityGuarantee"),
      description: t("home.qualityGuaranteeDesc"),
    },
    {
      icon: <UserOutlined />,
      title: t("home.expertGuides"),
      description: t("home.expertGuidesDesc"),
    },
  ];

  const whyChooseUs = [
    "20+ " + t("home.yearsExperience"),
    "5000+ " + t("home.happyCustomers"),
    "50+ " + t("home.tourOptions"),
    "%98 " + t("home.satisfactionRate"),
    t("home.ecoPrinciples"),
    t("home.customTourPlanning"),
  ];

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip={t('home.loadingTours')} />
      </div>
    );
  }

  // Error durumu
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert
          message={t('home.error')}
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              {t('home.tryAgain')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-white">
      <Content className="h-full">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Welcome Section */}
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {t("home.welcomeTitle")}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {t("home.welcomeDesc")}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {whyChooseUs.map((item, index) => (
                  <Tag
                    key={index}
                    className="bg-gray-50 text-gray-700 border-gray-200 text-sm py-1 px-3"
                  >
                    ✓ {item}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {t("home.whyChooseUsTitle")}
              </h2>
              <p className="text-gray-600">
                {t("home.whyChooseUsSubtitle")}
              </p>
            </div>

            <Row gutter={[24, 24]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <div className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 border border-gray-200 h-full">
                    <div className="text-3xl text-blue-600 mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Tours Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {t('home.featuredTours')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('home.featuredToursDesc')}
              </p>
            </div>

            <Row gutter={[16, 16]}>
              {tours.slice(0, TOURS_TO_DISPLAY).map((tour) => (
                <Col xs={24} sm={12} md={12} lg={8} xl={6} key={tour.id}>
                  <Card
                    className="tour-card w-full hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-lg bg-white"
                    cover={
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      >
                        <img
                          alt={tour.title}
                          src={tour.coverImage}
                          className="h-48 w-full object-cover rounded-t-lg"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=250&q=80";
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <Tag color="blue" className="text-xs font-medium">
                            {tour.category}
                          </Tag>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Tag color="green" className="text-xs font-medium">
                            {tour.specialOffer}
                          </Tag>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded text-xs">
                            <StarFilled className="text-yellow-400 mr-1" />
                            <span>{tour.rating}</span>
                            <span className="ml-1">({tour.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    }
                    actions={[
                      <div key="info" className="text-center px-2">
                        <Button
                          type="primary"
                          block
                          className="bg-blue-600 hover:bg-blue-700 font-medium"
                          onClick={() => navigate(`/tour/${tour.id}`)}
                        >
                          {t('home.viewDetails')}
                        </Button>
                      </div>,
                    ]}
                  >
                    <Meta
                      title={
                        <div className="flex justify-between items-start">
                          <span className="text-base font-semibold text-gray-800">
                            {tour.title}
                          </span>
                        </div>
                      }
                      description={
                        <div className="space-y-3 mt-2">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {tour.description}
                          </p>

                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <EnvironmentOutlined className="mr-2 text-blue-500" />
                              <span className="truncate font-medium">
                                {tour.location}
                              </span>
                            </div>

                            <div className="flex items-center text-xs text-gray-500">
                              <CalendarOutlined className="mr-2 text-green-500" />
                              <span>{tour.duration}</span>
                              <span className="mx-2">•</span>
                              <UserOutlined className="mr-1 text-purple-500" />
                              <span>{tour.groupSize}</span>
                            </div>
                          </div>

                          {/* Tur Özellikleri */}
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              {t('home.tourHighlights')}:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {tour.highlights.slice(0, 3).map((highlight, index) => (
                                <Tag
                                  key={index}
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs m-0"
                                >
                                  {highlight}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* Gösterilen tur sayısı */}
            <div className="mt-8 text-center text-gray-500 text-sm">
              {Math.min(tours.length, TOURS_TO_DISPLAY)} {t("home.toursShowing")}
              {tours.length > TOURS_TO_DISPLAY && ` (${t("home.totalTours")} ${tours.length})`}
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {t("home.trustIndicator")}
              </h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t("home.trustIndicatorDesc")}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  20+
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {t("home.yearsExperience")}
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {tours.length}+
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {t("home.tourOptions")}
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  5000+
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {t("home.happyCustomers")}
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  %98
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {t("home.satisfactionRate")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="relative py-16 md:py-20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/70" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                {t("home.dreamVacationTitle")}
              </h2>

              <p className="text-gray-200 text-lg leading-relaxed mb-8">
                {t("home.dreamVacationDesc")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="bg-white text-gray-900 hover:bg-gray-100 border-white hover:border-gray-100 h-12 px-8 font-semibold"
                  onClick={() => window.open('tel:02121234567')}
                >
                  {t('home.callNow')}
                </Button>
                <Button
                  size="large"
                  className="bg-transparent text-white hover:bg-white/20 border-2 border-white h-12 px-8 font-semibold"
                  onClick={() => navigate('/iletisim')}
                >
                  {t('home.requestQuote')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {t("home.howItWorks")}
              </h2>
              <p className="text-gray-600">
                {t("home.howItWorksDesc")}
              </p>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-700">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{t("home.step1Title")}</h3>
                  <p className="text-gray-600">
                    {t("home.step1Desc")}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-700">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{t("home.step2Title")}</h3>
                  <p className="text-gray-600">
                    {t("home.step2Desc")}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-gray-700">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">
                    {t("home.step3Title")}
                  </h3>
                  <p className="text-gray-600">
                    {t("home.step3Desc")}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t('home.customPackagesTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('home.customPackagesDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700 h-12 px-8 font-semibold"
                  onClick={() => window.open('tel:02121234567')}
                >
                  📞 0 (212) 123 45 67
                </Button>
                <Button
                  size="large"
                  className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700 h-12 px-8 font-semibold bg-white"
                  onClick={() => navigate('/iletisim')}
                >
                  ✉️ info@guiaogi.com
                </Button> 
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;