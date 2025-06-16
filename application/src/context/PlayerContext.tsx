"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface PlayerContextType {
  players: string[];
  points: Record<string, number>;
  setPlayers: (players: string[]) => void;
  setPoints: (points: Record<string, number>) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [players, setPlayersState] = useState<string[]>([]);
  const [points, setPointsState] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    const storedPoints = localStorage.getItem("points");

    if (storedPlayers) setPlayersState(JSON.parse(storedPlayers));
    if (storedPoints) setPointsState(JSON.parse(storedPoints));
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

  return (
    <PlayerContext.Provider value={{ players, points, setPlayers, setPoints }}>
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
