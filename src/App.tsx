// App.tsx - GÜNCELLENMİŞ
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/footer';
import routes from './routes';
import i18n, { loadLanguage, addLanguage } from './i18n/config';

const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Uygulama başlangıcında localStorage'dan çevirileri yükle
  useEffect(() => {
    const loadSavedTranslations = async () => {
      // Tüm localStorage'daki çevirileri yükle
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('translations_')) {
          const langCode = key.replace('translations_', '');
          try {
            const translations = JSON.parse(localStorage.getItem(key) || '{}');
            if (Object.keys(translations).length > 0) {
              await addLanguage(langCode, translations);
            }
          } catch (error) {
            console.error(`Error loading translations for ${langCode}:`, error);
          }
        }
      }
    };
    
    loadSavedTranslations();
  }, []);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAgentRoute = location.pathname.startsWith('/agent');

  // Admin ve Agent rotalarında Header ve Footer gösterilmez
  if (isAdminRoute || isAgentRoute) {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" tip="Yükleniyor..." />
        </div>
      }>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            >
              {route.children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    );
  }

  // Normal site rotalarında Header ve Footer gösterilir
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <Spin size="large" tip="Yükleniyor..." />
          </div>
        }>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              >
                {route.children?.map((child, childIndex) => (
                  <Route
                    key={childIndex}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            ))}
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;