"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import FormInput from "@/components/ui/FormInput";
import FormButton from "@/components/ui/FormButton";

type Props = {
  label: string;
  targetValue: string;
  onValidate: (code: string) => Promise<boolean>;
  onClose: () => void;
};

export default function CodeValidationModal({ label, targetValue, onValidate, onClose }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCode = async () => {
    if (!code || code.length !== 6) {
      toast.error("Code invalide");
      return;
    }

    try {
      setLoading(true);
      const success = await onValidate(code);

      if (success) {
        toast.success(`Code validé !`);
        onClose();
      } else {
        toast.error(`Échec de la validation du code`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
        <h2 className="text-lg font-bold text-center">Vérifiez votre {label.toLowerCase()}</h2>
        <p className="text-sm text-gray-600 text-center">
          Entrez le code envoyé à <span className="font-medium">{targetValue}</span>
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