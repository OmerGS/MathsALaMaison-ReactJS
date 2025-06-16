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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        max-w-md mx-auto
        p-6
        bg-white/20 backdrop-blur-md
        border border-white/30
        rounded-3xl
        shadow-lg shadow-black/25
        text-gray-900 font-sans
        flex flex-col items-center
        space-y-6
        md:max-w-4xl md:flex-row md:items-start md:space-y-0 md:space-x-10
      "
    >
      {/* Photo profil */}
      <motion.img
        src={profileImageSrc}
        alt="Photo de profil"
        className="
          w-28 h-28 rounded-full
          border-8 border-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500
          object-cover
          shadow-lg shadow-pink-400/50
          transition-transform
          hover:scale-105
          md:w-40 md:h-40
        "
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      />

      {/* Contenu infos */}
      <div className="flex-1 w-full md:w-auto">
        <motion.h2
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
          className="
            text-3xl font-extrabold text-center mb-6
            text-gradient bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent
            md:text-left
          "
        >
          Profil de {user.pseudo}
        </motion.h2>

        <div className="grid grid-cols-1 gap-4 text-gray-800 mb-8 md:grid-cols-2 md:gap-6">
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
          transition={{ delay: 0.5 }}
          className="
            mb-8
            p-5
            bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100
            rounded-2xl
            border border-white/40
            shadow-inner shadow-purple-300/50
            text-gray-800 font-semibold
            select-none
          "
        >
          <h3 className="text-2xl mb-4 text-center md:text-left">Statistiques</h3>
          <StatsItem label="Points" value={user.point.toString()} />
          <StatsItem label="Victoires" value={user.nombreVictoire.toString()} />
          <StatsItem label="Parties jouées" value={user.nombrePartie.toString()} />
        </motion.div>

        {/* Boutons */}
        {user.isPremium ? (
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemovePremium}
            disabled={loading}
            className="
              w-full py-3
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              rounded-2xl
              shadow-lg shadow-red-500/60
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Suppression en cours..." : "Enlever le statut Premium"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddPremium}
            disabled={loading}
            className="
              w-full py-3
              bg-green-600 hover:bg-green-700
              text-white font-semibold
              rounded-2xl
              shadow-lg shadow-green-500/60
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Activation en cours..." : "Activer le statut Premium"}
          </motion.button>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-red-600 font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="break-words min-w-0">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold break-words">{value}</p>
    </div>
  );
}

function StatsItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-300 py-2 last:border-b-0">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}