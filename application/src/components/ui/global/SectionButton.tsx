"use client";

import React from "react";

type SectionButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export default function SectionButton({ children, active, onClick }: SectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-semibold shadow transition-all duration-200
        ${active
          ? 'btn-primary text-white'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
      `}
    >
      {children}
    </button>
  );
}
