"use client";

import React from "react";

interface PointsCardProps {
  points: number;
}

export default function PointsCard({ points }: PointsCardProps) {
  return (
    <div className="card animate-fade-in-delay-100 px-3 py-2 min-w-[120px]">
      <div className="flex items-baseline space-x-1">
        <p className="text-2xl font-bold text-primary">{points}</p>
        <p className="text-2xl font-bold text-sm text-muted">digits</p>
      </div>
    </div>
  );
}
