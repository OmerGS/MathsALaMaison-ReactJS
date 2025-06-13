"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import LinkButton from "@/components/ui/LinkButton";

export default function ResetPassword() {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Étapes: 0 = envoyer code, 1 = valider code, 2 = changer mdp
  const [step, setStep] = useState(0);

  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1500));

    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) {
      alert("Mot de passe changé avec succès !");
      router.push("/auth/login");
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Côté image */}
      <div className="hidden md:flex flex-1 flex-col bg-accent relative justify-center items-center p-10">
        <BackButton />
        <img
          src="/icons/icon-192x192.png"
          alt="Icône"
          className="w-4/5 max-h-[80%] object-contain"
        />
      </div>

      {/* Côté formulaire */}
      <div className="md:flex-1 bg-bg p-10 flex flex-col justify-center items-center space-y-2">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Mot de passe oublié
          </h1>

          {(step === 0 || step > 0) && (
            <FormInput
              type="email"
              placeholder="Email ou Pseudonyme"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={step > 0}
              autoComplete="username"
            />
          )}

          {step === 1 && (
            <FormInput
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="one-time-code"
            />
          )}

          {step === 2 && (
            <FormInput
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          )}

          <FormButton
            onClick={onSubmit}
            disabled={
              loading ||
              (step === 0 && !identifier) ||
              (step === 1 && !code) ||
              (step === 2 && !newPassword)
            }
          >
            {loading
              ? "Chargement..."
              : step === 0
              ? "Recevoir le code"
              : step === 1
              ? "Valider le code"
              : "Changer le mot de passe"}
          </FormButton>

          <LinkButton to="/auth/signup" color="black">Pas de compte ? S'inscrire</LinkButton>
        </div>
    </div>
  );
}
