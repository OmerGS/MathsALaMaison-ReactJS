"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PlayerContextType {
  players: string[];
  points: Record<string, number>;
  setPlayers: (players: string[]) => void;
  setPoints: (points: Record<string, number>) => void;
  resetPlayers: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayersState] = useState<string[]>([]);
  const [points, setPointsState] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedPlayers = localStorage.getItem("players");
    const savedPoints = localStorage.getItem("points");
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedPoints) setPoints(JSON.parse(savedPoints));
    }, []);

    useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("points", JSON.stringify(points));
    }, [players, points]);

  const setPlayers = (newPlayers: string[]) => {
    setPlayersState(newPlayers);
  };

  const setPoints = (newPoints: Record<string, number>) => {
    setPointsState(newPoints);
  };

  const resetPlayers = () => {
    setPlayers([]);
    setPoints({});
  };

  return (
    <PlayerContext.Provider value={{ players, points, setPlayers, setPoints, resetPlayers }}>
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
