import { useState } from "react";

export default function ajouterArticle() {
  const [formData, setFormData] = useState({
    titre: "",
    annee: "",
    theme: "",
    resume: "",
    author_name: "",
    pdf_files: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState(null); // To handle the selected file
    const [showThemeInfo, setShowThemeInfo] = useState(false);


  // Update form data
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // For theme, ensure only numbers are accepted
    if (name === "theme") {
      // Only allow numbers, and prevent non-numeric input
      const numValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
 
  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ajouter_article.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Article and Author added successfully!");
        setFormData({ titre: "", annee: "", theme: "", resume: "", author_name: "" });
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload_excel.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Articles added from the Excel file!");
      } else {
        alert(result.error || "Error uploading the file");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  return ( 
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm border border-green-400/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">{successMessage}</span>
              <button 
                onClick={() => setSuccessMessage("")}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Ajouter un Article
          </h1>
          <p className="text-slate-600">Créez un nouvel article de recherche ou importez depuis Excel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manual Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Saisie Manuelle</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Titre</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Entrez le titre de l'article"
                />
              </div>


              <div>
                <label className="block text-slate-700 font-semibold mb-2">Année</label>
                <input
                  type="number"
                  name="annee"
                  value={formData.annee}
                  onChange={handleChange}
                  required
                  min="1900"
                  max="2100"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Ex: 2024"
                />
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <label className="block text-slate-700 font-semibold">Thème</label>
                  <button
                    type="button"
                    aria-label="Afficher les thèmes"
                    onClick={() => setShowThemeInfo((v) => !v)}
                    className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ lineHeight: 0 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e0f2fe" />
                      <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#2563eb" fontWeight="bold">!</text>
                    </svg>
                  </button>
                </div>
                <input
                  type="number"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  required
                  min="1"
                  step="1"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Entrez le numéro du thème"
                />
                {showThemeInfo && (
                  <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-lg z-10">
                    <h3 className="font-semibold text-blue-800 mb-2">Correspondance des thèmes :</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li><span className="font-bold">1</span> — Conception & Optimisation / Allègement / Durée de Vie et contrôle d’intégrité</li>
                      <li><span className="font-bold">2</span> — Matériaux & Procédés d’élaboration / Recyclage et Cycle de Vie</li>
                      <li><span className="font-bold">3</span> — Energies Renouvelables / Economie d’énergie / surveillance intelligentes des équipements, Intelligence Artificielle</li>
                      <li><span className="font-bold">4</span> — Matériaux bio-sourcés/Eco-matériaux/Eco-Conception</li>
                      <li><span className="font-bold">5</span> — Hydrogène en production, stockage, transport et conversion</li>
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Résumé</label>
                <textarea
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400 resize-none"
                  placeholder="Décrivez le contenu de l'article..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Nom de l'Auteur</label>
                <input
                  type="text"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Entrez le nom de l'auteur"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2">Fichier PDF</label>
                <input
                  type="text"
                  name="pdf_files"
                  value={formData.pdf_files}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-slate-800 placeholder-slate-400"
                  placeholder="Nom du fichier PDF, ex: document.pdf"
                />
                <p className="text-xs text-slate-400 mt-2">Entrez le nom du fichier PDF disponible dans /pdf_files.</p>
              </div>

              <button
                aria-label="Submit"
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Ajouter l'Article
                </div>
              </button>
            </form>
          </div>

          {/* Excel Upload Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Import Excel</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-4">Fichier Excel</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-slate-400">Excel files (.xlsx, .xls)</p>
                    </div>
                  </label>
                </div>
                
                {file && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">{file.name}</p>
                        <p className="text-xs text-blue-600">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                aria-label="Upload File"
                onClick={handleFileUpload}
                disabled={!file}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  Importer le Fichier
                </div>
              </button>

              {/* Info Section */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Format Excel requis:</h4>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Colonne A: Titre</li>
                      <li>• Colonne B: Année</li>
                      <li>• Colonne C: Thème</li>
                      <li>• Colonne D: Résumé</li>
                      <li>• Colonne E: Nom de l'auteur</li>
                      <li>• Colonne F: Nom du fichier PDF (`pdf_files`)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
