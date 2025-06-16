// SettingsButtons.tsx
"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function SettingsButton() {
  const router = useRouter();
  return (
    <button className="btn-primary px-4 py-2 animate-fade-in-delay-200 w-[12rem]"
    onClick={() => router.push("/settings")}>
      Paramètres
    </button>
  );
}
