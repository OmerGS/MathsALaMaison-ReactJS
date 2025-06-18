"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import { useUser } from "@/context/UserContext";

export default function ChangePassword() {
  const [curPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {user, loading, setUser} = useUser();

  const router = useRouter();

  if (!user) return null;

  const onSubmit = async (newPassword: string) => {
    const success = await handlePasswordChange(newPassword);
    if(success){
      setUser({ ...user, password: newPassword})
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <BackButton />
      <div className="md:flex-1 bg-bg p-10 flex flex-col justify-center items-center space-y-2">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Changer mot de passe
          </h1>

          <FormInput
            type="text"
            placeholder="Mot de passe actuel"
            value={curPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="username"
          />

          <FormInput
            type="text"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="username"
          />

          <FormInput
            type="text"
            placeholder="Confirmer nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="username"
          />

          <FormButton
              onClick={() => onSubmit(newPassword)}
              disabled={
                  loading
              }
          >
            {loading
              ? "Changement du mot de passe termine"
              : "Changer le mot de passe"}
          </FormButton>
      </div>
    </div>
  ); 
}
