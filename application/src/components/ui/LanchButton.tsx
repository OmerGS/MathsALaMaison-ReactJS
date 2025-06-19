"use client";
import React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function LaunchButtonLarge({
  onClick,
  disabled = false,
  children = "LANCER",
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary-large rounded-full shadow-lg transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}
