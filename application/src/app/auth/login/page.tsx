"use client";

import NotProtectedRoute from "@/components/NotProtectedRoute";
import Login from "./Login";
import { Toaster } from "react-hot-toast";


export default function AdminPage() {
  return (
    <NotProtectedRoute>
      <Login />
      <Toaster position="top-right" reverseOrder={false} />
    </NotProtectedRoute>
  );
}