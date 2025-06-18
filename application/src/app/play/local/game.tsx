"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import BoardPlayer from "@/components/ui/BoardPlayer";

import "../../globals.css";
import { usePlayer } from "@/context/PlayerContext";
import Category from "@/Type/Category";
import { categoryData } from "@/Type/CategoryData";
import GameStep from "./gameStep";

export default function LocalGame() {
  const router = useRouter();
  const { currentPlayer, currentPlayerIndex, nextPlayer, getPointsOfPlayer } = usePlayer();

  // Convertir categoryData (Record<Category, CategoryData>) en tableau
  const categoriesArray = Object.values(categoryData);

  const [category, setCategory] = useState<Category | null>(null);
  const [showCategory, setShowCategory] = useState(false);
  const [readyForQuestion, setReadyForQuestion] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showQuestionCard, setShowQuestionCard] = useState(false);
  const winningScorePoint = 21;
  const winningScoreCategory = 12;

  const handleEndTurn = () => {
    if (!currentPlayer) return;

    const playerScore = getPointsOfPlayer(currentPlayer);
    
    if (playerScore >= winningScorePoint || playerScore >= winningScoreCategory) {
      router.push("/play/local/endgame");
      return;
    }
    setCategory(null);
    setShowCategory(false);
    setReadyForQuestion(false);
    setShowQuestionCard(false);
    nextPlayer();
  };

  const handleEndGame = () => {
    if (confirmEnd) {
      router.push("/play/local/endgame");
    } else {
      setConfirmEnd(true);
      setTimeout(() => setConfirmEnd(false), 3000);
    }
  };


  // Fonction appelée pour finir un tour
  const onEndTurn = () => {
    handleEndTurn();
  };

  // Fonction appelée pour passer à la question
  const onReadyForQuestion = () => {
    setReadyForQuestion(true);
    setShowQuestionCard(true);
  };

  return (
    <div className="relative min-h-screen w-screen p-4 bg-gradient-to-l from-custom to-custom font-sans flex flex-col md:grid md:grid-cols-[3fr_1fr] md:grid-rows-[auto_1fr_auto] gap-4">
      {/* --- Colonne principale --- */}
      <div className="flex flex-col items-center justify-center gap-6 w-full px-2 md:col-start-1 md:row-span-3">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <GameStep
            category={category}
            setCategory={setCategory}
            showCategory={showCategory}
            setShowCategory={setShowCategory}
            readyForQuestion={readyForQuestion}
            setReadyForQuestion={setReadyForQuestion}
            showQuestionCard={showQuestionCard}
            setShowQuestionCard={setShowQuestionCard}
            categoriesArray={categoriesArray}
            onEndTurn={onEndTurn}
            onReadyForQuestion={onReadyForQuestion}
          />
        </div>
      </div>

      {/* --- BoardPlayer et bouton --- */}
      <div className="w-full flex flex-col justify-between items-center md:col-start-2 md:row-span-3 md:items-end">
        {/* Classement joueur */}
        <div className="w-full flex justify-center md:justify-end mb-4">
          <BoardPlayer currentIndex={currentPlayerIndex} />
        </div>

        {/* Bouton terminer */}
        <div className="w-full flex justify-center md:justify-end mt-4">
          <button
            onClick={handleEndGame}
            className="btn-admin px-6 py-5 rounded-full animate-fade-in w-[15rem]"
          >
            {confirmEnd ? "Cliquer encore pour confirmer" : "Terminer"}
          </button>
        </div>
      </div>
    </div>
  );
}
