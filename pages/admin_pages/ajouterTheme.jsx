import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Tag, Plus, ArrowLeft } from 'lucide-react';

function ajouterTheme() {
    const router = useRouter();
    const [themeNumber, setThemeNumber] = useState("");
    const [themeName, setThemeName] = useState("");
    const [themeCode, setThemeCode] = useState("");
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [themes, setThemes] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isLoading, setIsLoading] = useState(false);

    const addTheme = async () => {
        if (!themeNumber.trim()) {
            setMessage({ text: "Le numéro du thème est requis", type: "error" });
            return;
        }
        if (!themeName.trim()) {
            setMessage({ text: "Le nom du thème est requis", type: "error" });
            return;
        }
        if (!themeCode.trim()) {
            setMessage({ text: "Le code du thème est requis", type: "error" });
            return;
        }
        if (!annee) {
            setMessage({ text: "L'année est requise", type: "error" });
            return;
        }
        setIsLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/Themes/AddTheme.php`,
                {
                    themeID: themeNumber,
                    themeName: themeName,
                    themeCode: themeCode,
                    annee: annee
                }
            );
            setThemes([...themes, { themeNumber, themeName, themeCode, annee }]);
            setThemeNumber("");
            setThemeName("");
            setThemeCode("");
            setAnnee(new Date().getFullYear());
            setMessage({ text: "Thème ajouté avec succès", type: "success" });
            setTimeout(() => {
                router.push("/admin_pages/modifierThemes");
            }, 1500);
        } catch (error) {
            setMessage({ text: "Erreur lors de l'ajout du thème", type: "error" });
            console.error("Error adding theme:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                {/* Success/Error Message */}
                {message.text && (
                    <div
                        className={`fixed top-0 left-0 w-full py-3 text-center text-white font-medium z-50 ${
                            message.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="group mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Retour
                </button>

                {/* Header Section */}
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 mb-8 border border-white/20">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg mr-4">
                            <Tag className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Ajouter un Thème
                            </h1>
                            <p className="text-gray-600 font-medium mt-2">
                                Créez un nouveau thème pour vos articles
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="backdrop-blur-sm bg-white/90 rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Numéro du Thème
                            </label>
                            <input
                                type="number"
                                placeholder="Entrez le numéro du thème..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 mb-6"
                                value={themeNumber}
                                onChange={e => setThemeNumber(e.target.value)}
                                disabled={isLoading}
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Nom du Thème
                            </label>
                            <input
                                type="text"
                                placeholder="Entrez le nom du thème..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                                value={themeName}
                                onChange={e => setThemeName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Code du Thème
                            </label>
                            <input
                                type="text"
                                placeholder="Entrez le code du thème..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                                value={themeCode}
                                onChange={e => setThemeCode(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Année
                            </label>
                            <input
                                type="number"
                                min="2000"
                                max={new Date().getFullYear() + 1}
                                value={annee}
                                onChange={e => setAnnee(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 mb-6"
                                placeholder="Entrez l'année..."
                                disabled={isLoading}
                            />
                        </div>
                        <button 
                            onClick={addTheme}
                            disabled={isLoading || !themeName.trim() || !themeCode.trim() || !annee}
                            className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg font-semibold"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Ajout en cours...
                                </div>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                                    Ajouter le Thème
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8 backdrop-blur-sm bg-blue-50/80 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-blue-500 text-white mr-4 flex-shrink-0">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">À propos des thèmes</h3>
                            <p className="text-blue-700 text-sm leading-relaxed">
                                Les thèmes permettent de catégoriser vos articles et d'améliorer la navigation pour vos lecteurs. 
                                Choisissez des noms descriptifs et pertinents pour faciliter la recherche de contenu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ajouterTheme;