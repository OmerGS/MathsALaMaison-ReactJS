"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PlayerContextType {
  players: string[];
  points: Record<string, number>;
  categoriesDone: Record<string, number>;
  currentPlayerIndex: number;
  currentPlayer: string | null;
  setPlayers: (players: string[]) => void;
  setPoints: (points: Record<string, number>) => void;
  addPointToCurrentPlayer: (points: number) => void;
  incrementCategoryDoneForCurrentPlayer: () => void; 
  getPointsOfPlayer: (playerName: string) => number;
  getCategoriesDoneOfPlayer: (playerName: string) => number; 
  nextPlayer: () => void;
  resetPlayers: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayersState] = useState<string[]>([]);
  const [points, setPointsState] = useState<Record<string, number>>({});
  const [categoriesDone, setCategoriesDone] = useState<Record<string, number>>({}); 
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  useEffect(() => {
    const savedPlayers = localStorage.getItem("players");
    const savedPoints = localStorage.getItem("points");
    const savedCategoriesDone = localStorage.getItem("categoriesDone"); 
    const savedIndex = localStorage.getItem("currentPlayerIndex");

    if (savedPlayers) setPlayersState(JSON.parse(savedPlayers));
    if (savedPoints) setPointsState(JSON.parse(savedPoints));
    if (savedCategoriesDone) setCategoriesDone(JSON.parse(savedCategoriesDone));
    if (savedIndex) setCurrentPlayerIndex(Number(savedIndex));
  }, []);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("categoriesDone", JSON.stringify(categoriesDone)); 
    localStorage.setItem("currentPlayerIndex", String(currentPlayerIndex));
  }, [players, points, categoriesDone, currentPlayerIndex]);

  const setPlayers = (newPlayers: string[]) => {
    setPlayersState(newPlayers);
    const initialPoints: Record<string, number> = {};
    const initialCategoriesDone: Record<string, number> = {}; 

    newPlayers.forEach((p) => {
      initialPoints[p] = 0;
      initialCategoriesDone[p] = 0; 
    });

    setPointsState(initialPoints);
    setCategoriesDone(initialCategoriesDone); 
    setCurrentPlayerIndex(0);
  };

  const setPoints = (newPoints: Record<string, number>) => {
    setPointsState(newPoints);
  };

  const addPointToCurrentPlayer = (score: number) => {
    const player = players[currentPlayerIndex];
    if (!player) return;
    setPointsState((prev) => ({
      ...prev,
      [player]: (prev[player] || 0) + score,
    }));
  };

  const incrementCategoryDoneForCurrentPlayer = () => {
    const player = players[currentPlayerIndex];
    if (!player) return;
    setCategoriesDone((prev) => ({
      ...prev,
      [player]: (prev[player] || 0) + 1,
    }));
  };

  const getPointsOfPlayer = (playerName: string) => {
    return points[playerName] || 0;
  };

  const getCategoriesDoneOfPlayer = (playerName: string) => {
    return categoriesDone[playerName] || 0;
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const resetPlayers = () => {
    setPlayersState([]);
    setPointsState({});
    setCategoriesDone({}); 
    setCurrentPlayerIndex(0);
  };

  const currentPlayer = players[currentPlayerIndex] || null;

  return (
    <PlayerContext.Provider
      value={{
        players,
        points,
        categoriesDone,
        currentPlayerIndex,
        currentPlayer,
        setPlayers,
        setPoints,
        addPointToCurrentPlayer,
        incrementCategoryDoneForCurrentPlayer,
        getPointsOfPlayer,
        getCategoriesDoneOfPlayer,
        nextPlayer,
        resetPlayers,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
