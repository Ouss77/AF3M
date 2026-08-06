"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import Dropdown from "./Dropdown";
import Image from "next/image";
import Link from "next/link";
import Hamburger from "./Hamburger";
import { LanguageContext } from "./Context/LanguageContext";
import SwitchLanguage from "./SwitchLanguage";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const af3mDropdownRef = useRef(null);
  const conferencesDropdownRef = useRef(null);
  const adhesionDropdownRef = useRef(null);
  const mobileDropdownRefs = useRef({});
  const { language, switchLanguage } = useContext(LanguageContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickOutside = (event) => {
    const desktopDropdownRefs = [af3mDropdownRef, conferencesDropdownRef, adhesionDropdownRef];
    
    const clickedInsideDesktopDropdown = desktopDropdownRefs.some((ref) => 
      ref.current && ref.current.contains(event.target)
    );
    
    const clickedInsideMobileDropdown = menuOpen && Object.values(mobileDropdownRefs.current).some((ref) => 
      ref && ref.contains(event.target)
    );
    
    if (!clickedInsideDesktopDropdown && !clickedInsideMobileDropdown) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const translations = {
    fr: {
      af3m: "L'AF3M",
      conferences: "Conférences",
      adhesion: "Adhésion",
      news: "Actualités",
      communications: "Communications JET",
      af3mItems: [
        { label: "Historique et missions", href: "/AF3M_pages/historique" },
        { label: "Administration actuelle", href: "/AF3M_pages/Administration" },
        { label: "Anciens bureaux de l'AF3M", href: "/AF3M_pages/anciensBureau" },
        { label: "Status et règlement intérieur", href: "/AF3M_pages/reglements" },
      ],
      confItems: [
        { label: "JET (2000-2022)", href: "/conference_pages/conferenceJet" },
        { label: "Congrès international de mécanique", href: "/conference_pages/congreIntrMeca" },
      ],
      adhesionItems: [
        { label: "Devenir membre de l'AF3M", href: "/Adhesion_pages/devenirMembre" },
        { label: "Equipes et laboratoires de recherche", href: "/Adhesion_pages/equipesLaboratoire" },
      ],
    },
    en: {
      af3m: "AF3M",
      conferences: "Conferences",
      adhesion: "Membership",
      news: "News",
      communications: "JET Communications",
      af3mItems: [
        { label: "History and Missions", href: "/AF3M_pages/historique" },
        { label: "Current Administration", href: "/AF3M_pages/Administration" },
        { label: "Former AF3M Offices", href: "/AF3M_pages/anciensBureau" },
        { label: "Statutes and Internal Regulations", href: "/AF3M_pages/reglements" },
      ],
      confItems: [
        { label: "JET (2000-2022)", href: "/conference_pages/conferenceJet" },
        { label: "International Mechanics Congress", href: "/conference_pages/congreIntrMeca" },
      ],
      adhesionItems: [
        { label: "Become an AF3M Member", href: "/Adhesion_pages/devenirMembre" },
        { label: "Research Teams and Laboratories", href: "/Adhesion_pages/equipesLaboratoire" },
      ],
    },
  };

  return (
    <header 
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg h-16 dark:bg-slate-950/95 dark:shadow-slate-950/80' 
          : 'bg-gradient-to-r from-blue-50 via-white to-blue-50 backdrop-blur-sm shadow-md h-20 dark:bg-slate-950/95 dark:shadow-slate-950/80'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 xl:px-16 h-full">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <Image
                src="/img/afm-logo.png" 
                width={scrolled ? 60 : 75}
                height={scrolled ? 60 : 75}
                alt="AF3M Logo"
                priority={true}
                className={`relative rounded-xl shadow-lg border-2 border-yellow-400/30 group-hover:border-yellow-500 transition-all duration-300 ${
                  scrolled ? 'scale-90' : ''
                }`}
              />
            </div>
            <div className="hidden xl:block">
              <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300 ${
                scrolled ? 'text-sm' : 'text-base'
              }`}>
                AF3M
              </h1>
              <p className={`text-xs text-gray-600 transition-all duration-300 ${
                scrolled ? 'opacity-0 h-0' : 'opacity-100'
              }`}>
                {language === "fr" ? "Mécanique & Matériaux" : "Mechanics & Materials"}
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          <Link
            href="/actualites"
            className="relative text-sm xl:text-base text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 group dark:text-slate-200 dark:hover:text-sky-300 dark:hover:bg-slate-800"
          >
            {translations[language].news}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
          </Link>

          <Dropdown
            label={translations[language].af3m}
            dropdownKey="af3m"
            dropdownRef={af3mDropdownRef}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            items={translations[language].af3mItems}
          />

          <Dropdown
            label={translations[language].conferences}
            dropdownKey="conferences"
            dropdownRef={conferencesDropdownRef}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            items={translations[language].confItems}
          />

          <Link
            href="/JetCommunication/communications"
            className="relative text-sm xl:text-base text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 group dark:text-slate-200 dark:hover:text-sky-300 dark:hover:bg-slate-800"
          >
            {translations[language].communications}
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
          </Link>

          <Dropdown
            label={translations[language].adhesion}
            dropdownKey="adhesion"
            dropdownRef={adhesionDropdownRef}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            items={translations[language].adhesionItems}
          />
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <SwitchLanguage />

          {/* Mobile Menu Button */}
          <button  
            aria-label="Menu"
            onClick={toggleMenu} 
            className="lg:hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
              {menuOpen ? <IoMdClose size={22} /> : <IoMdMenu size={22} />}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-gradient-to-b from-white via-slate-50 to-white shadow-2xl border-t border-slate-200 animate-fade-in dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700">
          <Hamburger 
            translations={translations[language]}
            toggleMenu={toggleMenu}
            menuOpen={menuOpen}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            dropdownRefs={mobileDropdownRefs}
            dropdownItemsAf3m={translations[language].af3mItems}
            dropdownItemsConf={translations[language].confItems}
            dropdownItemsAdhesion={translations[language].adhesionItems}
            language={language}
            switchLanguage={switchLanguage}
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;