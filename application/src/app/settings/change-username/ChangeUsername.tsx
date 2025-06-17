"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import { useUser } from "@/context/UserContext";

export default function ChangeUsername() {
  const [newPseudo, setNewPseudo] = useState("");
  const {user, setUser, loading} = useUser();

  const router = useRouter();

  if (!user) return null;

  const onSubmit = async (newName: string) => {
    const success = await handleUsernameChange(newName);
    if(success){
      setUser({ ...user, pseudo: newName})
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <BackButton />
      <div className="md:flex-1 bg-bg p-10 flex flex-col justify-center items-center space-y-2">
          <h1 className="text-3xl font-bold mb-6 text-black">
            Changer pseudonyme
          </h1>

          <FormInput
            type="text"
            placeholder="Nouveau pseudonyme"
            value={newPseudo}
            onChange={(e) => setNewPseudo(e.target.value)}
            autoComplete="username"
          />

          <FormButton
              onClick={() => onSubmit(newPseudo)}
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
