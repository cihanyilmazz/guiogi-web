// services/bookingService.ts
export interface Booking {
  id: number;
  userId: string | number;
  tourId: number;
  tourTitle: string;
  tourImage: string;
  bookingDate: string;
  travelDate: string;
  persons: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingNumber: string;
  specialRequests?: string;
  createdAt: string;
  cancelledAt?: string;
}

class BookingService {
  async createBooking(bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Promise<Booking> {
    try {
      // Önce API'den mevcut rezervasyonları çek
      let bookings: Booking[] = [];
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings``);
          if (response.ok) {
            bookings = await response.json();
          }
        } catch (apiError) {
          console.log('API\'den rezervasyonlar çekilemedi, localStorage kullanılıyor...');
          bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        }
        
        const newBooking: Booking = {
          ...bookingData,
          id: bookings.length > 0 ? Math.max(...bookings.map((b: Booking) => b.id)) + 1 : 1,
          bookingNumber: `BKG - ${ Date.now() }`,
          createdAt: new Date().toISOString(),
          status: bookingData.status || 'pending',
          paymentStatus: bookingData.paymentStatus || 'pending'
        };
        
        bookings.push(newBooking);
        
        // API'ye kaydet
        try {
          const response = await fetch(`${ import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005' } / bookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBooking),
          });
          
          if (response.ok) {
            const savedBooking = await response.json();
            // localStorage'a da kaydet (backup)
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return savedBooking;
          }
        } catch (apiError) {
          console.log('API\'ye kaydedilemedi, localStorage kullanılıyor...');
        }
        
        // API başarısız olursa localStorage'a kaydet
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return newBooking;
      } catch (error) {
        console.error('Rezervasyon oluşturma hatası:', error);
        throw new Error('Rezervasyon oluşturulamadı');
      }
    }
  
    async getUserBookings(userId: string | number): Promise<Booking[]> {
      try {
        // Önce API'den çekmeyi dene
        try {
          const response = await fetch(`${ import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005' } / bookings`?userId=${userId}`);
        if (response.ok) {
          const bookings = await response.json();
          return Array.isArray(bookings) ? bookings : [];
        }
      } catch (apiError) {
        console.log('API\'den rezervasyonlar çekilemedi, localStorage kullanılıyor...');
      }

      // API başarısız olursa localStorage'dan çek
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      return bookings.filter((booking: Booking) => String(booking.userId) === String(userId));
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error);
      throw new Error('Rezervasyonlar yüklenemedi');
    }
  }

