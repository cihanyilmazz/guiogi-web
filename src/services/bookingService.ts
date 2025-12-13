// services/bookingService.ts
export interface Booking {
    id: number;
    userId: number;
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
  }
  
  class BookingService {
    async createBooking(bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Promise<Booking> {
      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        const newBooking: Booking = {
          ...bookingData,
          id: bookings.length > 0 ? Math.max(...bookings.map((b: Booking) => b.id)) + 1 : 1,
          bookingNumber: `BKG-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: bookingData.status || 'pending',
          paymentStatus: bookingData.paymentStatus || 'pending'
        };
        
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        return newBooking;
      } catch (error) {
        console.error('Rezervasyon oluşturma hatası:', error);
        throw new Error('Rezervasyon oluşturulamadı');
      }
    }
  
    async getUserBookings(userId: number): Promise<Booking[]> {
      try {
        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // Demo kullanıcı için örnek rezervasyonlar
        if (bookings.length === 0 && userId === 1) {
          const demoBookings: Booking[] = [
            {
              id: 1,
              userId: 1,
              tourId: 1,
              tourTitle: 'Kapadokya Balon Turu',
              tourImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
              bookingDate: '2024-01-15',
              travelDate: '2024-03-20',
              persons: 2,
              totalPrice: 4250,
              status: 'confirmed',
              paymentStatus: 'paid',
              bookingNumber: 'BKG-2024-001',
              specialRequests: 'Balon turu için ön sıra istiyorum',
              createdAt: '2024-01-15T10:30:00.000Z'
            },
            {
              id: 2,
              userId: 1,
              tourId: 2,
              tourTitle: 'Pamukkale Günübirlik Tur',
              tourImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
              bookingDate: '2024-01-10',
              travelDate: '2024-02-25',
              persons: 4,
              totalPrice: 3600,
              status: 'completed',
              paymentStatus: 'paid',
              bookingNumber: 'BKG-2024-002',
              createdAt: '2024-01-10T14:20:00.000Z'
            },
            {
              id: 3,
              userId: 1,
              tourId: 3,
              tourTitle: 'Efes Antik Kenti Turu',
              tourImage: 'https://images.unsplash.com/photo-1593693399021-8ddfc4db6e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
              bookingDate: '2024-01-05',
              travelDate: '2024-04-15',
              persons: 3,
              totalPrice: 3200,
              status: 'pending',
              paymentStatus: 'pending',
              bookingNumber: 'BKG-2024-003',
              createdAt: '2024-01-05T09:15:00.000Z'
            },
            {
              id: 4,
              userId: 1,
              tourId: 4,
              tourTitle: 'İstanbul Boğaz Turu',
              tourImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80',
              bookingDate: '2023-12-20',
              travelDate: '2024-01-10',
              persons: 2,
              totalPrice: 1200,
              status: 'cancelled',
              paymentStatus: 'refunded',
              bookingNumber: 'BKG-2023-045',
              createdAt: '2023-12-20T16:45:00.000Z'
            }
          ];
          
          localStorage.setItem('bookings', JSON.stringify(demoBookings));
          return demoBookings.filter(booking => booking.userId === userId);
        }
        
        return bookings.filter((booking: Booking) => booking.userId === userId);
      } catch (error) {
        console.error('Rezervasyonlar yüklenirken hata:', error);
        throw new Error('Rezervasyonlar yüklenemedi');
      }
    }
  
    async cancelBooking(bookingId: number, userId: number): Promise<void> {
      try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const bookingIndex = bookings.findIndex((b: Booking) => b.id === bookingId && b.userId === userId);
        
        if (bookingIndex === -1) {
          throw new Error('Rezervasyon bulunamadı');
        }
        
        bookings[bookingIndex] = {
          ...bookings[bookingIndex],
          status: 'cancelled',
          paymentStatus: 'refunded'
        };
        
        localStorage.setItem('bookings', JSON.stringify(bookings));
      } catch (error) {
        console.error('Rezervasyon iptal hatası:', error);
        throw new Error('Rezervasyon iptal edilemedi');
      }
    }
  
    async updateBooking(bookingId: number, updates: Partial<Booking>): Promise<Booking> {
      try {
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