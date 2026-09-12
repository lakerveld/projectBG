import type { ButtonHTMLAttributes } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/ui/cn";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Lime primary, cream secondary, pink destructive, or bare control. */
  variant?: "royal" | "iron" | "ember" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
  loading?: boolean;
};

const VARIANTS = {
  royal: "trippy-button bg-gold-bright text-night-deep",
  iron: "trippy-button bg-parchment text-sepia hover:bg-[#f6d9ef]",
  ember: "trippy-button bg-ember text-white",
  ghost: "border-transparent bg-transparent text-inherit hover:bg-arcane/15"
} as const;

const SIZES = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-14 px-6 text-base"
} as const;

const ICON_SIZE = { sm: 15, md: 18, lg: 20 } as const;

/** Bold command control with a tactile offset shadow. */
export function ActionButton({
  variant = "royal",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  fullWidth,
  loading,
  className,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const iconSize = ICON_SIZE[size];

  return (
    <button
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl border font-display font-bold uppercase tracking-wide transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-night",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={iconSize} strokeWidth={2.3} aria-hidden="true" />
      ) : null}
      {children}
      {IconRight && !loading ? (
        <IconRight
          size={iconSize}
          strokeWidth={2.3}
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}
