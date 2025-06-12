"use client";

import AdminAccessControl from "@/components/AdminAccessControl";
import AdminDashboard from "./AdminPage";


export default function AdminPage() {
  return (
    <AdminAccessControl>
      <AdminDashboard />
    </AdminAccessControl>
  );
}