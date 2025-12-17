// services/contactService.ts

export interface ContactInfo {
  icon?: string;
  title: string;
  content: string;
  subtitle: string;
  action: string | null;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ContactContent {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  contactInfo: ContactInfo[];
  whatsappLink: string;
  skypeLink: string;
  emergencyTitle: string;
  emergencyDescription: string;
  emergencyPhone: string;
  formTitle: string;
  formDescription: string;
  mapEmbedUrl: string;
  officeAddress: string;
  faqTitle: string;
  faqs: FAQ[];
}

const defaultContactContent: ContactContent = {
  heroTitle: "İletişim",
  heroSubtitle: "Size nasıl yardımcı olabiliriz? Sorularınız, önerileriniz veya rezervasyon talepleriniz için bizimle iletişime geçmekten çekinmeyin.",
  contactInfo: [
    {
      title: 'Telefon',
      content: '+90 555 555 55 55',
      subtitle: '7/24 Destek Hattı',
      action: 'tel:+905555555555'
    },
    {
      title: 'E-posta',
      content: 'info@guiaogi.com.tr',
      subtitle: '24 saat içinde yanıt',
      action: 'mailto:info@guiaogi.com.tr'
    },
    {
      title: 'Adres',
      content: 'Levent, İstanbul',
      subtitle: 'Merkez Ofis',
      action: 'https://maps.google.com/?q=Levent,İstanbul'
    },
    {
      title: 'Çalışma Saatleri',
      content: 'Pzt - Cuma: 09:00 - 18:00',
      subtitle: 'Cumartesi: 10:00 - 16:00',
      action: null
    }
  ],
  whatsappLink: "https://wa.me/905555555555",
  skypeLink: "skype:guiaogi?call",
  emergencyTitle: "🆘 Acil Durum",
  emergencyDescription: "Yurtdışında acil durumlarda 7/24 ulaşabileceğiniz destek hattı:",
  emergencyPhone: "+90 555 555 55 56",
  formTitle: "Bize Ulaşın",
  formDescription: "Aşağıdaki formu doldurarak bize ulaşabilirsiniz. En kısa sürede sizinle iletişime geçeceğiz.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.674188611382!2d29.020215315718!3d41.04487432529929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a24975fe5d%3A0x2d35cb6d8a30dd8f!2sLevent%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1234567890",
  officeAddress: "Levent Mahallesi, Büyükdere Caddesi, No:123, 34330 Levent/İstanbul",
  faqTitle: "Sık Sorulan Sorular",
  faqs: [
    {
      question: "📞 Telefonla nasıl rezervasyon yapabilirim?",
      answer: "+90 555 555 55 55 numaralı hattımızdan 7/24 rezervasyon yapabilirsiniz. Operatörlerimiz size yardımcı olacaktır."
    },
    {
      question: "⏰ Çalışma saatleriniz nedir?",
      answer: "Hafta içi 09:00 - 18:00, Cumartesi 10:00 - 16:00 saatleri arasında hizmet vermekteyiz. Acil durumlarda 7/24 ulaşılabilirsiniz."
    },
    {
      question: "🌍 Yurtdışı turlarınız var mı?",
      answer: "Evet, 50'den fazla ülkede tur paketlerimiz bulunmaktadır. Detaylı bilgi için iletişim formunu doldurabilirsiniz."
    },
    {
      question: "💼 Kurumsal iş birlikleri için kiminle görüşebilirim?",
      answer: "Kurumsal iş birlikleri için corporate@guiaogi.com.tr adresine mail atabilir veya 0212 555 55 55 numaralı hattımızdan kurumsal satış departmanımıza ulaşabilirsiniz."
    }
  ]
};

class ContactService {
  async getContactContent(): Promise<ContactContent> {
    try {
      const response = await fetch('http://localhost:3005/contact');
      if (response.ok) {
        const data = await response.json();
        // Eğer array dönerse ilk elemanı al, değilse direkt kullan
        const content = Array.isArray(data) ? data[0] : data;
        if (content) {
          return content;
        }
      }
    } catch (error) {
      console.error('Contact içeriği yüklenirken hata:', error);
    }
    
    // Fallback olarak default içeriği döndür
    return defaultContactContent;
  }

  async updateContactContent(content: ContactContent): Promise<ContactContent> {
    try {
      // Önce mevcut içeriği kontrol et
      const existing = await this.getContactContent();
      const contentToUpdate = { ...content, id: existing.id || '1' };

      let response;
      if (existing.id) {
        // Güncelleme
        response = await fetch(`http://localhost:3005/contact/${existing.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contentToUpdate),
        });
      } else {
        // Yeni oluştur
        response = await fetch('http://localhost:3005/contact', {
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
      console.error('Contact içeriği güncellenirken hata:', error);
      throw error;
    }
  }
}

export const contactService = new ContactService();



