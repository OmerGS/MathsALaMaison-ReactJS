"use client";

import ProfilPicture from "@/config/ProfilePicture";
import { User } from "@/Type/User";
import { useRouter } from "next/navigation";
import React from "react";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCardMobile({ user }: ProfileCardProps) {
  const router = useRouter();

  return (
    <button
      className="card animate-fade-in p-6 flex items-center gap-6 min-w-[220px] min-h-[120px]"
      onClick={() => router.push("/profile")}
    >
      <img
        src={ProfilPicture[user.photoDeProfil]}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <p className="text-muted text-base">Bienvenue !</p>
        <h2 className="text-primary font-bold text-xl">{user.pseudo}</h2>
      </div>
    </button>
  );
}

