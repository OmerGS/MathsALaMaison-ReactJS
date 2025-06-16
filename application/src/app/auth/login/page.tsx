"use client";

import NotProtectedRoute from "@/components/NotProtectedRoute";
import Login from "./Login";


export default function AdminPage() {
  return (
    <NotProtectedRoute>
      <Login />
    </NotProtectedRoute>
  );
}