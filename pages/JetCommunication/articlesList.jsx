import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/components/Context/LanguageContext";
import { fetchArticles, handleSearch, handleYearChange } from "@/utils/articleUtils";
import { fetchThemes, buildThemeMap } from "@/utils/themeUtils";
import { FaSearch, FaDownload, FaTable, FaCalendarAlt, FaBook, FaUser, FaChevronDown, FaChevronUp, FaTag } from "react-icons/fa";

export default function ArticlesTable() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAbstract, setShowAbstract] = useState({});
  const [selectedYear, setSelectedYear] = useState("All");
  const [themeMap, setThemeMap] = useState({});
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    fetchArticles(setArticles, setFilteredArticles, setLoading, setError);
    fetchThemes().then((themes) => setThemeMap(buildThemeMap(themes))).catch(() => {});
  }, []);

  const toggleAbstract = (index) => {
    setShowAbstract((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const years = [...new Set(articles.map(article => article.annee))].sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {language === "fr" ? "Chargement des articles..." : "Loading articles..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-8xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500 mb-3">
            {language === "fr" ? "Liste des Articles" : "Articles List"}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            {language === "fr" ? "Parcourez notre collection d'articles scientifiques" : "Browse our collection of scientific articles"}
          </p>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
              <FaBook className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{filteredArticles.length}</p>
            <p className="text-sm text-gray-600">{language === "fr" ? "Articles" : "Articles"}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
              <FaCalendarAlt className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{years.length}</p>
            <p className="text-sm text-gray-600">{language === "fr" ? "Années" : "Years"}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
              <FaUser className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{[...new Set(articles.flatMap(a => a.authors?.split(',') || []))].length}</p>
            <p className="text-sm text-gray-600">{language === "fr" ? "Auteurs" : "Authors"}</p>
          </div>
        </div> */}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Year Filter */}
            <div className="relative flex-shrink-0 lg:w-52">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="w-4 h-4 text-gray-400" />
              </div>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e, setSelectedYear, setFilteredArticles, articles)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
              >
                <option value="All">{language === "fr" ? "Toutes les années" : "All Years"}</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={language === "fr" ? "Rechercher par titre, auteur ou code..." : "Search by title, author or code..."}
                value={searchQuery}
                onChange={(e) => handleSearch(e, articles, setSearchQuery, setFilteredArticles, themeMap)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
              />
            </div>

            {/* Table View Button */}
            <a
              href="/JetCommunication/communications"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
            >
              <FaTable className="w-4 h-4" />
              {language === "fr" ? "Vue Tableau" : "Table View"}
            </a>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-6">
          {filteredArticles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-yellow-400 transition-all duration-300"
            >
              {/* Article Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {article.titre}
                </h2>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUser className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{language === "fr" ? "Auteurs:" : "Authors:"}</span>
                    <span>{article.authors}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{language === "fr" ? "Année:" : "Year:"}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {article.annee}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaTag className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">{language === "fr" ? "Thème:" : "Theme:"}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      {themeMap[article.theme]?.themeCode || article.theme}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Body */}
              <div className="p-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    aria-label={showAbstract[index] ? "Hide Abstract" : "Show Abstract"}
                    onClick={() => toggleAbstract(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {showAbstract[index] ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                    {showAbstract[index] 
                      ? (language === "fr" ? "Masquer le résumé" : "Hide Abstract")
                      : (language === "fr" ? "Afficher le résumé" : "Show Abstract")}
                  </button>
                  
                  <div className="flex flex-col gap-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/pdf_files/${article.pdf_files}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <FaDownload className="w-4 h-4" />
                      {language === "fr" ? "Voir PDF" : "View PDF"}
                    </a>
                  </div>
                </div>

                {/* Abstract */}
                {showAbstract[index] && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl border border-blue-100 animate-fade-in">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaBook className="w-4 h-4 text-blue-600" />
                      {language === "fr" ? "Résumé" : "Abstract"}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">
                      {article.resume}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Articles Found */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">
              {language === "fr" ? "Aucun article trouvé" : "No articles found"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {language === "fr" ? "Essayez de modifier vos critères de recherche" : "Try adjusting your search criteria"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}