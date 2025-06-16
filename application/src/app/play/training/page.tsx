"use client";

import Training from "./training";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Training />
    </ProtectedRoute>
  );
}