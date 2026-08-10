"use client";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchArticles } from "@/utils/articleUtils";
import { fetchThemes, buildThemeMap } from "@/utils/themeUtils";
import Loading from "@/components/Loading";
import { Pencil, CheckCircle2, X, ArrowLeft, Paperclip } from "lucide-react";

const ACCENT = "#2a78d6";

export default function ModifierUnArticle() {
  const router = useRouter();
  const { id } = router.query;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeMap, setThemeMap] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [titre, setTitre] = useState("");
  const [annee, setAnnee] = useState("");
  const [theme, setTheme] = useState("");
  const [resume, setResume] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [pdfFile, setPdfFile] = useState("");

  useEffect(() => {
    fetchArticles(setArticles, () => {}, setLoading, setError);
    fetchThemes().then((themes) => setThemeMap(buildThemeMap(themes))).catch(() => {});
  }, []);

  const currentArticle = useMemo(() => {
    if (!id) return null;
    return articles.find((item) => String(item.article_id) === String(id));
  }, [articles, id]);

  useEffect(() => {
    if (!currentArticle) return;
    setTitre(currentArticle.titre || "");
    setAnnee(currentArticle.annee || "");
    setTheme(currentArticle.theme || "");
    setResume(currentArticle.resume || "");
    setAuthorName(currentArticle.authors || "");
    setPdfFile(currentArticle.pdf_files || "");
  }, [currentArticle]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/updateArticle.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            article_id: id,
            titre,
            annee,
            theme,
            resume,
            author_name: authorName,
            pdf_file: pdfFile,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Échec de la mise à jour");
      }

      setMessage("Article mis à jour avec succès !");
      setTimeout(() => router.push("/admin_pages/modifierArticle"), 1200);
    } catch (err) {
      setMessage("Erreur: " + err.message);
    } finally {
      setSaving(false);
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

  if (!id || !currentArticle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-600 font-medium">Article introuvable.</p>
          <a
            href="/admin_pages/modifierArticle"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold"
            style={{ color: ACCENT }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </a>
        </div>
      </div>
    );
  }

  const themeInfo = themeMap[theme];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3 mb-5 pt-1"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: ACCENT }}
          >
            <Pencil className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Modifier l'Article</h1>
            <p className="text-xs text-gray-500 truncate max-w-md">{currentArticle.titre}</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="titre" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Titre
              </label>
              <input
                type="text"
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="annee" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Année
                </label>
                <input
                  type="number"
                  id="annee"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="theme" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Thème (ID)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  id="theme"
                  value={theme}
                  onChange={handleThemeChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800"
                />
                {themeInfo && (
                  <p className="text-xs text-gray-400 mt-1">
                    {themeInfo.themeCode} — {themeInfo.themeName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="authorName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Auteur(s)
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800"
              />
            </div>

            <div>
              <label htmlFor="pdfFile" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Fichier PDF
              </label>
              <div className="relative">
                <Paperclip className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="pdfFile"
                  value={pdfFile}
                  onChange={(e) => setPdfFile(e.target.value)}
                  placeholder="ex: T01-002-010.pdf"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Doit correspondre exactement au nom du fichier déjà présent dans le dossier pdf_files du serveur.
              </p>
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Résumé
              </label>
              <textarea
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                required
                rows={6}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none text-sm text-gray-800 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
              <a
                href="/admin_pages/modifierArticle"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Annuler
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
