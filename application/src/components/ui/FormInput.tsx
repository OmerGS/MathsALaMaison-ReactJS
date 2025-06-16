"use client";

import React from 'react';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ className = "", ...props }: FormInputProps) {
  return (
    <input
      className={`w-4/5 max-w-md h-12 border border-gray-300 rounded-md px-3 mb-3 bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary-yellow ${className}`}
      {...props}
    />
  );
}
