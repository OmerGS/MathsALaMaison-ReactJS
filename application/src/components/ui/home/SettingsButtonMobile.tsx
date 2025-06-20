"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SettingsButtonMobile() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/settings")}
      className="btn-primary w-25 h-20 rounded-md flex items-center justify-center animate-fade-in-delay-200"
    >
      <Settings size={40} />
    </button>
  );
}