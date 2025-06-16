"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilPage from "./Profil";


export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ProfilPage />
    </ProtectedRoute>
  );
}