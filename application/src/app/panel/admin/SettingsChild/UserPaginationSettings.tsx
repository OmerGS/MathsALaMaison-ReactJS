"use client";

import React, { useEffect, useRef, useState } from "react";
import { getUserPerPage, updateUserPerPageNumber } from "@/services/adminAPI";
import ToastContainer from "@/components/ToastContainer";
import { motion, useAnimation } from "framer-motion";
import AnimatedNumber from "@/components/ui/admin/AnimatedNumber";
import Spinner from "@/components/ui/global/Spinner";

export default function UserPaginationSettings() {
  const [usersPerPage, setUsersPerPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toastRef = useRef<{ addToast: (type: "success" | "error", msg: string) => void } | null>(null);
  const controls = useAnimation();

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

  const bounce = async () => {
    await controls.start({ scale: 1.05 });
    await controls.start({ scale: 1, transition: { type: "spring", stiffness: 300 } });
  };

  const handleIncrement = () => {
    setUsersPerPage((prev) => {
      const next = Math.min(100, prev + 1);
      bounce();
      return next;
    });
  };

  const handleDecrement = () => {
    setUsersPerPage((prev) => {
      const next = Math.max(1, prev - 1);
      bounce();
      return next;
    });
  };

  const handleSave = async () => {
    if (usersPerPage <= 0) {
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

  if (loading) return <div className="text-left text-gray-500"><Spinner></Spinner></div>;

  return (
    <>
      <div className="p-6 border rounded-2xl bg-white shadow-md w-full max-w-xs mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pagination</h2>

        <p className="text-sm text-gray-600 mb-1">Utilisateurs par page</p>

        <div className="flex items-center justify-center space-x-4 my-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleDecrement}
            disabled={usersPerPage <= 1}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-xl font-light text-gray-800 transition disabled:opacity-50"
          >
            −
          </motion.button>

          <AnimatedNumber value={usersPerPage} />

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleIncrement}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-xl font-light text-gray-800 transition"
          >
            +
          </motion.button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 w-full text-sm bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-4 py-2 rounded-xl disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>

        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}

        <ToastContainer ref={toastRef} />
      </div>
    </>
  );
}