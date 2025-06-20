"use client";

import React from "react";

interface ModeSelectorProps {
  onClick: () => void;
}

export default function ModeSelector({ onClick }: ModeSelectorProps) {
  return (
    <button
      onClick={onClick}
      className="btn-primary px-6 py-3 rounded-full animate-fade-in w-[30rem]"
    >
      Choisir un mode
    </button>
  );
}
