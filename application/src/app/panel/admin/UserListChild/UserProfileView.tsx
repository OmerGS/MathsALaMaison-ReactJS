"use client";

import React, { useState } from "react";
import { User } from "@/Type/User";
import { motion } from "framer-motion";
import ProfilPicture from "@/config/ProfilPicture";
import { updatePremiumState } from "@/services/adminAPI";

type UserProfileViewProps = {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
};

export default function UserProfileView({ user, onUpdateUser }: UserProfileViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const profileImageSrc = ProfilPicture[user.photoDeProfil] || ProfilPicture[1];

  const handleRemovePremium = async () => {
    setLoading(true);
    setError("");
    try {
      await updatePremiumState(user.email, false);
      onUpdateUser({ ...user, isPremium: false });
    } catch {
      setError("Erreur lors de la suppression du statut premium.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPremium = async () => {
    setLoading(true);
    setError("");
    try {
      await updatePremiumState(user.email, true);
      onUpdateUser({ ...user, isPremium: true });
    } catch {
      setError("Erreur lors de l'activation du statut premium.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg p-8 mt-10"
    >
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
        className="text-3xl font-extrabold text-gray-900 mb-6 text-center"
      >
        Profil Utilisateur
      </motion.h2>

      <div className="mb-8 grid grid-cols-2 gap-6 text-gray-700">
        <img
          src={profileImageSrc}
          alt="Photo de profil"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-200 object-cover"
        />

        <InfoItem label="Pseudo" value={user.pseudo} />
        <InfoItem label="Email" value={user.email} />
        <InfoItem
          label="Statut Premium"
          value={
            <span className={`font-semibold ${user.isPremium ? "text-green-600" : "text-red-600"}`}>
              {user.isPremium ? "Oui" : "Non"}
            </span>
          }
        />
      </div>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200"
      >
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Statistiques</h3>
        <StatsItem label="Digits" value={user.point.toString()} />
        <StatsItem label="Victoire" value={user.nombreVictoire.toString()} />
        <StatsItem label="Partie joué" value={user.nombrePartie.toString()} />
      </motion.div>

      {user.isPremium ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRemovePremium}
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:bg-red-700 disabled:opacity-50 transition"
        >
          {loading ? "Suppression en cours..." : "Enlever le statut Premium"}
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddPremium}
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? "Activation en cours..." : "Activer le statut Premium"}
        </motion.button>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 text-center text-red-600 font-medium"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="break-words min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium break-words">{value}</p>
    </div>
  );
}

function StatsItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-200 py-2 text-gray-700 last:border-b-0">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}