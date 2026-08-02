import React, { useContext, useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaGlobe, FaCheck } from "react-icons/fa";
import { LanguageContext } from './Context/LanguageContext';
import Image from 'next/image';

function SwitchLanguage() {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { language, switchLanguage } = useContext(LanguageContext);
  const dropdownRef = useRef(null);
  
  const handleLanguageSwitch = (lang) => {
    switchLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden lg:flex relative" ref={dropdownRef}>
      <button
        aria-label="Switch language"
        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
        className="group relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:border-slate-600"
      >
        {/* Current Language Flags */}
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300">
            <Image 
              src={language === "fr" ? "/img/france.png" : "/img/uk.png"} 
              width={24} 
              height={24} 
              className="object-cover" 
              alt={language === "fr" ? "Français" : "English"} 
            />
          </div>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
            {language === "fr" ? "FR" : "EN"}
          </span>
        </div>

        {/* Chevron Icon */}
        <div className={`transition-transform duration-300 ${isLanguageDropdownOpen ? "rotate-180" : "rotate-0"}`}>
          <FaChevronDown className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isLanguageDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in dark:bg-slate-900 dark:border-slate-700">
          <div className="p-2">
            {/* French Option */}
            <button 
              aria-label="Français"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                language === "fr" 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md" 
                  : "hover:bg-gray-50 text-gray-700 dark:hover:bg-slate-700 dark:text-slate-100"
              }`}
              onClick={() => handleLanguageSwitch("fr")}
            >
              <div className="flex items-center gap-3">
                <div className={`relative w-7 h-7 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                  language === "fr" ? "border-white shadow-sm" : "border-gray-200 group-hover:border-gray-300"
                }`}>
                  <Image 
                    src="/img/france.png" 
                    width={28} 
                    height={28} 
                    className="object-cover" 
                    alt="Français" 
                  />
                </div>
                <span className="font-medium text-sm">Français</span>
              </div>
              {language === "fr" && (
                <FaCheck className="w-4 h-4 text-white animate-scale-in" />
              )}
            </button>

            {/* English Option */}
            <button
              aria-label="English"
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group mt-1 ${
                language === "en" 
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md" 
                  : "hover:bg-gray-50 text-gray-700 dark:hover:bg-slate-700 dark:text-slate-100"
              }`}
              onClick={() => handleLanguageSwitch("en")}
            >
              <div className="flex items-center gap-3">
                <div className={`relative w-7 h-7 rounded-full overflow-hidden border-2 transition-all duration-200 ${
                  language === "en" ? "border-white shadow-sm" : "border-gray-200 group-hover:border-gray-300"
                }`}>
                  <Image 
                    src="/img/uk.png" 
                    width={28} 
                    height={28} 
                    className="object-cover" 
                    alt="English" 
                  />
                </div>
                <span className="font-medium text-sm">English</span>
              </div>
              {language === "en" && (
                <FaCheck className="w-4 h-4 text-white animate-scale-in" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SwitchLanguage;