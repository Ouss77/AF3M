import ArticleChart from "@/components/ArticleChart";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/components/Context/LanguageContext";
import {
  FileText,
  Users,
  Newspaper,
  Palette,
  BarChart3,
  ArrowUpRight,
  CircleCheck,
  LayoutGrid,
} from "lucide-react";

// Fixed categorical order (validated for CVD-safe adjacency) — never reassign per-render.
const COLORS = {
  articles: "#2a78d6", // blue
  authors: "#eb6834", // orange
  actualites: "#1baf7a", // aqua
  themes: "#eda100", // yellow
};

const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (target === null) return;
    const from = startRef.current;
    const startTime = performance.now();
    let raf;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        startRef.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};

const StatTile = ({ icon: Icon, label, count, color, index }) => {
  const value = useCountUp(count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-6 overflow-hidden"
    >
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-[0.07]"
        style={{ backgroundColor: color }}
      />
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>
      <div className="relative mt-5">
        {count !== null ? (
          <p className="text-3xl font-semibold text-gray-900">{value.toLocaleString("fr-FR")}</p>
        ) : (
          <div className="h-9 w-16 rounded-lg bg-gray-100 animate-pulse" />
        )}
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </motion.div>
  );
};

const OverviewBar = ({ label, value, max, color, index }) => {
  const width = value === null ? 0 : Math.max(4, Math.round((value / max) * 100));
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.06 }}
      className="flex items-center gap-3"
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm text-gray-600 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.7, delay: 0.2 + index * 0.06, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium text-gray-800 w-8 text-right flex-shrink-0">
        {value === null ? "–" : value}
      </span>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, title, desc, href, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.15 + index * 0.06 }}
  >
    <Link
      href={href}
      className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 p-5 h-full"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1">
          {title}
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </Link>
  </motion.div>
);

function Dashboard() {
  const { language } = useContext(LanguageContext);
  const t = (fr, en) => (language === "fr" ? fr : en);

  const [articleCount, setArticleCount] = useState(null);
  const [actualitesCount, setActualitesCount] = useState(null);
  const [authors, setAuthors] = useState(null);
  const [themes, setThemes] = useState(null);

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`);
        const data = await response.json();
        if (data.error) {
          console.error(`Error from ${url}:`, data.error);
          setter(0);
          return;
        }
        const count = Object.values(data)[0];
        setter(Number(count) || 0);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    };

    fetchData("articles/getArticles_Count.php", setArticleCount);
    fetchData("getAuthors_Count.php", setAuthors);
    fetchData("Actualites/getActualites_Count.php", setActualitesCount);
    fetchData("getThemes_Count.php", setThemes);
  }, []);

  const stats = [
    { icon: FileText, label: t("Articles", "Articles"), count: articleCount, color: COLORS.articles },
    { icon: Users, label: t("Auteurs", "Authors"), count: authors, color: COLORS.authors },
    { icon: Newspaper, label: t("Actualités", "News"), count: actualitesCount, color: COLORS.actualites },
    { icon: Palette, label: t("Thèmes", "Themes"), count: themes, color: COLORS.themes },
  ];

  const overview = [
    { label: t("Articles", "Articles"), value: articleCount, color: COLORS.articles },
    { label: t("Actualités", "News"), value: actualitesCount, color: COLORS.actualites },
    { label: t("Thèmes", "Themes"), value: themes, color: COLORS.themes },
    { label: t("Auteurs", "Authors"), value: authors, color: COLORS.authors },
  ];
  const overviewMax = Math.max(1, ...overview.map((item) => item.value || 0));

  const quickActions = [
    {
      icon: FileText,
      title: t("Gestion des Articles", "Manage Articles"),
      desc: t("Ajouter, modifier ou supprimer des articles", "Add, edit or remove articles"),
      href: "/admin_pages/modifierArticle",
      color: COLORS.articles,
    },
    {
      icon: Newspaper,
      title: t("Gestion des Actualités", "Manage News"),
      desc: t("Publier et réordonner les actualités", "Publish and reorder news items"),
      href: "/admin_pages/actualites",
      color: COLORS.actualites,
    },
    {
      icon: Palette,
      title: t("Gestion des Thèmes", "Manage Themes"),
      desc: t("Organiser les thèmes de recherche", "Organize research themes"),
      href: "/admin_pages/modifierThemes",
      color: COLORS.themes,
    },
    {
      icon: Users,
      title: t("Gestion des Utilisateurs", "Manage Users"),
      desc: t("Gérer les accès du panneau admin", "Manage admin panel access"),
      href: "/admin_pages/utilisateur",
      color: COLORS.authors,
    },
  ];

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("Bonjour", "Good morning")
      : hour < 18
      ? t("Bon après-midi", "Good afternoon")
      : t("Bonsoir", "Good evening");

  const today = new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pt-2"
        >
          <div>
            <p className="text-sm text-gray-500 capitalize mb-1">{today}</p>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting} <span className="text-gray-400 font-normal">— {t("Tableau de Bord", "Dashboard")}</span>
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2 self-start">
            <CircleCheck className="w-4 h-4" style={{ color: "#0ca30c" }} strokeWidth={2} />
            <span className="text-sm font-medium text-gray-700">{t("Système actif", "System online")}</span>
          </div>
        </motion.div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatTile key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Chart + Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center mb-6">
              <div
                className="p-3 rounded-xl text-white shadow-sm mr-4"
                style={{ backgroundColor: COLORS.articles }}
              >
                <BarChart3 className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{t("Statistiques Détaillées", "Detailed Statistics")}</h2>
                <p className="text-sm text-gray-500">{t("Articles publiés par année", "Articles published by year")}</p>
              </div>
            </div>
            <ArticleChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-xl bg-gray-800 text-white shadow-sm mr-4">
                <LayoutGrid className="w-5 h-5" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{t("Aperçu global", "Overview")}</h2>
                <p className="text-sm text-gray-500">{t("Comparaison des volumes", "Volume comparison")}</p>
              </div>
            </div>
            <div className="space-y-4">
              {overview.map((item, index) => (
                <OverviewBar key={item.label} {...item} max={overviewMax} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <div className="mb-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t("Actions rapides", "Quick actions")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction key={action.title} {...action} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
