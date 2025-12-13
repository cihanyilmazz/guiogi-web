import React, { useState } from 'react';
import { SearchOutlined, CalendarOutlined, GlobalOutlined } from '@ant-design/icons';

const Banner = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTour, setSelectedTour] = useState('');

  const tourOptions = [
    { value: 'tur1', label: 'Kültür Turları' },
    { value: 'tur2', label: 'Doğa Turları' },
    { value: 'tur3', label: 'Yurt Dışı Turları' },
    { value: 'tur4', label: 'Hafta Sonu Kaçamakları' },
  ];

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
              TUR ARA
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry's standard dummy text ever since the
            </p>
          </div>

          {/* Arama Formu */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Tarih Seçimi */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  <CalendarOutlined className="mr-2" />
                  Tarih Seçiniz
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>

              {/* Tur Seçimi */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  <GlobalOutlined className="mr-2" />
                  Tur Seçiniz
                </label>
                <select
                  value={selectedTour}
                  onChange={(e) => setSelectedTour(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none bg-white"
                >
                  <option value="">Tur tipi seçiniz</option>
                  {tourOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Arama Butonu */}
              <div className="flex items-end">
                <button className="w-full bg-[#9E0102]  text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                  <SearchOutlined className="mr-2" />
                  ARA
                </button>
              </div>
            </div>

            {/* Ekstra Filtreler (Masaüstünde Görünür) */}
            <div className="hidden md:flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Popüler Turlar
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Son Dakika
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Aile Turları
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Detaylı Arama ›
              </button>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold">500+</div>
              <div className="text-sm opacity-80">Etkin Tur</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">10K+</div>
              <div className="text-sm opacity-80">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">50+</div>
              <div className="text-sm opacity-80">Ülke Seçeneği</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-80">Destek</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;