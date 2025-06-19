"use client";

import React, { useState } from "react";
import "../../globals.css";

import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import BackButton from "@/components/ui/BackButton";
import { handleChangeEmail } from "./handleChangeEmail";
import PasswordInput from "@/components/ui/PasswordInput";
import EmailCodeModal from "@/components/ui/EmailCodeModal";

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (password: string, email: string) => {
    const success = await handleChangeEmail(password, email);

    if(success){
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-custom to-custom flex flex-col items-center justify-center px-4 py-8">
      <BackButton />

      <main className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Mise à jour de l’email
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(password, newEmail);
          }}
          className="space-y-6"
        >
          <PasswordInput
            placeholder="Mot de passe actuel"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <FormInput
            type="email"
            placeholder="Votre nouvelle adresse email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            autoComplete="email"
          />

          <FormButton>Enregistrer l’adresse email</FormButton>
        </form>
      </main>

      {showModal && (
        <EmailCodeModal
          email={newEmail}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}