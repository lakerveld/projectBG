import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({ href, icon: Icon, children, variant = "primary" }: ButtonLinkProps) {
  const styles =
    variant === "primary"
      ? "border-forest bg-forest text-white"
      : "border-line bg-panel text-ink";

  return (
    <Link
      className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-lg border px-4 text-base font-bold shadow-soft ${styles}`}
      href={href}
    >
      <Icon size={21} aria-hidden="true" />
      {children}
    </Link>
  );
}
