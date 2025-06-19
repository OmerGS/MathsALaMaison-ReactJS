"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import { useUser } from "@/context/UserContext";
import { handleChangePassword } from "./handleChangePassword";
import PasswordInput from "@/components/ui/PasswordInput";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading } = useUser();

  const router = useRouter();

  const onSubmit = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const success = await handleChangePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
    if (success) {
      router.push("/settings/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-custom to-custom flex flex-col items-center justify-center px-4 py-8">
      <BackButton/>

      <main className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Changer mot de passe
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(currentPassword, newPassword, confirmPassword);
          }}
          className="space-y-6"
        >
          <PasswordInput
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />

          <PasswordInput
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            showStrength={true}
          />

          <PasswordInput
            placeholder="Confirmer nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <p className="text-xs text-gray-500 italic mt-2">
            Le mot de passe doit contenir au moins 10 caractères, une majuscule,
            un chiffre et un symbole.
          </p>

          <FormButton
            disabled={loading}
          >
            {loading ? "Changement en cours..." : "Changer le mot de passe"}
          </FormButton>
        </form>
      </main>
    </div>
  );
}