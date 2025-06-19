"use client";

import React from "react";

type Props = {
  name: string;
  index: number;
  onRemove?: () => void;
};

export default function PlayerCard({ name, index, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between bg-gradient-div px-4 py-2 rounded-lg mb-2 text-white">
      <span className="font-bold w-8">{index + 1}</span>
      <span className="flex-grow text-center">{name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-red-400 font-bold text-lg hover:text-red-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}