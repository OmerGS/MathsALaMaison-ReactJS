"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/Type/User";
import { getNonPremiumUser, approveUser, rejectUser } from "@/services/adminAPI";
import Spinner from "@/components/ui/Spinner";
import EmptyStateAnimated from "@/components/ui/EmptyState";

export default function PendingList() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getNonPremiumUser();
        setPendingUsers(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs non premium :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const approve = async (id: number, email: string, pseudo: string) => {
    try {
      const response = await approveUser(id, email, pseudo);
      if (!response.success) {
        console.error("Erreur lors de l'approbation de l'utilisateur");
      } else {
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation de l'utilisateur :", error);
    }
  };

  const reject = async (id: number, email: string, pseudo: string) => {
    try {
      const response = await rejectUser(id, email, pseudo);
      if (!response.success) {
        console.error("Erreur lors du refus de l'utilisateur");
      } else {
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error("Erreur lors du refus de l'utilisateur :", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center"><Spinner /> </div>
    );
  if (pendingUsers.length === 0)
    return (
      <EmptyStateAnimated />
    );

  return (
    <>
      {/* Table desktop avec glassmorphism amélioré */}
      <table
        className="hidden md:table w-full border-collapse
          bg-white/25 backdrop-blur-lg
          border border-white/25
          rounded-3xl
          shadow-lg shadow-gray-500/20
          text-gray-800"
      >
        <thead className="bg-white/40 backdrop-blur-sm text-gray-900 font-semibold tracking-wide">
          <tr>
            <th className="border-b border-white/30 px-5 py-4 text-left rounded-tl-3xl">ID</th>
            <th className="border-b border-white/30 px-5 py-4 text-left">Pseudo</th>
            <th className="border-b border-white/30 px-5 py-4 text-left">Email</th>
            <th className="border-b border-white/30 px-5 py-4 text-center rounded-tr-3xl">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.map((user) => (
            <tr
              key={user.id}
              className="bg-white/20 hover:bg-white/40 transition-colors duration-300 cursor-pointer"
            >
              <td className="border-b border-white/25 px-5 py-4 font-semibold">{user.id}</td>
              <td className="border-b border-white/25 px-5 py-4 font-medium">{user.pseudo}</td>
              <td className="border-b border-white/25 px-5 py-4 break-words">{user.email}</td>
              <td className="flex gap-3 justify-center border-b border-white/25 px-5 py-4">
                <button
                  onClick={() => approve(user.id, user.email, user.pseudo)}
                  className="rounded-xl bg-gradient-to-r from-green-400 to-green-600 px-5 py-2 text-white font-semibold 
                             shadow-md shadow-green-300/50
                             hover:scale-105 hover:from-green-500 hover:to-green-700
                             transition-transform duration-300"
                >
                  Approuver
                </button>
                <button
                  onClick={() => reject(user.id, user.email, user.pseudo)}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-5 py-2 text-white font-semibold 
                             shadow-md shadow-red-300/50
                             hover:scale-105 hover:from-red-600 hover:to-red-800
                             transition-transform duration-300"
                >
                  Refuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cartes mobile avec glassmorphism & style soft */}
      <div className="md:hidden flex flex-col gap-7 px-3">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-6
                       shadow-lg shadow-gray-400/30
                       border border-white/30
                       hover:shadow-gray-500/50
                       transition-shadow duration-300 cursor-pointer"
          >
            <p className="text-gray-900 font-semibold text-xl mb-2 tracking-wide">{user.pseudo}</p>
            <p className="text-gray-700 mb-2 break-words tracking-normal">{user.email}</p>
            <p className="text-gray-600 mb-4 tracking-wider">ID: {user.id}</p>

            <div className="flex gap-5">
              <button
                onClick={() => approve(user.id, user.email, user.pseudo)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3
                           shadow-md shadow-green-300/50
                           hover:scale-105 hover:from-green-500 hover:to-green-700
                           transition-transform duration-300"
              >
                Approuver
              </button>
              <button
                onClick={() => reject(user.id, user.email, user.pseudo)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-3
                           shadow-md shadow-red-300/50
                           hover:scale-105 hover:from-red-600 hover:to-red-800
                           transition-transform duration-300"
              >
                Refuser
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}