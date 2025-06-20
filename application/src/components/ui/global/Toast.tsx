"use client";

import React, { useEffect, useState } from "react";

type ToastProps = {
  id: number;
  type: "success" | "error";
  message: string;
  onClose: (id: number) => void;
  duration?: number;
};

export default function Toast({
  id,
  type,
  message,
  onClose,
  duration = 3500,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, duration);

    const removeTimeout = setTimeout(() => {
      onClose(id);
    }, duration + 300);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(removeTimeout);
    };
  }, [id, onClose, duration]);

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 max-w-xs w-full
        rounded-lg shadow-lg px-5 py-3 flex items-center gap-3
        text-white text-sm
        transition-all duration-300 ease-in-out
        transform
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
      role="alert"
      style={{ touchAction: "manipulation" }}
    >
      {type === "success" && (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === "error" && (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span className="flex-grow">{message}</span>
      <button
        onClick={() => onClose(id)}
        aria-label="Fermer"
        className="text-white opacity-70 hover:opacity-100 transition-opacity"
      >
        &#10005;
      </button>
    </div>
  );
}