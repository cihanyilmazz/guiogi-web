// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  preferences?: string;
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
    // Login işlemi...
    const mockUser = {
      id: '1',
      name: 'Demo Kullanıcı',
      email: email,
      phone: '+90 555 123 45 67',
      address: 'İstanbul, Türkiye',
      preferences: 'Açık hava turlarını tercih ederim'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: any) => {
    // Register işlemi...
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