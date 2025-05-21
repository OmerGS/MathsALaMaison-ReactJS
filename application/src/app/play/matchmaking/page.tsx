"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
//import matchmakingManager from "@/components/controller/Matchmaking";
//import serverConnection from "@/components/controller/ServerConnection";

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

 /* useEffect(() => {
    const fetchMaxPlayers = async () => {
      try {
        const max = await serverConnection.getNumberOfPlayerForOneGame();
        setMaxPlayers(max);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre max de joueurs:", error);
      }
    };
    fetchMaxPlayers();
  }, []);*/

 /* useEffect(() => {
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
  };*/

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

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#e0e0e0",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#f9e29c",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "2rem",
  },
  arrowBack: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "#635D5D",
    borderRadius: 10,
    padding: "8px 16px",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  image: {
    width: "80%",
    height: "auto",
    maxHeight: "80%",
    objectFit: "contain",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#000",
  },
  playerCount: {
    marginBottom: "1rem",
    fontSize: "1.2rem",
  },
  searching: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  loader: {
    width: 20,
    height: 20,
    marginRight: 10,
    border: "3px solid #ccc",
    borderTop: "3px solid #000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  listContainer: {
    width: "80%",
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: "1rem",
  },
  listItem: {
    padding: "0.5rem",
    borderBottom: "1px solid #eee",
  },
};

// Animation CSS à ajouter dans ton CSS global si tu ne veux pas utiliser styled-components
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
