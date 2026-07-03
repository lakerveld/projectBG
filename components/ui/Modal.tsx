"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/ui/cn";
import { Seal } from "./Seal";
import type { Tone } from "@/lib/ui/eventVisuals";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  tone?: Tone;
  children?: ReactNode;
  /** Action row pinned to the foot of the dialog. */
  footer?: ReactNode;
  size?: "sm" | "md";
  className?: string;
};

/**
 * An unfurled scroll presented over a darkened hall. Closes on backdrop click and
 * Escape, locks background scroll, and returns focus to the opener on dismiss.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  tone = "gold",
  children,
  footer,
  size = "md",
  className
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    cardRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="veil-in fixed inset-0 z-50 flex items-end justify-center bg-night-deep/75 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "scroll-in parchment-face illuminated relative w-full overflow-hidden rounded-3xl border border-parchment-edge/70 text-sepia shadow-parchment outline-none",
          size === "sm" ? "max-w-sm" : "max-w-md",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-parchment-edge/70 bg-[#e6d7b4]/60 text-sepia-muted transition hover:text-sepia focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="px-6 pb-6 pt-7">
          <div className="flex items-start gap-3.5">
            {icon ? <Seal icon={icon} tone={tone} size="md" /> : null}
            <div className="min-w-0 flex-1 pr-6">
              <h2 id={titleId} className="font-display text-xl font-bold leading-tight text-sepia">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="mt-1.5 font-body text-sm leading-6 text-sepia/85">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {children ? <div className="mt-4">{children}</div> : null}
        </div>

        {footer ? (
          <div className="flex justify-end gap-2.5 border-t border-parchment-edge/60 bg-[#e6d7b4]/40 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
