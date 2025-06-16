"use client";

import React, { useState } from "react";

interface HelpTooltipProps {
  description: string;
}

export default function HelpTooltip({ description }: HelpTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="w-6 h-6 rounded-full bg-gray-300 text-gray-800 font-bold text-sm hover:bg-gray-400 transition flex items-center justify-center"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label="Aide"
      >
        ?
      </button>

      {visible && (
        <div
          role="tooltip"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs bg-black text-white text-xs p-2 rounded shadow-lg z-50"
        >
          {description}
        </div>
      )}
    </div>
  );
}
