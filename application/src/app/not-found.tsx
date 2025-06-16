"use client";

import Link from "next/link";
import '@/app/globals.css'; 
import { useEffect, useState } from "react";

export default function NotFound() {
  return (
    <main style={styles.main}>
      <BackgroundFloatingNumbers count={35} />
      <div style={styles.container}>
        <h1 style={styles.title}>404</h1>
        <p style={styles.subtitle}>
          Cette page est aussi introuvable que la solution de l’équation&nbsp;:
        </p>
        <p style={styles.equation}>x × 0 = 404</p>
        <Link href="/">
          <p style={styles.button}>Retour à l'accueil</p>
        </Link>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            color: #007aff;
            text-shadow: 0 0 8px #007aff66;
          }
          50% {
            color: #005fcc;
            text-shadow: 0 0 20px #005fccaa;
          }
        }

        a:hover {
          background-color: #005fcc !important;
          box-shadow: 0 6px 12px #005fcc88;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Animation floating up/down */
        @keyframes floatUpDown {
          0% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
        }
      `}</style>
    </main>
  );
}

interface FloatingNumber {
  id: number;
  digit: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

function BackgroundFloatingNumbers({ count }: { count: number }) {
  const [numbers, setNumbers] = useState<FloatingNumber[]>([]);

  useEffect(() => {
    const generated: FloatingNumber[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        digit: Math.floor(Math.random() * 99) + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5, 
        duration: 4 + Math.random() * 4, 
        size: 20 + Math.random() * 30,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }
    setNumbers(generated);
  }, [count]);

  return (
    <>
      {numbers.map(({ id, digit, left, top, delay, duration, size, opacity }) => (
        <span
          key={id}
          style={{
            position: "fixed",
            left: `${left}vw`,
            top: `${top}vh`,
            fontSize: size,
            color: "#007aff",
            fontWeight: "900",
            userSelect: "none",
            pointerEvents: "none",
            opacity,
            animationName: "floatUpDown",
            animationDuration: `${duration}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${delay}s`,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            zIndex: 0,
          }}
        >
          {digit}
        </span>
      ))}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "linear-gradient(270deg, #E6D8F7, #B1EDE8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  container: {
    position: "relative",
    backgroundColor: "white",
    padding: "40px 48px",
    borderRadius: 20,
    boxShadow: "0 25px 50px rgba(0, 122, 255, 0.15)",
    maxWidth: 440,
    textAlign: "center",
    zIndex: 10,
  },
  title: {
    fontSize: "8rem",
    fontWeight: "900",
    margin: 0,
    color: "#007aff",
    userSelect: "none",
    animation: "pulse 3s ease-in-out infinite",
  },
  subtitle: {
    fontSize: "1.25rem",
    marginTop: 16,
    marginBottom: 12,
    color: "#33475b",
  },
  equation: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#005fcc",
    fontFamily: "'Courier New', Courier, monospace",
    marginBottom: 32,
    userSelect: "none",
  },
  button: {
    display: "inline-block",
    padding: "14px 44px",
    backgroundColor: "#007aff",
    color: "white",
    fontWeight: 600,
    borderRadius: 16,
    textDecoration: "none",
    fontSize: "1.1rem",
    boxShadow: "0 6px 15px rgba(0, 122, 255, 0.25)",
    userSelect: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
};