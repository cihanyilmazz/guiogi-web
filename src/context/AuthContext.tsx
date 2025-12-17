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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:32',message:'Login function called',data:{email,passwordLength:password.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:37',message:'Fetching users from json-server',data:{url:'http://49.13.94.27/:3005/users?email='+encodeURIComponent(email)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // json-server'dan email ile kullanıcıyı bul
      let response;
      try {
        // Önce /api/users deneyelim
        response = await fetch(`http://49.13.94.27/:3005/api/users?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:49',message:'API users response received',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        // 404 ise /users endpoint'ini dene
        if (response.status === 404) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:55',message:'404 error - trying alternative endpoint',data:{alternativeUrl:'http://49.13.94.27/:3005/users?email='+encodeURIComponent(email)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          
          response = await fetch(`http://49.13.94.27/:3005/users?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:65',message:'Alternative endpoint response',data:{status:response.status,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        }
      } catch (fetchError: any) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:71',message:'Fetch network error',data:{errorMessage:fetchError.message,errorName:fetchError.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        throw new Error(`Bağlantı hatası: ${fetchError.message}. json-server çalışıyor mu?`);
      }

      if (!response.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:78',message:'API request failed',data:{status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        throw new Error(`Giriş başarısız (HTTP ${response.status})`);
      }

      const users = await response.json();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:85',message:'Users fetched from API',data:{usersCount:Array.isArray(users)?users.length:0,isArray:Array.isArray(users)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Kullanıcı bulundu mu kontrol et
      const userArray = Array.isArray(users) ? users : [users];
      const foundUser = userArray.find((u: any) => u.email === email);

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:92',message:'User lookup result',data:{userFound:!!foundUser,userEmail:foundUser?.email,hasPassword:!!foundUser?.password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (!foundUser) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:97',message:'User not found',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error('E-posta veya şifre hatalı');
      }

      // Şifre kontrolü
      if (foundUser.password !== password) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:104',message:'Password mismatch',data:{email,passwordMatch:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error('E-posta veya şifre hatalı');
      }

      // Kullanıcı onay kontrolü (admin ve agent hariç)
      if (foundUser.role !== 'admin' && foundUser.role !== 'agent' && !foundUser.isApproved) {
        throw new Error('Hesabınız henüz onaylanmamış. Lütfen admin onayı bekleyin.');
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:110',message:'Login successful - setting user state',data:{userId:foundUser.id,email:foundUser.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:125',message:'User state updated',data:{userSet:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:129',message:'Login error caught',data:{errorMessage:error.message,errorName:error.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.error('Giriş hatası:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: any) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:151',message:'Register function called',data:{email:userData.email,name:userData.name,hasPhone:!!userData.phone},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      // Önce email'in zaten kullanılıp kullanılmadığını kontrol et
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:157',message:'Checking if email already exists',data:{email:userData.email,checkUrl:'http://49.13.94.27/:3005/api/users?email='+encodeURIComponent(userData.email)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      let emailCheckResponse;
      try {
        // Önce /api/users endpoint'ini dene
        emailCheckResponse = await fetch(`http://49.13.94.27/:3005/api/users?email=${encodeURIComponent(userData.email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:168',message:'Email check API response',data:{status:emailCheckResponse.status,ok:emailCheckResponse.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        // 404 ise /users endpoint'ini dene
        if (emailCheckResponse.status === 404) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:174',message:'404 error - trying alternative endpoint for email check',data:{alternativeUrl:'http://49.13.94.27/:3005/users?email='+encodeURIComponent(userData.email)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          
          emailCheckResponse = await fetch(`http://49.13.94.27/:3005/users?email=${encodeURIComponent(userData.email)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:184',message:'Alternative endpoint email check response',data:{status:emailCheckResponse.status,ok:emailCheckResponse.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        }
      } catch (emailCheckError: any) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:190',message:'Email check network error',data:{errorMessage:emailCheckError.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Network hatası olsa bile kayıt işlemini devam ettir (email kontrolü opsiyonel)
        console.warn('Email kontrolü yapılamadı:', emailCheckError);
      }

      // Email kontrolü başarılı olduysa sonucu kontrol et
      if (emailCheckResponse && emailCheckResponse.ok) {
        const existingUsers = await emailCheckResponse.json();
        const userArray = Array.isArray(existingUsers) ? existingUsers : [existingUsers];
        const existingUser = userArray.find((u: any) => u.email === userData.email);

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:201',message:'Email check result',data:{emailExists:!!existingUser,usersFound:userArray.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion

        if (existingUser) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:206',message:'Email already exists - throwing error',data:{email:userData.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
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

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:68',message:'Preparing fetch request',data:{url:'http://49.13.94.27/:3005/api/users',userData:newUser},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // json-server API'sine POST isteği gönder
      let response;
      try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:75',message:'Fetch request starting',data:{url:'http://49.13.94.27/:3005/api/users'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        response = await fetch('http://49.13.94.27/:3005/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:87',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      } catch (fetchError: any) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:92',message:'Fetch network error',data:{errorMessage:fetchError.message,errorName:fetchError.name,errorStack:fetchError.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        throw new Error(`Bağlantı hatası: ${fetchError.message}. json-server çalışıyor mu?`);
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:104',message:'API request failed',data:{status:response.status,statusText:response.statusText,errorData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        
        // json-server endpoint formatını kontrol et - /api/users yerine /users deneyelim
        if (response.status === 404) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:109',message:'404 error - trying alternative endpoint',data:{originalUrl:'http://49.13.94.27/:3005/api/users',alternativeUrl:'http://49.13.94.27/:3005/users'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          
          // /api/users 404 verdi, /users deneyelim
          const altResponse = await fetch('http://49.13.94.27/:3005/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          });

          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:122',message:'Alternative endpoint response',data:{status:altResponse.status,ok:altResponse.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion

          if (!altResponse.ok) {
            const altErrorData = await altResponse.json().catch(() => ({}));
            throw new Error(altErrorData.message || 'Kayıt başarısız');
          }

          const savedUser = await altResponse.json();
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:131',message:'User saved via alternative endpoint',data:{userId:savedUser.id,email:savedUser.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion

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
        
        throw new Error(errorData.message || `Kayıt başarısız (HTTP ${response.status})`);
      }

      const savedUser = await response.json();
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:152',message:'User saved successfully',data:{userId:savedUser.id,email:savedUser.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:166',message:'User state updated',data:{userSet:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a29d79da-c2fb-4547-a375-e0d59332ce77',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.tsx:170',message:'Register error caught',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
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