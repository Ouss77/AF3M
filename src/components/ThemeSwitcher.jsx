import React, { useContext } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "./Context/ThemeContext";
import { LanguageContext } from "./Context/LanguageContext";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useContext(LanguageContext);
  const isDark = theme === "dark";
  const label = isDark ? (language === "fr" ? "Sombre" : "Dark") : (language === "fr" ? "Clair" : "Light");

  return (
    <button
      aria-label={isDark ? (language === "fr" ? "Passer au mode clair" : "Switch to light mode") : (language === "fr" ? "Passer au mode sombre" : "Switch to dark mode")}
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-transparent hover:border-blue-200 bg-white/95 text-slate-700 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm"
    >
      {isDark ? <FaMoon className="w-4 h-4 text-blue-300" /> : <FaSun className="w-4 h-4 text-orange-400" />}
      <span className="text-sm font-medium">
        {label}
      </span>
    </button>
  );
}

export default ThemeSwitcher;
