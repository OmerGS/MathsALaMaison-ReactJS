"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
};

export default function PlayerInput({ value, onChange, onSubmit }: Props) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        placeholder="Nom du Joueur"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        className="flex-grow p-2 text-base rounded-lg border border-gray-300 text-black"
      />
      <button
        onClick={onSubmit}
        className="text-2xl bg-gradient-div font-bold px-4 py-2 rounded-lg hover:bg-yellow-300"
      >
        +
      </button>
    </div>
  );
}