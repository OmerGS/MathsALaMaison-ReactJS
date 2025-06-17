"use client";

import { PlayerProvider } from "@/context/PlayerContext";

export default function LocalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      {children}
    </PlayerProvider>
  );
}
