"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "../globals.css";
import BackButton from "@/components/ui/BackButton";
import ProfileHeader from "@/components/ui/ProfileHeader";
import StatCard from "@/components/ui/StatCard";

export default function ProfilPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (!user) return null;

  const defeats = user.nombrePartie - user.nombreVictoire;
  const ratio =
    user.nombrePartie > 0
      ? `${((user.nombreVictoire / user.nombrePartie) * 100).toFixed(0)}%`
      : "0%";

  const stats = [
    { label: "Digits", value: user.point, icon: "/assets/images/icones/digit.png" },
    { label: "Ratio", value: ratio, icon: "/assets/images/icones/ratio.png" },
    { label: "Victoires", value: user.nombreVictoire, icon: "/assets/images/icones/victories.png" },
    { label: "Parties", value: user.nombrePartie, icon: "/assets/images/icones/games.png" },
    { label: "Défaites", value: defeats, icon: "/assets/images/icones/defeats.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-l from-custom to-custom p-6 flex flex-col items-center">
      <div className="self-start mb-4">
        <BackButton />
      </div>

      <div className="w-full max-w-5xl min-h-[70vh] flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Profil</h1>

        <ProfileHeader user={user} />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8 w-full justify-items-center">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}