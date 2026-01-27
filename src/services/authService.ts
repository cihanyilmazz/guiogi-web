// services/authService.ts
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    preferences?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
  
  class AuthService {
    private getHeaders(): HeadersInit {
      const token = localStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    }
  
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      // Demo login - hardcoded
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        const demoUser: User = {
          id: 1,
          name: "Demo Kullanıcı",
          email: "demo@example.com",
          phone: "0555 123 45 67",
          address: "İstanbul, Türkiye",
          preferences: "Deniz manzaralı otelleri tercih ediyorum",
          createdAt: "2024-01-01T10:00:00.000Z",
          updatedAt: "2024-01-01T10:00:00.000Z"
        };
        
        const token = 'demo-jwt-token-' + Date.now();
        return { user: demoUser, token };
      }
      
      // API'ye istek at
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Giriş başarısız');
      }
  
      return await response.json();
    }
  
    async register(data: RegisterData): Promise<AuthResponse> {
      // json-server kullanıyoruz, direkt /users endpoint'ine POST yapıyoruz
      const userData = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        password: data.password, // Not: Production'da şifre hash'lenmeli
        address: '',
        preferences: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kayıt başarısız');
      }
  
      const savedUser = await response.json();
      
      // AuthResponse formatına dönüştür
      const token = 'jwt-token-' + Date.now();
      return {
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
          address: savedUser.address,
          preferences: savedUser.preferences,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt
        },
        token
      };
    }
  
    async getCurrentUser(): Promise<User> {
      // Demo kullanıcı için hardcoded
      const token = localStorage.getItem('token');
      if (token && token.includes('demo-jwt-token')) {
        return {
          id: 1,
          name: "Demo Kullanıcı",
          email: "demo@example.com",
          phone: "0555 123 45 67",
          address: "İstanbul, Türkiye",
          preferences: "Deniz manzaralı otelleri tercih ediyorum",
          createdAt: "2024-01-01T10:00:00.000Z",
          updatedAt: "2024-01-01T10:00:00.000Z"
        };
      }
  
      // API'den al
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: this.getHeaders(),
      });
  
      if (!response.ok) {
        throw new Error('Kullanıcı bilgileri alınamadı');
      }
  
      return await response.json();
    }
  
    async updateProfile(userData: Partial<User>): Promise<User> {
      // Demo için hardcoded güncelleme
      const currentUser = await this.getCurrentUser();
      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    }
  }
  
  export const authService = new AuthService();