"use client";

import { usePlayer } from "@/context/PlayerContext";
import "../../../globals.css";

interface EndGameProps {
  onReplay: () => void;
  onQuit: () => void;
}

export default function EndGame({ onReplay, onQuit }: EndGameProps) {
  const { players, points, resetPlayers } = usePlayer();

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-gradient-to-l from-custom to-custom text-white">
      <h1 className="text-3xl font-bold mb-6">🎉 Fin de la partie</h1>
      <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Classement :</h2>
        <ul className="space-y-2">
          {players
            .slice()
            .sort((a, b) => (points[b] ?? 0) - (points[a] ?? 0))
            .map((player, index) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span>{index + 1}. {player}</span>
                <span>{points[player] ?? 0} pts</span>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex mt-8 space-x-4">
        <button
          onClick={() => {
            resetPlayers();
            onReplay();
          }}
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
        >
          Rejouer
        </button>
        <button
          onClick={() => {
            resetPlayers();
            onQuit();
          }}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
        >
          Quitter
        </button>
      </div>
    </div>
  );
}
