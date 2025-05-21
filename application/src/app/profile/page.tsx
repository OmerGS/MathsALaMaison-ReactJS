"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import profileImages from "/icons/icon-192x192.png"; //a modifier

export default function Profil() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

 /* useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userSession = localStorage.getItem("userSession");
        if (userSession) {
          const parsedSession = JSON.parse(userSession);
          setCurrentUser(parsedSession);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      }
    };
    loadCurrentUser();
  }, []);

  if (!currentUser) return null;

  const defeats = currentUser.nbPartie - currentUser.nbVictoire;
  const ratio =
    currentUser.nbPartie > 0
      ? ((currentUser.nbVictoire / currentUser.nbPartie) * 100).toFixed(0) + "%"
      : "0%";
*/
  return (
    <div style={styles.container}>
      <button style={styles.arrowBack} onClick={() => router.back()}>
        ← Retour
      </button>

      <h1 style={styles.title}>Profil</h1>

      <div style={styles.profileContainer}>
        <div style={styles.profileImageWrapper}>
          <img
            src="/icons/icon-192x192.png" //a modifier
            alt="Photo de profil"
            style={styles.profileImage}
          />
          <button
            style={styles.editButton}
            onClick={() => router.push("/profile/edit")}
          >
            ✎
          </button>
        </div>
        <div style={styles.pseudoContainer}>
          <h2 style={styles.pseudo}>{/*currentUser.pseudo*/}</h2>
        </div>
      </div>

   {/*   <div style={styles.statsContainer}>
        {[
          { label: "Digits", value: currentUser.point, icon: "/assets/images/icones/digit.png" },
          { label: "Ratio", value: ratio, icon: "/assets/images/icones/ratio.png" },
          { label: "Victoires", value: currentUser.nbVictoire, icon: "/assets/images/icones/victories.png" },
          { label: "Parties", value: currentUser.nbPartie, icon: "/assets/images/icones/games.png" },
          { label: "Défaites", value: defeats, icon: "/assets/images/icones/defeats.png" },
        ].map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <img src={stat.icon} alt={stat.label} style={styles.statIcon} />
            <p>{stat.label}: {stat.value}</p>
          </div>
        ))}
      </div>*/}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "linear-gradient(to left, #E6D8F7, #B1EDE8)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
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
  title: {
    fontSize: "2.5rem",
    marginBottom: "2rem",
    color: "#000",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #635D5D",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8a8a8a",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 30,
    height: 30,
    cursor: "pointer",
    fontWeight: "bold",
  },
  pseudoContainer: {
    marginTop: "1rem",
    backgroundColor: "#635D5D",
    padding: "0.5rem 1rem",
    borderRadius: 8,
  },
  pseudo: {
    color: "white",
    fontSize: "1.5rem",
  },
  statsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
  },
  statCard: {
    backgroundColor: "#635D5D",
    color: "white",
    padding: "1rem",
    borderRadius: 10,
    width: 140,
    textAlign: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
};
