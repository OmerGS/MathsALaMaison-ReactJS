"use client";

import React, { useEffect, useRef, useState } from "react";
import { getUserPerPage, updateUserPerPageNumber } from "@/services/adminAPI";
import ToastContainer from "@/components/ToastContainer";

export default function PaginationSettings() {
  const [usersPerPage, setUsersPerPage] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toastRef = useRef<{ addToast: (type: "success" | "error", msg: string) => void } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await getUserPerPage(); 
        setUsersPerPage(res.users_per_page);
      } catch {
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (usersPerPage === "" || usersPerPage <= 0) {
      toastRef.current?.addToast("error", "Valeur invalide");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await updateUserPerPageNumber(usersPerPage);
      toastRef.current?.addToast("success", "Paramètre mis à jour !");
    } catch {
      toastRef.current?.addToast("error", "Erreur lors de la sauvegarde !");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="border rounded p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Pagination</h2>
      <label htmlFor="usersPerPage" className="block mb-2 font-semibold">
        Nombre d'utilisateurs par page :
      </label>
      <input
        type="number"
        id="usersPerPage"
        min={1}
        value={usersPerPage}
        onChange={(e) => setUsersPerPage(Number(e.target.value))}
        className="border p-2 rounded w-20"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Sauvegarde..." : "Sauvegarder"}
      </button>
      {error && <p className="mt-2 text-red-600">{error}</p>}

      <ToastContainer ref={toastRef} />
    </div>
    
  );
}