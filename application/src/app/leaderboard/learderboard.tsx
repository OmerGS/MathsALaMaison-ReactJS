"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { User } from "@/Type/User";
import { handleGetLeadBoardUser } from "./leaderboard";
import "../globals.css";

import BackButton from "@/components/ui/global/BackButton";
import SectionButton from "@/components/ui/global/SectionButton";
import ClassementCard from "@/components/ui/learderBoard/ClassementCard";
import UserStatsCard from "@/components/ui/learderBoard/UserStatsCard";
import Loading from "@/components/ui/global/Loading";

const TABS = [
  { key: "point", label: "Points" },
  { key: "nombrePartie", label: "Parties" },
  { key: "nombreVictoire", label: "Victoires" },
] as const;

export default function LeaderBoard() {
  const [selectedTab, setSelectedTab] = useState<"point" | "nombrePartie" | "nombreVictoire">("point");
  const [sortedPlayers, setSortedPlayers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  const { user} = useUser();

  const currentUser = user;
  const fetchLeaderboard = async (tab: string) => {
    setIsLoading(true);
    const result = await handleGetLeadBoardUser(tab);
    if (result) {
      setSortedPlayers(result);
      const rank = result.findIndex((player) => player.pseudo === user?.pseudo);
      setCurrentUserRank(rank >= 0 ? rank + 1 : null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
      fetchLeaderboard(selectedTab);
  }, [selectedTab]);

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
          {isLoading ? (
            <Loading />
          ) : (
            sortedPlayers.map((player, index) => (
              <ClassementCard
                key={player.id ?? `player-${index}`}
                player={player}
                index={index}
                currentUser={currentUser}
                selectedTab={selectedTab}
              />
            ))
          )}
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
