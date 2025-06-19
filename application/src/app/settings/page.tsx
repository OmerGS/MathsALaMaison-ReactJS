"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Settings from "./Settings";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Settings />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
}