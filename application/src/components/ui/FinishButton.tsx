"use client";
import React from "react";
import "@/app/globals.css";

export default function FinishButton({ onFinish }: { onFinish: () => void }) {
  return (
    <button
      onClick={onFinish}
      className="btn-admin px-6 py-5 rounded-full animate-fade-in w-[20rem]"
    >
      Terminer la partie
    </button>
  );
}