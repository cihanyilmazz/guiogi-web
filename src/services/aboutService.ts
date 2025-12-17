// services/aboutService.ts

export interface AboutContent {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: Array<{
    number: string;
    text: string;
    icon?: string;
  }>;
  storyTitle: string;
  storyParagraphs: string[];
  storyImage: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
}

const defaultAboutContent: AboutContent = {
  heroTitle: "Guiogi",
  heroSubtitle: "Yolculuk çağınızı birlikte keşfedelim",
  stats: [
    { number: "15.000+", text: "Mutlu Müşteri" },
    { number: "12", text: "Yıllık Deneyim" },
    { number: "65+", text: "Ülkede Hizmet" },
    { number: "98%", text: "Memnuniyet Oranı" },
  ],
  storyTitle: "Hikayemiz",
  storyParagraphs: [
    "Guiogi olarak 2012'de küçük bir ofiste başlayan tutkumuz, bugün 65'ten fazla ülkede 15.000'den fazla mutlu müşteriye ulaştı.",
    "Amacımız sadece tur satmak değil, unutulmaz anılar biriktirmenize aracı olmak. Her yolculuğun bir hikaye olduğuna inanıyor ve bu hikayenin en güzel şekilde yazılması için çalışıyoruz.",
    "Yenilikçi yaklaşımımız ve müşteri odaklı hizmet anlayışımızla, seyahat endüstrisinde fark yaratmaya devam ediyoruz.",
  ],
  storyImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  featuresTitle: "Neden Bizi Seçmelisiniz?",
  featuresSubtitle: "Farkımızı yaratan özelliklerimizle tanışın",
  features: [
    {
      title: "Hızlı Rezervasyon",
      description: "3 dakikada rezervasyon işleminizi tamamlayın",
    },
    {
      title: "Güvenli Ödeme",
      description: "256-bit SSL şifreleme ile güvenli ödeme",
    },
    {
      title: "VIP Hizmet",
      description: "Özel müşteri temsilcisi desteği",
    },
    {
      title: "7/24 Destek",
      description: "Seyahatiniz boyunca yanınızdayız",
    },
  ],
  visionTitle: "Vizyonumuz",
  visionText: "Dijital çağın öncü seyahat platformu olarak, sınırları kaldırıp dünyayı herkes için daha ulaşılabilir kılmak.",
  missionTitle: "Misyonumuz",
  missionText: "Teknoloji ve insan dokunuşunu birleştirerek, kişiye özel ve unutulmaz seyahat deneyimleri sunmak.",
};

class AboutService {
  async getAboutContent(): Promise<AboutContent> {
    try {
      const response = await fetch('http://49.13.94.27/:3005/about');
      if (response.ok) {
        const data = await response.json();
        // Eğer array dönerse ilk elemanı al, değilse direkt kullan
        const content = Array.isArray(data) ? data[0] : data;
        if (content) {
          return content;
        }
      }
    } catch (error) {
      console.error('About içeriği yüklenirken hata:', error);
    }
    
    // Fallback olarak default içeriği döndür
    return defaultAboutContent;
  }

  async updateAboutContent(content: AboutContent): Promise<AboutContent> {
    try {
      // Önce mevcut içeriği kontrol et
      const existing = await this.getAboutContent();
      const contentToUpdate = { ...content, id: existing.id || '1' };

      let response;
      if (existing.id) {
        // Güncelleme
        response = await fetch(`http://49.13.94.27/:3005/about/${existing.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contentToUpdate),
        });
      } else {
        // Yeni oluştur
        response = await fetch('http://49.13.94.27/:3005/about', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contentToUpdate),
        });
      }

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Güncelleme başarısız');
      }
    } catch (error) {
      console.error('About içeriği güncellenirken hata:', error);
      throw error;
    }
  }
}

export const aboutService = new AboutService();



