"use client";

import NotProtectedRoute from "@/components/NotProtectedRoute";
import Signup from "./Signup";


export default function AdminPage() {
  return (
    <NotProtectedRoute>
      <Signup />
    </NotProtectedRoute>
  );
}