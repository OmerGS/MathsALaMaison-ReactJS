"use client";
import React from "react";
import { usePlayer } from "@/context/PlayerContext";

interface BoardPlayerProps {
  currentIndex: number;
}

export default function BoardPlayer({ currentIndex }: BoardPlayerProps) {
  const { players, points } = usePlayer();

  return (
    <div className="bg-white/60 backdrop-blur-md px-5 py-4 w-full max-w-xs rounded-xl shadow-md animate-fade-in-delay-100">
      <h2 className="text-center text-black-400 text-xl font-extrabold mb-4 tracking-wide uppercase drop-shadow-md">
        Classement
      </h2>
      <ul className="space-y-2 max-h-[280px] overflow-y-auto">
        {players
          .slice()
          .sort((a, b) => (points[b] ?? 0) - (points[a] ?? 0))
          .map((player, index) => (
            <li
              key={player}
              className={`flex justify-between items-center rounded-md px-3 py-2 transition
                ${
                  index === currentIndex
                    ? "bg-gradient-div bg-opacity-90 text-black-200 shadow-lg font-bold"
                    : "bg-white bg-opacity-10 text-black-200 hover:bg-white hover:bg-opacity-20"
                }`}
              title={player}
            >
              <span className="truncate max-w-[130px]">
                {player.length > 16 ? player.slice(0, 13) + "..." : player}
              </span>
              <span className="ml-3 font-semibold">{points[player] ?? 0} pt</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
