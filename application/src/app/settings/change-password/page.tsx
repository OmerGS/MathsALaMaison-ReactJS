"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ChangePassword from "./ChangePassword";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ChangePassword />
      <Toaster position="bottom-center" reverseOrder={false} />
    </ProtectedRoute>
  );
}