"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import { useUser } from "@/context/UserContext";

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const {user, loading, setUser} = useUser();
  
  const router = useRouter();

  if (!user) return null;

  const onSubmit = async (newEmail: string) => {
    const success = await handleUsernameChange(newEmail);
    if(success){
      setUser({ ...user, pseudo: newEmail})
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <BackButton />
      <div className="md:flex-1 bg-bg p-10 flex flex-col justify-center items-center space-y-2">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Modifier Pseudonyme
          </h1>

          <FormInput
            type="email"
            placeholder="Nouvel Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="username"
          />
          
          <FormInput
            type="text"
            placeholder="Mot de passe"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="username"
          />

          <FormButton
              onClick={() => onSubmit(newEmail)}
              disabled={
                  loading
              }
          >
            {loading
              ? "Changement du pseudo termine"
              : "Changer le pseudo"}
          </FormButton>
      </div>
    </div>
  ); 
}
