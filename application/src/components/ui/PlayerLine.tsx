"use client";
import React from "react";

interface PlayerLineProps {
  playerName: string;
  points: number;
  categoriesDone: number; 
  isCurrent: boolean;
}

export default function PlayerLine({ playerName, points, categoriesDone, isCurrent }: PlayerLineProps) {
  return (
    <li
      className={`flex justify-between items-center rounded-md px-3 py-2 transition
        ${
          isCurrent
            ? "bg-gradient-div bg-opacity-90 text-black-200 shadow-lg font-bold"
            : "bg-white bg-opacity-10 text-black-200 hover:bg-white hover:bg-opacity-20"
        }`}
      title={playerName}
    >
      <span className="truncate max-w-[130px]">
        {playerName.length > 16 ? playerName.slice(0, 13) + "..." : playerName}
      </span>
      <div className="flex gap-4 ml-3 font-semibold whitespace-nowrap">
        <span>{points} pt</span>
        <span>{categoriesDone}/12</span>
      </div>
    </li>
  );
}
