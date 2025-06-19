"use client";

import { usePlayer } from "@/context/PlayerContext";
import "../../globals.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeftCircle, RotateCcw } from "lucide-react";
import Confetti from "react-confetti";
import BackButton from "@/components/ui/BackButton";

export default function EndGame({ onCreated }: { onCreated: () => void }) {
  const { players, points, resetPlayers } = usePlayer();
  const router = useRouter();

  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReplay = () => {
    resetPlayers();
    onCreated();
  };

  const handleQuit = () => {
    router.push("/");
    resetPlayers();
    onCreated();
  };

  const ranking = players
    .slice()
    .sort((a, b) => (points[b] ?? 0) - (points[a] ?? 0));

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-bl from-custom via-[#2d2a4a] to-custom text-white overflow-hidden">
      <div className="self-start mb-4">
        <BackButton />
      </div>
      {/* 🎊 Confettis */}
      <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={300} />

      <motion.h1
        className="text-4xl font-bold mb-8 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎉 Fin de la partie
      </motion.h1>

      <motion.div
        className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Classement :</h2>
        <ul className="space-y-3">
          {ranking.map((player, index) => (
            <li
              key={player}
              className={`flex justify-between items-center p-3 rounded-lg ${
                index === 0
                  ? "bg-yellow-100 font-semibold"
                  : index === 1
                  ? "bg-gray-200"
                  : index === 2
                  ? "bg-orange-100"
                  : "bg-gray-50"
              }`}
            >
              <span className="text-lg">
                {getMedal(index)} {player}
              </span>
              <span className="font-bold">{points[player] ?? 0} pts</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="flex mt-10 space-x-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={handleReplay}
          className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-600 hover:scale-105 transition-all"
        >
          <RotateCcw size={20} /> Rejouer
        </button>

        <button
          onClick={handleQuit}
          className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-red-600 hover:scale-105 transition-all"
        >
          <ArrowLeftCircle size={20} /> Quitter
        </button>
      </motion.div>
    </div>
  );
}
