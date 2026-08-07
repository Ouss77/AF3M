"use client";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { fetchActualites } from "@/utils/actualitesUtils";
import Loading from "@/components/Loading";

export default function ModifierActualite() {
  const router = useRouter();
  const { id } = router.query;

  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [titleFr, setTitleFr] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [image, setImage] = useState(null);
  const [initialTitleFr, setInitialTitleFr] = useState("");
  const [initialDescriptionFr, setInitialDescriptionFr] = useState("");
  const [initialTitleEn, setInitialTitleEn] = useState("");
  const [initialDescriptionEn, setInitialDescriptionEn] = useState("");
  const [message, setMessage] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    fetchActualites(setActualites, setLoading, setError);
  }, []);

  const currentActualite = useMemo(() => {
    if (!id) return null;
    return actualites.find((item) => String(item.id) === String(id));
  }, [actualites, id]);

  useEffect(() => {
    if (!currentActualite) return;
    setTitleFr(currentActualite.title_fr || "");
    setDescriptionFr(currentActualite.description_fr || "");
    setTitleEn(currentActualite.title_en || "");
    setDescriptionEn(currentActualite.description_en || "");
    setCurrentImageUrl(currentActualite.image_url || "");
    // store initial values for client-side change detection
    setInitialTitleFr(currentActualite.title_fr || "");
    setInitialDescriptionFr(currentActualite.description_fr || "");
    setInitialTitleEn(currentActualite.title_en || "");
    setInitialDescriptionEn(currentActualite.description_en || "");
  }, [currentActualite]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setMessage("ID manquant.");
      return;
    }

    // Client-side check: if nothing changed, avoid sending request
    const imageChanged = !!image; // new file selected
    const nothingChanged =
      titleFr === initialTitleFr &&
      descriptionFr === initialDescriptionFr &&
      titleEn === initialTitleEn &&
      descriptionEn === initialDescriptionEn &&
      !imageChanged;

    if (nothingChanged) {
      setMessage("Rien à modifier");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("title_fr", titleFr);
    formData.append("description_fr", descriptionFr);
    formData.append("title_en", titleEn);
    formData.append("description_en", descriptionEn);
 
    if (image) formData.append("image", image);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Actualites/putActualite.php`;
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      let data = null;
      let text = null;
      try {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          text = await response.text();
        }
      } catch (parseErr) {
        text = await response.text().catch(() => null);
      }

      if (response.ok && data && data.success) {
        setMessage(data.message || "Actualité mise à jour avec succès !");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/admin_pages/actualites");
      } else {
        // Prefer backend JSON message, then plain text, then generic
        const serverMsg = (data && data.message) || text;
        setMessage(serverMsg || `Une erreur est survenue (code ${response.status})`);
      }
    } catch (err) {
      setMessage("Erreur lors de la mise à jour.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-red-600 py-10">Error: {error}</div>
      </div>
    );
  }

  if (!id || !currentActualite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-slate-600 py-10">Actualité introuvable.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Modifier l'Actualité
          </h1>
          <p className="text-slate-600">Mettez à jour les contenus en français et anglais</p>
        </div>

        {/* Message */}
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

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* French Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4a4 4 0 014-4h5a4 4 0 014 4v4"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M21 12c0 .6-.4 1-1 1h-1.5"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Version Française</h2>
              </div>

              <div>
                <label htmlFor="titleFr" className="block text-slate-700 font-semibold mb-2">
                  Titre (Français)
                </label>
                <input
                  type="text"
                  id="titleFr"
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Entrez le titre en français"
                />
              </div>

              <div>
                <label htmlFor="descriptionFr" className="block text-slate-700 font-semibold mb-2">
                  Description (Français)
                </label>
                <textarea
                  id="descriptionFr"
                  value={descriptionFr}
                  onChange={(e) => setDescriptionFr(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400 resize-none"
                  placeholder="Décrivez l'actualité en français..."
                />
              </div>
            </div>

            {/* English Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">English Version</h2>
              </div>

              <div>
                <label htmlFor="titleEn" className="block text-slate-700 font-semibold mb-2">
                  Title (English)
                </label>
                <input
                  type="text"
                  id="titleEn"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Enter the title in English"
                />
              </div>

              <div>
                <label htmlFor="descriptionEn" className="block text-slate-700 font-semibold mb-2">
                  Description (English)
                </label>
                <textarea
                  id="descriptionEn"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400 resize-none"
                  placeholder="Describe the news in English..."
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Image (Optionelle)</h2>
              </div>

              {currentImageUrl && (
                <div className="mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentImageUrl}`}
                    alt="Image actuelle"
                    className="w-full h-48 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-slate-500">
                      <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-slate-400">PNG, JPG, GIF (MAX. 800x400px)</p>
                  </div>
                </label>
                
                {image && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">{image.name}</p>
                        <p className="text-xs text-blue-600">{(image.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              aria-label="Submit"
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Mettre à jour l'Actualité
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
