'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import profileImages from '@/Type/ProfilePicture';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useMediaQuery } from 'react-responsive';

export default function LoggedInHomePage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, loading } = useUser();
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [isModalVisible, setModalVisible] = useState(false);
  const [isHoveredPlay, setIsHoveredPlay] = useState(false);
  const [isHoveredLeadBorad, setIsHoveredLeadBorad] = useState(false);
  const [isHoveredSetting, setIsHoveredSetting] = useState(false);
  const [isHoveredProfil, setIsHoveredProfil] = useState(false);
  const [isHoveredSelect, setIsHoveredSelect] = useState(false);

  const choices = [
    { label: 'Les Questions', action: () => router.push('/play/question-list') },
    { label: 'Partie en ligne', action: () => router.push('/play/matchmaking') },
    { label: 'Partie local', action: () => router.push('/play/create') },
    { label: 'Entraînement', action: () => router.push('/play/training') },
  ];
  const [selectedAction, setSelectedAction] = useState(choices[1]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

 



const windowLayout = (
  <div className="min-h-screen w-screen bg-gradient-to-l from-[#E6D8F7] to-[#B1EDE8] font-sans grid grid-cols-3 grid-rows-3 relative text-[clamp(1rem,2.5vw,1.75rem)]">
    {/* Profil & Points */}
    <div className="row-start-1 col-start-1 flex flex-col gap-3 p-2">
      <button
        className="flex items-center gap-3 px-3 py-2 bg-gradient-to-br from-blue-100 to-blue-200 border border-gray-600 rounded-xl shadow-md font-bold text-gray-700 transition-all duration-200 cursor-pointer w-full"
        onClick={() => router.push("/profile")}
        onMouseEnter={() => setIsHoveredProfil(true)}
        onMouseLeave={() => setIsHoveredProfil(false)}
      >
        <Image
          src={profileImages[user?.photoDeProfil || 1]}
          alt="profile"
          width={50}
          height={50}
          style={{ width: "clamp(30px, 8vw, 50px)", height: "clamp(30px, 8vw, 50px)" }}
        />
        <span className="truncate max-w-[10ch]">{user?.pseudo}</span>
      </button>
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-100 to-blue-200 border border-gray-600 rounded-xl shadow-md font-bold text-gray-700 text-base w-full">
        <span className="truncate font-extrabold">{user?.point}</span>
        <Image src="/icons/icon-192x192.png" alt="digit" width={28} height={28} />
      </div>
    </div>

    {/* Centre : Logo */}
    <div className="row-start-2 col-start-2 flex justify-center items-center h-full w-full p-2">
      <div className="relative w-[50vw] max-w-[200px] aspect-square">
        <Image
          src="/icons/icon-512x512.png"
          alt="logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>

    {/* Paramètres & Classement */}
    <div className="row-start-1 col-start-3 flex flex-col gap-2 items-end p-2">
      {[{
        icon: "⚙️",
        onClick: () => router.push("/settings")
      }, {
        icon: "🏆",
        onClick: () => router.push("/leaderboard")
      }].map(({icon, onClick}, i) => (
        <button
          key={i}
          className="px-2 py-1 bg-gradient-to-br from-blue-100 to-blue-200 border border-gray-600 rounded-xl shadow-md font-bold text-gray-700 transition-all duration-200 cursor-pointer w-full"
          onClick={onClick}
          onMouseEnter={() => setIsHoveredPlay(true)}
          onMouseLeave={() => setIsHoveredPlay(false)}
        >
          {icon}
        </button>
      ))}
    </div>

    {/* Mode de jeu */}
    <div className="row-start-3 col-start-2 inline-flex justify-center p-2 gap-2 items-end">
      <button
        className="px-4 py-2 bg-gradient-to-br from-blue-100 to-blue-200 border border-gray-600 rounded-xl shadow-md font-bold text-gray-700 transition-all duration-200 cursor-pointer w-full"
        onClick={() => setModalVisible(true)}
        onMouseEnter={() => setIsHoveredSelect(true)}
        onMouseLeave={() => setIsHoveredSelect(false)}
      >
        {selectedAction?.label || "Choisir un mode de jeu"}
      </button>
    </div>

    {/* Bouton Jouer */}
    <div className="row-start-3 col-start-3 flex flex-col justify-end items-end p-2 h-full">
      <button
        className="px-4 py-2 bg-gradient-to-br from-blue-100 to-blue-200 border border-gray-600 rounded-xl shadow-md font-bold text-gray-700 transition-all duration-200 cursor-pointer w-full"
        onClick={() => router.push("/play")}
        onMouseEnter={() => setIsHoveredPlay(true)}
        onMouseLeave={() => setIsHoveredPlay(false)}
      >
        Jouer
      </button>
    </div>

    {/* Modal (Overlay) */}
    {isModalVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50 p-4">
        <div className="bg-white rounded-lg p-4 flex flex-col gap-3 max-w-sm w-full mb-8">
          {choices.map((choice, index) => (
            <button
              key={index}
              className="px-3 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
              onClick={() => {
                choice.action();
                setModalVisible(false);
              }}
            >
              {choice.label}
            </button>
          ))}
          <button
            className="mt-2 px-3 py-2 border border-gray-500 rounded-md hover:bg-gray-100 transition"
            onClick={() => setModalVisible(false)}
          >
            Annuler
          </button>
        </div>
      </div>
    )}
  </div>
);




  return windowLayout;
}
