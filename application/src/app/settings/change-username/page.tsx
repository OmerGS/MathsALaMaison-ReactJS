"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ChangeUsername from "./ChangeUsername";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ChangeUsername />
      <Toaster position="bottom-center" reverseOrder={false} />
    </ProtectedRoute>
  );
}