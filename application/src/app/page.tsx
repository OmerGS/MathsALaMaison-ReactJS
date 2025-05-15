"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ padding: "2rem" }}>
      <p>Bonjour !</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
        {/* Auth */}
        <button onClick={() => router.push('/auth/login')}>Aller vers /auth/login</button>
        <button onClick={() => router.push('/auth/reset')}>Aller vers /auth/reset</button>
        <button onClick={() => router.push('/auth/signup')}>Aller vers /auth/signup</button>

        {/* Leaderboard */}
        <button onClick={() => router.push('/leaderboard')}>Aller vers /leaderboard</button>

        {/* Play */}
        <button onClick={() => router.push('/play/matchmaking')}>Aller vers /play/matchmaking</button>
        <button onClick={() => router.push('/play/question-list')}>Aller vers /play/question-list</button>
        <button onClick={() => router.push('/play/training')}>Aller vers /play/training</button>

        {/* Profile */}
        <button onClick={() => router.push('/profile/edit')}>Aller vers /profile/edit</button>

        {/* Settings */}
        <button onClick={() => router.push('/settings/change-email')}>Aller vers /settings/change-email</button>
        <button onClick={() => router.push('/settings/change-password')}>Aller vers /settings/change-password</button>
        <button onClick={() => router.push('/settings/change-username')}>Aller vers /settings/change-username</button>
      </div>
    </div>
  );
}
