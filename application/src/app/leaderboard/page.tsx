"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '../globals.css';
import { useUser } from "@/context/UserContext";
import profileImages from "@/Type/ProfilePicture";
import { User } from "@/Type/User";

export default function LeaderBoard() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'points' | 'gamesPlayed' | 'wins'>('points');
  const [sortedPlayers, setSortedPlayers] = useState<User[]>([]);

  const { user, loading } = useUser();

  const currentUserId = user?.id;
  const currentUserRank = 1;

   const sortPlayers = (players: User[], tab: string) => {
    return [...players].sort((a, b) => {
      if (tab === 'points') return b.point - a.point;
      if (tab === 'gamesPlayed') return b.photoDeProfil - a.photoDeProfil;
      return b.nombreVictoire - a.nombreVictoire;
    });
  };

   useEffect(() => {
       if (!loading && !user) {
         router.replace('/auth/login');
       }
     }, [user, loading, router]);
    

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-purple-200 to-teal-200 p-6">
      <button onClick={() => router.back()} className="mb-4 lg:mb-0 text-white text-3xl">
       Retour
      </button>
      <div className="w-full lg:w-3/4 px-6">
        <h1 className="text-center text-3xl font-bold mb-4">
          CLASSEMENT - {selectedTab === 'points' ? 'Points' : selectedTab === 'gamesPlayed' ? 'Parties' : 'Victoires'}
        </h1>
        <div className="flex justify-center space-x-2 mb-4">
          {['points', 'gamesPlayed', 'wins'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md font-semibold ${selectedTab === tab ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
              onClick={() => setSelectedTab(tab as any)}
            >
              {tab === 'points' ? 'Points' : tab === 'gamesPlayed' ? 'Parties' : 'Victoires'}
            </button>
          ))}
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {sortedPlayers.slice(0, 100).map((player, index) => (
            <div
              key={player.pseudo}
              className={`flex items-center justify-between p-3 rounded-md ${player.id === currentUserId ? 'bg-green-400' : 'bg-gray-600'} text-white`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{index + 1}.</span>
                {/*index < 3 && (
                  <MaterialCommunityIcons
                    name="crown"
                    size={24}
                    color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
                    className="ml-1"
                  />
                )*/}
                <Image
                  src={profileImages[player.photoDeProfil]}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{player.pseudo}</span>
              </div>
              <span>
                {selectedTab === 'points' ? player.point : selectedTab === 'gamesPlayed' ? player.nombrePartie : player.nombreVictoire}
              </span>
            </div>
          ))}
        </div>
      </div>
      {user && (
        <div className="w-full lg:w-1/4 bg-white bg-opacity-80 p-4 rounded-xl shadow-md mt-6 lg:mt-0">
          <div className="flex items-center space-x-4">
            <Image
              src={profileImages[user.photoDeProfil]}
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full"
            />
            <h2 className="text-xl font-bold">{user.pseudo}</h2>
          </div>
          <hr className="my-2" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Classement :</span>
              <span>{currentUserRank}/{/*totalPlayers*/}</span>
            </div>
            <div className="flex justify-between">
              <span>Points :</span>
              <span>{user.point}</span>
            </div>
            <div className="flex justify-between">
              <span>Victoires :</span>
              <span>{/*user.nbVictoire*/}</span>
            </div>
            <div className="flex justify-between">
              <span>Parties :</span>
              <span>{/*user.nbPartie*/}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

