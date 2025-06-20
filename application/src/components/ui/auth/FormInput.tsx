"use client";

import clsx from 'clsx';
import React from 'react';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ className = "", ...props }: FormInputProps) {
  return (
    <input
      className={clsx(
                  "w-full p-3 border border-gray-300 rounded-xl bg-white text-black",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
      {...props}
    />
  );
}
