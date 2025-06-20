"use client";

import { useRouter } from "next/navigation";
import React from "react";

type LinkButtonProps = {
  to: string;
  children: React.ReactNode;
  color?: string; 
};

export default function LinkButton({ to, children, color }: LinkButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(to)}
      style={{ color }}
      className="text-sm hover:underline"
    >
      {children}
    </button>
  );
}
