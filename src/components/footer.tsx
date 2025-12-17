import React from "react";
import { Layout } from "antd";
import { useTranslation } from "react-i18next";
import {
  FacebookFilled,
  InstagramFilled,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Footer className="bg-[#1E1E1E] text-white py-8 md:py-12 mt-auto">
      <div className="container mx-auto px-4">
        {/* Başlık */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">
          # Guiaogi
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Turlar Kolonu */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t("footer.tours")}</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Meksika
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Misir
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dubai
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Morocco
                </a>
              </li>
            </ul>
          </div>

          {/* Kurumsal Kolonu */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {t("footer.corporate")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.kvkk")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.termsOfService")}
                </a>
              </li>
            </ul>
          </div>

          {/* Kampanyalar Kolonu */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {t("footer.campaigns")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.dubaiCampaigns")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.mexicoCampaigns")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.egyptCampaigns")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("footer.allCampaigns")}
                </a>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya Kolonu */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              {t("footer.socialMedia")}
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FacebookFilled className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <InstagramFilled className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <TwitterCircleFilled className="text-2xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <YoutubeFilled className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Ayırıcı Çizgi */}
        <div className="border-t border-gray-700 pt-6">
          <div className="text-center text-gray-400">
            <p className="text-sm md:text-base">
              {t("footer.allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
