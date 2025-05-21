"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      // router.push("/game"); // à activer selon ton routing
    } else {
      alert(`Il faut au moins ${MIN_PLAYERS} joueurs pour commencer.`);
    }
  };

  return (
    <div style={styles.outerContainer(isMobile)}>
      <div style={styles.leftColumn(isMobile)}>
        <h1 style={styles.title}>Création Partie</h1>

        {players.length === 0 && (
          <p style={styles.noPlayersText}>Aucun joueur ajouté</p>
        )}

        <div style={styles.playersList}>
          {players.map((player, index) => (
            <div key={index} style={styles.playerRow}>
              <span style={styles.playerIndex}>{index + 1}</span>
              <span style={styles.playerName}>{player}</span>
              {players.length > MIN_PLAYERS && (
                <button
                  style={styles.removeButton}
                  onClick={() => removePlayer(index)}
                  aria-label={`Supprimer joueur ${player}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {players.length < MAX_PLAYERS && (
          <div style={styles.addPlayerRow}>
            <input
              type="text"
              placeholder="Nom du Joueur"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addPlayer();
              }}
              style={styles.input}
            />
            <button
              style={styles.addButton}
              onClick={addPlayer}
              aria-label="Ajouter un joueur"
            >
              +
            </button>
          </div>
        )}
      </div>

      <div style={styles.rightColumn(isMobile)}>
        <button style={styles.startButton} onClick={startGame}>
          LANCER
        </button>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: (isMobile: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    padding: "20px",
    height: "100vh",
    backgroundColor: "#F3EBFF",
    boxSizing: "border-box",
  }),
  leftColumn: (isMobile: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "20px",
    backgroundColor: "#6D5B97",
    borderRadius: "16px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  }),
  rightColumn: (isMobile: boolean): React.CSSProperties => ({
    flexBasis: isMobile ? "auto" : "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  noPlayersText: {
    color: "#EEE",
    textAlign: "center",
    marginBottom: "10px",
  },
  playersList: {
    flexGrow: 1,
    marginBottom: "20px",
    overflowY: "auto",
  },
  playerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4B3B6A",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
    color: "#fff",
  },
  playerIndex: {
    fontWeight: "bold",
    width: "30px",
  },
  playerName: {
    flexGrow: 1,
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FF6B6B",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  addPlayerRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  addButton: {
    fontSize: "24px",
    backgroundColor: "#FFD700",
    border: "none",
    cursor: "pointer",
    padding: "10px 15px",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#FFD700",
    padding: "15px 30px",
    borderRadius: "12px",
    border: "none",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
