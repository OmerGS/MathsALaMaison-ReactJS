"use client";

import React from "react";

interface SectionButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function SectionButton({ active, onClick, children }: SectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium shadow transition-colors
        ${active ? "bg-purple-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
    >
      {children}
    </button>
  );
}
