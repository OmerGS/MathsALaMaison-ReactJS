"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import '../../globals.css'

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSignUp = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#95DCC7]">
      {/* Form Container */}
      <div className="flex flex-1 flex-col justify-center items-center bg-gray-100 px-6 relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-[#635D5D] text-white px-4 py-2 rounded-md font-bold"
        >
          ← Retour
        </button>

        <h1 className="text-2xl font-bold text-black mb-6">S'inscrire</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-4/5 max-w-md h-12 border border-gray-300 rounded-md px-3 mb-3 bg-white text-base"
        />

        <input
          type="text"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-4/5 max-w-md h-12 border border-gray-300 rounded-md px-3 mb-3 bg-white text-base"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="w-4/5 max-w-md h-12 border border-gray-300 rounded-md px-3 mb-3 bg-white text-base"
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          className="w-4/5 max-w-md h-12 border border-gray-300 rounded-md px-3 mb-6 bg-white text-base"
        />

        <button
          onClick={onSignUp}
          disabled={loading}
          className={`w-4/5 max-w-md h-12 bg-black text-white font-bold rounded-md mb-4 transition-opacity ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
          }`}
        >
          {loading ? "Chargement..." : "Créer un compte"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="text-sm text-black hover:underline"
        >
          Déjà un compte ? Se connecter
        </button>
      </div>

      {/* Image Container */}
      <div className="hidden md:flex flex-1 justify-center items-center bg-[#95DCC7]">
        <img
          src="/icons/icon-192x192.png"
          alt="Logo"
          className="w-4/5 max-h-[80%] object-contain"
        />
      </div>
    </div>
  );
}
