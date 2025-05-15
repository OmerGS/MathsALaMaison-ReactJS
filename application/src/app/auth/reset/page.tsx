"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Gère l'état : 0 = envoyer code, 1 = valider code, 2 = changer mdp
  const [step, setStep] = useState(0);

  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);

    // Simule appels API selon étape
    await new Promise((res) => setTimeout(res, 1500));

    if (step === 0) {
      // Envoyer code
      setStep(1);
    } else if (step === 1) {
      // Valider code
      setStep(2);
    } else if (step === 2) {
      // Changer mdp
      alert("Mot de passe changé avec succès !");
      router.push("/auth/login");
    }

    setLoading(false);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Left Side with Logo */}
      <div style={styles.imageContainer}>
        <button style={styles.arrowBack} onClick={() => router.back()}>
          ← Retour
        </button>
        <img
          src="/icons/icon-192x192.png"
          alt="Icône"
          style={styles.image}
        />
      </div>

      {/* Right Side with Reset Password Form */}
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Mot de passe oublié</h1>

        {(step === 0 || step > 0) && (
          <input
            type="email"
            placeholder="Email ou Pseudonyme"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={styles.input}
            disabled={step > 0}
            autoComplete="username"
          />
        )}

        {step === 1 && (
          <input
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
            autoComplete="one-time-code"
          />
        )}

        {step === 2 && (
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />
        )}

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={onSubmit}
          disabled={loading || (step === 0 && !identifier) || (step === 1 && !code) || (step === 2 && !newPassword)}
        >
          {loading
            ? "Chargement..."
            : step === 0
            ? "Recevoir le code"
            : step === 1
            ? "Valider le code"
            : "Changer le mot de passe"}
        </button>

        <button
          style={styles.signupText}
          onClick={() => router.push("/auth/signup")}
        >
          Pas de compte ? S'inscrire
        </button>
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#000000",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    padding: "0 10px",
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 5,
    padding: 12,
    width: "80%",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
  },
  signupText: {
    background: "none",
    border: "none",
    color: "#000",
    fontSize: 14,
    cursor: "pointer",
  },
};
