"use client";

import React, { Suspense } from "react";
import InvitationCard from "./InvitationCard";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <InvitationCard />
    </Suspense>
  );
}