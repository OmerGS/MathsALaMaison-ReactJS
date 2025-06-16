import React, { useState, useEffect } from "react";
import { User } from "@/Type/User";
import { getAllUsers } from "@/services/adminAPI";
import UserProfileView from "./UserListChild/UserProfileView";
import Spinner from "@/components/ui/Spinner";

const USERS_PER_PAGE = 10;

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(USERS_PER_PAGE);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [premiumFilter, setPremiumFilter] = useState<"all" | "premium" | "nonpremium">("all");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers(page, searchTerm, premiumFilter);
        setUsers(data.users);
        setTotalUsers(data.total);
        setLimit(data.limit);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchTerm, premiumFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, premiumFilter]);

  const totalPages = Math.ceil(totalUsers / limit);

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  const handleCloseProfile = () => setSelectedUser(null);

  if (selectedUser) {
    return (
      <div className="p-4">
        <button
          onClick={handleCloseProfile}
          className="mb-6 px-4 py-2 bg-white/50 backdrop-blur-md text-gray-700 font-semibold rounded-full hover:bg-white/70 transition cursor-pointer"
        >
          ← Retour à la liste
        </button>
        <UserProfileView user={selectedUser} onUpdateUser={handleUpdateUser} />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-gradient-to-b from-white to-blue-50 min-h-screen">
      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Rechercher par pseudo ou email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-full px-4 py-2 shadow-md bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <select
          value={premiumFilter}
          onChange={(e) => setPremiumFilter(e.target.value as any)}
          className="border border-gray-300 rounded-full px-4 py-2 shadow-md bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="all">Tous</option>
          <option value="premium">Premium</option>
          <option value="nonpremium">Non Premium</option>
        </select>
      </div>

      {loading && <div className="flex items-center justify-center"><Spinner /> </div> }
      {!loading && users.length === 0 && <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>}

      {!loading && users.length > 0 && (
        <>
          {/* TABLEAU DESKTOP */}
          <div className="hidden md:block rounded-2xl overflow-hidden shadow-xl bg-white/40 backdrop-blur-md">
            <table className="w-full border-collapse">
              <thead className="bg-white/60 text-gray-700 font-semibold">
                <tr>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">ID</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">Pseudo</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-left">Email</th>
                  <th className="border-b border-gray-300 px-6 py-4 text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-100 cursor-pointer transition"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4 border-b border-gray-200">{user.id}</td>
                    <td className="px-6 py-4 border-b border-gray-200">{user.pseudo}</td>
                    <td className="px-6 py-4 border-b border-gray-200 break-all">{user.email}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-center">
                      {user.isPremium ? "Oui" : "Non"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VERSION MOBILE */}
          <div className="md:hidden space-y-6 mt-4">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="bg-white/40 p-5 rounded-2xl shadow-xl backdrop-blur-md hover:bg-white/60 transition cursor-pointer"
              >
                <div className="text-xs text-gray-500">ID: {user.id}</div>
                <div className="font-semibold text-lg text-gray-800">{user.pseudo}</div>
                <div className="text-sm text-gray-700 break-words">{user.email}</div>
                <div className={`mt-2 font-bold ${user.isPremium ? "text-green-600" : "text-red-600"}`}>
                  Premium: {user.isPremium ? "Oui" : "Non"}
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex justify-center items-center gap-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`rounded-full bg-white/60 px-5 py-2 backdrop-blur-md text-gray-700 border border-gray-300 font-semibold transition hover:bg-white/80 ${
                page === 1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              ⬅ Précédent
            </button>
            <span className="text-gray-700 font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded-full bg-white/60 px-5 py-2 backdrop-blur-md text-gray-700 border border-gray-300 font-semibold transition hover:bg-white/80 ${
                page === totalPages ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              Suivant ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}