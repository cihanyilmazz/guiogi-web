import React, { useState, useEffect } from "react";
import {
  RocketOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { IconUsers, IconStar, IconWorld, IconMoodSmile } from '@tabler/icons-react';
import { aboutService, AboutContent } from "../services/aboutService";

const AboutPage1 = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      setLoading(true);
      const aboutContent = await aboutService.getAboutContent();
      setContent(aboutContent);
    } catch (error) {
      console.error('About içeriği yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // İkon mapping
  const getStatIcon = (index: number) => {
    const icons = [
      <IconUsers size={32} key="users" />,
      <IconStar size={32} key="star" />,
      <IconWorld size={32} key="world" />,
      <IconMoodSmile size={32} key="smile" />,
    ];
    return icons[index % icons.length];
  };

  const getFeatureIcon = (index: number) => {
    const icons = [
      <RocketOutlined key="rocket" />,
      <SafetyCertificateOutlined key="safety" />,
      <CrownOutlined key="crown" />,
      <GlobalOutlined key="global" />,
    ];
    return icons[index % icons.length];
  };

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

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
            {content.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-95 drop-shadow-md">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {content.stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-cyan-100"
              >
                <div className="text-4xl mb-3 flex justify-center text-cyan-600">{getStatIcon(index)}</div>
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
              {content.storyTitle}
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-lg text-gray-700">
                {content.storyParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <div className="relative">
                <img
                  src={content.storyImage}
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
              {content.featuresTitle}
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {content.featuresSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm hover:bg-opacity-20 transition-all"
              >
                <div className="text-3xl mb-4 text-cyan-300">
                  {getFeatureIcon(index)}
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
                {content.visionTitle}
              </h3>
              <p className="text-gray-700">
                {content.visionText}
              </p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
              <TeamOutlined className="text-4xl text-cyan-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {content.missionTitle}
              </h3>
              <p className="text-gray-700">
                {content.missionText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage1;
