import type { WorldEvent, WorldEventCategory } from "@/lib/domain/types";

type WorldEventRevealVisual = {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
};

const CATEGORY_EYEBROW: Record<WorldEventCategory, string> = {
  positive: "Bonus",
  tactical: "Tactical",
  negative: "Penalty"
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
  "bush-thief-captured": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Traveling Merchant.webp",
    imageAlt: "A captured outlaw being marched through a fantasy village.",
    eyebrow: "Bonus"
  },
  "hidden-treasure": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Hay.webp",
    imageAlt: "A hidden treasure chest uncovered near a frontier path.",
    eyebrow: "Bonus"
  },
  "shared-wealth": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/MArket day.webp",
    imageAlt: "A royal treasury opened for the whole realm.",
    eyebrow: "Bonus"
  },
  "royal-celebration": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A royal celebration with banners and feast tables.",
    eyebrow: "Bonus"
  },
  "royal-favor": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A royal decree granting favor across the realm.",
    eyebrow: "Tactical"
  },
  "prosperous-cities": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/MArket day.webp",
    imageAlt: "Busy prosperous cities thriving under strong trade.",
    eyebrow: "Bonus"
  },
  "traveling-merchant": {
    imageSrc: "/events/Traveling Merchant.webp",
    imageAlt: "A traveling fantasy merchant with rare goods.",
    eyebrow: "Tactical"
  },
  "market-day": {
    imageSrc: "/events/MArket day.webp",
    imageAlt: "A lively medieval market day.",
    eyebrow: "Tactical"
  },
  "bush-thief": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Traveling Merchant.webp",
    imageAlt: "A bush thief waiting near the roadside for a careless traveler.",
    eyebrow: "Tactical"
  },
  "bribe-the-bush-thief": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Traveling Merchant.webp",
    imageAlt: "A secret bribe passed to an outlaw in the brush.",
    eyebrow: "Tactical"
  },
  "secret-hideout": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Forrest fire.webp",
    imageAlt: "A hidden outlaw shelter tucked deep inside a forest trail.",
    eyebrow: "Tactical"
  },
  "kings-tournament": {
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A royal fantasy tournament hosted by the king.",
    eyebrow: "Tactical"
  },
  "royal-decree": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A royal decree being read before the court.",
    eyebrow: "Tactical"
  },
  "master-builders": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Hay.webp",
    imageAlt: "Master builders preparing materials beside a growing town.",
    eyebrow: "Tactical"
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
  },
  "night-raid": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Heavy Storm.webp",
    imageAlt: "A night raid striking a sleeping settlement.",
    eyebrow: "Penalty"
  },
  "royal-taxation": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A stern royal tax collector demanding payment from the realm.",
    eyebrow: "Penalty"
  },
  "abuse-of-power": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/Kings tournament.webp",
    imageAlt: "A harsh royal court bending the rules for private gain.",
    eyebrow: "Penalty"
  },
  "costly-cities": {
    // TODO: Replace with final artwork for this event
    imageSrc: "/events/MArket day.webp",
    imageAlt: "City builders paying inflated prices in a crowded market.",
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
