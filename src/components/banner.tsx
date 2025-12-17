import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, CalendarOutlined, GlobalOutlined } from '@ant-design/icons';
import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { tourService } from '../services/tourService';
import { useTranslation } from 'react-i18next';

const Banner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTour, setSelectedTour] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // API'den kategorileri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await tourService.getAllCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    };
    fetchData();
  }, []);

  // Arama işlemi
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Arama sonuçlarını URL parametreleri ile turlar sayfasına yönlendir
      const params = new URLSearchParams();
      if (selectedTour) params.set('category', selectedTour);
      if (selectedDate) {
        params.set('date', selectedDate.format('YYYY-MM-DD'));
      }
      
      navigate(`/turlar?${params.toString()}`);
    } catch (error) {
      console.error('Arama yapılırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-[#414040bf] to-[#414040bf] text-white">
      {/* Arkaplan Görseli */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80")'
        }}
      ></div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {t("banner.searchTour")}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {t("banner.bannerDesc")}
            </p>
          </div>

          {/* Arama Formu */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Tarih Seçimi */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  <CalendarOutlined className="mr-2" />
                  {t("banner.selectDate")}
                </label>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  format="DD/MM/YYYY"
                  placeholder={t("banner.datePlaceholder")}
                  className="w-full [&_.ant-picker-input>input::placeholder]:!text-gray-500 [&_.ant-picker-input>input]:text-gray-700 [&_.ant-picker-input>input]:text-base"
                  size="large"
                  style={{ width: '100%' }}
                  allowClear
                  disabledDate={(current) => {
                    // Geçmiş tarihleri devre dışı bırak
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </div>

              {/* Tur Seçimi */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  <GlobalOutlined className="mr-2" />
                  {t("banner.selectTour")}
                </label>
                <Select
                  value={selectedTour || undefined}
                  onChange={(value) => setSelectedTour(value)}
                  placeholder={t("banner.tourTypePlaceholder")}
                  className="w-full [&_.ant-select-selection-placeholder]:!text-gray-500"
                  size="large"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={categories.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
              </div>

              {/* Arama Butonu */}
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#9E0102] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SearchOutlined className="mr-2" />
                  {loading ? t("banner.searching") : t("banner.search")}
                </button>
              </div>
            </div>

            {/* Ekstra Filtreler (Masaüstünde Görünür) */}
            <div className="hidden md:flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <button 
                  type="button"
                  onClick={() => navigate('/turlar?special=popular')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t("banner.popularTours")}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/turlar?special=lastminute')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t("banner.lastMinute")}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/turlar?special=family')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {t("banner.familyTours")}
                </button>
              </div>
              <button 
                type="button"
                onClick={() => navigate('/turlar')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t("banner.detailedSearch")}
              </button>
            </div>
          </form>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold">500+</div>
              <div className="text-sm opacity-80">{t("banner.activeTours")}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">10K+</div>
              <div className="text-sm opacity-80">{t("banner.happyCustomers")}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">50+</div>
              <div className="text-sm opacity-80">{t("banner.countryOptions")}</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-80">{t("banner.support")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;