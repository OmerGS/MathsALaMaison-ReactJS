"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import { handleLogin } from "./login-logic";
import { useUser } from "@/context/UserContext";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import LinkButton from "@/components/ui/LinkButton";
import Spinner from "@/components/ui/Spinner";
import BackButton from "@/components/ui/BackButton";
import { useMediaQuery } from "react-responsive";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading]);

  const onLogin = async () => {
    const responseData = await handleLogin(identifier, password);
    if(responseData) {
      if(responseData.authorized) {
        if (responseData.user) {
          setUser(responseData.user);
          router.push("/");
        }
      } else {
        alert(responseData.message || "Votre compte est en attente de validation par un administrateur.");
      }
    } 
  };

  return (
    <div>
      {isMobile ?
        <div className="relative min-h-screen w-full">
          <div className="absolute inset-0 bg-accent z-0" />
        
          <img
            src="/icons/icon-192x192.png"
            alt="Fond"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
          />
        
          <div className="absolute top-4 left-4 z-10">
            <BackButton />
          </div>
        
          <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 w-full max-w-md space-y-4">
              <h1 className="text-3xl font-bold text-black text-center">Connexion</h1>
        
              <FormInput
                type="text"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
        
              <FormInput
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
        
              <LinkButton to="/auth/reset" color="red">
                Mot de passe oublié
              </LinkButton>
        
              <FormButton onClick={onLogin} disabled={loading}>
                {loading ? <Spinner /> : "Se connecter"}
              </FormButton>
        
              <LinkButton to="/auth/signup" color="black">
                Pas de compte ? S'inscrire
              </LinkButton>
            </div>
          </div>
        </div> 
        :
        <div className="flex h-screen">
          {/* Left side – logo + retour */}
          <div className="hidden md:flex flex-1 flex-col bg-accent relative justify-center items-center p-10">
            <BackButton />

            <img
              src="/icons/icon-192x192.png"
              alt="Icône"
              className="w-4/5 max-h-[80%] object-contain"
            />
          </div>

          {/* Right side – formulaire */}
          <div className="md:flex-1 bg-bg p-10 flex flex-col justify-center items-center space-y-2">
            <h1 className="text-3xl font-bold mb-6 text-black">Connexion</h1>

            <FormInput
              type="text"
              placeholder="Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />

            <FormInput
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <LinkButton to="/auth/reset" color="red">Mot de passe oublié</LinkButton>

            <FormButton onClick={onLogin} disabled={loading}>
              {loading ? <Spinner /> : "Se connecter"}
            </FormButton>

            <LinkButton to="/auth/signup" color="black">Pas de compte ? S'inscrire</LinkButton>
          </div>
        </div>
      }
    </div>
  );
}