"use client";

import React from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export default function ActionButton({ danger, children, className = "", ...props }: ActionButtonProps) {
  const baseClasses =
    "w-full py-3 rounded-xl font-semibold text-white transition-colors";

  const dangerClasses = danger
    ? "bg-red-500 hover:bg-red-600"
    : "bg-purple-600 hover:bg-purple-700";

  return (
    <button
      {...props}
      className={`${baseClasses} ${danger ? dangerClasses : "bg-purple-600 hover:bg-purple-700"} ${className}`}
    >
      {children}
    </button>
  );
}
