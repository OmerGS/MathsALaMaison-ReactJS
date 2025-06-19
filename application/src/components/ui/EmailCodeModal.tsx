"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";
import { updateEmailCheck } from "@/services/userAPI";

type Props = {
  email: string;
  onClose: () => void;
};

export default function EmailCodeModal({ email, onClose }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCode = async () => {
    if (!code || code.length !== 6) {
      toast.error("Code invalide");
      return;
    }

    try {
      setLoading(true);
      const response = await updateEmailCheck(code);

      if (response.status === 200) {
        toast.success("Adresse email mise à jour !");
        onClose();
      } else {
        toast.error(response.data.message || "Échec de la validation");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-center">Vérifiez votre email</h2>
        <p className="text-sm text-gray-600 text-center">
          Entrez le code envoyé à <span className="font-medium">{email}</span>
        </p>

        <FormInput
          placeholder="Code à 6 chiffres"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <FormButton onClick={validateCode} disabled={loading}>
          {loading ? "Validation..." : "Valider le code"}
        </FormButton>

        <button onClick={onClose} className="text-xs text-center text-gray-500 hover:underline block mx-auto">
          Annuler
        </button>
      </div>
    </div>
  );
}