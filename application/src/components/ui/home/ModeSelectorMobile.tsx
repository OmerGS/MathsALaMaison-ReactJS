"use client";

import React from "react";

interface ModeSelectorProps {
  onClick: () => void;
}

export default function ModeSelectorMobile({ onClick }: ModeSelectorProps) {
  return (
    <div className="pl-3 mt-10"> {/* aligné à gauche avec un décalage vertical */}
      <button
        onClick={onClick}
        className="btn-primary w-[12rem] h-[4rem] text-lg rounded-full animate-fade-in"
      >
        Choisir un mode
      </button>
    </div>
  );
}


