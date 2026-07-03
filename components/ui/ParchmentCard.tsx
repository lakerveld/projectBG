import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type ParchmentCardProps = {
  children: ReactNode;
  /** `raised` adds the gilded illuminated edge for hero surfaces. */
  variant?: "flat" | "raised";
  /** Render as a different element (e.g. "article", "li"). */
  as?: ElementType;
  className?: string;
};

/**
 * The base surface for every Chronicle component: an aged-parchment tile with a
 * hairline gold border and a soft drop shadow that reads well on the dark hall.
 */
export function ParchmentCard({
  children,
  variant = "flat",
  as,
  className
}: ParchmentCardProps) {
  const Tag = as ?? "div";

  return (
    <Tag
      className={cn(
        "parchment-face relative rounded-2xl border border-parchment-edge/70 text-sepia shadow-parchment",
        variant === "raised" && "illuminated",
        className
      )}
    >
      {children}
    </Tag>
  );
}
