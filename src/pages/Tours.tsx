import React, { useState } from 'react';
import { StarFilled, ClockCircleOutlined, UserOutlined, EnvironmentOutlined, FilterOutlined } from '@ant-design/icons';

const ToursPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const categories = [
    { id: 'all', name: 'Tüm Turlar' },
    { id: 'culture', name: 'Kültür Turları' },
    { id: 'nature', name: 'Doğa Turları' },
    { id: 'adventure', name: 'Macera Turları' },
    { id: 'beach', name: 'Plaj Turları' },
    { id: 'city', name: 'Şehir Turları' }
  ];

  const tours = [
    {
      id: 1,
      title: 'Kapadokya Balon Turu',
      description: 'Eşsiz Kapadokya manzarasını balon turu ile keşfedin',
      price: 1250,
      duration: '2 Gün 1 Gece',
      category: 'adventure',
      rating: 4.8,
      reviewCount: 342,
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Kapadokya, Türkiye',
      groupSize: '12 Kişi'
    },
    {
      id: 2,
      title: 'Ege Kültür Turu',
      description: 'Ege nin tarihi ve kültürel zenginliklerini keşfedin',
      price: 890,
      duration: '3 Gün 2 Gece',
      category: 'culture',
      rating: 4.6,
      reviewCount: 287,
      image: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Ege Bölgesi',
      groupSize: '15 Kişi'
    },
    {
      id: 3,
      title: 'Karadeniz Yaylaları',
      description: 'Yeşilin her tonunu görebileceğiniz doğa turu',
      price: 750,
      duration: '4 Gün 3 Gece',
      category: 'nature',
      rating: 4.9,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Karadeniz',
      groupSize: '10 Kişi'
    },
    {
      id: 4,
      title: 'İstanbul Tarih Turu',
      description: 'İstanbul un tarihi mekanlarını rehber eşliğinde gezin',
      price: 450,
      duration: '1 Gün',
      category: 'city',
      rating: 4.7,
      reviewCount: 523,
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'İstanbul',
      groupSize: '20 Kişi'
    },
    {
      id: 5,
      title: 'Antalya Plaj Turu',
      description: 'Mavi bayraklı plajlarda unutulmaz bir tatil',
      price: 1100,
      duration: '5 Gün 4 Gece',
      category: 'beach',
      rating: 4.5,
      reviewCount: 198,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Antalya',
      groupSize: '8 Kişi'
    },
    {
      id: 6,
      title: 'Doğu Ekspresi Macerası',
      description: 'Doğu Ekspresi ile unutulmaz bir yolculuk',
      price: 680,
      duration: '2 Gün 1 Gece',
      category: 'adventure',
      rating: 4.8,
      reviewCount: 231,
      image: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      location: 'Doğu Anadolu',
      groupSize: '16 Kişi'
    }
  ];

  const filteredTours = tours.filter(tour => 
    selectedCategory === 'all' || tour.category === selectedCategory
  ).filter(tour => 
    tour.price >= priceRange[0] && tour.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Turlarımız</h1>
          <p className="text-xl max-w-2xl">
            Hayalinizdeki tatili keşfedin. 50+ ülkede unutulmaz deneyimler sizi bekliyor.
          </p>
        </div>
      </section>

      {/* Filtreler */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4">
              <FilterOutlined className="text-xl text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filtrele:</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat Aralığı: {priceRange[0]}₺ - {priceRange[1]}₺
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tur Listesi */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map(tour => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {tour.price}₺
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>
                  <p className="text-gray-600 mb-4">{tour.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-yellow-500">
                      <StarFilled className="mr-1" />
                      <span className="font-semibold">{tour.rating}</span>
                      <span className="text-gray-500 ml-1">({tour.reviewCount})</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <UserOutlined className="mr-1" />
                      {tour.groupSize}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <ClockCircleOutlined className="mr-2" />
                      {tour.duration}
                    </div>
                    <div className="flex items-center">
                      <EnvironmentOutlined className="mr-2" />
                      {tour.location}
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                    Tur Detayları
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Seçtiğiniz kriterlere uygun tur bulunamadı.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ToursPage;