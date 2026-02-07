import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/components/Context/LanguageContext";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Users, Plus, Check, X } from "lucide-react";
import Loading from "@/components/Loading";
import { deleteUserById, getUsers, updateUser } from "@/utils/usersUtils";

function ModifierUtilisateur() {
  const language = useContext(LanguageContext).language;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null); // Track the user being edited
  const [editedUser, setEditedUser] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" }); // Track success/error message
  const [error, setError] = useState(null); // Track error message

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setMessage({
        text: "An error occurred while fetching users.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await deleteUserById(id);
      if (result.success) {
        setUsers(users.filter((user) => user.id !== id));
        setMessage({ text: "User deleted successfully", type: "success" });
      } else {
        setMessage({
          text: result.message || "Failed to delete the user",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while deleting the user",
        type: "error",
      });
      console.error("Delete error:", error);
    }
  };

  const editUser = (user) => {
    setEditingUserId(user.id); // Start editing this user
    setEditedUser({ username: user.username, password: user.password }); // Pre-fill the inputs with current values
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const confirmEdit = async () => {
    const { username, password } = editedUser;
    if (!username || !password) {
      setMessage({ text: "Username and password are required", type: "error" });
      return;
    }

    const updatedUser = {
      id: editingUserId,
      username,
      password,
    };

    try {
      const data = await updateUser(updatedUser);
      if (data.success) {
        setUsers(
          users.map((user) => (user.id === editingUserId ? updatedUser : user))
        );
        setMessage({ text: "User updated successfully", type: "success" });
        setEditingUserId(null); // End editing
      } else {
        setMessage({ text: `Error: ${data.message}`, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "An error occurred while updating the user",
        type: "error",
      });
    }
  };

  const cancelEdit = () => {
    setEditingUserId(null); // End editing without saving changes
  };

  // Auto-hide the message after 4 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="backdrop-blur-sm bg-white/90 rounded-2xl p-8 border border-white/20">
        <Loading/>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="backdrop-blur-sm bg-white/90 rounded-2xl p-8 border border-white/20">
        <div className="text-center text-red-600 py-10">Error: {error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
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

        {/* Header Section */}
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mr-4">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {language === "fr" ? "Gestion des Utilisateurs" : "User Management"}
              </h1>
              <p className="text-gray-600 font-medium mt-2">
                {language === "fr" ? "Gérez tous les utilisateurs du système" : "Manage all system users"}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              aria-label="Add User"
              onClick={() => (window.location.href = "/admin_pages/utilisateur/ajouter")}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {language === "fr" ? "Ajouter un Utilisateur" : "Add User"}
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold border-b border-gray-700">
                    {language === "fr" ? "Nom d'utilisateur" : "Username"}
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold border-b border-gray-700">
                    {language === "fr" ? "Mot de passe" : "Password"}
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold border-b border-gray-700">
                    {language === "fr" ? "Actions" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/90">
                {users.map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-200 hover:bg-blue-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          name="username"
                          value={editedUser.username}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={language === "fr" ? "Nom d'utilisateur" : "Username"}
                        />
                      ) : (
                        <span className="text-gray-700 font-medium">{user.username}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          name="password"
                          value={editedUser.password}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={language === "fr" ? "Mot de passe" : "Password"}
                        />
                      ) : (
                        <span className="text-gray-700 font-mono">{user.password}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={confirmEdit}
                            className="group relative px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                          >
                            <Check size={16} className="mr-1" />
                            {language === "fr" ? "Sauver" : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="group relative px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                          >
                            <X size={16} className="mr-1" />
                            {language === "fr" ? "Annuler" : "Cancel"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => editUser(user)}
                            className="group relative p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                            title={language === "fr" ? "Modifier" : "Edit"}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="group relative p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                            title={language === "fr" ? "Supprimer" : "Delete"}
                          >
                            <FiTrash size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {language === "fr" ? "Aucun utilisateur trouvé" : "No users found"}
              </p>
              <p className="text-sm">
                {language === "fr" ? "Commencez par ajouter un nouvel utilisateur" : "Start by adding a new user"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModifierUtilisateur;
