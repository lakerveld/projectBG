import type { SVGProps } from "react";

/** A stack of cards with a sparkle, distinct from the individual resource symbols. */
export function DevelopmentCardsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 18H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v1" />
      <rect x="6" y="7" width="15" height="15" rx="2" />
      <path d="m13.5 10 1.3 3.2L18 14.5l-3.2 1.3-1.3 3.2-1.3-3.2L9 14.5l3.2-1.3Z" />
    </svg>
  );
}
