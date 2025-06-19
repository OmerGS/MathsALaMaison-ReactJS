'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/app/globals.css'
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import profileImages from '@/Type/ProfilePicture';
import LoggedInDashboard from './LoggedInHomePage';
import { Toaster } from 'react-hot-toast';
export default function Home() {
  return (
      <ProtectedRoute>
        <DashboardContent />
        <Toaster position="top-right" reverseOrder={false} />
      </ProtectedRoute>
  );
}





function DashboardContent() {
  const { user } = useUser();
  const router = useRouter();

  /*const [isPlaying, setIsPlaying] = useState(isSoundPlaying());*/
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isHoveredProfil, setIsHoveredProfil] = useState(false);
  const [isHoveredSetting, setIsHoveredSetting] = useState(false);
  const [isHoveredLeadBorad, setIsHoveredLeadBorad] = useState(false);
  const [isHoveredPlay, setIsHoveredPlay] = useState(false);
  const [isHoveredSelect, setIsHoveredSelect] = useState(false);

  const choices = [
    { label: "Les Questions", action: () => router.push('/play/question-list') },
    { label: "Partie en ligne", action: () => router.push('/play/matchmaking') },
    { label: "Partie local", action: () => router.push('/play/create') },
    { label: "Entraînement", action: () => router.push('/play/training') },
  ];

  const [selectedAction, setSelectedAction] = useState(choices[1]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);





  return <LoggedInDashboard /> ;
}