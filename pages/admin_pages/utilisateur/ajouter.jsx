import { useRouter } from "next/router";
import { useState } from "react";
import { UserPlus, ArrowLeft, User, Lock } from "lucide-react";

function ajouterUtilisateur() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const addUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(event.target);
        const newUser = {
            username: formData.get("username"),
            password: formData.get("password")
        };

        if (!newUser.username.trim() || !newUser.password.trim()) {
            setMessage({ text: "Tous les champs sont requis", type: "error" });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/addUser.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            
            if (response.ok) {
                setMessage({ text: "Utilisateur ajouté avec succès", type: "success" });
                setTimeout(() => {
                    router.push("/admin_pages/utilisateur");
                }, 1500);
            } else {
                setMessage({ text: "Erreur lors de l'ajout de l'utilisateur", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Erreur de connexion", type: "error" });
            console.error("Error adding user:", error);
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
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mr-4">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Ajouter un Utilisateur
                            </h1>
                            <p className="text-gray-600 font-medium mt-2">
                                Créez un nouveau compte utilisateur
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="backdrop-blur-sm bg-white/90 rounded-2xl p-8 border border-white/20 shadow-xl">
                    <form onSubmit={addUser} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    name="username" 
                                    placeholder="Entrez le nom d'utilisateur..." 
                                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Entrez le mot de passe..." 
                                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full group relative px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg font-semibold"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Ajout en cours...
                                </div>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                                    Ajouter l'Utilisateur
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Section */}
                <div className="mt-8 backdrop-blur-sm bg-blue-50/80 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-start">
                        <div className="p-2 rounded-lg bg-blue-500 text-white mr-4 flex-shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Conseils de sécurité</h3>
                            <p className="text-blue-700 text-sm leading-relaxed">
                                Utilisez des mots de passe forts contenant au moins 8 caractères, incluant des lettres majuscules, 
                                minuscules, des chiffres et des caractères spéciaux pour garantir la sécurité du compte.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ajouterUtilisateur;