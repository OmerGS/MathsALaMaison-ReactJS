"use client";

import React from "react";

type ActionButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
};

export default function ActionButton({ children, onClick, danger = false }: ActionButtonProps) {
  const baseClasses =
    "w-full px-4 py-2 rounded-xl font-medium text-white shadow transition-all duration-200";

  const gradientClass = danger
    ? "bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90"
    : "bg-gradient-to-r from-cyan-400 to-cyan-600 hover:opacity-90";

  return (
    <button onClick={onClick} className={`${baseClasses} ${gradientClass}`}>
      {children}
    </button>
  );
}
