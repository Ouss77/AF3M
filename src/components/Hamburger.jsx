import Link from "next/link";
import React, { useState } from "react";
import Dropdown from "./Dropdown";
import Image from "next/image";
import { FaChevronDown, FaNewspaper, FaUsers, FaCalendar, FaClipboard, FaGlobe, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "./Context/ThemeContext";

function Hamburger({
  translations,
  toggleMenu,
  menuOpen,
  openDropdown,
  toggleDropdown,
  dropdownRefs,
  dropdownItemsAf3m,
  dropdownItemsConf,
  dropdownItemsAdhesion,
  language,
  switchLanguage,
}) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleLanguageSwitch = (lang) => {
    switchLanguage(lang);
    setIsLanguageDropdownOpen(false);
    toggleMenu();
  };

  const menuItems = [
    {
      href: "/actualites",
      icon: <FaNewspaper className="w-5 h-5" />,
      labelFr: "Actualités",
      labelEn: "News",
      type: "link"
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      label: translations.af3m,
      dropdownKey: "af3m",
      items: dropdownItemsAf3m,
      type: "dropdown"
    },
    {
      icon: <FaCalendar className="w-5 h-5" />,
      label: translations.conferences,
      dropdownKey: "conferences",
      items: dropdownItemsConf,
      type: "dropdown"
    },
    {
      href: "/JetCommunication/communications",
      icon: <FaClipboard className="w-5 h-5" />,
      labelFr: "Communications JET",
      labelEn: "JET Communications",
      type: "link"
    },
    {
      icon: <FaUsers className="w-5 h-5" />,
      label: translations.adhesion,
      dropdownKey: "adhesion",
      items: dropdownItemsAdhesion,
      type: "dropdown"
    }
  ];

  return (
    <div className="lg:hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="p-4 sm:p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            item.type === "link" ? (
              <Link
                key={index}
                href={item.href}
                className="group flex items-center gap-4 text-base sm:text-lg text-white hover:text-blue-400 transition-all duration-300 font-medium py-3 px-4 rounded-xl hover:bg-slate-700/50 border-l-4 border-transparent hover:border-blue-400"
                onClick={toggleMenu}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="flex-1">{language === "fr" ? item.labelFr : item.labelEn}</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ) : (
              <div key={index} className="relative">
                <Dropdown
                  label={item.label}
                  icon={item.icon}
                  dropdownKey={item.dropdownKey}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={item.items}
                  dropdownRef={(el) => (dropdownRefs.current[item.dropdownKey] = el)}
                  toggleMenu={toggleMenu}
                  isMobile={true}
                />
              </div>
            )
          ))}

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                {language === "fr" ? "Thème" : "Theme"}
              </span>
            </div>
          </div>

          <button
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
            className="group flex items-center gap-3 w-full text-white hover:text-blue-400 py-3 px-4 rounded-xl hover:bg-slate-700/50 font-medium transition-all duration-300 border-l-4 border-transparent hover:border-blue-400"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-all duration-300">
              {isDark ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
            </div>
            <span>{isDark ? (language === "fr" ? "Sombre" : "Dark") : (language === "fr" ? "Clair" : "Light")}</span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                {language === "fr" ? "Langue" : "Language"}
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              aria-label="Language Dropdown"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="group flex items-center gap-4 w-full text-white hover:text-blue-400 py-3 px-4 rounded-xl hover:bg-slate-700/50 font-medium transition-all duration-300 border-l-4 border-transparent hover:border-blue-400"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-all duration-300">
                <FaGlobe className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Image src="/img/france.png" width={24} height={24} className="rounded" alt="French" />
                <span className="text-slate-400">/</span>
                <Image src="/img/uk.png" width={24} height={24} className="rounded" alt="English" />
              </div>
              <span className={`transition-transform duration-300 ${isLanguageDropdownOpen ? "rotate-180" : "rotate-0"}`}>
                <FaChevronDown className="w-4 h-4" />
              </span>
            </button>

            {isLanguageDropdownOpen && (
              <div className="mt-2 ml-4 space-y-1 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600/50 overflow-hidden shadow-xl animate-fade-in">
                <button
                  aria-label="French"
                  className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                    language === "fr" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                      : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
                  }`}
                  onClick={() => handleLanguageSwitch("fr")}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    language === "fr" ? "bg-white/20" : "bg-slate-700"
                  }`}>
                    <Image src="/img/france.png" width={20} height={20} alt="French" />
                  </div>
                  <span className="font-medium">Français</span>
                  {language === "fr" && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
                <button
                  aria-label="English"
                  className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center gap-3 ${
                    language === "en" 
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
                      : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
                  }`}
                  onClick={() => handleLanguageSwitch("en")}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    language === "en" ? "bg-white/20" : "bg-slate-700"
                  }`}>
                    <Image src="/img/uk.png" width={20} height={20} alt="English" />
                  </div>
                  <span className="font-medium">English</span>
                  {language === "en" && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-slate-600/50">
          <p className="text-xs text-slate-400 text-center">
            AF3M © 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hamburger;