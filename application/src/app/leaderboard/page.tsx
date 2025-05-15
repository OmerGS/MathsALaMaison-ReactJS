"use client";

import { useRouter } from "next/navigation";

export default function LeaderBoard() {
  const router = useRouter();

  return (
    <div>
      <p>Bonjour !</p>
      <button onClick={() => router.push('/')}>Aller vers /home</button>
    </div>
  );
}