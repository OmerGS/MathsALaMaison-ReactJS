"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";

export default function Homepage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useUser();

  return (
    <div>
        <h1>Bienvenue sur ton Dashboard, {user?.pseudo}</h1>
        <p>votre email : {user?.email}</p>
        <p>Votre photo de profil : {user?.photoDeProfil}</p>
        <p>votre nombre de partie : {user?.nombrePartie}</p>
        <p>votre nombre de victoire : {user?.nombreVictoire}</p>
        <p>vos points : {user?.point}</p>
        <p>Votre premium : {user?.isPremium}</p>
        <p>Votre password : {user?.password}</p>
        <p>vos salt : {user?.salt}</p>
    </div>
  );
}