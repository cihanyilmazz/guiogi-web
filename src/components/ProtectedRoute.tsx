// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'admin' | 'agent' | 'user';
  requireApproval?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireApproval = true 
}) => {
  const { user, isAuthenticated } = useAuth();

  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isAuthenticated || !user) {
    return <Navigate to="/giris" replace />;
  }

  // Onay kontrolü (admin ve agent için gerekli değil)
  if (requireApproval && user.role === 'user' && !user.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Hesap Onayı Bekleniyor
          </h2>
          <p className="text-gray-600 mb-6">
            Hesabınız henüz admin tarafından onaylanmamış. Lütfen onay bekleyin.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Rol kontrolü
  if (requiredRole) {
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    if (requiredRole === 'agent' && user.role !== 'agent' && user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    if (requiredRole === 'user' && user.role !== 'user' && user.role !== 'admin' && user.role !== 'agent') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
