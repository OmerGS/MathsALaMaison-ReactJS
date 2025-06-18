"use client";

import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ClassementButtonMobile() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/leaderboard")}
      className="btn-primary w-25 h-20 rounded-md flex items-center justify-center animate-fade-in-delay-200"
    >
      <Trophy size={40} />
    </button>
  );
}