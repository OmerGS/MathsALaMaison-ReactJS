"use client";

import NotProtectedRoute from "@/components/NotProtectedRoute";
import Signup from "./Signup";
import { Toaster } from "react-hot-toast";


export default function AdminPage() {
  return (
    <NotProtectedRoute>
      <Signup />
      <Toaster position="top-right" reverseOrder={false} />
    </NotProtectedRoute>
  );
}