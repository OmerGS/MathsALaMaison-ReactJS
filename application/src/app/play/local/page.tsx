"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CreateGame from "./create";
import LocalGame from "./game";
import EndGame from "./endGame";
import { usePlayer } from "@/context/PlayerContext";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function GamePage() {

  const [gameState, setGameState] = useState<'created' | 'started' | 'finished'>('created');
  const { players, resetPlayers} = usePlayer();
  const router = useRouter();

  const isValidPlayerSetup = players && players.length >= 2 && players.length <= 4;


  useEffect(() => {
    if ((gameState === 'started' || gameState === 'finished') && !isValidPlayerSetup) {
      router.push("/");
      resetPlayers();
      localStorage.setItem('localGameState', 'created');
      setGameState('created');
    }
  }, [gameState, isValidPlayerSetup, router]);

  useEffect(() => {
    const storedState = localStorage.getItem('localGameState');
    if (storedState === 'started' || storedState === 'finished' || storedState === 'created') {
      setGameState(storedState);
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'localGameState') {
        const newState = event.newValue;
        if (newState === 'started' || newState === 'finished' || newState === 'created') {
          setGameState(newState);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleStart = () => {
    localStorage.setItem('localGameState', 'started');
    setGameState('started');
  };
  const handleFinish = () => {
    localStorage.setItem('localGameState', 'finished');
    setGameState('finished');
  };
  const handleCreated = () => {
    localStorage.setItem('localGameState', 'created');
    setGameState('created');
  };

  return (
    <ProtectedRoute>
      {gameState === 'started' && isValidPlayerSetup && (
        <LocalGame onFinish={handleFinish} />
      )}
      {gameState === 'finished' && isValidPlayerSetup && (
        <EndGame onCreated={handleCreated} />
      )}
      {(gameState === 'created' || !isValidPlayerSetup) && (
        <CreateGame onStart={handleStart} />
      )}
      <Toaster position="top-left" reverseOrder={false} />
    </ProtectedRoute>
  );

}
