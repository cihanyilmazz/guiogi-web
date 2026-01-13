// components/Header.tsx - güncelleyin
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Avatar, Dropdown, Menu, Select } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
  PhoneFilled,
  MailFilled,
  FacebookFilled,
  InstagramFilled,
  TwitterCircleFilled,
  YoutubeFilled,
  DashboardOutlined,
  AppstoreOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/images/logo.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([
    { code: 'tr', name: t("common.turkish") },
    { code: 'en', name: t("common.english") },
  ]);

  useEffect(() => {
    // localStorage'dan dilleri yükle
    const loadLanguages = async () => {
      try {
        const response = await fetch('http://guiaogi.com/languages');
        if (response.ok) {
          const langs = await response.json();
          const activeLangs = (Array.isArray(langs) ? langs : [])
            .filter((l: any) => l.isActive !== false)
            .map((l: any) => ({
              code: l.code,
              name: l.nativeName || l.name,
            }));
          
          if (activeLangs.length > 0) {
            setAvailableLanguages(activeLangs);
          }
        }
      } catch (error) {
        // API yoksa default dilleri kullan
        console.log('Languages API not available, using defaults');
      }
    };
    
    loadLanguages();
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const userMenu = (
    <Menu>
      {user?.role === 'admin' && (
        <>
          <Menu.Item
            key="admin"
            icon={<DashboardOutlined />}
            onClick={() => navigate("/admin")}
          >
            {t("header.adminPanel")}
          </Menu.Item>
          <Menu.Item
            key="agent"
            icon={<AppstoreOutlined />}
            onClick={() => navigate("/agent/tours")}
          >
            {t("header.agentPanel")}
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      {user?.role === 'agent' && (
        <>
          <Menu.Item
            key="agent"
            icon={<AppstoreOutlined />}
            onClick={() => navigate("/agent/tours")}
          >
            {t("header.agentPanel")}
          </Menu.Item>
          <Menu.Divider />
        </>
      )}
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate("/profil")}
      >
        {t("header.profile")}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t("header.logout")}
      </Menu.Item>
    </Menu>
  );

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header - Sosyal Medya ve İletişim */}
      <div
        className="text-white py-2 sm:py-2.5 border-b"
        style={{ backgroundColor: "#9E0102" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            {/* İletişim Bilgileri */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <a
                href="tel:+905551234567"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
              >
                <PhoneFilled className="text-sm lg:text-base" />
                <span className="text-xs sm:text-sm lg:text-base">
                  +90 555 123 45 67
                </span>
              </a>
              <a
                href="mailto:info@guiaogi.com"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
              >
                <MailFilled className="text-sm lg:text-base" />
                <span className="text-xs sm:text-sm lg:text-base">
                  info@guiaogi.com
                </span>
              </a>
            </div>

            {/* Sosyal Medya İkonları */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Facebook"
              >
                <FacebookFilled className="text-base lg:text-lg" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Instagram"
              >
                <InstagramFilled className="text-base lg:text-lg" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Twitter"
              >
                <TwitterCircleFilled className="text-base lg:text-lg" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="YouTube"
              >
                <YoutubeFilled className="text-base lg:text-lg" />
              </a>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 sm:justify-between">
              {/* İletişim Bilgileri */}
              <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-4">
                <a
                  href="tel:+905551234567"
                  className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity duration-200"
                >
                  <PhoneFilled className="text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm">+90 555 123 45 67</span>
                </a>
                <a
                  href="mailto:info@guiaogi.com"
                  className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity duration-200"
                >
                  <MailFilled className="text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">
                    info@guiaogi.com
                  </span>
                </a>
              </div>

              {/* Sosyal Medya İkonları */}
              <div className="flex items-center space-x-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                  aria-label="Facebook"
                >
                  <FacebookFilled className="text-sm sm:text-base" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                  aria-label="Instagram"
                >
                  <InstagramFilled className="text-sm sm:text-base" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                  aria-label="Twitter"
                >
                  <TwitterCircleFilled className="text-sm sm:text-base" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200"
                  aria-label="YouTube"
                >
                  <YoutubeFilled className="text-sm sm:text-base" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Ana Header */}
          <div className="flex justify-between items-center py-4 sm:py-5">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group flex-shrink-0"
              onClick={closeMobileMenu}
            >
              <div className="relative">
                <img
                  src={logoImage}
                  alt="GuiaOgi Turizm Logo"
                  className="relative h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  style={{ backgroundColor: "transparent" }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                  }}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg transition-all duration-200 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9E0102";
                  e.currentTarget.style.backgroundColor = "#FFEBEE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <span className="relative z-10">{t("common.home")}</span>
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(158, 1, 2, 0.1)" }}
                ></span>
              </Link>
              <Link
                to="/turlar"
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg transition-all duration-200 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9E0102";
                  e.currentTarget.style.backgroundColor = "#FFEBEE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <span className="relative z-10">{t("common.tours")}</span>
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(158, 1, 2, 0.1)" }}
                ></span>
              </Link>
              <Link
                to="/hakkimizda"
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg transition-all duration-200 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9E0102";
                  e.currentTarget.style.backgroundColor = "#FFEBEE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <span className="relative z-10">{t("common.about")}</span>
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(158, 1, 2, 0.1)" }}
                ></span>
              </Link>
              <Link
                to="/blog"
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg transition-all duration-200 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9E0102";
                  e.currentTarget.style.backgroundColor = "#FFEBEE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <span className="relative z-10">{t("common.blog")}</span>
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(158, 1, 2, 0.1)" }}
                ></span>
              </Link>
              <Link
                to="/iletisim"
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg transition-all duration-200 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#9E0102";
                  e.currentTarget.style.backgroundColor = "#FFEBEE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
              >
                <span className="relative z-10">{t("common.contact")}</span>
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(158, 1, 2, 0.1)" }}
                ></span>
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Language Selector */}
              <Select
                value={i18n.language}
                onChange={changeLanguage}
                style={{ width: 120 }}
                suffixIcon={<GlobalOutlined />}
              >
                {availableLanguages.map(lang => (
                  <Select.Option key={lang.code} value={lang.code}>
                    {lang.name}
                  </Select.Option>
                ))}
              </Select>
              {isAuthenticated ? (
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <div
                    className="flex items-center cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 border border-transparent hover:shadow-md group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFEBEE";
                      e.currentTarget.style.borderColor = "#9E0102";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.borderColor = "";
                    }}
                  >
                    <Avatar
                      icon={<UserOutlined />}
                      className="mr-2 text-white shadow-sm group-hover:shadow-md transition-shadow"
                      style={{ backgroundColor: "#9E0102" }}
                      size="default"
                    />
                    <span
                      className="text-gray-700 font-semibold text-sm transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#9E0102";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                    >
                      {user?.name}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <>
                  <Button
                    type="default"
                    size="middle"
                    onClick={() => navigate("/giris")}
                    className="border-gray-300 text-gray-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#9E0102";
                      e.currentTarget.style.color = "#9E0102";
                      e.currentTarget.style.backgroundColor = "#FFEBEE";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.color = "";
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    {t("common.login")}
                  </Button>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => navigate("/kayit")}
                    className="border-0 font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    style={{
                      backgroundColor: "#9E0102",
                      borderColor: "#9E0102",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#8B0000";
                      e.currentTarget.style.borderColor = "#8B0000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#9E0102";
                      e.currentTarget.style.borderColor = "#9E0102";
                    }}
                  >
                    {t("common.register")}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button & Auth */}
            <div className="flex items-center space-x-2 lg:hidden">
              {/* Language Selector Mobile */}
              <Select
                value={i18n.language}
                onChange={changeLanguage}
                style={{ width: 100 }}
                size="small"
                suffixIcon={<GlobalOutlined />}
              >
                {availableLanguages.map(lang => (
                  <Select.Option key={lang.code} value={lang.code}>
                    {lang.name}
                  </Select.Option>
                ))}
              </Select>
              {isAuthenticated ? (
                <Dropdown overlay={userMenu} placement="bottomRight">
                  <div
                    className="flex items-center cursor-pointer px-2 py-1.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFEBEE";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    <Avatar
                      icon={<UserOutlined />}
                      className="text-white shadow-sm"
                      style={{ backgroundColor: "#9E0102" }}
                      size="small"
                    />
                    <span
                      className="hidden sm:inline text-gray-700 font-medium text-xs ml-1.5 max-w-[80px] truncate"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#9E0102";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                    >
                      {user?.name}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <Button
                    type="default"
                    size="small"
                    onClick={() => navigate("/giris")}
                    className="border-gray-300 text-gray-700 text-xs px-2 sm:px-3"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#9E0102";
                      e.currentTarget.style.color = "#9E0102";
                      e.currentTarget.style.backgroundColor = "#FFEBEE";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.color = "";
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    {t("common.login")}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => navigate("/kayit")}
                    className="border-0 text-xs px-2 sm:px-3 hidden sm:inline-block shadow-md"
                    style={{
                      backgroundColor: "#9E0102",
                      borderColor: "#9E0102",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#8B0000";
                      e.currentTarget.style.borderColor = "#8B0000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#9E0102";
                      e.currentTarget.style.borderColor = "#9E0102";
                    }}
                  >
                    {t("common.register")}
                  </Button>
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-2.5 text-gray-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.backgroundColor = "#9E0102";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.backgroundColor = "";
                }}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <CloseOutlined className="text-lg" />
                ) : (
                  <MenuOutlined className="text-lg" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 bg-gradient-to-b from-white to-gray-50/50 animate-in slide-in-from-top duration-300">
              <nav className="flex flex-col space-y-1">
                <Link
                  to="/"
                  className="px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-transparent"
                  onClick={closeMobileMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9E0102";
                    e.currentTarget.style.backgroundColor = "#FFEBEE";
                    e.currentTarget.style.borderColor = "#9E0102";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  {t("common.home")}
                </Link>
                <Link
                  to="/turlar"
                  className="px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-transparent"
                  onClick={closeMobileMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9E0102";
                    e.currentTarget.style.backgroundColor = "#FFEBEE";
                    e.currentTarget.style.borderColor = "#9E0102";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  {t("common.tours")}
                </Link>
                <Link
                  to="/hakkimizda"
                  className="px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-transparent"
                  onClick={closeMobileMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9E0102";
                    e.currentTarget.style.backgroundColor = "#FFEBEE";
                    e.currentTarget.style.borderColor = "#9E0102";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  {t("common.about")}
                </Link>
                <Link
                  to="/blog"
                  className="px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-transparent"
                  onClick={closeMobileMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9E0102";
                    e.currentTarget.style.backgroundColor = "#FFEBEE";
                    e.currentTarget.style.borderColor = "#9E0102";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  {t("common.blog")}
                </Link>
                <Link
                  to="/iletisim"
                  className="px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-200 border border-transparent"
                  onClick={closeMobileMenu}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#9E0102";
                    e.currentTarget.style.backgroundColor = "#FFEBEE";
                    e.currentTarget.style.borderColor = "#9E0102";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  {t("common.contact")}
                </Link>
                {!isAuthenticated && (
                  <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
                    <Button
                      type="primary"
                      block
                      onClick={() => {
                        navigate("/kayit");
                        closeMobileMenu();
                      }}
                      className="border-0 font-semibold shadow-md hover:shadow-lg transition-all"
                      style={{
                        backgroundColor: "#9E0102",
                        borderColor: "#9E0102",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#8B0000";
                        e.currentTarget.style.borderColor = "#8B0000";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#9E0102";
                        e.currentTarget.style.borderColor = "#9E0102";
                      }}
                    >
                      {t("common.register")}
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
