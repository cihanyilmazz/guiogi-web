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
    description: "Kapadokya'nın eşsiz manzaralarını balon turu ile keşfedin. Peri bacaları arasında unutulmaz bir sabah turu. Sabahın erken saatlerinde sıcak hava balonları ile gökyüzüne yükselerek eşsiz gün doğumu manzarasını izleyeceksiniz. Binlerce balonun gökyüzünü süslediği bu muhteşem anı fotoğraflayabilirsiniz. Tur sonrası geleneksel kahvaltı ve sertifika töreni ile deneyiminizi taçlandıracaksınız.",
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
    description: "Pamukkale'nin beyaz travertenlerinde ve antik Hierapolis'te unutulmaz bir gün geçirin. Doğanın mucizesi olan travertenlerde yürüyüş yaparak termal suların oluşturduğu eşsiz manzarayı keşfedeceksiniz. Antik Hierapolis kentini gezerek Roma döneminden kalma tiyatro, hamam ve nekropol alanlarını göreceksiniz. Kleopatra'nın da yüzdüğü antik havuzda yüzme fırsatı bulacaksınız.",
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
    description: "Tarihin izlerini süreceğiniz Efes Antik Kenti turu ile geçmişe yolculuk yapın. Dünyanın en iyi korunmuş antik kentlerinden biri olan Efes'te Celsus Kütüphanesi, Büyük Tiyatro ve Hadrian Tapınağı gibi görkemli yapıları keşfedeceksiniz. Meryem Ana Evi'ni ziyaret ederek Hristiyanlık için kutsal sayılan bu mekanı göreceksiniz. Uzman rehberlerimiz eşliğinde antik dönemin yaşam tarzını öğreneceksiniz.",
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
    description: "İstanbul Boğazı'nın eşsiz manzaralarını tekne turu ile keşfedin. Kız Kulesi'nden Dolmabahçe'ye unutulmaz bir yolculuk. Asya ve Avrupa kıtalarını bir arada görme fırsatı bulacaksınız. Boğaz Köprüsü'nün altından geçerek İstanbul'un iki yakasını birbirine bağlayan bu muhteşem yapıyı yakından göreceksiniz. Dolmabahçe Sarayı, Çırağan Sarayı ve Ortaköy Camii gibi tarihi yapıları denizden izleyeceksiniz.",
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
    description: "Osmanlı mimarisinin en güzel örneklerini barındıran Safranbolu'da tarih ve kültür turu. UNESCO Dünya Mirası Listesi'nde yer alan Safranbolu'da 18. ve 19. yüzyıldan kalma geleneksel Osmanlı evlerini keşfedeceksiniz. Cinci Hanı, Kaymakamlar Müze Evi ve Kristal Teras gibi önemli noktaları ziyaret edeceksiniz. Yörük Köyü'nde geleneksel yaşamı gözlemleme fırsatı bulacaksınız.",
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
    description: "Nemrut Dağı'nda güneşin doğuşunu izleyin ve dev heykeller arasında tarihe tanıklık edin. Kommagene Krallığı'nın eşsiz mirasını keşfedeceğiniz bu turda, 2000 metreden yüksek rakımda bulunan dev heykelleri göreceksiniz. Sabahın erken saatlerinde zirveye çıkarak güneşin doğuşunu izleyeceksiniz. Arsameia, Cendere Köprüsü ve Karakuş Tümülüsü gibi antik yapıları ziyaret edeceksiniz.",
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
  },
  {
    id: 7,
    title: "Antalya Dalış Turu",
    description: "Akdeniz'in berrak sularında profesyonel rehberlikte dalış keyfi. Sualtı yaşamını keşfedin. Kaş ve Kekova bölgesinin kristal berraklığındaki sularında dalış yaparak renkli balıklar, mercanlar ve sualtı mağaralarını keşfedeceksiniz. PADI sertifikalı eğitmenlerimiz eşliğinde güvenli bir dalış deneyimi yaşayacaksınız. Batık şehirleri ve sualtı arkeolojik alanlarını görme fırsatı bulacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Kaş, Antalya",
    duration: "2 Gün 1 Gece",
    groupSize: "Max 6 Kişi",
    category: "Spor",
    specialOffer: "İlk Dalış Paketi",
    rating: 4.8,
    reviewCount: 78,
    highlights: ["Sualtı yaşamı", "Batık keşfi", "Dalış eğitimi", "Mercan resifleri"],
    price: 3200,
    discount: 12,
    season: "Yaz",
    guide: "Can Aydın",
    included: ["Dalış ekipmanı", "Eğitmen", "Tekne turu", "Sertifika", "Sigorta"]
  },
  {
    id: 8,
    title: "Karadeniz Yayla Turu",
    description: "Yeşilin her tonunu görebileceğiniz yaylalar ve şelaleler turu. Yöresel yemekler ve doğa yürüyüşleri. Rize ve Artvin'in yemyeşil yaylalarında doğa yürüyüşü yaparak şelaleler, göller ve ormanlar arasında unutulmaz bir deneyim yaşayacaksınız. Yöresel yemeklerden oluşan öğle yemeği ile Karadeniz mutfağının lezzetlerini tadacaksınız. Geleneksel yayla evlerinde konaklama imkanı bulacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Rize, Türkiye",
    duration: "3 Gün 2 Gece",
    groupSize: "Max 10 Kişi",
    category: "Doğa",
    specialOffer: "Fotoğrafçılık Turu",
    rating: 4.7,
    reviewCount: 67,
    highlights: ["Yaylalar", "Şelaleler", "Yöresel mutfak", "Doğa yürüyüşü"],
    price: 2200,
    discount: 5,
    season: "İlkbahar-Yaz",
    guide: "Fatma Şahin",
    included: ["Doğa yürüyüşü", "Yöresel konaklama", "Rehber", "Fotoğraf rehberi", "Yemekler"]
  },
  {
    id: 9,
    title: "Ege Mavi Yolculuk",
    description: "Mavi bayraklı koylarda lüks yat ile unutulmaz bir mavi yolculuk. Özel koylarda yüzme molaları ve deniz ürünleri. Bodrum'dan başlayarak Gökova Körfezi'nin en güzel koylarını keşfedeceksiniz. Her gün farklı bir koyda demir atarak yüzme, güneşlenme ve su sporları yapma fırsatı bulacaksınız. Taze deniz ürünlerinden oluşan özel menüler ile damak zevkinize hitap edecek bir deneyim.",
    coverImage: "https://images.unsplash.com/photo-1593238640783-3e1e9d72f9a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Muğla, Türkiye",
    duration: "4 Gün 3 Gece",
    groupSize: "Max 15 Kişi",
    category: "Deniz",
    specialOffer: "Haftalık Kiralama",
    rating: 4.9,
    reviewCount: 156,
    highlights: ["Özel koylar", "Güneş batımı", "Deniz sporları", "Lüks yat konaklama"],
    price: 5000,
    discount: 20,
    season: "Yaz",
    guide: "Ayşe Kaya",
    included: ["Yat konaklama", "Tam pansiyon", "Tekne turu", "Sualtı ekipmanı", "Rehberlik"]
  },
  {
    id: 10,
    title: "Doğu Anadolu Ekspresi",
    description: "Doğu'nun gizemli şehirlerini ve doğal güzelliklerini keşfedin. Kültürlerin kesişme noktası. Erzurum, Kars ve Ağrı'nın tarihi ve doğal güzelliklerini keşfedeceğiniz bu turda, Ani Harabeleri, İshak Paşa Sarayı ve Ağrı Dağı'nı göreceksiniz. Yöresel el sanatları atölyelerini ziyaret ederek geleneksel üretim tekniklerini öğreneceksiniz. Doğu Anadolu'nun zengin mutfağını tadacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Erzurum, Türkiye",
    duration: "5 Gün 4 Gece",
    groupSize: "Max 14 Kişi",
    category: "Kültür",
    specialOffer: "Kültür Pasaportu",
    rating: 4.4,
    reviewCount: 45,
    highlights: ["Tarihi kervansaraylar", "Dağ manzaraları", "Kültürel etkileşim", "El sanatı atölyesi"],
    price: 2800,
    discount: 8,
    season: "Yaz",
    guide: "Zeynep Yıldız",
    included: ["Tarihi mekanlar", "Yöresel konaklama", "Kültür rehberi", "El sanatı atölyesi", "Ulaşım"]
  },
  {
    id: 11,
    title: "Marmaris Yat Turu",
    description: "Lüks yatlarla mavi yolculuk ve özel koylarda yüzme molaları. Akdeniz'in incisinde tatil. Marmaris'ten başlayarak Datça ve Hisarönü körfezlerinin en güzel koylarını keşfedeceksiniz. Lüks yatlarda konforlu konaklama ile denizin ortasında uyanacaksınız. Her gün farklı bir koyda demir atarak yüzme, güneşlenme ve su sporları yapma fırsatı bulacaksınız. Gurme yemekler ve spa hizmetleri ile kendinizi şımartacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Muğla, Türkiye",
    duration: "3 Gün 2 Gece",
    groupSize: "Max 12 Kişi",
    category: "Deniz",
    specialOffer: "Honeymoon Paketi",
    rating: 4.9,
    reviewCount: 112,
    highlights: ["Lüks konfor", "Özel koylar", "Gurme deneyim", "Spa hizmetleri"],
    price: 6500,
    discount: 25,
    season: "Yaz",
    guide: "Burak Koç",
    included: ["Lüks yat", "Gurme yemekler", "Spa hizmetleri", "Özel koy turu", "Rehberlik"]
  },
  {
    id: 12,
    title: "Trabzon Sümela Manastırı Turu",
    description: "Trabzon'un eşsiz doğası ve tarihi yapılarını keşfedin. Sümela Manastırı'nın büyüleyici atmosferi. Maçka'daki Sümela Manastırı'nı ziyaret ederek Bizans döneminden kalma freskleri ve mimariyi göreceksiniz. Uzungöl'ün muhteşem manzarasını keşfedeceksiniz. Trabzon Kalesi, Ayasofya Müzesi ve Atatürk Köşkü gibi önemli noktaları ziyaret edeceksiniz. Karadeniz mutfağının lezzetlerini tadacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Trabzon, Türkiye",
    duration: "2 Gün 1 Gece",
    groupSize: "Max 18 Kişi",
    category: "Kültür",
    specialOffer: "Tarih Turu",
    rating: 4.6,
    reviewCount: 134,
    highlights: ["Sümela Manastırı", "Uzungöl", "Trabzon Kalesi", "Ayasofya Müzesi"],
    price: 1500,
    discount: 10,
    season: "Tüm Yıl",
    guide: "Murat Özkan",
    included: ["Konaklama", "Kahvaltı", "Rehberlik", "Ulaşım", "Giriş ücretleri"]
  },
  {
    id: 13,
    title: "Bursa Uludağ Kayak Turu",
    description: "Uludağ'ın eşsiz kayak pistlerinde kış sporları keyfi. Kar kalitesi ve pist çeşitliliği ile ünlü Uludağ'da kayak yaparak kışın keyfini çıkaracaksınız. Telesiyej ve teleski ile zirveye çıkarak muhteşem manzarayı izleyeceksiniz. Kayak ekipmanları kiralama ve ders imkanı bulacaksınız. Otel konaklaması ile rahat bir tatil geçireceksiniz. Akşamları spa ve wellness hizmetlerinden yararlanabilirsiniz.",
    coverImage: "https://images.unsplash.com/photo-1551524164-6cf77f5e7b3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Bursa, Türkiye",
    duration: "2 Gün 1 Gece",
    groupSize: "Max 20 Kişi",
    category: "Spor",
    specialOffer: "Kış Paketi",
    rating: 4.7,
    reviewCount: 203,
    highlights: ["Kayak pistleri", "Telesiyej", "Spa hizmetleri", "Kış manzaraları"],
    price: 2800,
    discount: 15,
    season: "Kış",
    guide: "Emre Kaya",
    included: ["Konaklama", "Kahvaltı", "Kayak ekipmanı", "Telesiyej biletleri", "Rehberlik"]
  },
  {
    id: 14,
    title: "Çanakkale Gelibolu Tarih Turu",
    description: "Çanakkale Savaşları'nın izlerini süreceğiniz duygusal bir tarih turu. Gelibolu Yarımadası'ndaki şehitlikleri ziyaret ederek Çanakkale Savaşları'nın izlerini göreceksiniz. Anıtlar, müzeler ve savaş alanlarını gezerek tarihe tanıklık edeceksiniz. Truva Antik Kenti'ni ziyaret ederek mitolojik hikayeleri dinleyeceksiniz. Çanakkale Boğazı'ndan geçiş yaparak stratejik önemi hakkında bilgi alacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1593693399021-8ddfc4db6e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Çanakkale, Türkiye",
    duration: "1 Gün",
    groupSize: "Max 25 Kişi",
    category: "Tarih",
    specialOffer: "Anma Turu",
    rating: 4.8,
    reviewCount: 267,
    highlights: ["Gelibolu Şehitlikleri", "Truva Antik Kenti", "Çanakkale Boğazı", "Anıtlar"],
    price: 850,
    season: "Tüm Yıl",
    guide: "Hasan Yılmaz",
    included: ["Ulaşım", "Rehberlik", "Öğle yemeği", "Giriş ücretleri"]
  },
  {
    id: 15,
    title: "Fethiye Ölüdeniz Yamaç Paraşütü",
    description: "Ölüdeniz'in muhteşem manzarasında yamaç paraşütü deneyimi. Dünyanın en güzel yamaç paraşütü pistlerinden birinde uçarak Ölüdeniz'in turkuaz sularını ve Babadağ'ın eşsiz manzarasını göreceksiniz. Tandem uçuş ile profesyonel pilot eşliğinde güvenli bir deneyim yaşayacaksınız. Uçuş sırasında çekilen fotoğraf ve videolar size hediye edilecek. Ölüdeniz plajında yüzme ve güneşlenme fırsatı bulacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Fethiye, Muğla",
    duration: "1 Gün",
    groupSize: "Max 8 Kişi",
    category: "Macera",
    specialOffer: "Adrenalin Paketi",
    rating: 4.9,
    reviewCount: 189,
    highlights: ["Yamaç paraşütü", "Ölüdeniz manzarası", "Tandem uçuş", "Fotoğraf/video"],
    price: 1800,
    discount: 20,
    season: "Yaz",
    guide: "Serkan Demir",
    included: ["Tandem uçuş", "Ekipman", "Fotoğraf/video", "Sigorta", "Rehberlik"]
  },
  {
    id: 16,
    title: "Mardin Tarihi Evler Turu",
    description: "Mardin'in taş evleri ve kültürel zenginliğini keşfedin. Mezopotamya'nın eşsiz şehri. Mardin'in dar sokaklarında yürüyerek geleneksel taş evleri göreceksiniz. Deyrulzafaran Manastırı, Mardin Müzesi ve Ulu Camii gibi önemli yapıları ziyaret edeceksiniz. Süryani kültürünü yakından tanıma fırsatı bulacaksınız. Yöresel el sanatları atölyelerini ziyaret ederek geleneksel üretim tekniklerini öğreneceksiniz.",
    coverImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Mardin, Türkiye",
    duration: "2 Gün 1 Gece",
    groupSize: "Max 12 Kişi",
    category: "Kültür",
    specialOffer: "Kültür Turu",
    rating: 4.6,
    reviewCount: 98,
    highlights: ["Taş evler", "Deyrulzafaran Manastırı", "Mardin Müzesi", "Süryani kültürü"],
    price: 1400,
    discount: 12,
    season: "Tüm Yıl",
    guide: "Mehmet Yıldırım",
    included: ["Konaklama", "Kahvaltı", "Rehberlik", "Ulaşım", "Giriş ücretleri"]
  },
  {
    id: 17,
    title: "Alaçatı Rüzgar Sörfü",
    description: "Alaçatı'nın rüzgarlı koylarında rüzgar sörfü öğrenin. Dünyanın en iyi rüzgar sörfü noktalarından biri olan Alaçatı'da profesyonel eğitmenler eşliğinde rüzgar sörfü öğreneceksiniz. Başlangıç seviyesinden ileri seviyeye kadar eğitim imkanı bulacaksınız. Ekipman kiralama ve eğitim dahil paket ile güvenli bir öğrenme deneyimi yaşayacaksınız. Alaçatı'nın ünlü plajlarında yüzme ve güneşlenme fırsatı bulacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Alaçatı, İzmir",
    duration: "3 Gün 2 Gece",
    groupSize: "Max 10 Kişi",
    category: "Spor",
    specialOffer: "Spor Paketi",
    rating: 4.8,
    reviewCount: 145,
    highlights: ["Rüzgar sörfü", "Eğitim", "Ekipman", "Plaj aktiviteleri"],
    price: 2400,
    discount: 18,
    season: "Yaz",
    guide: "Deniz Aktaş",
    included: ["Eğitim", "Ekipman", "Konaklama", "Kahvaltı", "Rehberlik"]
  },
  {
    id: 18,
    title: "Göreme Atv Safari",
    description: "Kapadokya'nın vadilerinde ATV ile macera dolu bir safari. Peri bacaları arasında ATV sürerek Kapadokya'nın eşsiz manzaralarını keşfedeceksiniz. Gün batımı turu ile muhteşem fotoğraf kareleri yakalayacaksınız. Güvercinlik Vadisi, Kızılçukur ve Çavuşin gibi önemli noktaları ziyaret edeceksiniz. Güvenlik ekipmanları ve rehber eşliğinde güvenli bir macera yaşayacaksınız.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
    location: "Göreme, Nevşehir",
    duration: "Yarım Gün",
    groupSize: "Max 15 Kişi",
    category: "Macera",
    specialOffer: "Macera Paketi",
    rating: 4.7,
    reviewCount: 167,
    highlights: ["ATV safari", "Gün batımı", "Vadiler", "Fotoğraf çekimi"],
    price: 450,
    discount: 10,
    season: "Tüm Yıl",
    guide: "Ahmet Yılmaz",
    included: ["ATV kiralama", "Güvenlik ekipmanı", "Rehberlik", "Sigorta"]
  }
];

