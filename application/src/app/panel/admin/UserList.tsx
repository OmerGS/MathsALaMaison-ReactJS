import React, { useState, useEffect } from "react";
import { User } from "@/Type/User";
import { getAllUsers } from "@/services/adminAPI";
import UserProfileView from "./UserListChild/UserProfileView";

const USERS_PER_PAGE = 10;

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(USERS_PER_PAGE);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers(page);
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
  }, [page]);

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
      <div>
        <button
          onClick={handleCloseProfile}
          className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          ← Retour à la liste
        </button>
        <UserProfileView
          user={selectedUser}
          onUpdateUser={handleUpdateUser}
        />
      </div>
    );
  }

  return (
    <div className="px-2">
      {loading && <p>Chargement des utilisateurs...</p>}
      {!loading && users.length === 0 && <p>Aucun utilisateur validé trouvé.</p>}

      {!loading && users.length > 0 && (
        <>

          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 font-semibold text-gray-700">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-3 text-left">ID</th>
                  <th className="border-b border-gray-300 px-4 py-3 text-left">Pseudo</th>
                  <th className="border-b border-gray-300 px-4 py-3 text-left">Email</th>
                  <th className="border-b border-gray-300 px-4 py-3 text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-blue-50 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="border-b border-gray-200 px-4 py-3">{user.id}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{user.pseudo}</td>
                    <td className="border-b border-gray-200 px-4 py-3 break-all">{user.email}</td>
                    <td className="border-b border-gray-200 px-4 py-3 text-center">
                      {user.isPremium ? "Oui" : "Non"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="bg-white p-4 rounded-xl shadow hover:bg-blue-50 transition cursor-pointer"
              >
                <div className="text-sm text-gray-500">ID: {user.id}</div>
                <div className="font-semibold text-lg text-gray-800">{user.pseudo}</div>
                <div className="text-sm text-gray-700 break-words">{user.email}</div>
                <div className={`mt-2 font-bold ${user.isPremium ? "text-green-600" : "text-red-600"}`}>
                  Premium: {user.isPremium ? "Oui" : "Non"}
                </div>
              </div>
            ))}
          </div>


          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
            >
              Précédent
            </button>
            <span className="self-center">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}