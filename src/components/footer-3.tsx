import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import {
  CrownOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  GlobalOutlined
} from "@ant-design/icons";

const { Footer } = Layout;

const LuxuryFooter: React.FC = () => {
  return (
    <Footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-16">
      <div className="container mx-auto px-4">
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={8}>
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <CrownOutlined className="text-3xl text-yellow-400 mr-3" />
                <h3 className="text-2xl font-bold">GuiaOgi Luxury</h3>
              </div>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Dünyanın en özel destinasyonlarında lüks seyahat deneyimleri sunuyoruz.
              </p>
              <Button 
                type="primary" 
                size="large"
                className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-gray-900 font-semibold"
              >
                VIP Danışmanlık Al
              </Button>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <Row gutter={[32, 32]}>
              <Col xs={12} md={6}>
                <h4 className="font-semibold text-yellow-400 mb-4">Lüks Turlar</h4>
                <ul className="space-y-3">
                  {['Maldives Villa', 'Santorini Elite', 'Dubai Royal', 'Paris Luxury'].map((tour) => (
                    <li key={tour}>
                      <a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center">
                        <StarOutlined className="mr-2 text-xs" />
                        {tour}
                      </a>
                    </li>
                  ))}
                </ul>
              </Col>

              <Col xs={12} md={6}>
                <h4 className="font-semibold text-yellow-400 mb-4">Hizmetler</h4>
                <ul className="space-y-3">
                  {['VIP Transfer', 'Özel Rehber', 'Concierge', '24/7 Destek'].map((service) => (
                    <li key={service}>
                      <a href="#" className="text-blue-200 hover:text-white transition-colors">
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </Col>

              <Col xs={12} md={6}>
                <h4 className="font-semibold text-yellow-400 mb-4">Güvenlik</h4>
                <ul className="space-y-3">
                  {['SSL Sertifikası', 'Veri Güvenliği', 'KVKK Uyum', 'Sigorta'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center">
                        <SafetyCertificateOutlined className="mr-2 text-xs" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </Col>

              <Col xs={12} md={6}>
                <h4 className="font-semibold text-yellow-400 mb-4">Global</h4>
                <ul className="space-y-3">
                  {['Türkiye', 'Avrupa', 'Asya', 'Amerika'].map((region) => (
                    <li key={region}>
                      <a href="#" className="text-blue-200 hover:text-white transition-colors flex items-center">
                        <GlobalOutlined className="mr-2 text-xs" />
                        {region}
                      </a>
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="border-t border-blue-700 mt-12 pt-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <p className="text-blue-300 text-sm">
                ⭐ 5.0 Müşteri Memnuniyeti • 🏆 2024 En İyi Seyahat Ajansı
              </p>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-wrap justify-end gap-4 text-blue-300 text-sm">
                <span>Gizlilik Politikası</span>
                <span>•</span>
                <span>Kullanım Şartları</span>
                <span>•</span>
                <span>Çerezler</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Footer>
  );
};

export default LuxuryFooter;