"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilEdit from "./ProfilEdit";


export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ProfilEdit />
    </ProtectedRoute>
  );
}