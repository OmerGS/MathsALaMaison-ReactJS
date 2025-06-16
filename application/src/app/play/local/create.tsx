"use client";

import React, { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import '../../globals.css';

import PlayerInput from "@/components/ui/PlayerInput";
import PlayerCard from "@/components/ui/PlayerCard";
import LaunchButton from "@/components/ui/LanchButton";

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

export default function CreateGame({ onStart }: { onStart: () => void }) {
  const { players, setPlayers } = usePlayer();
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < MAX_PLAYERS) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (players.length >= MIN_PLAYERS) {
      onStart(); // switch vers la page "LocalGame"
    } else {
      alert(`Il faut au moins ${MIN_PLAYERS} joueurs pour commencer.`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <div className="flex flex-col flex-1 bg-white rounded-2xl p-6 shadow-xl mb-5 md:mb-0 md:mr-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Création de la Partie</h1>

        {players.length === 0 && (
          <p className="text-center text-gray-400 mb-4">Aucun joueur ajouté</p>
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

      <div className="flex md:w-[30%] items-center justify-center">
        <LaunchButton onClick={startGame} />
      </div>
    </div>
  );
}