  async cancelBooking(bookingId: number, userId: string | number): Promise<void> {
    try {
      // Önce mevcut rezervasyonu bul
      let booking: Booking | null = null;
      let allBookings: Booking[] = [];

      // API'den tüm rezervasyonları çek
      try {
        const getAllResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings`);
        if (getAllResponse.ok) {
          allBookings = await getAllResponse.json();
          booking = allBookings.find((b: Booking) => b.id === bookingId && String(b.userId) === String(userId));
        }
      } catch (apiError) {
        console.log('API\'den rezervasyonlar çekilemedi, localStorage kullanılıyor...');
      }

      // API'den bulunamazsa localStorage'dan bul
      if (!booking) {
        allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        booking = allBookings.find((b: Booking) => b.id === bookingId && String(b.userId) === String(userId));
      }

      if (!booking) {
        throw new Error('Rezervasyon bulunamadı');
      }

      // İptal edilmiş rezervasyonu güncelle
      const updatedBooking: Booking = {
        ...booking,
        status: 'cancelled',
        paymentStatus: 'refunded',
        cancelledAt: new Date().toISOString()
      };

      // Tüm rezervasyonları güncelle
      const updatedBookings = allBookings.map((b: Booking) =>
        b.id === bookingId ? updatedBooking : b
      );

      // API'ye kaydet (PUT kullanarak tam güncelleme)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBooking),
        });

        if (response.ok) {
          const savedBooking = await response.json();

          // İptal edilen rezervasyonu cancelledBookings array'ine ekle
          try {
            const cancelledBookingWithDate = {
              ...savedBooking,
              cancelledAt: new Date().toISOString()
            };

            // Önce mevcut cancelledBookings'i al
            let cancelledBookings: Booking[] = [];
            try {
              const cancelledResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/cancelledBookings`);
              if (cancelledResponse.ok) {
                cancelledBookings = await cancelledResponse.json();
              } else if (cancelledResponse.status === 404) {
                // Eğer endpoint yoksa, boş array ile başla
                cancelledBookings = [];
              }
            } catch (fetchError) {
              console.warn('cancelledBookings endpoint\'i bulunamadı, yeni oluşturuluyor...');
              cancelledBookings = [];
            }

            // İptal edilen rezervasyonu ekle (eğer zaten yoksa)
            const alreadyExists = cancelledBookings.some((b: Booking) => b.id === bookingId);
            if (!alreadyExists) {
              const addCancelledResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/cancelledBookings`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(cancelledBookingWithDate),
              });

              if (addCancelledResponse.ok) {
                const addedBooking = await addCancelledResponse.json();
                console.log('İptal edilen rezervasyon cancelledBookings\'e eklendi:', addedBooking);
              } else {
                const errorText = await addCancelledResponse.text();
                console.error('cancelledBookings\'e eklenirken hata:', addCancelledResponse.status, errorText);
                // Hata olsa bile localStorage'a kaydet
                const localCancelled = JSON.parse(localStorage.getItem('cancelledBookings') || '[]');
                if (!localCancelled.some((b: Booking) => b.id === bookingId)) {
                  localCancelled.push(cancelledBookingWithDate);
                  localStorage.setItem('cancelledBookings', JSON.stringify(localCancelled));
                  console.log('İptal edilen rezervasyon localStorage\'a kaydedildi (cancelledBookings)');
                }
              }
            } else {
              console.log('Rezervasyon zaten cancelledBookings\'de mevcut');
            }
          } catch (cancelledError: any) {
            console.error('cancelledBookings\'e eklenirken hata:', cancelledError);
            // Hata olsa bile localStorage'a kaydet
            try {
              const localCancelled = JSON.parse(localStorage.getItem('cancelledBookings') || '[]');
              if (!localCancelled.some((b: Booking) => b.id === bookingId)) {
                localCancelled.push({
                  ...savedBooking,
                  cancelledAt: new Date().toISOString()
                });
                localStorage.setItem('cancelledBookings', JSON.stringify(localCancelled));
                console.log('İptal edilen rezervasyon localStorage\'a kaydedildi (cancelledBookings - hata durumu)');
              }
            } catch (localError) {
              console.error('localStorage\'a kaydedilirken hata:', localError);
            }
          }

          // localStorage'ı da güncelle
          const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
          const bookingIndex = localBookings.findIndex((b: Booking) => b.id === bookingId);
          if (bookingIndex !== -1) {
            localBookings[bookingIndex] = savedBooking;
          } else {
            localBookings.push(savedBooking);
          }
          localStorage.setItem('bookings', JSON.stringify(localBookings));

          // localStorage'a cancelledBookings'i de ekle
          const localCancelled = JSON.parse(localStorage.getItem('cancelledBookings') || '[]');
          const alreadyExistsLocal = localCancelled.some((b: Booking) => b.id === bookingId);
          if (!alreadyExistsLocal) {
            localCancelled.push({
              ...savedBooking,
              cancelledAt: new Date().toISOString()
            });
            localStorage.setItem('cancelledBookings', JSON.stringify(localCancelled));
          }

          console.log('Rezervasyon başarıyla iptal edildi:', savedBooking);
          return;
        } else {
          const errorText = await response.text();
          console.error('API yanıt hatası:', response.status, errorText);
          throw new Error(`API hatası: ${response.status}`);
        }
      } catch (apiError: any) {
        console.error('API\'ye kaydedilemedi:', apiError);
        // API başarısız olursa localStorage'a kaydet
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const bookingIndex = localBookings.findIndex((b: Booking) => b.id === bookingId && String(b.userId) === String(userId));

        if (bookingIndex === -1) {
          throw new Error('Rezervasyon bulunamadı');
        }

        localBookings[bookingIndex] = updatedBooking;
        localStorage.setItem('bookings', JSON.stringify(localBookings));

        // localStorage'a cancelledBookings'i de ekle
        const localCancelled = JSON.parse(localStorage.getItem('cancelledBookings') || '[]');
        const alreadyExistsLocal = localCancelled.some((b: Booking) => b.id === bookingId);
        if (!alreadyExistsLocal) {
          localCancelled.push(updatedBooking);
          localStorage.setItem('cancelledBookings', JSON.stringify(localCancelled));
        }

        console.log('Rezervasyon localStorage\'a kaydedildi:', updatedBooking);
        // localStorage'a kaydedildi ama db.json'a kaydedilmedi, kullanıcıya bilgi ver
        throw new Error('Rezervasyon iptal edildi ancak veritabanına kaydedilemedi. Lütfen sayfayı yenileyin.');
      }
    } catch (error: any) {
      console.error('Rezervasyon iptal hatası:', error);
      throw error;
    }
  }

  async updateBooking(bookingId: number, updates: Partial<Booking>): Promise<Booking> {
    try {
      // API'den güncelle
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          const updatedBooking = await response.json();
          // localStorage'ı da güncelle
          const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
          const bookingIndex = bookings.findIndex((b: Booking) => b.id === bookingId);
          if (bookingIndex !== -1) {
            bookings[bookingIndex] = updatedBooking;
            localStorage.setItem('bookings', JSON.stringify(bookings));
          }
          return updatedBooking;
        }
      } catch (apiError) {
        console.log('API\'ye güncellenemedi, localStorage kullanılıyor...');
      }

      // API başarısız olursa localStorage'dan güncelle
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const bookingIndex = bookings.findIndex((b: Booking) => b.id === bookingId);

      if (bookingIndex === -1) {
        throw new Error('Rezervasyon bulunamadı');
      }

      bookings[bookingIndex] = {
        ...bookings[bookingIndex],
        ...updates
      };

      localStorage.setItem('bookings', JSON.stringify(bookings));
      return bookings[bookingIndex];
    } catch (error) {
      console.error('Rezervasyon güncelleme hatası:', error);
      throw new Error('Rezervasyon güncellenemedi');
    }
  }
}

export const bookingService = new BookingService();