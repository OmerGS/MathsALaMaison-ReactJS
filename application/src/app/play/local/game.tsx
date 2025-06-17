"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import BoardPlayer from "@/components/ui/BoardPlayer";

import "../../globals.css";
import { usePlayer } from "@/context/PlayerContext";
import { Category } from "@/data/question";

export default function LocalGame() {
  const router = useRouter();
  const { players } = usePlayer();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategory, setShowCategory] = useState(false);
  const [readyForQuestion, setReadyForQuestion] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const handleCategorySelected = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setShowCategory(true);
    setReadyForQuestion(false);
    setTimeout(() => {
      setShowCategory(false);
      setReadyForQuestion(true);
    }, 1000);
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setCategory(null);
    setReadyForQuestion(false);
  };

  const handleEndGame = () => {
    if (confirmEnd) {
      router.push("/play/local/endgame");
    } else {
      setConfirmEnd(true);
      setTimeout(() => setConfirmEnd(false), 3000);
    }
  };

  return (
    <div className="h-screen w-full p-4 bg-gradient-to-l from-custom to-custom text-white font-sans grid grid-cols-[3fr_1fr] grid-rows-[auto_1fr_auto] gap-4">
      
      {/* Centre colonne 1 — roue centrée verticalement et horizontalement */}
      <div className="col-start-1 row-span-3 flex flex-col items-center justify-center gap-4 max-h-full">
        <div className="w-full max-h-[80vh]">
          
        </div>
      </div>

      {/* Colonne 2 — contenu en colonne, BoardPlayer en haut, bouton en bas */}
      <div className="col-start-2 row-start-1 row-span-3 flex flex-col justify-between max-h-full">
        {/* BoardPlayer en haut */}
        <div className="flex justify-end">
          <BoardPlayer currentIndex={currentPlayerIndex} />
        </div>

        {/* Bouton terminer en bas */}
        <div className="flex justify-end">
          <button
            onClick={handleEndGame}
            className="text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            {confirmEnd ? "Cliquer encore pour confirmer" : "Terminer"}
          </button>
        </div>
      </div>
    </div>
  );
}
