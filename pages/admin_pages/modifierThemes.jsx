import { useState, useEffect, useContext } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import { Pencil, Check, X, Tag, Plus } from "lucide-react";
import { LanguageContext } from "@/components/Context/LanguageContext";

function ModifierThemes() {
  const { language } = useContext(LanguageContext);

  const [themes, setThemes] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedThemeName, setEditedThemeName] = useState("");
  const [editedThemeCode, setEditedThemeCode] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getThemes();
  }, []);

  const years = Array.from(new Set(themes.map(t => t.annee))).sort((a, b) => b - a);

  const filteredThemes = themes.filter(
    t => !selectedYear || String(t.annee) === String(selectedYear)
  );

  const getThemes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Themes/getAllTheme.php`
      );
      const data = await response.json();
      setThemes(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch themes");
      setLoading(false);
    }
  };

  const updateTheme = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Themes/EditTheme.php`,
        {
          themeID: id,
          themeName: editedThemeName,
          themeCode: editedThemeCode,
          _method: "PUT",
        }
      );

      setThemes(themes.map(t =>
        t.themeID === id ? { ...t, themeName: editedThemeName, themeCode: editedThemeCode } : t
      ));

      setEditMode(null);
      setEditedThemeName("");
      setEditedThemeCode("");
      setMessage({ text: "Theme modified successfully", type: "success" });

    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Failed to edit theme",
        type: "error",
      });
    }
  };

  const enterEditMode = (id, name, code) => {
    setEditMode(id);
    setEditedThemeName(name);
    setEditedThemeCode(code || "");
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedThemeName("");
    setEditedThemeCode("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto max-w-6xl px-4">

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`fixed top-0 left-0 w-full py-3 text-center text-white z-50 ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* HEADER PAGE */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 mb-8 shadow">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl">
                <Tag className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">
                {language === "fr" ? "Gestion des Thèmes" : "Theme Management"}
              </h1>
            </div>

            <button
              onClick={() => (window.location.href = "/admin_pages/ajouterTheme")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:scale-105 transition"
            >
              <Plus className="inline mr-2" size={18} />
              {language === "fr" ? "Ajouter un thème" : "Add Theme"}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow overflow-hidden">

          {/* TABLE HEADER PREMIUM */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {language === "fr" ? "Liste des thèmes" : "Themes list"}
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredThemes.length}{" "}
                  {language === "fr" ? "thèmes affichés" : "themes displayed"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">
                    {language === "fr" ? "Toutes les années" : "All years"}
                  </option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                {selectedYear && (
                  <button
                    onClick={() => setSelectedYear("")}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                  >
                    ✕ Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">
                    {language === "fr" ? "Nom" : "Name"}
                  </th>
                  <th className="px-6 py-4 text-left">
                    {language === "fr" ? "Code" : "Code"}
                  </th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredThemes.map((theme, index) => (
                  <tr
                    key={theme.themeID}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4">#{theme.themeID}</td>

                    <td className="px-6 py-4">
                      {editMode === theme.themeID ? (
                        <input
                          className="border rounded-lg px-3 py-2 w-full"
                          value={editedThemeName}
                          onChange={(e) => setEditedThemeName(e.target.value)}
                        />
                      ) : (
                        theme.themeName
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editMode === theme.themeID ? (
                        <input
                          className="border rounded-lg px-3 py-2 w-full"
                          value={editedThemeCode}
                          onChange={(e) => setEditedThemeCode(e.target.value)}
                        />
                      ) : (
                        theme.themeCode || "—"
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {editMode === theme.themeID ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => updateTheme(theme.themeID)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            enterEditMode(theme.themeID, theme.themeName, theme.themeCode)
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredThemes.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              {language === "fr"
                ? "Aucun thème trouvé"
                : "No themes found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModifierThemes;
