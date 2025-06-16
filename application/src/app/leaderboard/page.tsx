"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { User } from "@/Type/User";
import "../globals.css";

import BackButton from "@/components/ui/BackButton";
import SectionButton from "@/components/ui/SectionButton";
import ClassementCard from "@/components/ui/ClassementCard";
import UserStatsCard from "@/components/ui/UserStatsCard";

const TABS = [
  { key: "points", label: "Points" },
  { key: "gamesPlayed", label: "Parties" },
  { key: "wins", label: "Victoires" },
] as const;

export default function LeaderBoard() {
  const [selectedTab, setSelectedTab] = useState<"points" | "gamesPlayed" | "wins">("points");
  const [sortedPlayers, setSortedPlayers] = useState<User[]>([]);

  const { user, loading } = useUser();
  const router = useRouter();

  const currentUserId = user?.id;
  const currentUserRank = 1;

  const sortPlayers = (players: User[], tab: string) => {
    return [...players].sort((a, b) => {
      if (tab === "points") return b.point - a.point;
      if (tab === "gamesPlayed") return b.nombrePartie - a.nombrePartie;
      return b.nombreVictoire - a.nombreVictoire;
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }

    if (user) {
      const fakePlayers: User[] = [
        {
          id: 1, pseudo: "Alice", photoDeProfil: 1, point: 120, nombrePartie: 30, nombreVictoire: 10,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 2, pseudo: "Bob", photoDeProfil: 1, point: 110, nombrePartie: 40, nombreVictoire: 12,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 3, pseudo: "Charlie", photoDeProfil: 2, point: 150, nombrePartie: 50, nombreVictoire: 20,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 4, pseudo: "Diana", photoDeProfil: 3, point: 1000, nombrePartie: 22, nombreVictoire: 8,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 5, pseudo: "Ethan", photoDeProfil: 4, point: 130, nombrePartie: 35, nombreVictoire: 15,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 6, pseudo: "Fiona", photoDeProfil: 5, point: 85, nombrePartie: 25, nombreVictoire: 6,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 7, pseudo: "George", photoDeProfil: 6, point: 140, nombrePartie: 45, nombreVictoire: 18,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 8, pseudo: "Hanna", photoDeProfil: 7, point: 75, nombrePartie: 20, nombreVictoire: 5,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 9, pseudo: "Ian", photoDeProfil: 8, point: 100, nombrePartie: 28, nombreVictoire: 9,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 10, pseudo: "Jane", photoDeProfil: 9, point: 110, nombrePartie: 33, nombreVictoire: 13,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },

        {
          id: 11, pseudo: "Kevin", photoDeProfil: 10, point: 125, nombrePartie: 40, nombreVictoire: 14,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 12, pseudo: "Luna", photoDeProfil: 11, point: 90, nombrePartie: 18, nombreVictoire: 7,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 13, pseudo: "Mike", photoDeProfil: 12, point: 115, nombrePartie: 32, nombreVictoire: 11,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 14, pseudo: "Nina", photoDeProfil: 13, point: 105, nombrePartie: 29, nombreVictoire: 10,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 15, pseudo: "Oscar", photoDeProfil: 14, point: 135, nombrePartie: 42, nombreVictoire: 16,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 16, pseudo: "Paula", photoDeProfil: 15, point: 80, nombrePartie: 21, nombreVictoire: 5,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 17, pseudo: "Quentin", photoDeProfil: 16, point: 95, nombrePartie: 24, nombreVictoire: 8,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 18, pseudo: "Rita", photoDeProfil: 17, point: 100, nombrePartie: 30, nombreVictoire: 9,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 19, pseudo: "Sam", photoDeProfil: 18, point: 130, nombrePartie: 44, nombreVictoire: 15,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 20, pseudo: "Tina", photoDeProfil: 19, point: 85, nombrePartie: 20, nombreVictoire: 6,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },

        {
          id: 21, pseudo: "Ugo", photoDeProfil: 20, point: 120, nombrePartie: 38, nombreVictoire: 13,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 22, pseudo: "Vera", photoDeProfil: 21, point: 90, nombrePartie: 22, nombreVictoire: 7,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 23, pseudo: "Will", photoDeProfil: 22, point: 110, nombrePartie: 31, nombreVictoire: 12,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 24, pseudo: "Xena", photoDeProfil: 23, point: 115, nombrePartie: 33, nombreVictoire: 14,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 25, pseudo: "Yann", photoDeProfil: 24, point: 130, nombrePartie: 41, nombreVictoire: 17,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 26, pseudo: "Zoe", photoDeProfil: 25, point: 95, nombrePartie: 26, nombreVictoire: 8,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 27, pseudo: "Adam", photoDeProfil: 26, point: 105, nombrePartie: 28, nombreVictoire: 10,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 28, pseudo: "Bella", photoDeProfil: 27, point: 125, nombrePartie: 39, nombreVictoire: 15,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 29, pseudo: "Carl", photoDeProfil: 28, point: 115, nombrePartie: 34, nombreVictoire: 13,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
        {
          id: 30, pseudo: "Dora", photoDeProfil: 29, point: 100, nombrePartie: 27, nombreVictoire: 9,
          email: "",
          password: "",
          salt: "",
          isPremium: false
        },
      ];
      setSortedPlayers(sortPlayers(fakePlayers, selectedTab));
    }
  }, [user, loading, selectedTab]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-l from-custom to-custom p-6">
      <div className="w-full lg:w-3/4 px-4">
        <BackButton />
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          CLASSEMENT - {TABS.find(tab => tab.key === selectedTab)?.label}
        </h1>

        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <SectionButton
              key={tab.key}
              active={selectedTab === tab.key}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </SectionButton>
          ))}
        </div>

        <div className="space-y-3 max-h-[calc(100vh-175px)] overflow-y-auto pr-2">
          {sortedPlayers.map((player, index) => (
            <ClassementCard
              key={player.id}
              player={player}
              index={index}
              currentUserId={currentUserId}
              selectedTab={selectedTab}
            />
          ))}
        </div>
      </div>

      {user && (
        <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
          <UserStatsCard user={user} currentUserRank={currentUserRank} />
        </div>
      )}
    </div>
  );
}
