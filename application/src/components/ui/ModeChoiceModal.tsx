"use client";

import React from "react";
import HelpTooltip from "@/components/ui/HelpTooltip";

interface Choice {
  label: string;
  action: () => void;
  description: string;
}

interface ModeChoiceModalProps {
  choices: Choice[];
  onClose: () => void;
  onSelect: (choice: Choice) => void;
}

export default function ModeChoiceModal({ choices, onClose, onSelect }: ModeChoiceModalProps) {
  return (
    <>
      {/* Overlay amélioré : dégradé + flou + transition */}
      <div
        className="fixed inset-0 z-[1000] bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal centré */}
      <div
        className="fixed top-1/2 left-1/2 z-[1001] max-w-md w-11/12 bg-white rounded-xl shadow-xl p-6
                   -translate-x-1/2 -translate-y-1/2 animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-xl font-semibold mb-4">Choisissez un mode</h2>
        <ul className="flex flex-col gap-3">
          {choices.map((choice) => (
            <li key={choice.label} className="flex items-center gap-2">
              <button
                onClick={() => onSelect(choice)}
                className="flex-1 py-2 px-4 rounded-md btn-primary text-white hover:bg-primary/80 transition"
              >
                {choice.label}
              </button>
              {choice.description && <HelpTooltip description={choice.description} />}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-muted underline hover:text-primary"
        >
          Annuler
        </button>
      </div>
    </>
  );
}
