"use client";

import React from "react";

interface PlayButtonProps {
  onClick: () => void;
}

export default function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      className="btn-primary px-6 py-3 rounded-full animate-fade-in w-[12rem]"
    >
      Jouer
    </button>
  );
}
