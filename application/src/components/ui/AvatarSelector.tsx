"use client";

import React from "react";
type Props = {
  profileImages: Record<number, string>;
  selectedId: number;
  onSelect: (id: number) => void;
  className?: string;
};

export default function AvatarSelector({ profileImages, selectedId, onSelect, className }: Props) {
  return (
    <div
      className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${className ?? ""}`}
    >
      {Object.entries(profileImages).map(([id, src]) => {
        const picId = Number(id);
        const isSelected = picId === selectedId;

        return (
            <button
                key={id}
                onClick={() => onSelect(picId)}
                className={`rounded-full border-4 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${isSelected
                    ? "bg-gradient-to-r from-red-400 to-red-600 border-transparent"
                    : "bg-gradient-to-r from-cyan-400 to-cyan-600 border-transparent"
                    }`}
                aria-pressed={isSelected}
                aria-label={`Sélectionner avatar ${id}`}
                >
                <img
                    src={src}
                    alt={`Avatar ${id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    draggable={false}
                />
            </button>
        );
      })}
    </div>
  );
}
