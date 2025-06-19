"use client";

import ActionButton from "@/components/ui/ActionButton";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authAPI";
import { useUser } from "@/context/UserContext";

import React from "react";
import toast from "react-hot-toast";

const Compte = () => {
    const router = useRouter();
    const { setUser } = useUser();
    
    const disconnect = async () => {
        const response = await logoutUser();
        if (response.status === 200) {
            setUser(null);
            router.push("/auth/login");
        } else {
            toast.error("Échec de la déconnexion. Veuillez réessayer.");
            console.error("Failed to disconnect user");
        }
    }

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
        <ActionButton
            danger
            onClick={async () => {
            await disconnect();
            }}
        >
            Déconnexion
        </ActionButton>
        <ActionButton
            danger
            onClick={() => {
            /* handleDeleteAccount(router, user, setUser); */
            }}
        >
            Supprimer compte
        </ActionButton>
        </div>
  );
};

export default Compte;