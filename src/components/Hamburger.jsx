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
    <div className="lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-slate-200/80 bg-white/85 backdrop-blur-xl text-slate-800 shadow-inner dark:border-slate-700/80 dark:bg-slate-900/85 dark:text-slate-100">
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-4 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {language === "fr" ? "Navigation" : "Navigation"}
              </p>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {language === "fr" ? "Menu principal" : "Main menu"}
              </h3>
            </div>
            <div className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
              AF3M
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            item.type === "link" ? (
              <Link
                key={index}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-base font-medium text-slate-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-600 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-800/80 dark:hover:text-blue-300"
                onClick={toggleMenu}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-700/70 dark:text-slate-300 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-300">
                  {item.icon}
                </div>
                <span className="flex-1">{language === "fr" ? item.labelFr : item.labelEn}</span>
                <div className="h-2.5 w-2.5 rounded-full bg-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
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
        </nav>

        <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 shadow-sm dark:border-slate-700/80 dark:bg-slate-800/70">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
              {isDark ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {language === "fr" ? "Préférences" : "Preferences"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "fr" ? "Thème et langue" : "Theme and language"}
              </p>
            </div>
          </div>

          <button
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/70 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-700/70 dark:hover:text-blue-300"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {isDark ? <FaMoon className="w-4 h-4" /> : <FaSun className="w-4 h-4" />}
              </span>
              <span>{isDark ? (language === "fr" ? "Mode sombre" : "Dark mode") : (language === "fr" ? "Mode clair" : "Light mode")}</span>
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {isDark ? (language === "fr" ? "ON" : "ON") : (language === "fr" ? "OFF" : "OFF")}
            </span>
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              aria-label="French"
              onClick={() => handleLanguageSwitch("fr")}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                language === "fr"
                  ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700"
              }`}
            >
              <Image src="/img/france.png" width={18} height={18} className="rounded-full" alt="French" />
              <span>Français</span>
            </button>
            <button
              aria-label="English"
              onClick={() => handleLanguageSwitch("en")}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                language === "en"
                  ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700"
              }`}
            >
              <Image src="/img/uk.png" width={18} height={18} className="rounded-full" alt="English" />
              <span>English</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 text-center text-xs text-slate-500 shadow-sm dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-400">
          AF3M © 2024 • {language === "fr" ? "Association des mécaniciens et matériaux" : "Association of mechanics and materials"}
        </div>
      </div>
    </div>
  );
}

export default Hamburger;