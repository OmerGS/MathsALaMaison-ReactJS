"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ChangeEmail from "./ChangeEmail";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ChangeEmail />
    </ProtectedRoute>
  );
}