"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/Type/User";
import { getAllUsers, approveUser, rejectUser } from "@/services/adminAPI";

export default function PendingList() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setPendingUsers(usersData.filter((u: { isPremium: any; }) => !u.isPremium));
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const approve = async (id: number, email: string, pseudo: string) => {
    const response = await approveUser(id, email, pseudo);

    if (!response.success) {
      console.error("Erreur lors de l'approbation de l'utilisateur");
      return;
    } else {
      setPendingUsers((prev) => prev.filter(u => u.id !== id));
    }
  };

  const reject = async (id: number, email: string, pseudo: string) => {
    const response = await rejectUser(id, email, pseudo);

    if (!response.success) {
      console.error("Erreur lors du refus de l'utilisateur");
      return;
    } else {
      setPendingUsers((prev) => prev.filter(u => u.id !== id));
    }
  };

  if (loading) return <p>Chargement des demandes...</p>;
  if (pendingUsers.length === 0) return <p>Aucune demande en attente.</p>;

  return (
    <table className="w-full border-collapse">
      <thead className="bg-gray-100 font-semibold text-gray-700">
        <tr>
          <th className="border-b border-gray-300 px-4 py-3 text-left">ID</th>
          <th className="border-b border-gray-300 px-4 py-3 text-left">Pseudo</th>
          <th className="border-b border-gray-300 px-4 py-3 text-left">Email</th>
          <th className="border-b border-gray-300 px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {pendingUsers.map((user) => (
          <tr key={user.id} className="bg-white hover:bg-blue-50">
            <td className="border-b border-gray-200 px-4 py-3">{user.id}</td>
            <td className="border-b border-gray-200 px-4 py-3">{user.pseudo}</td>
            <td className="border-b border-gray-200 px-4 py-3">{user.email}</td>
            <td className="flex gap-2 justify-center border-b border-gray-200 px-4 py-3">
              <button
                onClick={() => approve(user.id, user.email, user.pseudo)}
                className="rounded-md bg-green-500 px-4 py-1 text-white font-semibold hover:bg-green-600"
              >
                Approuver
              </button>
              <button
                onClick={() => reject(user.id, user.email, user.pseudo)}
                className="rounded-md bg-red-600 px-4 py-1 text-white font-semibold hover:bg-red-700"
              >
                Refuser
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}