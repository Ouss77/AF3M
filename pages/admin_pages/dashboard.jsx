import ArticleChart from "@/components/ArticleChart";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { BarChart3, Users, Newspaper, Tag } from "lucide-react";

// Reusable DashboardCard Component
const DashboardCard = ({ icon, title, count, color }) => {
  return (
    <div className="flex-shrink-0 w-3/5 pr-10 sm:w-auto sm:px-0">
      <section className={`group relative backdrop-blur-sm bg-white/90 border border-white/20 rounded-2xl p-6 h-32 hover:scale-105 hover:shadow-xl hover:shadow-${color}-500/20 transition-all duration-500 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/10 to-${color}-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative z-10 flex items-center justify-between h-full">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 text-white shadow-lg`}>
            <Image height={32} width={32} className="w-8 h-8" src={icon} alt={`${title}-icon`} />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {count !== null ? count : (
                <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
              )}
            </p>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

function Dashboard() {
  const [articleCount, setArticleCount] = useState(null);
  const [actualitesCount, setActualitesCount] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [themes, setThemes] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    { icon: "/article.png", title: "Articles", count: articleCount, color: "blue" },
    { icon: "/editor.png", title: "Authors", count: authors, color: "emerald" },
    { icon: "/world-news.png", title: "Actualités", count: actualitesCount, color: "purple" },
    { icon: "/team.png", title: "Thèmes", count: themes, color: "orange" }
  ];

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`);
        const data = await response.json();
        setter(data.article_count || data.actualite_count || 0);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    };

    fetchData("getArticles_Count.php", setArticleCount);
    fetchData("getAuthors_Count.php", setAuthors);
    fetchData("Actualites/getActualites_Count.php", setActualitesCount);
    fetchData("getThemes_Count.php", setThemes);
  }, []);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextCard(),
    onSwipedRight: () => prevCard(),
    trackMouse: true
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-0 ">
        {/* Header Section */}
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tableau de Bord
          </h1>
          <p className="text-center text-gray-600 font-medium">
            Vue d'ensemble de votre système de gestion
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-12">
          {/* Mobile Carousel */}
          <div className="sm:hidden" {...swipeHandlers}>
            <div className="flex overflow-hidden relative">
              <div 
                className="flex transition-transform duration-300" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {cards.map((card, index) => (
                  <DashboardCard key={index} {...card} />
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg mr-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Statistiques Détaillées</h2>
              <p className="text-gray-600">Analyse des performances du système</p>
            </div>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <ArticleChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;