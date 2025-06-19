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
import toast from "react-hot-toast";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, setUser } = useUser();
  const router = useRouter();
    const isMobile = useMediaQuery({ maxWidth: 767 });

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
        toast.success(responseData.message || "Votre compte est en attente de validation par un administrateur.");
      }
    } 
  };

  return (
   <div className="flex relative w-full h-[100svh] font-sans
      text-[clamp(1rem,2.5vw,1.75rem)]
      gap-4"
    >
      {/* Left side – logo + retour (seulement sur desktop) */}
      <BackButton />
      {!isMobile && (
        <div className="hidden md:flex flex-1 flex-col bg-accent relative justify-center items-center p-10">
          <img
            src="/icons/icon-192x192.png"
            alt="Icône"
            className="w-4/5 max-h-[80%] object-contain"
          />
        </div>
      )}

      {/* Right side – formulaire */}
      <div className={`md:flex-1 ${isMobile ? "bg-accent" : "bg-bg"} p-10 flex flex-col justify-center items-center space-y-2 w-full`}>

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
  );
}