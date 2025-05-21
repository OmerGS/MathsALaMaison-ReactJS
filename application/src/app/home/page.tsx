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

  return <h1>Bienvenue sur ton Dashboard, {user?.pseudo}</h1>;
}