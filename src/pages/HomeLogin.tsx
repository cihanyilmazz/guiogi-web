// pages/TourDetail.tsx - DÜZELTİLMİŞ VERSİYON
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
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StarFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { tourService, Tour } from "../services/tourService";
import { useTranslation } from "react-i18next";

const { Content } = Layout;
const { TabPane } = Tabs;

const TourDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);

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

        // Tur detaylarını getir
        const tourId = parseInt(id);
        const tourData = await tourService.getTourById(tourId);
        setTour(tourData);

        // İlgili turları getir
        const related = await tourService.getRelatedTours(
          tourData.category,
          tourId,
        );
        setRelatedTours(related);
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
    alert("Rezervasyon sayfasına yönlendiriliyorsunuz...");
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
                      <div className="font-medium">{t("homeLogin.location")}</div>
                      <div className="text-gray-600">{tour.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CalendarOutlined className="text-green-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">{t("homeLogin.duration")}</div>
                      <div className="text-gray-600">{tour.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <UserOutlined className="text-purple-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">{t("homeLogin.groupSize")}</div>
                      <div className="text-gray-600">{tour.groupSize}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <UserOutlined className="text-orange-500 text-xl mr-3" />
                    <div>
                      <div className="font-medium">{t("homeLogin.guide")}</div>
                      <div className="text-gray-600">{tour.guide}</div>
                    </div>
                  </div>
                </div>

                {/* Fiyat ve Rezervasyon */}
                {tour.price && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {tour.discount ? (
                        <>
                          <span className="line-through text-gray-400 text-2xl mr-2">
                            {tour.price} TL
                          </span>
                          <span className="text-red-600">
                            {Math.round(tour.price * (1 - tour.discount / 100))}{" "}
                            TL
                          </span>
                          <Tag color="red" className="ml-2">
                            %{tour.discount} İNDİRİM
                          </Tag>
                        </>
                      ) : (
                        `${tour.price} TL`
                      )}
                    </div>
                    <div className="text-gray-500 mb-4">{t("homeLogin.perPerson")}</div>
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
                      onClick={handleBookTour}
                    >
                      {t("homeLogin.bookNow")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Detaylı Bilgiler Tabs */}
          <Tabs defaultActiveKey="1" className="bg-white p-6 rounded-lg shadow">
            <TabPane tab={t("homeLogin.tourDescription")} key="1">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4">{t("homeLogin.aboutTour")}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {tour.description}
                </p>
              </div>
            </TabPane>

            <TabPane tab={t("homeLogin.tourProgram")} key="2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">{t("homeLogin.tourProgram")}</h3>
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
                            {t("homeLogin.activityDescription")}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>

            <TabPane tab={t("homeLogin.included")} key="3">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4">
                  {t("homeLogin.packageIncludes")}
                </h3>
                <Row gutter={[16, 16]}>
                  {tour.included.map((item, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <div className="flex items-center p-3 bg-green-50 rounded-lg">
                        <CheckCircleOutlined className="text-green-500 text-xl mr-3" />
                        <span>{item}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </TabPane>

            <TabPane tab={t("homeLogin.importantInfo")} key="4">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-4">{t("homeLogin.importantInfo")}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{t("homeLogin.cancellationPolicy")}</h4>
                    <p className="text-gray-600">
                      {t("homeLogin.cancellationPolicyDesc")}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{t("homeLogin.requiredDocuments")}</h4>
                    <p className="text-gray-600">
                      {t("homeLogin.requiredDocumentsDesc")}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{t("homeLogin.healthWarnings")}</h4>
                    <p className="text-gray-600">
                      {t("homeLogin.healthWarningsDesc")}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{t("homeLogin.whatToBring")}dsdfsfsd</h4>
                    <p className="text-gray-600">
                      {t("homeLogin.whatToBringDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>

          {/* İlgili Turlar */}
          {relatedTours.length > 0 && (
            <div className="mt-8">
              <Divider orientation="left">
                <h3 className="text-2xl font-bold">{t("homeLogin.similarTours")}</h3>
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
                              <span className="text-blue-600 font-bold">
                                {relatedTour.price
                                  ? `${relatedTour.price} TL`
                                  : "Fiyat bilgisi yok"}
                              </span>
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
    </Layout>
  );
};

export default TourDetail;
