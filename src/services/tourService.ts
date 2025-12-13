// services/tourService.ts
export interface Tour {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  location: string;
  duration: string;
  groupSize: string;
  category: string;
  specialOffer: string;
  rating: number;
  reviewCount: number;
  highlights: string[];
  price?: number;
  discount?: number;
  season?: string;
  guide?: string;
  included?: string[];
}

// Mock tur verileri
const mockTours: Tour[] = [
  {
    id: 1,
    title: "Kapadokya Balon Turu",
    description: "Kapadokya'nın eşsiz manzaralarını balon turu ile keşfedin. Peri bacaları arasında unutulmaz bir sabah turu.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Kapadokya, Nevşehir",
    duration: "2 Gün 1 Gece",
    groupSize: "Max 12 Kişi",
    category: "Macera",
    specialOffer: "Erken Rezervasyon",
    rating: 4.9,
    reviewCount: 245,
    highlights: ["Sabah balon turu", "Açık hava müzesi", "Yeraltı şehri", "Güneşin doğuşu"],
    price: 2500,
    discount: 15,
    season: "İlkbahar/Yaz",
    guide: "Ahmet Yılmaz",
    included: ["Konaklama", "Kahvaltı", "Ulaşım", "Rehberlik", "Sigorta"]
  },
  {
    id: 2,
    title: "Pamukkale Günübirlik Tur",
    description: "Pamukkale'nin beyaz travertenlerinde ve antik Hierapolis'te unutulmaz bir gün geçirin.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Pamukkale, Denizli",
    duration: "1 Gün",
    groupSize: "Max 20 Kişi",
    category: "Doğa",
    specialOffer: "Popüler Tur",
    rating: 4.7,
    reviewCount: 189,
    highlights: ["Travertenler", "Hierapolis Antik Kenti", "Antik Havuz", "Kleopatra Havuzu"],
    price: 900,
    season: "Tüm Yıl",
    guide: "Mehmet Demir",
    included: ["Ulaşım", "Rehberlik", "Öğle yemeği", "Giriş ücretleri"]
  },
  {
    id: 3,
    title: "Efes Antik Kenti Turu",
    description: "Tarihin izlerini süreceğiniz Efes Antik Kenti turu ile geçmişe yolculuk yapın.",
    coverImage: "https://images.unsplash.com/photo-1593693399021-8ddfc4db6e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Efes, İzmir",
    duration: "1 Gün",
    groupSize: "Max 15 Kişi",
    category: "Kültür",
    specialOffer: "Aile İndirimi",
    rating: 4.8,
    reviewCount: 312,
    highlights: ["Celsus Kütüphanesi", "Büyük Tiyatro", "Meryem Ana Evi", "Hadrian Tapınağı"],
    price: 750,
    discount: 10,
    season: "Tüm Yıl",
    guide: "Ayşe Kaya",
    included: ["Ulaşım", "Rehberlik", "Giriş ücretleri", "Rehber kitapçık"]
  },
  {
    id: 4,
    title: "İstanbul Boğaz Turu",
    description: "İstanbul Boğazı'nın eşsiz manzaralarını tekne turu ile keşfedin. Kız Kulesi'nden Dolmabahçe'ye unutulmaz bir yolculuk.",
    coverImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "İstanbul",
    duration: "3 Saat",
    groupSize: "Max 30 Kişi",
    category: "Şehir",
    specialOffer: "Akşam Turu",
    rating: 4.6,
    reviewCount: 178,
    highlights: ["Boğaz Köprüsü", "Dolmabahçe Sarayı", "Kız Kulesi", "Ortaköy Meydanı"],
    price: 300,
    season: "Tüm Yıl",
    guide: "Fatma Şahin",
    included: ["Tekne turu", "Rehberlik", "Çay/kahve ikramı", "Atıştırmalık"]
  },
  {
    id: 5,
    title: "Safranbolu Evleri Turu",
    description: "Osmanlı mimarisinin en güzel örneklerini barındıran Safranbolu'da tarih ve kültür turu.",
    coverImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Safranbolu, Karabük",
    duration: "2 Gün 1 Gece",
    groupSize: "Max 15 Kişi",
    category: "Kültür",
    specialOffer: "Hafta Sonu",
    rating: 4.5,
    reviewCount: 156,
    highlights: ["Tarihi Safranbolu Evleri", "Cinci Hanı", "Kristal Teras", "Yörük Köyü"],
    price: 1200,
    discount: 20,
    season: "İlkbahar/Sonbahar",
    guide: "Can Demir",
    included: ["Konaklama", "Kahvaltı", "Rehberlik", "Ulaşım"]
  },
  {
    id: 6,
    title: "Nemrut Dağı Turu",
    description: "Nemrut Dağı'nda güneşin doğuşunu izleyin ve dev heykeller arasında tarihe tanıklık edin.",
    coverImage: "https://images.unsplash.com/photo-1564574662336-88c9f5a6c8d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Nemrut Dağı, Adıyaman",
    duration: "3 Gün 2 Gece",
    groupSize: "Max 10 Kişi",
    category: "Tarih",
    specialOffer: "Özel Tur",
    rating: 4.9,
    reviewCount: 89,
    highlights: ["Nemrut Dağı Zirvesi", "Güneşin Doğuşu", "Kommagene Krallığı", "Dev Heykeller"],
    price: 1800,
    discount: 15,
    season: "Yaz",
    guide: "Ali Yıldız",
    included: ["Konaklama", "Yemekler", "Ulaşım", "Rehberlik", "Giriş ücretleri"]
  }
];

class TourService {
  async getAllTours(): Promise<Tour[]> {
    try {
      // İlk önce localStorage'dan kontrol et
      const localTours = localStorage.getItem('tours');
      if (localTours) {
        return JSON.parse(localTours);
      }
      
      // Yoksa mock verileri kullan ve localStorage'a kaydet
      localStorage.setItem('tours', JSON.stringify(mockTours));
      return mockTours;
    } catch (error) {
      console.error('Turlar yüklenirken hata:', error);
      // Hata durumunda da mock verileri döndür
      return mockTours;
    }
  }

  async getTourById(id: number): Promise<Tour> {
    try {
      const tours = await this.getAllTours();
      const tour = tours.find(t => t.id === id);
      
      if (!tour) {
        throw new Error(`ID: ${id} olan tur bulunamadı`);
      }
      
      return tour;
    } catch (error) {
      console.error('Tur detayları yüklenirken hata:', error);
      throw error;
    }
  }

  async getRelatedTours(category: string, excludeId: number): Promise<Tour[]> {
    try {
      const tours = await this.getAllTours();
      return tours
        .filter(t => t.category === category && t.id !== excludeId)
        .slice(0, 3);
    } catch (error) {
      console.error('İlgili turlar yüklenirken hata:', error);
      return [];
    }
  }
}

export const tourService = new TourService();