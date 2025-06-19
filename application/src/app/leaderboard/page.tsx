"use client";

import LeaderBoard from "./learderboard";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function AdminPage() {
  return (
    <ProtectedRoute>
      <LeaderBoard />
    </ProtectedRoute>
  );
}