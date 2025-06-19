"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ChangeEmail from "./ChangeEmail";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ChangeEmail />
      <Toaster position="bottom-center" reverseOrder={false} />
    </ProtectedRoute>
  );
}