"use client";

import React from "react";
import UserPaginationSettings from "./SettingsChild/UserPaginationSettings";
import QuestionPaginationSettings from "./SettingsChild/QuestionPaginationSettings";

export default function Settings() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center space-y-12">
      <section className="w-full max-w-md space-y-6">
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 select-none">
          Pagination
        </h2>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 select-none">
            Utilisateurs
          </h3>
          <UserPaginationSettings />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 select-none">
            Questions
          </h3>
          <QuestionPaginationSettings />
        </div>
      </section>

      <div className="w-full max-w-md h-px bg-white/30 backdrop-blur-sm rounded-full" />

      <section className="w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 select-none">
          Données
        </h2>
        <p className="mt-4 text-gray-500 italic text-center">Pas encore de paramètres disponibles.</p>
      </section>
    </main>
  );
}
