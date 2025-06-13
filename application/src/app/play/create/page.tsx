"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '../../globals.css'

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

export default function CreateGame() {
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      alert("Partie lancée avec " + players.length + " joueurs.");
      // router.push("/game");
    } else {
      alert(`Il faut au moins ${MIN_PLAYERS} joueurs pour commencer.`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-5 bg-purple-100 box-border">
      <div className="flex flex-col flex-1 p-5 bg-purple-700 text-white rounded-2xl mb-5 md:mb-0 md:mr-5">
        <h1 className="text-3xl font-bold text-center mb-5">Création Partie</h1>

        {players.length === 0 && (
          <p className="text-gray-200 text-center mb-3">Aucun joueur ajouté</p>
        )}

        <div className="flex-grow overflow-y-auto mb-5">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-purple-900 px-4 py-2 rounded-lg mb-2"
            >
              <span className="font-bold w-8">{index + 1}</span>
              <span className="flex-grow text-center">{player}</span>
              {players.length > MIN_PLAYERS && (
                <button
                  onClick={() => removePlayer(index)}
                  aria-label={`Supprimer joueur ${player}`}
                  className="text-red-400 font-bold text-lg hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {players.length < MAX_PLAYERS && (
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Nom du Joueur"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addPlayer();
              }}
              className="flex-grow p-2 text-base rounded-lg border border-gray-300 text-black"
            />
            <button
              onClick={addPlayer}
              aria-label="Ajouter un joueur"
              className="text-2xl bg-yellow-400 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300"
            >
              +
            </button>
          </div>
        )}
      </div>

      <div className="flex md:basis-[30%] items-center justify-center">
        <button
          onClick={startGame}
          className="bg-yellow-400 text-black font-bold text-2xl px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors"
        >
          LANCER
        </button>
      </div>
    </div>
  );
}
