'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoggedOutHomePage() {
  const router = useRouter();

  return (
    <div className="flex w-screen h-screen">
      <div className="flex-1 relative bg-blue-50 flex flex-col justify-center items-center p-8">
        <button
          className="absolute top-4 left-4 text-2xl bg-transparent border-none cursor-pointer"
          onClick={() => router.push('/SettingsScreen')}
        >
          ⚙️
        </button>

        <div className="flex flex-col gap-4 items-center">
          <button
            className="px-8 py-3 bg-blue-700 text-white rounded-lg cursor-pointer text-lg font-semibold min-w-[160px]"
            onClick={() => router.push('/SignupScreen')}
          >
            S'inscrire
          </button>
          <p className="font-bold text-base m-0">OU</p>
          <button
            className="px-8 py-3 bg-blue-700 text-white rounded-lg cursor-pointer text-lg font-semibold min-w-[160px]"
            onClick={() => router.push('/LoginScreen')}
          >
            Se Connecter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-blue-300 flex flex-col justify-center items-center gap-4 p-8">
        <Image
          src="/icons/icon-192x192.png"
          alt="logo"
          width={200}
          height={200}
          priority
        />
        <button
          className="mt-4 px-8 py-3 bg-blue-700 text-white rounded-lg cursor-pointer text-lg font-semibold min-w-[160px]"
          onClick={() => router.push('/TrainingScreen')}
        >
          Essayer
        </button>
      </div>
    </div>
  );
}
