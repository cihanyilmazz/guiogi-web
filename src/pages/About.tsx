import React from "react";
import {
  RocketOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { IconUsers,IconStar, IconWorld, IconMoodSmile } from '@tabler/icons-react';

const AboutPage1 = () => {
  const stats = [
    { number: "15.000+", text: "Mutlu Müşteri", icon: <IconUsers size={32} /> },
    { number: "12", text: "Yıllık Deneyim", icon: <IconStar size={32}/> },
    { number: "65+", text: "Ülkede Hizmet", icon: <IconWorld size={32} /> },
    { number: "98%", text: "Memnuniyet Oranı", icon: <IconMoodSmile size={32} /> },
  ];

  const features = [
    {
      icon: <RocketOutlined />,
      title: "Hızlı Rezervasyon",
      description: "3 dakikada rezervasyon işleminizi tamamlayın",
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: "Güvenli Ödeme",
      description: "256-bit SSL şifreleme ile güvenli ödeme",
    },
    {
      icon: <CrownOutlined />,
      title: "VIP Hizmet",
      description: "Özel müşteri temsilcisi desteği",
    },
    {
      icon: <GlobalOutlined />,
      title: "7/24 Destek",
      description: "Seyahatiniz boyunca yanınızdayız",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section 
        className="relative text-white py-16 sm:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 30%, #14b8a6 60%, #10b981 100%)'
        }}
      >
        {/* Dekoratif dalga efekti */}
        <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z" fill="white"></path>
          </svg>
        </div>
        
        {/* Dekoratif daireler */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
            Guiogi
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-95 drop-shadow-md">
            Yolculuk çağınızı birlikte keşfedelim
          </p>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-cyan-100"
              >
                <div className="text-4xl mb-3 flex justify-center text-cyan-600">{stat.icon}</div>
                <div className="text-3xl font-bold text-cyan-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
              Hikayemiz
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-lg text-gray-700">
                <p>
                  Guiogi olarak 2012'de küçük bir ofiste başlayan tutkumuz,
                  bugün 65'ten fazla ülkede 15.000'den fazla mutlu müşteriye
                  ulaştı.
                </p>
                <p>
                  Amacımız sadece tur satmak değil, unutulmaz anılar
                  biriktirmenize aracı olmak. Her yolculuğun bir hikaye olduğuna
                  inanıyor ve bu hikayenin en güzel şekilde yazılması için
                  çalışıyoruz.
                </p>
                <p>
                  Yenilikçi yaklaşımımız ve müşteri odaklı hizmet anlayışımızla,
                  seyahat endüstrisinde fark yaratmaya devam ediyoruz.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Seyahat Ekibimiz"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-cyan-600 text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-2xl font-bold">12+</div>
                  <div className="text-sm">Yıllık Deneyim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özelliklerimiz */}
      <section className="py-16 bg-[#414040bf] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Farkımızı yaratan özelliklerimizle tanışın
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm hover:bg-opacity-20 transition-all"
              >
                <div className="text-3xl mb-4 text-cyan-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vizyon & Misyon */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
              <TrophyOutlined className="text-4xl text-cyan-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vizyonumuz
              </h3>
              <p className="text-gray-700">
                Dijital çağın öncü seyahat platformu olarak, sınırları kaldırıp
                dünyayı herkes için daha ulaşılabilir kılmak.
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
              <TeamOutlined className="text-4xl text-cyan-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Misyonumuz
              </h3>
              <p className="text-gray-700">
                Teknoloji ve insan dokunuşunu birleştirerek, kişiye özel ve
                unutulmaz seyahat deneyimleri sunmak.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage1;
