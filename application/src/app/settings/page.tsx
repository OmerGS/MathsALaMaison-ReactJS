"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Settings from "./Settings";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  );
}