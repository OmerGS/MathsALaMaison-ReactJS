"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "@/Type/User";
import profileImages from "@/Type/ProfilePicture";

type Props = {
  user: User;
  currentUserRank: number;
};

export default function UserStatsCard({ user, currentUserRank }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-gray-800"
    >
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={profileImages[user.photoDeProfil]}
          alt="Profil"
          width={64}
          height={64}
          className="rounded-full border-4 border-cyan-400"
        />
        <div>
          <h2 className="text-xl font-bold">{user.pseudo}</h2>
          <p className="text-sm text-gray-500">Ton profil</p>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <div className="space-y-3">
        <div className="flex justify-between text-lg">
          <span>🏆 Classement</span>
          <span className="font-semibold text-cyan-600">
            {currentUserRank}
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span>⭐ Points</span>
          <span className="font-semibold">{user.point}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>🎯 Victoires</span>
          <span className="font-semibold">{user.nombreVictoire ?? "-"}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span>🎮 Parties jouées</span>
          <span className="font-semibold">{user.nombrePartie ?? "-"}</span>
        </div>
      </div>
    </motion.div>
  );
}
