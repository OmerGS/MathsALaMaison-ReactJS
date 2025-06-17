"use client";

import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "@/components/ProtectedRoute";
import Training from "./Training";

export default function TrainingPage() {
  return (
    <ProtectedRoute>
      <Training />
      <Toaster position="top-right" reverseOrder={false} />
    </ProtectedRoute>
  );
}