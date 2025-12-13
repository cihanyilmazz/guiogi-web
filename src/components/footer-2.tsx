import React from 'react';
import { Layout, Row, Col, Input, Button } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

const { Footer } = Layout;
const { TextArea } = Input;

const CorporateFooter: React.FC = () => {
  return (
    <Footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12}>
            <h3 className="text-2xl font-bold mb-6">İş Ortağınız Olalım</h3>
            <p className="text-gray-300 mb-6">
              Kurumsal seyahat çözümleri ve özel grup turları için bizimle iletişime geçin.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <PhoneOutlined className="mr-4 text-blue-400" />
                <div>
                  <div className="font-semibold">Kurumsal Satış</div>
                  <div>+90 212 555 55 55</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300">
                <MailOutlined className="mr-4 text-blue-400" />
                <div>
                  <div className="font-semibold">E-posta</div>
                  <div>corporate@guiaogi.com</div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-300">
                <ClockCircleOutlined className="mr-4 text-blue-400" />
                <div>
                  <div className="font-semibold">Çalışma Saatleri</div>
                  <div>Pazartesi - Cuma: 09:00 - 18:00</div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <h4 className="font-semibold mb-4">Hızlı Teklif Alın</h4>
            <div className="space-y-3">
              <Input placeholder="Firma Adı" size="large" />
              <Input placeholder="İletişim Kişisi" size="large" />
              <Input placeholder="Telefon" size="large" />
              <TextArea 
                placeholder="İhtiyaçlarınızı belirtin..." 
                rows={3}
                size="large"
              />
              <Button type="primary" size="large" block>
                Teklif İste
              </Button>
            </div>
          </Col>
        </Row>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="flex items-center">
                <EnvironmentOutlined className="text-blue-400 mr-3" />
                <span className="text-gray-300">İstanbul, Türkiye Merkez Ofis</span>
              </div>
            </Col>
            <Col xs={24} md={8} className="text-center">
              <p className="text-gray-400">
                TURSAB Belge No: 1234
              </p>
            </Col>
            <Col xs={24} md={8} className="text-right">
              <div className="flex justify-end space-x-4 text-gray-400 text-sm">
                <span>ISO 9001</span>
                <span>•</span>
                <span>TSE Certified</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Footer>
  );
};

export default CorporateFooter;