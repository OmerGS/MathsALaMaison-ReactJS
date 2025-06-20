"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser, logoutUser } from "@/services/authAPI";
import { useUser } from "@/context/UserContext";
import ActionButton from "@/components/ui/global/ActionButton";
import ConfirmDelete from "@/components/ui/settings/ConfirmDelete";
import CodeValidationModal from "@/components/ui/global/EmailCodeModal";
import { askMailCode, checkMailCode } from "@/services/validationAPI";
import toast from "react-hot-toast";
import FinalConfirmDelete from "@/components/ui/settings/FinalConfirmDelete";

const Compte = () => {
  const router = useRouter();
  const { setUser, user } = useUser();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);

  const disconnect = async () => {
    const response = await logoutUser();
    if (response.status === 200) {
      setUser(null);
      router.push("/auth/login");
    } else {
      toast.error("Échec de la déconnexion");
    }
  };

  const handleDeleteAccount = async () => {
    setShowConfirm(false);
    const response = await askMailCode();
    if (response.status === 200) {
      setShowCodeModal(true);
    } else {
      toast.error("Le code de validation n'a pas pu être envoyé.");
    }
  };

  const validateCodeAndDelete = async (code: string): Promise<boolean> => {
    try {
      const response = await checkMailCode(code);
      if (response.status === 200) {
        setShowCodeModal(false);
        setShowFinalConfirm(true);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  };

  const handleFinalDelete = async () => {
    const response = await deleteUser();

    if(response.status === 200){
      setUser(null);
      toast.success("Utilisateur supprimé avec succès");
      router.push('/auth/login');
    } else {
      toast.error("Une erreur est survenue lors de la suppression de l'utilisateur");
    }

    setShowFinalConfirm(false);
  };

  return (
    <div className="space-y-4">
      <ActionButton onClick={() => router.push("/settings/change-password")}>
        Changer mot de passe
      </ActionButton>
      <ActionButton onClick={() => router.push("/settings/change-email")}>
        Changer email
      </ActionButton>
      <ActionButton onClick={() => router.push("/settings/change-username")}>
        Changer pseudo
      </ActionButton>
      <ActionButton danger onClick={disconnect}>
        Déconnexion
      </ActionButton>
      <ActionButton danger onClick={() => setShowConfirm(true)}>
        Supprimer compte
      </ActionButton>

      <ConfirmDelete
        show={showConfirm}
        message="Es-tu sûr·e de vouloir supprimer ton compte ? Cette action est irréversible."
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDeleteAccount}
      />

      {showCodeModal && user?.email && (
        <CodeValidationModal
          label="compte"
          targetValue={user.email}
          onValidate={validateCodeAndDelete}
          onClose={() => setShowCodeModal(false)}
        />
      )}

      <FinalConfirmDelete
        show={showFinalConfirm}
        onCancel={() => setShowFinalConfirm(false)}
        onConfirm={handleFinalDelete}
      />
    </div>
  );
};

export default Compte;