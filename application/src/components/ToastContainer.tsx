"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";

type ToastType = "success" | "error";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

const ToastContainer = forwardRef<
  { addToast: (type: ToastType, message: string) => void },
  {}
>((props, ref) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useImperativeHandle(ref, () => ({
    addToast(type: ToastType, message: string) {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
  }));

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 max-w-xs w-full px-2 z-50">
      {toasts.map(({ id, type, message }) => (
        <div
          key={id}
          className={`rounded-lg shadow-lg px-5 py-3 flex items-center gap-3 text-white text-sm
            ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
          role="alert"
        >
          {type === "success" ? (
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
          ) : (
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
});

ToastContainer.displayName = "ToastContainer";

export default ToastContainer;