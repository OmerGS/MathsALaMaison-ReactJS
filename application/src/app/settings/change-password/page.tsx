"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ChangePassword from "./ChangePassword";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ChangePassword />
    </ProtectedRoute>
  );
}