"use client";
import React from "react";

export default function FinishButton({ onFinish }: { onFinish: () => void }) {
  return (
    <button
      onClick={onFinish}
      className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Terminer la partie
    </button>
  );
}