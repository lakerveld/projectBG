"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/ui/cn";

export type EventParticleType = "positive" | "neutral" | "negative";
export type EventParticleIntensity = "low" | "medium" | "high";

type EventParticleOverlayProps = {
  type: EventParticleType;
  intensity?: EventParticleIntensity;
  className?: string;
};

const PARTICLE_STYLE: Record<EventParticleType, { color: string; colorSoft: string }> = {
  positive: { color: "#F6B94B", colorSoft: "#FFD76A" },
  neutral: { color: "#4ADE80", colorSoft: "#7CFF9B" },
  negative: { color: "#DC2626", colorSoft: "#FF5A4F" }
};

const INTENSITY_STYLE: Record<EventParticleIntensity, { speed: string; opacity: string }> = {
  low: { speed: "22s", opacity: "0.55" },
  medium: { speed: "18s", opacity: "0.7" },
  high: { speed: "14s", opacity: "0.82" }
};

export function EventParticleOverlay({
  type,
  intensity = "high",
  className
}: EventParticleOverlayProps) {
  const particleStyle = PARTICLE_STYLE[type];
  const intensityStyle = INTENSITY_STYLE[intensity];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "event-particles pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      style={
        {
          "--particle-color": particleStyle.color,
          "--particle-color-soft": particleStyle.colorSoft,
          "--particle-speed": intensityStyle.speed,
          "--particle-opacity": intensityStyle.opacity
        } as CSSProperties
      }
    />
  );
}