class TourService {
  async getAllTours(): Promise<Tour[]> {
    try {
      // Önce json-server'dan direkt çek (en güncel veri için)
      try {
        const dbResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/tours``);
        if (dbResponse.ok) {
          const tours = await dbResponse.json();
          if (tours && Array.isArray(tours) && tours.length > 0) {
            console.log(`${ tours.length } tur json - server'dan yüklendi`);
            // localStorage'a cache olarak kaydet
            localStorage.setItem('tours', JSON.stringify(tours));
        return tours;
      }
        }
      } catch(dbError) {
    console.log('json-server\'dan veri çekilemedi, alternatif kaynaklar deneniyor...');
  }

      // API endpoint'ini dene
      try {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/tours``);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data) && data.length > 0) {
            localStorage.setItem('tours', JSON.stringify(data));
            return data;
          }
        }
      } catch (apiError) {
        console.log('API\'den veri çekilemedi, localStorage kontrol ediliyor...');
      }

      // Son çare olarak localStorage'dan kontrol et (cache)
      const localTours = localStorage.getItem('tours');
      if (localTours) {
        const parsedTours = JSON.parse(localTours);
        if (Array.isArray(parsedTours) && parsedTours.length > 0) {
          console.log(`${ parsedTours.length } tur localStorage'dan yüklendi (cache)`);
          return parsedTours;
}
      }

