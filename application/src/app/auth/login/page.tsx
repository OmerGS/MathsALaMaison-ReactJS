"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "./login";
import { useUser } from "@/context/UserContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const router = useRouter();
    
  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  const onLogin = async () => {
    const userInfo = await handleLogin(identifier, password);
    if (userInfo) {
      setUser(userInfo);
      router.push('/home');
    }
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

      {/* Right Side with Login Form */}
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Connexion</h1>

        <input
          type="text"
          placeholder="Email ou Pseudonyme"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={styles.input}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
        />

        <button
          style={styles.forgotPasswordText}
          onClick={() => router.push("/auth/reset")}
        >
          Mot de passe oublié
        </button>

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={onLogin}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Se Connecter"}
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

// === Spinner Component ===
function Spinner() {
  return (
    <div style={spinnerStyles.spinner} />
  );
}

// === Styles ===
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
  forgotPasswordText: {
    alignSelf: "flex-end",
    marginRight: "10%",
    color: "red",
    fontSize: 14,
    background: "none",
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    background: "none",
    border: "none",
    color: "#000",
    fontSize: 14,
    cursor: "pointer",
  },
};

const spinnerStyles = {
  spinner: {
    width: 20,
    height: 20,
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  } as React.CSSProperties,
};