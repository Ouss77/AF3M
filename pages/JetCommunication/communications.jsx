import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/components/Context/LanguageContext";
import { fetchArticles, handleSearch, handleYearChange, handleSort } from "@/utils/articleUtils";
import { fetchThemes, buildThemeMap } from "@/utils/themeUtils";
import { FaSearch, FaDownload, FaList, FaCalendarAlt, FaBook, FaUser, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";

export default function ArticlesTable() {
  const { language } = useContext(LanguageContext);
  const pageTitle = "Articles Page";
  const pageDescription = "Description of the articles page";
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [hoveredTheme, setHoveredTheme] = useState({ id: null, article_id: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [expandedRows, setExpandedRows] = useState({});
  const [themeMap, setThemeMap] = useState({});

  useEffect(() => {
    fetchArticles(setArticles, setFilteredArticles, setLoading, setError);
    fetchThemes().then((themes) => setThemeMap(buildThemeMap(themes))).catch(() => {});
  }, []);

  const handleMouseEnter = (themeID, article_id) => {
    setHoveredTheme({ id: themeID, article_id });
  };

  const handleMouseLeave = () => {
    setHoveredTheme({ id: null, article_id: null });
  };

  const toggleResume = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getFirstSentence = (text) => {
    const sentences = text.split(/(?<=[.!?])\s*/);
    return sentences[0] || text;
  };

  const years = [...new Set(articles.map(article => article.annee))].sort((a, b) => b - a);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <FaSort className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === "asc" 
      ? <FaSortUp className="w-3 h-3 text-yellow-500" />
      : <FaSortDown className="w-3 h-3 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading articles...</p>
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
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://af3m-assoc.org/devenir-membre" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://af3m-assoc.org/wp-content/uploads/2022/10/Capture-de%CC%81cran-2022-10-06-a%CC%80-10.09.14.png" />
      </Head>

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500 mb-3">
              {language === "fr" ? "Articles Scientifiques" : "Scientific Articles"}
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              {language === "fr" ? "Explorez notre collection d'articles de recherche" : "Explore our collection of research articles"}
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

              {/* List View Button */}
              <a
                href="/JetCommunication/articlesList"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
              >
                <FaList className="w-4 h-4" />
                {language === "fr" ? "Vue Liste" : "List View"}
              </a>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th 
                      className="px-4 py-4 text-left text-xs font-semibold uppercase cursor-pointer hover:bg-blue-700 transition-colors"
                      onClick={() => handleSort("annee", sortConfig, setSortConfig, filteredArticles, setFilteredArticles)}
                    >
                      <div className="flex items-center gap-2">
                        {language === "fr" ? "Année" : "Year"}
                        {getSortIcon("annee")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-4 text-left text-xs font-semibold uppercase cursor-pointer hover:bg-blue-700 transition-colors hidden sm:table-cell w-32"
                      onClick={() => handleSort("theme", sortConfig, setSortConfig, filteredArticles, setFilteredArticles)}
                    >
                      <div className="flex items-center gap-2">
                        {language === "fr" ? "Thème" : "Theme"}
                        {getSortIcon("theme")}
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      {language === "fr" ? "Titre" : "Title"}
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase">
                      {language === "fr" ? "Résumé" : "Abstract"}
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase hidden md:table-cell">
                      {language === "fr" ? "Auteurs" : "Authors"}
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((article, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-700 font-medium">{article.annee}</td>
                      <td
                        className="px-4 py-4 text-sm text-gray-700 hidden sm:table-cell relative cursor-help"
                        onMouseEnter={() => handleMouseEnter(article.theme, article.article_id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                          {themeMap[article.theme]?.themeCode || article.theme}
                        </span>
                        {hoveredTheme.id === article.theme && hoveredTheme.article_id === article.article_id && (
                          <div className="absolute z-10 bg-blue-600 text-white p-3 rounded-lg shadow-xl text-sm font-medium -left-2 top-12 w-48 animate-fade-in">
                            {themeMap[article.theme]?.themeName || (language === "fr" ? "Thème introuvable" : "Theme not found")}
                            <div className="absolute -top-2 left-4 w-4 h-4 bg-blue-600 transform rotate-45"></div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 font-medium">{article.titre}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <div className="sm:hidden">{getFirstSentence(article.resume)}</div>
                        <div className="hidden sm:block">
                          {expandedRows[index] || article.resume.length <= 220
                            ? article.resume
                            : article.resume.slice(0, 220) + "..."}
                          {article.resume.length > 220 && (
                            <button
                              aria-label="Read More"
                              onClick={() => toggleResume(index)}
                              className="block text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 hover:underline"
                            >
                              {expandedRows[index] ? (language === "fr" ? "Lire moins" : "Read Less") : (language === "fr" ? "Lire plus" : "Read More")}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 hidden md:table-cell">{article.authors}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/pdf_files/${article.pdf_files}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <FaDownload className="w-3 h-3" />
                            {language === "fr" ? "Voir PDF" : "View PDF"}
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredArticles.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        <FaBook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="font-medium">{language === "fr" ? "Aucun article trouvé" : "No articles found"}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}