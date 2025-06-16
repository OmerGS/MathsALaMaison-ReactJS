"use client";

import QuestionList from "./question-list";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function AdminPage() {
  return (
    <ProtectedRoute>
      <QuestionList />
    </ProtectedRoute>
  );
}