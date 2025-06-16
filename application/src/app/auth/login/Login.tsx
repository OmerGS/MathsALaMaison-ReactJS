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

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, setUser } = useUser();
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
  );
}