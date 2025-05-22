"use client";

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useSearchParams } from 'next/navigation';

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const InvitationCard: React.FC = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [numPieces, setNumPieces] = useState(500);
  const [isConfettiVisible, setIsConfettiVisible] = useState(true);
  const searchParams = useSearchParams();
  const pseudo = searchParams.get("pseudo") || "!";

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);

    const timerPieces = setTimeout(() => setNumPieces(0), 3500);
    const timerHide = setTimeout(() => setIsConfettiVisible(false), 8000);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timerPieces);
      clearTimeout(timerHide);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        fontFamily:
          "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {isConfettiVisible && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={numPieces}
          recycle={false}
          gravity={randomRange(0.03, 0.12)}
          wind={randomRange(-0.01, 0.01)}
          colors={["#0a84ff", "#5ac8fa", "#0071e3"]}
          opacity={0.65}
        />
      )}

      <div
        style={{
          maxWidth: "400px",
          width: "90vw",
          backgroundColor: "white",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: "3rem 2.5rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 300,
            color: "#1c1c1e",
            marginBottom: "1.5rem",
            opacity: 0,
            animation: "fadeSlide 1.2s ease-out forwards 0.2s",
          }}
        >
          🎉 Félicitation { pseudo }
        </h1>
        <p
          style={{
            color: "#6e6e73",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
            opacity: 0,
            animation: "fadeSlide 1.2s ease-out forwards 0.6s",
          }}
        >
          Un mail vous sera envoyé dès que votre compte sera accepté par l’administrateur.
          Merci de votre patience !
        </p>

        <button
          onClick={() => (window.location.href = "https://mathsalamaison.fr/")}
          style={{
            backgroundColor: "#0a84ff",
            color: "white",
            fontWeight: "600",
            borderRadius: "9999px",
            padding: "0.75rem 2.5rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(10, 132, 255, 0.6)",
            transition: "background-color 0.3s ease",
            fontSize: "1rem",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#006edc")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0a84ff")}
          aria-label="Retour à l'accueil"
        >
          Retour à l’accueil
        </button>

      <style>{`
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default InvitationCard;