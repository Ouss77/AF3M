"use client";
import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchArticles, handleSearch } from "@/utils/articleUtils";
import { fetchThemes, buildThemeMap } from "@/utils/themeUtils";
import {
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  FileX2,
  Paperclip,
} from "lucide-react";

const ACCENT = "#2a78d6";

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
    fetchArticles(setArticles, setFilteredArticles, setLoading, setError);
    fetchThemes().then((themes) => setThemeMap(buildThemeMap(themes))).catch(() => {});
  }, []);

  const handleDelete = async (articleId) => {
    try {
      setMessage(""); // Reset message
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/deleteArticles.php`,
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toast message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
            >
              <div
                className={`text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
                  message.startsWith("Erreur") ? "bg-red-500" : "bg-emerald-500"
                }`}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{message}</span>
                <button
                  onClick={() => setMessage("")}
                  className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact header + toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5 pt-1"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: ACCENT }}
            >
              <FileText className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Gestion des Articles</h1>
              <p className="text-xs text-gray-500">{filteredArticles.length} article{filteredArticles.length > 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur ou code..."
                value={searchQuery}
                onChange={(e) =>
                  handleSearch(e, articles, setSearchQuery, setFilteredArticles, themeMap)
                }
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              aria-label="Add Article"
              onClick={() => (window.location.href = "/admin_pages/ajouterArticle")}
              className="flex items-center gap-2 px-4 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0 text-sm"
              style={{ backgroundColor: ACCENT }}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          </div>
        </motion.div>

        {/* Table for Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8 hidden md:block"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-16">
                    Année
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-24">
                    Thème
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-52">
                    Titre
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">
                    Résumé
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-28">
                    Auteurs
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-40">
                    Fichier PDF
                  </th>
                  <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider w-36">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((article, index) => {
                  const theme = themeMap[article.theme]?.themeCode || article.theme || "";
                  const titre = article.titre || "";
                  const resume = article.resume || "";
                  const authors = article.authors || "";
                  const pdfFile = article.pdf_files || "";

                  return (
                    <tr
                      key={article.article_id}
                      className={`transition-colors duration-150 hover:bg-blue-50/60 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      }`}
                    >
                      <td className="px-3 py-3 text-xs text-gray-700 font-medium">{article.annee || ""}</td>
                      <td className="px-3 py-3 text-xs text-gray-700">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {theme.length > 8 ? theme.substring(0, 8) + "..." : theme}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700">
                        <div className="font-medium truncate max-w-[13rem]" title={titre}>
                          {titre}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600">
                        <div className="truncate max-w-64" title={resume}>
                          {resume.length > 90 ? resume.substring(0, 90) + "..." : resume}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700">
                        <div className="truncate max-w-[7rem]" title={authors}>
                          {authors}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {pdfFile ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-slate-700 max-w-[9rem] truncate"
                            title={pdfFile}
                          >
                            <Paperclip className="w-3 h-3 flex-shrink-0 text-slate-400" />
                            <span className="truncate">{pdfFile}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-gray-400">
                            <FileX2 className="w-3 h-3" />
                            Aucun
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/admin_pages/modifierUnArticle?id=${article.article_id}`}
                            aria-label="Edit Article"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200 text-xs"
                          >
                            <Pencil className="w-3 h-3" />
                            Éditer
                          </a>
                          <button
                            aria-label="Delete Article"
                            onClick={() => handleDelete(article.article_id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors duration-200 text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredArticles.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-14">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileX2 className="w-10 h-10 text-gray-300" />
                        <p className="text-gray-500 font-medium text-sm">Aucun article trouvé</p>
                        <p className="text-gray-400 text-xs">Essayez de modifier vos critères de recherche</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Card Layout for Mobile */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.article_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 mb-2">{article.titre}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {article.annee}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      {themeMap[article.theme]?.themeCode || article.theme}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs font-medium text-gray-500">Auteurs</span>
                  <p className="text-sm text-gray-700 mt-0.5">{article.authors}</p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-500">Fichier PDF</span>
                  {article.pdf_files ? (
                    <p className="text-sm text-gray-700 mt-0.5 flex items-center gap-1.5 truncate">
                      <Paperclip className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {article.pdf_files}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-0.5">Aucun fichier</p>
                  )}
                </div>

                {/* Resume Toggle Button */}
                <div>
                  <button
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors duration-200 text-sm"
                    onClick={() =>
                      setActiveResume(activeResume === article.article_id ? null : article.article_id)
                    }
                  >
                    {activeResume === article.article_id ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {activeResume === article.article_id ? "Masquer le résumé" : "Voir le résumé"}
                  </button>

                  {activeResume === article.article_id && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{article.resume}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <a
                  href={`/admin_pages/modifierUnArticle?id=${article.article_id}`}
                  aria-label="Edit Article"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm"
                >
                  <Pencil className="w-4 h-4" />
                  Éditer
                </a>
                <button
                  aria-label="Delete Article"
                  onClick={() => handleDelete(article.article_id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
          {filteredArticles.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <FileX2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-600 font-medium mb-1">Aucun article trouvé</h3>
              <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
