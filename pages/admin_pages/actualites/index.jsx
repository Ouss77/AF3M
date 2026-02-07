"use client";
import { LanguageContext } from '@/components/Context/LanguageContext';
import Loading from '@/components/Loading';
import React, { useContext, useEffect, useState } from "react";
import { fetchActualites } from '@/utils/actualitesUtils';

export default function Actualites() {
  const language = useContext(LanguageContext);
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [visibleDescription, setVisibleDescription] = useState(null);

  const toggleDescription = (id) => {
    setVisibleDescription(visibleDescription === id ? null : id);
  };

  useEffect(() => {
    fetchActualites(setActualites, setLoading, setError);
  }, []);



  const handleDelete = async (id) => {
    try {
      setMessage("");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Actualites/deleteActualite.php?id=${id}`,
        {
          method: "GET" // Changed to GET to match backend
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete actualité');
      }
  
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Delete operation failed');
      }
  
      setMessage(language === "fr" 
        ? "Actualité supprimée avec succès !" 
        : "News deleted successfully!");
      
      fetchActualites(setActualites, setLoading, setError);
      
    } catch (err) {
      setMessage((language === "fr" ? "Erreur: " : "Error: ") + err.message);
      console.error("Delete error:", err);
    }
  };
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <Loading/>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center text-red-600 py-10">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {message && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
            <div className={`${message.includes('Erreur') || message.includes('Error') 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500'
            } text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm border ${message.includes('Erreur') || message.includes('Error') 
              ? 'border-red-400/20' 
              : 'border-green-400/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {message.includes('Erreur') || message.includes('Error') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                )}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            {language === "fr" ? "Gestion des Actualités" : "News Management"}
          </h1>
          <p className="text-slate-600">
            {language === "fr" ? "Gérez vos actualités et publications" : "Manage your news and publications"}
          </p>
        </div>

        {/* Add Button */}
        <div className="mb-8">
          <button
            aria-label={language === "fr" ? "Ajouter Actualité" : "Add News"}
            onClick={() => (window.location.href = "/admin_pages/actualites/ajouter")}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {language === "fr" ? "Ajouter Actualité" : "Add News"}
          </button>
        </div>

        {/* News Cards */}
        <div className="space-y-6">
          {actualites.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                {item.image_url && (
                  <div className="lg:w-64 lg:flex-shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.image_url}`}
                      alt="News"
                      className="w-full h-48 lg:h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 lg:pr-6">
                      <h2 className="text-2xl font-bold text-slate-800 mb-3">
                        {language === "fr" ? item.title_fr : item.title_en}
                      </h2>
                      
                      {/* Description - Hidden on mobile by default */}
                      <div className={`text-slate-700 leading-relaxed ${
                        visibleDescription === item.id ? "block" : "hidden lg:block"
                      }`}>
                        <p className="mb-4">
                          {language === "fr" ? item.description_fr : item.description_en}
                        </p>
                      </div>

                      {/* Toggle button for mobile */}
                      <button
                        onClick={() => toggleDescription(item.id)}
                        className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 font-medium lg:hidden transition-colors duration-200"
                      >
                        {visibleDescription === item.id ? (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                            {language === "fr" ? "Masquer" : "Hide"}
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            {language === "fr" ? "Lire plus" : "Read More"}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Actions Section */}
                    <div className="flex lg:flex-col gap-3 mt-4 lg:mt-0">
                      <button
                        aria-label="Edit"
                        onClick={() => (window.location.href = `/admin_pages/actualites/modifier?id=${item.id}`)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        {language === "fr" ? "Modifier" : "Edit"}
                      </button>
                      <button
                        aria-label="Delete"
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-200 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        {language === "fr" ? "Supprimer" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {actualites.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
              </svg>
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                {language === "fr" ? "Aucune actualité trouvée" : "No news found"}
              </h3>
              <p className="text-slate-400">
                {language === "fr" ? "Commencez par ajouter votre première actualité" : "Start by adding your first news article"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}