import type { SVGProps } from "react";

export function PowderedSugarIcon({
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
      <path d="M3 13h18a9 9 0 0 1-18 0Z" />
      <path d="m5 13 5-6a2.6 2.6 0 0 1 4 0l5 6" />
      <path d="M8 21h8M8 3h.01M16 3h.01M12 10h.01" />
    </svg>
  );
}
