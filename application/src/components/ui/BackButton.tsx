"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      className="absolute top-4 left-4 bg-dark text-white font-bold py-2 px-4 rounded"
      onClick={() => router.back()}
    >
      ← Retour
    </button>
  );
}
