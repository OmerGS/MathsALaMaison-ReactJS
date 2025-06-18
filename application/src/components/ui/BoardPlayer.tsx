"use client";
import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import PlayerLine from "./PlayerLine";

interface BoardPlayerProps {
  currentIndex: number;
}

export default function BoardPlayer({ currentIndex }: BoardPlayerProps) {
  const { players, points, categoriesDone } = usePlayer();

  // Trouver le score max et le joueur gagnant
  let maxPoints = -Infinity;
  let winner: string | null = null;
  players.forEach((player) => {
    if ((points[player] ?? 0) > maxPoints) {
      maxPoints = points[player] ?? 0;
      winner = player;
    }
  });

  return (
    <div className="bg-white/60 backdrop-blur-md px-5 py-4 w-full max-w-xs rounded-xl shadow-md animate-fade-in-delay-100">
      <h2 className="text-center text-black-400 text-xl font-extrabold mb-4 tracking-wide uppercase drop-shadow-md">
        Classement
      </h2>
      <ul className="space-y-2 max-h-[280px] overflow-y-auto">
        {players.map((player, index) => (
          <PlayerLine
            key={player}
            playerName={player}
            points={points[player] ?? 0}
            categoriesDone={categoriesDone[player] ?? 0}
            isCurrent={index === currentIndex}
            isWinner={player === winner}
          />
        ))}
      </ul>
    </div>
  );
}
