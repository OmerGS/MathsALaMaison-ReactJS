
"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function ClassementButton() {
  const router = useRouter();
  return (
    <button className="btn-admin px-4 py-2 animate-fade-in-delay-200 w-[12rem]"
     onClick={() => router.push("/panel/admin")}>
      Panel
    </button>
  );
}
