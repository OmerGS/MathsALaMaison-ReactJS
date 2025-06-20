'use client';

import '@/app/globals.css'
import ProtectedRoute from "@/components/ProtectedRoute";
import LoggedInDashboard from './LoggedInHomePage';
import { Toaster } from 'react-hot-toast';
export default function Home() {
  return (
      <ProtectedRoute>
        <LoggedInDashboard />
        <Toaster position="top-right" reverseOrder={false} />
      </ProtectedRoute>
  );
}





