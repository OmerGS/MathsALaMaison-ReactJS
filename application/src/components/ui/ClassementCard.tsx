"use client";
import Image from "next/image";
import profileImages from "@/Type/ProfilePicture";
import { User } from "@/Type/User";
import { motion } from "framer-motion";

type Props = {
  player: User;
  index: number;
  currentUserId?: number;
  selectedTab: "points" | "gamesPlayed" | "wins";
};

export default function ClassementCard({ player, index, currentUserId, selectedTab }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className={`flex items-center justify-between p-3 rounded-xl shadow-sm ${
        player.id === currentUserId ? "bg-cyan-400" : "bg-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg font-bold text-gray-800">{index + 1}.</span>
        <Image
          src={profileImages[player.photoDeProfil]}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-medium text-gray-900">{player.pseudo}</span>
      </div>
      <span className="text-gray-700 font-semibold">
        {selectedTab === "points"
          ? player.point
          : selectedTab === "gamesPlayed"
          ? player.nombrePartie
          : player.nombreVictoire}
      </span>
    </motion.div>
  );
}
