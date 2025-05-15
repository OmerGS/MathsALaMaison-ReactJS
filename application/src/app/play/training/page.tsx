"use client";

import { useRouter } from "next/navigation";

export default function Training() {
  const router = useRouter();

  return (
    <div>
      <p>Bonjour !</p>
      <button onClick={() => router.push('/')}>Aller vers /home</button>
    </div>
  );
}