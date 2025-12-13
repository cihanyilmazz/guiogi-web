import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarFilled, ClockCircleOutlined, UserOutlined, EnvironmentOutlined, FilterOutlined } from '@ant-design/icons';
import { Spin, Alert, Tag } from 'antd';
import { tourService, Tour } from '../services/tourService';

const ToursPage = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000); // Tüm turların maksimum fiyatı
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(10000); // Seçilen maksimum fiyat

  // API'den turları çek
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tourService.getAllTours();
        setTours(data);
        
        // Fiyat aralığını dinamik olarak ayarla
        if (data.length > 0) {
          const prices = data
            .map(tour => {
              const basePrice = tour.price || 0;
              // İndirimli fiyatları da hesaba kat
              return tour.discount 
                ? Math.round(basePrice * (1 - tour.discount / 100))
                : basePrice;
            })
            .filter(price => price > 0);
          
          if (prices.length > 0) {
            const calculatedMaxPrice = Math.max(...prices);
            const roundedMax = Math.ceil(calculatedMaxPrice / 1000) * 1000; // En yakın 1000'e yuvarla
            setMaxPrice(roundedMax);
            setSelectedMaxPrice(roundedMax);
          }
        }
      } catch (err: any) {
        console.error('Turlar yüklenirken hata:', err);
        setError('Turlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Kategorileri turlardan dinamik olarak çıkar
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(tours.map(tour => tour.category)))
      .filter(cat => cat && cat.trim() !== '')
      .sort();
    
    return [
      { id: 'all', name: 'Tüm Turlar' },
      ...uniqueCategories.map(cat => ({
        id: cat,
        name: cat
      }))
    ];
  }, [tours]);

  // Filtrelenmiş turlar
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      // Kategori filtresi
      if (selectedCategory !== 'all' && tour.category !== selectedCategory) {
        return false;
      }
      
      // Fiyat filtresi
      const tourPrice = tour.price || 0;
      const finalPrice = tour.discount 
        ? Math.round(tourPrice * (1 - tour.discount / 100))
        : tourPrice;
      
      if (finalPrice < 0 || finalPrice > selectedMaxPrice) {
        return false;
      }
      
      return true;
    });
  }, [tours, selectedCategory, selectedMaxPrice]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="Turlar yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert
          message="Hata"
          description={error}
          type="error"
          showIcon
          action={
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sayfayı Yenile
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden"
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
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-lg">Turlarımız</h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl opacity-95 drop-shadow-md">
            Hayalinizdeki tatili keşfedin. {tours.length}+ tur ile unutulmaz deneyimler sizi bekliyor.
          </p>
        </div>
      </section>

      {/* Filtreler */}
      <section className="py-2 sm:py-3 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Başlık - Mobilde gizli, desktop'ta görünür */}
          <div className="hidden md:flex items-center gap-2 mb-2">
            <FilterOutlined className="text-lg text-gray-600" />
            <h3 className="text-base font-semibold text-gray-800">Filtrele</h3>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            {/* Kategoriler */}
            <div className="flex-1 w-full md:min-w-0">
              <div className="flex items-center gap-2 mb-2 md:hidden">
                <FilterOutlined className="text-base text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-800">Kategoriler</h3>
              </div>
              <div className="hidden md:block mb-1.5">
                <h4 className="text-xs font-medium text-gray-700">Kategoriler</h4>
              </div>
              <div className="overflow-x-auto pb-1 -mx-4 sm:-mx-6 md:mx-0 md:overflow-visible">
                <div className="flex gap-1.5 px-4 sm:px-6 md:px-0 min-w-max md:min-w-0 md:flex-wrap">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 sm:px-3.5 md:px-3.5 py-1.5 rounded-full transition-all duration-200 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white shadow-md font-medium transform scale-105'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fiyat Aralığı */}
            <div className="w-full md:w-auto md:min-w-[240px] lg:min-w-[280px] border-t md:border-t-0 md:border-l md:pl-4 lg:pl-6 pt-3 md:pt-0">
              <div className="flex items-center gap-2 mb-2 md:hidden">
                <FilterOutlined className="text-base text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-800">Fiyat Aralığı</h3>
              </div>
              <div className="hidden md:block mb-1.5">
                <h4 className="text-xs font-medium text-gray-700">Fiyat Aralığı</h4>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Maksimum Fiyat: <span className="text-blue-600 font-bold text-base">{selectedMaxPrice.toLocaleString('tr-TR')}₺</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={selectedMaxPrice}
                  onChange={(e) => setSelectedMaxPrice(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(selectedMaxPrice / maxPrice) * 100}%, #e5e7eb ${(selectedMaxPrice / maxPrice) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0₺</span>
                  <span>{maxPrice.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tur Listesi */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
            <span className="font-semibold">{filteredTours.length}</span> tur bulundu
          </div>
          
          {filteredTours.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg mb-4">Seçtiğiniz kriterlere uygun tur bulunamadı.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMaxPrice(maxPrice);
                }}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredTours.map(tour => {
                const finalPrice = tour.discount 
                  ? Math.round((tour.price || 0) * (1 - tour.discount / 100))
                  : (tour.price || 0);
                
                return (
                  <div 
                    key={tour.id} 
                    className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    <div className="relative">
                      <img 
                        src={tour.coverImage} 
                        alt={tour.title}
                        className="w-full h-40 sm:h-48 lg:h-56 object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('placeholder')) {
                            target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80';
                          }
                        }}
                      />
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2">
                        {tour.discount && (
                          <Tag color="red" className="text-xs font-semibold px-1.5 sm:px-2 py-0.5">
                            %{tour.discount} İndirim
                          </Tag>
                        )}
                        <Tag color="blue" className="text-xs font-semibold px-1.5 sm:px-2 py-0.5">
                          {tour.specialOffer}
                        </Tag>
                      </div>
                      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-blue-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                        {finalPrice > 0 ? `${finalPrice.toLocaleString('tr-TR')}₺` : 'Fiyat yok'}
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 lg:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2">{tour.title}</h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm">{tour.description}</p>
                      
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center text-yellow-500">
                          <StarFilled className="mr-1 text-sm sm:text-base" />
                          <span className="font-semibold text-sm sm:text-base">{tour.rating}</span>
                          <span className="text-gray-500 ml-1 text-xs sm:text-sm">({tour.reviewCount})</span>
                        </div>
                        
                        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                          <UserOutlined className="mr-1" />
                          <span className="hidden sm:inline">{tour.groupSize}</span>
                          <span className="sm:hidden">{tour.groupSize.split(' ')[0]}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <div className="flex items-center">
                          <ClockCircleOutlined className="mr-1 sm:mr-2" />
                          <span className="truncate">{tour.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <EnvironmentOutlined className="mr-1 sm:mr-2" />
                          <span className="truncate max-w-[100px] sm:max-w-[120px]">{tour.location}</span>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 lg:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tour/${tour.id}`);
                        }}
                      >
                        Tur Detayları
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ToursPage;