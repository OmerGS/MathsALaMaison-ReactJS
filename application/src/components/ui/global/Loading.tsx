import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[200px]">
      <svg
        className="w-12 h-12 mb-4 text-indigo-600 animate-spin"
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
      <p className="text-indigo-600 font-semibold tracking-wide">
        Chargement en cours...
      </p>
    </div>
  );
}