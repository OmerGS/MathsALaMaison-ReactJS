"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import LinkButton from "@/components/ui/LinkButton";
import BackButton from "@/components/ui/BackButton";
import Spinner from "@/components/ui/Spinner";
import { useUser } from "@/context/UserContext";
import { handleSignUp } from "./signup-logic";
import { useMediaQuery } from "react-responsive";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  
  const onSignUp = async () => {
    const userInfo = await handleSignUp(email, pseudo, password, confirmPassword);
    if (userInfo) {
      router.push(`/auth/signup/success?pseudo=${encodeURIComponent(userInfo)}`);
    }
  };

  return (
    <div>
      {isMobile?
        <div className="relative min-h-screen w-full bg-signup overflow-hidden">
          {/* Image de fond au-dessus de bg-signup */}
          <img
            src="/icons/icon-192x192.png"
            alt="Fond décoratif"
            className="absolute inset-0 w-full h-full object-cover opacity-10 z-0"
          />
        
          {/* Bouton de retour en haut à gauche */}
          <div className="absolute top-4 left-4 z-10">
            <BackButton />
          </div>
        
          {/* Formulaire au centre */}
          <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-10">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-xl p-6 space-y-4">
              <h1 className="text-3xl font-bold text-center text-black mb-4">
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
        </div>
        
        :
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
    
        </div>}
    </div>
  );
}