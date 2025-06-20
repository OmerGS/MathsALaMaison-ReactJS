
"use client";

import { ShieldUser } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ClassementButton() {
  const router = useRouter();
  return (
    <button className="btn-admin w-25 h-20 px-4 py-2 animate-fade-in-delay-200 justify-center items-center flex"
     onClick={() => router.push("/panel/admin")}>
      <ShieldUser size={40} />
    </button>
  );
}
