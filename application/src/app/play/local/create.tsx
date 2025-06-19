"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import PlayerInput from "@/components/ui/PlayerInput";
import PlayerCard from "@/components/ui/PlayerCard";
import LaunchButton from "@/components/ui/LanchButton";
import { usePlayer } from "@/context/PlayerContext";
import BackButton from "@/components/ui/BackButton";
import { Info } from "lucide-react";

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

export default function CreateGame({ onStart }: { onStart: () => void }) {
  const { players, setPlayers } = usePlayer();
  const [newPlayerName, setNewPlayerName] = useState("");
  const router = useRouter();

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();

    if (
      trimmedName &&
      trimmedName.length <= 16 &&
      !players.includes(trimmedName) &&
      players.length < MAX_PLAYERS
    ) {
      setPlayers([...players, trimmedName]);
      setNewPlayerName("");
    } else if (trimmedName.length > 16) {
      alert("Le nom du joueur ne doit pas dépasser 16 caractères.");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (players.length >= MIN_PLAYERS) {
      onStart();
    } else {
      alert(`Il faut au moins ${MIN_PLAYERS} joueurs pour commencer.`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <div className="self-start mb-4">
        <BackButton />
      </div>
      <div className="flex flex-col flex-1 bg-white rounded-2xl p-6 shadow-xl mb-5 md:mb-0 md:mr-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Création de la Partie
        </h1>

        {players.length === 0 && (
          <p className="text-center text-gray-400 mb-4">
            Aucun joueur ajouté
          </p>
        )}

        <div className="flex-grow overflow-y-auto mb-5">
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              name={player}
              index={index}
              onRemove={players.length > MIN_PLAYERS ? () => removePlayer(index) : undefined}
            />
          ))}
        </div>

        {players.length < MAX_PLAYERS && (
          <PlayerInput
            value={newPlayerName}
            onChange={setNewPlayerName}
            onSubmit={addPlayer}
          />
        )}
      </div>

      <div className="flex flex-col md:w-[30%] items-center justify-center space-y-6">
        {/* Bloc règles */}
        <div className="bg-white text-gray-700 rounded-xl shadow-lg p-4 w-full">
          <div className="flex items-center mb-2">
            <Info size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Règles du jeu</h2>
          </div>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>Chaque joueur répond à une question à son tour.</li>
            <li>Les catégories sont sélectionnées aléatoirement.</li>
            <li>1 point par bonne réponse.</li>
            <li>Le joueur avec le plus de points gagne !</li>
          </ul>
        </div>

        <LaunchButton onClick={startGame} />
      </div>
    </div>
  );
}
