// components/Header.tsx - güncelleyin
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profil')}>
        Profilim
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Çıkış Yap
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Guiaogi Turizm
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Ana Sayfa
            </Link>
            <Link to="/turlar" className="text-gray-700 hover:text-blue-600">
              Turlar
            </Link>
            <Link to="/hakkimizda" className="text-gray-700 hover:text-blue-600">
              Hakkımızda
            </Link>
            <Link to="/iletisim" className="text-gray-700 hover:text-blue-600">
              İletişim
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="mr-2 bg-blue-100 text-blue-600"
                />
                <span className="text-gray-700 font-medium">
                  {user?.name}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => navigate('/giris')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Giriş Yap
              </Button>
              <Button
                onClick={() => navigate('/kayit')}
                className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"
              >
                Kayıt Ol
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;