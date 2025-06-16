"use client";

import NotProtectedRoute from "@/components/NotProtectedRoute";
import ResetPassword from "./ResetPassword";


export default function AdminPage() {
  return (
    <NotProtectedRoute>
      <ResetPassword />
    </NotProtectedRoute>
  );
}