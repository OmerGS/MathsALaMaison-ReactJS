"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProfilEdit from "./ProfilEdit";
import { Toaster } from "react-hot-toast";


export default function AdminPage() {
  return (
    <ProtectedRoute>
      <ProfilEdit />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
}