// En son çare olarak mock verileri kullan
console.log('Mock veriler kullanılıyor...');
localStorage.setItem('tours', JSON.stringify(mockTours));
return mockTours;
    } catch (error) {
  console.error('Turlar yüklenirken hata:', error);
  // Hata durumunda localStorage'dan dene
  try {
    const localTours = localStorage.getItem('tours');
    if (localTours) {
      return JSON.parse(localTours);
    }
  } catch (e) {
    console.error('localStorage\'dan yükleme hatası:', e);
  }
  // Son çare mock veriler
  return mockTours;
}
  }

  async getTourById(id: number | string): Promise < Tour > {
  try {
    // Önce direkt API'den çekmeyi dene
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/tours/${id}`);
      if(response.ok) {
  const tour = await response.json();
  if (tour) {
    return tour;
  }
}
      } catch (apiError) {
  console.log('API\'den tur çekilemedi, tüm turlardan aranıyor...');
}

// API'den bulunamazsa tüm turlardan ara
const tours = await this.getAllTours();
const tour = tours.find(t => String(t.id) === String(id));

if (!tour) {
  throw new Error(`ID: ${id} olan tur bulunamadı`);
}

return tour;
    } catch (error) {
  console.error('Tur detayları yüklenirken hata:', error);
  throw error;
}
  }

  async getRelatedTours(category: string, excludeId: number | string): Promise < Tour[] > {
  try {
    const tours = await this.getAllTours();
    return tours
      .filter(t => t.category === category && String(t.id) !== String(excludeId))
      .slice(0, 4); // Maksimum 4 tur döndür (tek satırda 3-4 tane gösterilebilir)
  } catch(error) {
    console.error('İlgili turlar yüklenirken hata:', error);
    return [];
  }
}

  async searchTours(query: string, category ?: string, location ?: string): Promise < Tour[] > {
  try {
    const tours = await this.getAllTours();
    let filtered = tours;

    // Metin araması
    if(query && query.trim()) {
  const searchQuery = query.toLowerCase().trim();
  filtered = filtered.filter(tour =>
    tour.title.toLowerCase().includes(searchQuery) ||
    tour.description.toLowerCase().includes(searchQuery) ||
    tour.location.toLowerCase().includes(searchQuery) ||
    tour.category.toLowerCase().includes(searchQuery)
  );
}

// Kategori filtresi
if (category && category.trim()) {
  filtered = filtered.filter(tour => tour.category === category);
}

// Lokasyon filtresi
if (location && location.trim()) {
  filtered = filtered.filter(tour =>
    tour.location.toLowerCase().includes(location.toLowerCase())
  );
}

return filtered;
    } catch (error) {
  console.error('Tur araması yapılırken hata:', error);
  return [];
}
  }

  async getAllCategories(): Promise < string[] > {
  try {
    const tours = await this.getAllTours();
    const categories = Array.from(new Set(tours.map(tour => tour.category)))
      .filter(cat => cat && cat.trim() !== '')
      .sort();
    return categories;
  } catch(error) {
    console.error('Kategoriler yüklenirken hata:', error);
    return [];
  }
}

  async getAllLocations(): Promise < string[] > {
  try {
    const tours = await this.getAllTours();
    const locations = Array.from(new Set(tours.map(tour => tour.location)))
      .filter(loc => loc && loc.trim() !== '')
      .sort();
    return locations;
  } catch(error) {
    console.error('Lokasyonlar yüklenirken hata:', error);
    return [];
  }
}
}

export const tourService = new TourService();