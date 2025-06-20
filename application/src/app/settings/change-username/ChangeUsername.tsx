"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

import FormInput from "@/components/ui/auth/FormInput";
import FormButton from "@/components/ui/auth/FormButton";
import BackButton from "@/components/ui/global/BackButton";
import { useUser } from "@/context/UserContext";
import PasswordInput from "@/components/ui/auth/PasswordInput";
import { handleChangePseudo, validatePseudoCodeWrapper } from "./handleChangeUsername";
import CodeValidationModal from "@/components/ui/global/EmailCodeModal";

export default function ChangeUsername() {
  const router = useRouter();
  const [newPseudo, setNewPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user, setUser, loading } = useUser();

  const onSubmit = async (password: string, newPseudo: string) => {
    const success = await handleChangePseudo(password, newPseudo);

    if (success) {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-custom to-custom flex flex-col items-center justify-center px-4 py-8">
      <BackButton />

      <main className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Mise à jour du pseudo
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(password, newPseudo);
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
            type="text"
            placeholder="Nouveau pseudo"
            value={newPseudo}
            onChange={(e) => setNewPseudo(e.target.value)}
            autoComplete="username"
          />

          <FormButton disabled={loading}>
            {loading ? "Changement du pseudo terminé" : "Changer le pseudo"}
          </FormButton>
        </form>
      </main>

      {/* Modal ici si besoin */}
      {showModal && (
        <CodeValidationModal
          label="Pseudo"
          targetValue={"l'adresse email associé à votre compte"}
          onValidate={validatePseudoCodeWrapper}
          onClose={() => {
            setShowModal(false);
            if (user && user.id !== undefined) {
              setUser({ ...user, pseudo: newPseudo });
            }
            router.push('/');
          }}
        />
      )}
    </div>
  );
}