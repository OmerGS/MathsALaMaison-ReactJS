"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/Type/User";
import { getAllUsers } from "@/services/adminAPI";

const USERS_PER_PAGE = 5;

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [limit, setLimit] = useState(USERS_PER_PAGE);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers(page);
        setUsers(data.users.filter((u: { isPremium: any; }) => u.isPremium));
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


  return (
    <div>
      {loading && <p>Chargement des utilisateurs...</p>}
      {!loading && users.length === 0 && <p>Aucun utilisateur validé trouvé.</p>}

      {!loading && users.length > 0 && (
        <>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 font-semibold text-gray-700">
              <tr>
                <th className="border-b border-gray-300 px-4 py-3 text-left">ID</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Pseudo</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Email</th>
                <th className="border-b border-gray-300 px-4 py-3 text-center">Accès Application</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white hover:bg-blue-50">
                  <td className="border-b border-gray-200 px-4 py-3">{user.id}</td>
                  <td className="border-b border-gray-200 px-4 py-3">{user.pseudo}</td>
                  <td className="border-b border-gray-200 px-4 py-3">{user.email}</td>
                  <td className="border-b border-gray-200 px-4 py-3 text-center">
                    {user.isPremium ? "Oui" : "Non"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
            >
              Précédent
            </button>
            <span className="self-center">
              Page {page} / {totalPages}
            </span>
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