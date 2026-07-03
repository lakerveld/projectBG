import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variants = {
  primary: "border-forest bg-forest text-white",
  secondary: "border-line bg-panel text-ink",
  danger: "border-danger bg-danger text-white"
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold shadow-soft transition active:scale-[0.99] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

