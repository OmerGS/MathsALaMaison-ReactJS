"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { handleSignUp } from "./signup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
      if (!loading && user) {
        router.replace('/home');
      }
    }, [user, loading, router]);
  
    const onSignUp = async () => {
      const userInfo = await handleSignUp(email, pseudo, password, confirmPassword);
      if (userInfo) {
        router.push(`/auth/signup/success?pseudo=${encodeURIComponent(userInfo)}`);
      }
    };

  return (
    <div style={styles.outerContainer}>
      {/* Formulaire à gauche */}
      <div style={styles.formContainer}>
        <button style={styles.arrowBack} onClick={() => router.back()}>
          ← Retour
        </button>

        <h1 style={styles.title}>S'inscrire</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          autoComplete="email"
        />

        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="new-password"
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
          autoComplete="new-password"
        />

        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={onSignUp}
          disabled={loading}
        >
          <span style={styles.buttonText}>
            {loading ? "Chargement..." : "Créer un compte"}
          </span>
        </button>

        <button
          style={styles.hasAccount}
          onClick={() => router.push("/auth/login")}
          type="button"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>

      {/* Image à droite */}
      <div style={styles.imageContainer}>
        <img
          src="/icons/icon-192x192.png"
          alt="Logo"
          style={styles.image}
        />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    backgroundColor: "#95DCC7",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    padding: "0 10px",
    marginBottom: 10,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000000",
    borderRadius: 5,
    padding: 12,
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    border: "none",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  hasAccount: {
    color: "#000000",
    fontSize: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#95DCC7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
    objectFit: "contain",
  },
};
