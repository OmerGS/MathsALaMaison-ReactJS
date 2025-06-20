"use client";

import AdminAccessControl from "@/components/AdminAccessControl";
import AdminDashboard from "./AdminPage";
import { Toaster } from "react-hot-toast";


export default function AdminPage() {
  return (
    <AdminAccessControl>
      <AdminDashboard />
      <Toaster position="top-right" reverseOrder={false} />
    </AdminAccessControl>

  );
}