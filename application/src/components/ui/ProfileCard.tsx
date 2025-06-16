"use client";

import profileImages from "@/Type/ProfilePicture";
import { User } from "@/Type/User";
import { useRouter } from "next/navigation";
import React from "react";

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();
  return (
    <button
      className="card animate-fade-in p-4 flex items-center gap-4"
      onClick={() => router.push("/profile")}
    >
      <img
        src={profileImages[user.photoDeProfil]}
        alt="Avatar"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <p className="text-muted text-s">Bienvenue !</p> 
        <h2 className="text-primary font-bold text-2xl">{user.pseudo}</h2>
      </div>
    </button>
  );
}
