"use client";
import React from "react";

interface PlayerLineProps {
  playerName: string;
  points: number;
  categoriesDone?: number;
  isCurrent: boolean;
  isWinner?: boolean;
}

export default function PlayerLine({ playerName, points, categoriesDone = 0, isCurrent, isWinner }: PlayerLineProps) {
  return (
    <li
      className={`flex justify-between items-center rounded-md px-3 py-2 transition
        ${
          isCurrent
            ? "bg-gradient-div bg-opacity-90 text-black-200 shadow-lg font-bold"
            : "bg-white bg-opacity-10 text-black-200 hover:bg-white hover:bg-opacity-20"
        }
        ${isWinner ? "text-yellow-400 font-extrabold" : ""}
      `}
      title={playerName}
    >
      <span className="flex items-center truncate max-w-[130px]">
        {isWinner && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2l2.39 6.84 7.21.61-5.39 4.53 1.64 7.15L12 17.77 6.15 21.13l1.64-7.15-5.39-4.53 7.21-.61L12 2z"
            />
          </svg>
        )}
        {playerName.length > 16 ? playerName.slice(0, 13) + "..." : playerName}
      </span>
      <span className="ml-3 font-semibold">{points} pt</span>
    </li>
  );
}
