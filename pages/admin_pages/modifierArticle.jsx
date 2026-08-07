"use client";
import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import { fetchArticles, handleSearch } from "@/utils/articleUtils";
import { fetchThemes, buildThemeMap } from "@/utils/themeUtils";

export default function ModifierArticle() {
  const [articles, setArticles] = useState([]); // All articles from API
  const [filteredArticles, setFilteredArticles] = useState([]); // Filtered articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [activeResume, setActiveResume] = useState(null); // Track active resume to toggle visibility
  const [message, setMessage] = useState(""); // Message state for success/error messages
  const [themeMap, setThemeMap] = useState({});

  useEffect(() => {
    fetchArticles(setArticles, setFilteredArticles, setLoading);
    fetchThemes().then((themes) => setThemeMap(buildThemeMap(themes))).catch(() => {});
  }, []);

  const handleDelete = async (articleId) => {
    try {
      setMessage(""); // Reset message
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteArticles.php`,
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article_id: articleId })
        }
      );
  
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete article');
      }
  
      setMessage("Article supprimé avec succès !");
      setArticles(articles.filter(article => article.article_id !== articleId));
      setFilteredArticles(filteredArticles.filter(article => article.article_id !== articleId));
      
    } catch (err) {
      setMessage("Erreur: " + err.message);
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Message avec animation */}
        {message && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm border border-green-400/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">{message}</span>
              <button 
                onClick={() => setMessage("")}
                className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Gestion des Articles
          </h1>
          <p className="text-slate-600">Gérez vos articles de recherche et publications</p>
        </div>

        {/* Search Input and Add Article Button */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre, auteur ou code..."
                value={searchQuery}
                onChange={(e) =>
                  handleSearch(e, articles, setSearchQuery, setFilteredArticles, themeMap)
                }
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
              />
            </div>
            <button
              aria-label="Add Article"
              onClick={() => (window.location.href = "/admin_pages/ajouterArticle")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Ajouter Article</span>
            </button>
          </div>
        </div>

        {/* Table for Desktop */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8 hidden md:block">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r border-slate-600 w-16">
                    Année
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r border-slate-600 w-24">
                    Thème
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r border-slate-600 w-60">
                    Titre
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r border-slate-600 w-80">
                    Résumé
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider border-r border-slate-600 w-32">
                    Auteurs
                  </th>
                  <th className="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
<tbody className="divide-y divide-slate-200">
  {filteredArticles.map((article, index) => {
    const theme = themeMap[article.theme]?.themeCode || article.theme || "";
    const titre = article.titre || "";
    const resume = article.resume || "";
    const authors = article.authors || "";

    return (
      <tr
        key={article.article_id}
        className={`transition-colors duration-200 hover:bg-blue-50/50 ${
          index % 2 === 0 ? "bg-slate-50/30" : "bg-white/50"
        }`}
      >
        <td className="px-3 py-3 text-xs text-slate-700 font-medium">{article.annee || ""}</td>
        <td className="px-3 py-3 text-xs text-slate-700">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate">
            {theme.length > 8 ? theme.substring(0, 8) + "..." : theme}
          </span>
        </td>
        <td className="px-3 py-3 text-xs text-slate-700">
          <div className="font-medium truncate" title={titre}>
            {titre.length > 40 ? titre.substring(0, 40) + "..." : titre}
          </div>
        </td>
        <td className="px-3 py-3 text-xs text-slate-700">
          <div className="truncate" title={resume}>
            {resume.length > 60 ? resume.substring(0, 60) + "..." : resume}
          </div>
        </td>
        <td className="px-3 py-3 text-xs text-slate-700">
          <div className="truncate" title={authors}>
            {authors.length > 15 ? authors.substring(0, 15) + "..." : authors}
          </div>
        </td>
        <td className="px-3 py-3 text-xs">
          <button
            aria-label="Delete Article"
            onClick={() => handleDelete(article.article_id)}
            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-200 text-xs"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Del
          </button>
        </td>
      </tr>
    );
  })}

  {filteredArticles.length === 0 && (
    <tr>
      <td colSpan="6" className="text-center py-12">
        <div className="flex flex-col items-center justify-center space-y-3">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <p className="text-slate-500 font-medium">Aucun article trouvé</p>
          <p className="text-slate-400 text-sm">Essayez de modifier vos critères de recherche</p>
        </div>
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>

        {/* Card Layout for Mobile */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {filteredArticles.map((article) => (
            <div
              key={article.article_id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-slate-800 mb-2">{article.titre}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.annee}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {themeMap[article.theme]?.themeCode || article.theme}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm font-medium text-slate-600">Auteurs:</span>
                  <p className="text-sm text-slate-700 mt-1">{article.authors}</p>
                </div>

                {/* Resume Toggle Button */}
                <div>
                  <button
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 transform hover:scale-105"
                    onClick={() =>
                      setActiveResume(activeResume === article.article_id ? null : article.article_id)
                    }
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {activeResume === article.article_id ? "Masquer le résumé" : "Voir le résumé"}
                  </button>

                  {activeResume === article.article_id && (  
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-700 leading-relaxed">{article.resume}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  aria-label="Delete Article"
                  onClick={() => handleDelete(article.article_id)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          {filteredArticles.length === 0 && (
            <div className="col-span-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-lg font-medium text-slate-600 mb-2">Aucun article trouvé</h3>
                <p className="text-slate-400">Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
