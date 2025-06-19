"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="fixed top-4 left-4 z-50 group flex items-center space-x-2">
      <button
        onClick={() => router.back()}
        className="bg-black/80 text-white rounded-full p-2 hover:bg-black transition duration-300 shadow-lg"
      >
        <ArrowLeft size={20} />
      </button>
      <span className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 -translate-x-2 transition duration-300 text-sm bg-black text-white px-3 py-1 rounded-md shadow">
        Retour
      </span>
    </div>
  );
}
