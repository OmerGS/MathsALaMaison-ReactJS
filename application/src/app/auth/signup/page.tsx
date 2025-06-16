"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import LinkButton from "@/components/ui/LinkButton";
import BackButton from "@/components/ui/BackButton";
import Spinner from "@/components/ui/Spinner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const router = useRouter();

  const onSignUp = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Formulaire (gauche sur desktop) */}
      <div className="hidden md:flex flex-1 flex-col bg-bg relative justify-center items-center p-10">
        <div className="w-full max-w-md flex flex-col items-center space-y-4">
          <div className="w-full">
            <BackButton />
          </div>

          <h1 className="text-3xl font-bold text-black mb-2 text-center">
            S'inscrire
          </h1>

          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />

          <FormInput
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormInput
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <FormButton onClick={onSignUp} disabled={loading}>
            {loading ? <Spinner /> : "Créer un compte"}
          </FormButton>

          <div className="text-center">
            <LinkButton to="/auth/login" color="text-black">
              Déjà un compte ? Se connecter
            </LinkButton>
          </div>
        </div>
      </div>


      {/* Logo */}
      <div className="md:flex-1 bg-signup p-10 flex flex-col justify-center items-center space-y-2">
        <img
          src="/icons/icon-192x192.png"
          alt="Logo"
          className="w-4/5 max-h-[80%] object-contain"
        />
      </div>

    </div>
  );
}
