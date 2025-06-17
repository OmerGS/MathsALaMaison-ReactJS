"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import LinkButton from "@/components/ui/LinkButton";
import { askValidation, resetPassword, validateCode } from "@/services/validationAPI";

export default function ResetPassword() {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(0);

  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);

    if (step === 0) {
      if(!identifier) {
        alert("Veuillez entrer votre email ou pseudonyme.");
        setLoading(false);
        return;
      } 
      
      if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(identifier)) {
        alert("Veuillez entrer un email valide.");
        setLoading(false);
        return;
      }

      try {
        const response = await askValidation(identifier);
        
        if (response.status === 200) {
          alert("Un code de validation a été envoyé à votre adresse email.");
          setStep(1);
        } else {
          alert("Une erreur s'est produite lors de l'envoi du code. Veuillez réessayer.");
        }
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 429) {
            alert("Trop de requêtes. Veuillez patienter avant de réessayer.");
          } else {
            alert("Échec de l'envoi du code.");
          }
        } else if (error.request) {
          alert("Le serveur ne répond pas. Veuillez vérifier votre connexion.");
        } else {
          alert("Une erreur inconnue s'est produite.");
        }
      }
    } 
    
    else if (step === 1) {
      if(!code) {
        alert("Veuillez entrer le code reçu par email.");
        setLoading(false);
        return;
      }

      try {
        const response = await validateCode(identifier, code);

        if (response.status === 200 && response.data.success) {
          setToken(response.data.token);
          alert("Code validé avec succès. Vous pouvez maintenant changer votre mot de passe.");
          setStep(2);
        } else if (response.data && response.data.message) {
          alert(response.data.message);
        } else {
          alert("Code incorrect ou expiré. Veuillez réessayer.");
        }
      } catch (error: any) {
        alert("Code incorrect ou expiré. Veuillez réessayer.");
      }
    }

    else if (step === 2) {
      if (!newPassword) {
        alert("Veuillez entrer un nouveau mot de passe.");
        setLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        alert("Le mot de passe doit contenir au moins 8 caractères.");
        setLoading(false);
        return;
      }

      const response = await resetPassword(identifier, token, newPassword);
      if (response.status === 200) {
        alert("Mot de passe changé avec succès. Vous pouvez maintenant vous connecter.");
        router.push("/auth/login");
      } else {
        alert("Une erreur s'est produite lors du changement de mot de passe. Veuillez réessayer.");
        setLoading(false);
      }      
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