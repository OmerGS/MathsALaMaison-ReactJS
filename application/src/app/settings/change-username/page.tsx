"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ChangeUsername from "./ChangeUsername";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ChangeUsername />
    </ProtectedRoute>
  );
}