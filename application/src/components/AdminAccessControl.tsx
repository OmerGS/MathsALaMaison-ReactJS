"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAccess } from "@/services/adminAPI";
import Spinner from "@/components/ui/global/Spinner";

interface AdminAccessControlProps {
  children: ReactNode;
}

export default function AdminAccessControl({ children }: AdminAccessControlProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      try {
        const res = await checkAdminAccess();
        console.log("checkAdminAccess response:", res);
        
        if (!isMounted) return;

        let succesfulResponse = (res.status === 200 || res.status === 304);
        setIsAdmin(succesfulResponse);
      } catch {
        if (!isMounted) return;
        setIsAdmin(false);
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log("AdminAccessControl: isAdmin state changed:", isAdmin);
    if (isAdmin === false) {
      router.replace("/auth/login");
    }
  }, [isAdmin, router]);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Spinner />
        <p>Vérification des droits d'accès...</p>
      </div>
    );
  }

  if (isAdmin === true) {
    return <>{children}</>;
  }

  return null;
}