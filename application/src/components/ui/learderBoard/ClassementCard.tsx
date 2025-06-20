"use client";
import Image from "next/image";
import ProfilPicture from "@/config/ProfilePicture";
import { User } from "@/Type/User";
import { motion } from "framer-motion";

type Props = {
  player: User;
  index: number;
  currentUser?: User | null;
  selectedTab: "point" | "nombrePartie" | "nombreVictoire";
};

export default function ClassementCard({
  player,
  index,
  currentUser,
  selectedTab,
}: Props) {


  const isCurrentUser = currentUser?.pseudo === player.pseudo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      className={`flex items-center justify-between p-3 rounded-xl shadow-sm 
        ${isCurrentUser ? "bg-cyan-100 border border-cyan-500" : "bg-white"}
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg font-bold text-gray-800">{index + 1}.</span>
        <Image
          src={ProfilPicture[player.photoDeProfil]}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-medium text-gray-900">{player.pseudo}</span>
      </div>
      <span className="text-gray-700 font-semibold">
        {selectedTab === "point"
          ? player.point
          : selectedTab === "nombrePartie"
          ? player.nombrePartie
          : player.nombreVictoire}
      </span>
    </motion.div>
  );
}
