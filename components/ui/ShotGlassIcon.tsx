import type { SVGProps } from "react";

export function ShotGlassIcon({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 4h14l-2 16H7L5 4Z" />
      <path d="M6 9h12M7 17h10" />
    </svg>
  );
}
