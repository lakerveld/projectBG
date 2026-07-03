import type { WorldEvent, WorldEventCategory } from "@/lib/domain/types";

type WorldEventRevealVisual = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
};

const CATEGORY_EYEBROW: Record<WorldEventCategory, string> = {
  positive_world: "Bonus",
  neutral_world: "Neutral",
  negative_world: "Penalty"
};

const EVENT_REVEAL_VISUALS: Record<string, WorldEventRevealVisual> = {
  "great-harvest": {
    imageSrc: "/events/Hay.webp",
    imageAlt: "A golden hay field after a great harvest.",
    eyebrow: "Bonus"
  },
  "golden-roads": {
    imageSrc: "/events/Hay.webp",
    imageAlt: "A sunlit rural kingdom road through golden fields.",
    eyebrow: "Bonus"
  },
  "calm-seas": {
    imageSrc: "/events/Calm seas.webp",
    imageAlt: "Calm fantasy seas with merchant ships.",
    eyebrow: "Bonus"
  },
  "traveling-merchant": {
    imageSrc: "/events/Traveling Merchant.webp",
    imageAlt: "A traveling fantasy merchant with rare goods.",
    eyebrow: "Neutral"
  },
  "market-day": {
    imageSrc: "/events/MArket day.webp",
    imageAlt: "A lively medieval market day.",
    eyebrow: "Neutral"
  },
  "kings-tournament": {
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A royal fantasy tournament hosted by the king.",
    eyebrow: "Neutral"
  },
  drought: {
    imageSrc: "/events/drought.webp",
    imageAlt: "Dry cracked wheat fields under harsh sun.",
    eyebrow: "Penalty"
  },
  "forest-fire": {
    imageSrc: "/events/Forrest fire.webp",
    imageAlt: "A fantasy forest fire spreading through woodland.",
    eyebrow: "Penalty"
  },
  "heavy-storms": {
    imageSrc: "/events/Heavy Storm.webp",
    imageAlt: "Heavy storms over a fantasy kingdom road.",
    eyebrow: "Penalty"
  }
};

const FALLBACK_REVEAL_VISUAL: WorldEventRevealVisual = {
  imageSrc: "/events/Hay.webp",
  imageAlt: "A fantasy world event illustration.",
  eyebrow: "World Event"
};

export function getWorldEventRevealVisual(event: WorldEvent): WorldEventRevealVisual {
  const eventVisual = EVENT_REVEAL_VISUALS[event.id];

  if (eventVisual) {
    return eventVisual;
  }

  return {
    ...FALLBACK_REVEAL_VISUAL,
    eyebrow: CATEGORY_EYEBROW[event.category]
  };
}
