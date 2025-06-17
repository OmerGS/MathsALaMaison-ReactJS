"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CreateGame from "./create";
import LocalGame from "./game";

export default function GamePage() {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("localGameStarted");
    if (stored === "true") {
      setGameStarted(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem("localGameStarted", "true");
    setGameStarted(true);
  };

  return (
    <ProtectedRoute>
      {gameStarted ? (
        <LocalGame />
      ) : (
        <CreateGame onStart={handleStart} />
      )}
    </ProtectedRoute>
  );
}
