"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

export default function MatchmakingScreen() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [playersSearching, setPlayersSearching] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState("∞");

  const router = useRouter();
  const playersEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }
  }, []);

  // Partie WebSocket désactivée volontairement si tu veux la réactiver :
  /*
  useEffect(() => {
    const fetchMaxPlayers = async () => {
      try {
        const max = await serverConnection.getNumberOfPlayerForOneGame();
        setMaxPlayers(max);
      } catch (error) {
        console.error("Erreur max players:", error);
      }
    };
    fetchMaxPlayers();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const initialize = async () => {
      try {
        await matchmakingManager.initializeWebSocket(currentUser.pseudo, router);
        matchmakingManager.subscribeToPlayersSearchingUpdates((updatedPlayers: string[]) => {
          setPlayersSearching(updatedPlayers);
          if (playersEndRef.current) {
            playersEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        });
        handleStartSearching();
      } catch (error) {
        console.error("Erreur WebSocket:", error);
      }
    };

    initialize();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleStopSearching();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      handleStopSearching();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser]);

  const handleStartSearching = () => {
    if (currentUser?.pseudo) {
      matchmakingManager.startSearching(currentUser.pseudo);
      setIsSearching(true);
    }
  };

  const handleStopSearching = () => {
    if (currentUser?.pseudo) {
      matchmakingManager.stopSearching(currentUser.pseudo);
      setIsSearching(false);
    }
  };
  */

  return (
    <div style={styles.outerContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Matchmaking</h1>
        <p style={styles.playerCount}>
          {playersSearching.length} / {maxPlayers} joueurs en recherche
        </p>

        {isSearching && (
          <div style={styles.searching}>
            <div style={styles.loader} />
            <p>Recherche en cours...</p>
          </div>
        )}

        <div style={styles.listContainer}>
          {playersSearching.map((player, index) => (
            <div key={index} style={styles.listItem}>
              {player}
            </div>
          ))}
          <div ref={playersEndRef} />
        </div>
      </div>
    </div>
  );
}
