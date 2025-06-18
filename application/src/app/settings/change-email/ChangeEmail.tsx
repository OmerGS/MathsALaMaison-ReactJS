"use client";

import React, { useState } from "react";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import { useUser } from "@/context/UserContext";

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const {user, loading, setUser} = useUser();
  
  if (!user) return null;

  const onSubmit = async (
    password: string, 
    newEmail: string
  ) => {
    console.log(password);
    console.log(newEmail)
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <BackButton />
      <div className="md:flex-1 bg-bg p-10 flex flex-col justify-center items-center space-y-2">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Changer Email
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
              onClick={() => onSubmit(currentPassword, newEmail)}
              disabled={
                  loading
              }
          >
            {loading
              ? "Changement de l'email termine"
              : "Changer l'email"}
          </FormButton>
      </div>
    </div>
  ); 
}
