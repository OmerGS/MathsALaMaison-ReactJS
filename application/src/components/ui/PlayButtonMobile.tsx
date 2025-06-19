"use client";

import React from "react";

interface PlayButtonProps {
  onClick: () => void;
}

export default function PlayButtonMobile({ onClick }: PlayButtonProps) {
  return (
    <div className="pl-3"> {/* aligné à gauche avec un décalage vertical */}
      <button
        onClick={onClick}
        className="btn-primary w-[12rem] h-[4rem] text-lg rounded-full animate-fade-in"
      >
        Jouer
      </button>
    </div>
  );
}
