"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/ui/Spinner";

export default function UserAccessControl({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
        <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl shadow-2xl border border-neutral-200 animate-fade-in">
          <Spinner />
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-900 tracking-tight">
              Patientez un instant...
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              On vérifie que tout est prêt pour vous accueillir.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}