"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "../globals.css";

import SectionButton from "@/components/ui/SectionButton";
import ActionButton from "@/components/ui/ActionButton";
import BackButton from "@/components/ui/BackButton";
import { logoutUser } from "@/services/authAPI";

export default function Settings() {
  const router = useRouter();
  const { user, loading, setUser } = useUser();
  const [selectedSection, setSelectedSection] = useState("COMPTE");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  const disconnect = async () => {
    const response = await logoutUser();
    if (response.status === 200) {
      setUser(null);
      router.push("/auth/login");
    } else {
      alert("Échec de la déconnexion. Veuillez réessayer.");
      console.error("Failed to disconnect user");
    }
  }

  const renderContent = () => {
    switch (selectedSection) {
      case "CGU":
        return (
          <div className="space-y-2 text-gray-800">
            <p>A VOIR AVEC CLIENTE</p>
            <p>L'application stocke les données utilisateur sur un serveur externe.</p>
          </div>
        );
      case "CONTACT":
        return (
          <div className="space-y-2 text-gray-800">
            <p>Contact : am@mathsalamaison.fr</p>
            <p>Site Web : www.mathsalamaison.fr</p>
          </div>
        );
      case "COMPTE":
        return user ? (
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
        ) : null;
      default:
        return null;
    }
  };

  const sections = user ? ["COMPTE", "CGU", "CONTACT"] : ["CGU", "CONTACT"];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-l from-custom to-custom">
      <div className="mb-15">
        <BackButton />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((section) => (
          <SectionButton
            key={section}
            active={selectedSection === section}
            onClick={() => setSelectedSection(section)}
          >
            {section}
          </SectionButton>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl">{renderContent()}</div>
    </div>
  );
}