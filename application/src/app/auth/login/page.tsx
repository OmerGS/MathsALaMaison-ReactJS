"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import '../../globals.css'

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onLogin = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-300">
      {/* Left Side with Logo */}
      <div className="md:flex-1 bg-yellow-200 flex flex-col justify-center items-center p-8 relative">
        <button
          className="absolute top-4 left-4 bg-[#635D5D] text-white font-bold py-2 px-4 rounded"
          onClick={() => router.back()}
        >
          ← Retour
        </button>
        <img
          src="/icons/icon-192x192.png"
          alt="Icône"
          className="w-4/5 max-h-[80%] object-contain"
        />
      </div>

      {/* Right Side with Login Form */}
      <div className="md:flex-1 bg-gray-100 p-8 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-6 text-black">Connexion</h1>

        <input
          type="text"
          placeholder="Email ou Pseudonyme"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-4/5 max-w-md h-12 border border-gray-300 rounded px-3 mb-3 bg-white text-base"
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-4/5 max-w-md h-12 border border-gray-300 rounded px-3 mb-3 bg-white text-base"
          autoComplete="current-password"
        />

        <button
          onClick={() => router.push("/auth/reset")}
          className="self-end text-red-600 text-sm mb-5 mr-[10%] hover:underline"
        >
          Mot de passe oublié
        </button>

        <button
          onClick={onLogin}
          disabled={loading}
          className={`w-4/5 max-w-md bg-black text-white font-bold py-3 rounded mb-5 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {loading ? "Chargement..." : "Se Connecter"}
        </button>

        <button
          onClick={() => router.push("/auth/signup")}
          className="text-black text-sm hover:underline"
        >
          Pas de compte ? S'inscrire
        </button>
      </div>
    </div>
  );
}
