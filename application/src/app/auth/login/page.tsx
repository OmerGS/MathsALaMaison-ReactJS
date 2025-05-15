"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <div>
      <p>Bonjour !</p>
      <button onClick={() => router.push('/home')}>Aller vers /home</button>
    </div>
  );
}