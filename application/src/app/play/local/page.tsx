"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Create from "./create";
import LocalGame from "./game";
import { useState } from "react";
import { PlayerProvider } from "@/context/PlayerContext";

export default function Game() {
  const [showLocalGame, setShowLocalGame] = useState(false);

  return (
    <ProtectedRoute>
      <PlayerProvider>
        {showLocalGame ? <LocalGame /> : <Create onStart={() => setShowLocalGame(true)} />}
      </PlayerProvider>
    </ProtectedRoute>
  );
}
