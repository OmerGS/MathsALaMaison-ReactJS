"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import profileImages from "@/Type/ProfilePicture";
import { handleProfilePictureChange } from "./edit"; // Assure-toi que ce chemin est correct
import "../../globals.css";

import BackButton from "@/components/ui/BackButton";
import AvatarSelector from "@/components/ui/AvatarSelector";

export default function ProfilEdit() {
  const { user, setUser, loading } = useUser();
  const router = useRouter();

  if (loading) return <p>Chargement...</p>;
  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  const handleChange = async (id: number) => {
    const success = await handleProfilePictureChange(id);
    if (success) {
      setUser({ ...user, photoDeProfil: id });
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#E6D8F7] to-[#B1EDE8] p-4 sm:p-6 md:p-10 flex flex-col items-center">
      <BackButton />

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 text-gray-900 text-center max-w-xl px-4">
        Choisissez une photo de profil
      </h1>

      <AvatarSelector
        profileImages={profileImages}
        selectedId={user.photoDeProfil}
        onSelect={handleChange}
        className="w-full max-w-5xl px-2 sm:px-4"
      />
    </div>
  );
}
