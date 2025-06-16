import React from "react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-6 mt-8 text-center text-gray-600">
      <svg
        className="mb-4 w-12 h-12 text-blue-400 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      <p className="text-lg font-medium">
        La liste d’inscriptions est vide pour le moment.
      </p>
      <p className="mt-1 text-sm text-gray-400">
        Aucun utilisateur en attente d’approbation actuellement.
      </p>
    </div>
  );
}