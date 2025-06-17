"use client";

import { useRouter } from "next/navigation";
import EndGame from "./endGame";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EndGamePage() {
  const router = useRouter();

  const handleReplay = () => {
    router.push("/play/local");
    localStorage.setItem("localGameStarted", "false");
  };

  const handleQuit = () => {
    router.push("/");
    localStorage.setItem("localGameStarted", "false");
  };

  return (
    <ProtectedRoute>
        <EndGame onReplay={handleReplay} onQuit={handleQuit} />;
    </ProtectedRoute>
  );
}
