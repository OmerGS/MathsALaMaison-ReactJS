"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import "../../globals.css";

export default function LocalGame() {
  const { players, points } = usePlayer();

  return (
    <div className="flex flex-col md:flex-row h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <div className="text-white w-full">
        <h1 className="text-center text-3xl mb-6">Partie locale</h1>
        <h2 className="text-lg mb-4">Joueurs :</h2>
        <ul className="list-disc list-inside">
          {players.map((player, index) => (
            <li key={index}>
              {player} — {points[player] ?? 0} points
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}