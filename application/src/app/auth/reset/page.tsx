"use client";

import NotProtectedRoute from "@/components/NotProtectedRoute";
import ResetPassword from "./ResetPassword";
import { Toaster } from "react-hot-toast";


export default function AdminPage() {
  return (
    <NotProtectedRoute>
      <ResetPassword />
      <Toaster position="top-right" reverseOrder={false} />
    </NotProtectedRoute>
  );
}