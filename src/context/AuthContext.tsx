// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: string;
  role?: 'admin' | 'agent' | 'user';
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Diğer kullanıcı özellikleri...
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>; // Bu satırı ekleyin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // localStorage'dan kullanıcı bilgilerini yükle
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {

    try {

      // json-server'dan email ile kullanıcıyı bul
      let response;
      try {
        // Önce /api/users deneyelim
        response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/users?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        // 404 ise /users endpoint'ini dene
        if (response.status === 404) {

          response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/users?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

        }
      } catch (fetchError: any) {
        throw new Error(`Bağlantı hatası: ${fetchError.message}. json-server çalışıyor mu?`);
      }

      if (!response.ok) {
        throw new Error(`Giriş başarısız (HTTP ${response.status})`);
      }

      const users = await response.json();


      // Kullanıcı bulundu mu kontrol et
      const userArray = Array.isArray(users) ? users : [users];
      const foundUser = userArray.find((u: any) => u.email === email);


      if (!foundUser) {
        throw new Error('E-posta veya şifre hatalı');
      }

      // Şifre kontrolü
      if (foundUser.password !== password) {
        throw new Error('E-posta veya şifre hatalı');
      }

      // Kullanıcı onay kontrolü (admin ve agent hariç)
      if (foundUser.role !== 'admin' && foundUser.role !== 'agent' && !foundUser.isApproved) {
        throw new Error('Hesabınız henüz onaylanmamış. Lütfen admin onayı bekleyin.');
      }


      // Kullanıcıyı state'e ve localStorage'a kaydet (şifre hariç)
      const userForState = {
        id: foundUser.id.toString(),
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone || '',
        address: foundUser.address || '',
        preferences: foundUser.preferences || '',
        role: foundUser.role || 'user',
        isApproved: foundUser.isApproved !== undefined ? foundUser.isApproved : true
      };

      setUser(userForState);
      localStorage.setItem('user', JSON.stringify(userForState));

    } catch (error: any) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: any) => {

    try {
      // Önce email'in zaten kullanılıp kullanılmadığını kontrol et

      let emailCheckResponse;
      try {
        // Önce /api/users endpoint'ini dene
        emailCheckResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/users?email=${encodeURIComponent(userData.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });


        // 404 ise /users endpoint'ini dene
        if (emailCheckResponse.status === 404) {

          emailCheckResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/users?email=${encodeURIComponent(userData.email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

        }
      } catch (emailCheckError: any) {
        // Network hatası olsa bile kayıt işlemini devam ettir (email kontrolü opsiyonel)
        console.warn('Email kontrolü yapılamadı:', emailCheckError);
      }

      // Email kontrolü başarılı olduysa sonucu kontrol et
      if (emailCheckResponse && emailCheckResponse.ok) {
        const existingUsers = await emailCheckResponse.json();
        const userArray = Array.isArray(existingUsers) ? existingUsers : [existingUsers];
        const existingUser = userArray.find((u: any) => u.email === userData.email);


        if (existingUser) {
          throw new Error('Bu mail zaten kullanılıyor');
        }
      }

      // Kullanıcı verilerini hazırla
      const newUser = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        password: userData.password, // Not: Production'da şifre hash'lenmeli
        address: '',
        preferences: '',
        role: 'user', // Yeni kayıt olanlar varsayılan olarak 'user' rolüne sahip
        isApproved: false, // Yeni kullanıcılar onay bekliyor
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };


      // json-server API'sine POST isteği gönder
      let response;
      try {

        response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

      } catch (fetchError: any) {
        throw new Error(`Bağlantı hatası: ${fetchError.message}. json-server çalışıyor mu?`);
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }


        // json-server endpoint formatını kontrol et - /api/users yerine /users deneyelim
        if (response.status === 404) {

          // /api/users 404 verdi, /users deneyelim
          const altResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          });


          if (!altResponse.ok) {
            const altErrorData = await altResponse.json().catch(() => ({}));
            throw new Error(altErrorData.message || 'Kayıt başarısız');
          }

          const savedUser = await altResponse.json();


          // Kullanıcıyı state'e ve localStorage'a kaydet (şifre hariç)
          const userForState = {
            id: savedUser.id.toString(),
            name: savedUser.name,
            email: savedUser.email,
            phone: savedUser.phone,
            address: savedUser.address,
            preferences: savedUser.preferences,
            role: savedUser.role || 'user',
            isApproved: savedUser.isApproved !== undefined ? savedUser.isApproved : false
          };

          setUser(userForState);
          localStorage.setItem('user', JSON.stringify(userForState));
          return;
        }

        throw new Error(errorData.message || `Kayıt başarısız(HTTP ${response.status})`);
      }

      const savedUser = await response.json();


      // Kullanıcıyı state'e ve localStorage'a kaydet (şifre hariç)
      const userForState = {
        id: savedUser.id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        address: savedUser.address,
        preferences: savedUser.preferences,
        role: savedUser.role || 'user',
        isApproved: savedUser.isApproved !== undefined ? savedUser.isApproved : false
      };

      setUser(userForState);
      localStorage.setItem('user', JSON.stringify(userForState));

    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  };

  // updateUser fonksiyonunu ekleyin
  const updateUser = async (updatedUser: User) => {
    try {
      // API çağrısı yapılacak
      // Şimdilik localStorage'ı güncelliyoruz
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUser, // Bu satırı ekleyin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};