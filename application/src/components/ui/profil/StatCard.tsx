"use client";

import Image from "next/image";

type Props = {
  label: string;
  value: string | number;
  icon: string;
};

export default function StatCard({ label, value, icon }: Props) {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800 px-4 py-6 rounded-xl w-full max-w-[180px] shadow-md hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-2">
        <Image src={icon} alt={label} fill className="object-contain" />
      </div>
      <p className="text-sm sm:text-base text-center font-medium">{label}</p>
      <p className="text-lg sm:text-xl font-bold">{value}</p>
    </div>
  );
}
