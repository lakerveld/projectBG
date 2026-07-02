import type { ButtonHTMLAttributes } from "react";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/ui/cn";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** royal = gilded primary, iron = quiet outline, ember = destructive, ghost = bare. */
  variant?: "royal" | "iron" | "ember" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  fullWidth?: boolean;
  loading?: boolean;
};

const VARIANTS = {
  royal:
    "border-[#8a5f18] bg-gradient-to-b from-gold-bright to-gold text-night-deep shadow-glow hover:shadow-glow-lg hover:brightness-105",
  iron: "border-parchment-edge/40 bg-white/5 text-parchment hover:bg-white/10 hover:border-parchment-edge/70",
  ember:
    "border-[#6f2417] bg-gradient-to-b from-[#c85a41] to-ember text-parchment shadow-seal hover:brightness-105",
  ghost: "border-transparent bg-transparent text-parchment/80 hover:text-parchment hover:bg-white/5"
} as const;

const SIZES = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-14 px-6 text-base"
} as const;

const ICON_SIZE = { sm: 15, md: 18, lg: 20 } as const;

/**
 * The primary command control. Uses the display face and a carved edge so a tap
 * target feels like pressing an engraved plate rather than a flat web button.
 */
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
