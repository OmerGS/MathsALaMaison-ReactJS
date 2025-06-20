"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/auth/FormInput";
import FormButton from "@/components/ui/auth/FormButton";
import LinkButton from "@/components/ui/auth/LinkButton";
import BackButton from "@/components/ui/global/BackButton";
import Spinner from "@/components/ui/global/Spinner";
import { useUser } from "@/context/UserContext";
import { handleSignUp } from "./signup-logic";
import { useMediaQuery } from "react-responsive";
import PasswordInput from "@/components/ui/auth/PasswordInput";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  
  const onSignUp = async () => {
    const userInfo = await handleSignUp(email, pseudo, password, confirmPassword);
    if (userInfo) {
      router.push(`/auth/signup/success?pseudo=${encodeURIComponent(userInfo)}`);
    }
  };

  return (
    <div className="flex relative w-full h-[100svh] font-sans
      text-[clamp(1rem,2.5vw,1.75rem)]
      gap-4"
    >

      <BackButton />
      {/* Formulaire (gauche sur desktop) */}
      <div className={`md:flex-1 ${isMobile ? "bg-signup" : "bg-bg"} p-10 flex flex-col justify-center items-center space-y-2 w-full`}>
        <div className="bg-white/80 flex flex-col justify-center items-center space-y-2 rounded-xl w-full max-w-md p-5 shadow-lg backdrop-blur-md">
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

          <PasswordInput
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            showStrength={true}
          />

          <PasswordInput
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <FormButton onClick={onSignUp} disabled={loading}>
            {loading ? <Spinner /> : "Créer un compte"}
          </FormButton>

          <LinkButton to="/auth/login" color="text-black">
              Déjà un compte ? Se connecter
          </LinkButton>
        </div>
      </div>


      {/* Logo */}
      {!isMobile && (
        <div className="hidden md:flex flex-1 flex-col bg-signup relative justify-center items-center p-10">
          <img src="/icons/icon-192x192.png" alt="Logo" className="w-4/5 max-h-[80%] object-contain" />
        </div>
      )}

    </div>
  );
}