import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/ui/cn";

type ParchmentCardProps = {
  children: ReactNode;
  /** `raised` adds a purple accent edge for hero surfaces. */
  variant?: "flat" | "raised";
  /** Render as a different element (e.g. "article", "li"). */
  as?: ElementType;
  className?: string;
};

/** Cream card with an ink border and a hard offset shadow. */
export function ParchmentCard({ children, variant = "flat", as, className }: ParchmentCardProps) {
  const Tag = as ?? "div";

  return (
    <Tag
      className={cn(
        "parchment-face relative rounded-2xl border-2 border-parchment-edge text-sepia shadow-parchment",
        variant === "raised" && "illuminated",
        className
      )}
    >
      {children}
    </Tag>
  );
}
