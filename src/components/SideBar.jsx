import Link from "next/link";
import Logout from "./Logout";
import SwitchLanguage from "./SwitchLanguage";
import { useContext, useState } from "react";
import { LanguageContext } from "./Context/LanguageContext";
import { Menu, X, House, BarChart3, FileText, Newspaper, Palette, Users, Settings } from "lucide-react";
import { useRouter } from "next/router";

function SideBar() {
  const language = useContext(LanguageContext).language;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 text-white bg-gradient-to-r from-slate-700 to-slate-800 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 z-50 backdrop-blur-sm border border-slate-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700
        transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-72 lg:w-80 z-50 flex flex-col`}
      >
        {/* Header Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {language === "fr" ? "Panneau Admin" : "Admin Panel"}
              </h1>
              <p className="text-xs text-slate-400">AF3M Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            <SidebarButton
              icon={<House size={20} />}
              label={language === "fr" ? "Accueil" : "Home"}
              link="/"
              setIsOpen={setIsOpen}
            />

            <SidebarButton
              icon={<BarChart3 size={20} />}
              label={language === "fr" ? "Tableau de Bord" : "Dashboard"}
              link="/admin_pages/dashboard"
              setIsOpen={setIsOpen}
            />
            
            <SidebarButton
              icon={<FileText size={20} />}
              label={language === "fr" ? "Gestion des Articles" : "Manage Articles"}
              link="/admin_pages/modifierArticle"
              setIsOpen={setIsOpen}
            />
        
            <SidebarButton
              icon={<Newspaper size={20} />}
              label={language === "fr" ? "Gestion des Actualités" : "Manage News"}
              link="/admin_pages/actualites"
              setIsOpen={setIsOpen}
            />
            
            <SidebarButton
              icon={<Palette size={20} />}
              label={language === "fr" ? "Gestion des Thèmes" : "Manage Themes"}
              link="/admin_pages/modifierThemes"
              setIsOpen={setIsOpen}
            />
            
            <SidebarButton
              icon={<Users size={20} />}
              label={language === "fr" ? "Gestion des Utilisateurs" : "Manage Users"}
              link="/admin_pages/utilisateur"
              setIsOpen={setIsOpen}
            />

            {/* Divider */}
            <div className="my-6 border-t border-slate-700"></div>

            {/* Logout */}
            <div className="px-2">
              <Logout />
            </div>

            {/* Language Switcher */}
            <div className="px-2 mt-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Language</span>
                </div>
                <SwitchLanguage />
              </div>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="text-center">
            <p className="text-xs text-slate-400">
              © 2024 | Developed by   
              <a 
                href="https://www.linkedin.com/in/oussama-sassour/" 
                target="_blank" 
                className="text-blue-400 ml-1 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Oussama Sassour
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

// Reusable Button Component
const SidebarButton = ({ icon, label, link, setIsOpen }) => {
  const router = useRouter();
  const isActive = router.pathname === link;

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(false); // Close sidebar
    router.push(link); // Navigate to the page
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
      }`}
    >
      <div className={`p-2 rounded-lg transition-all duration-300 ${
        isActive 
          ? "bg-white/20" 
          : "bg-slate-700/50 group-hover:bg-slate-600/50"
      }`}>
        {icon}
      </div>
      <span className="flex-1 text-left text-sm">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
      )}
      
      {/* Hover effect */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
        isActive ? "" : "opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
      }`}></div>
    </button>
  );
};

export default SideBar;
