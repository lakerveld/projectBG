import type { ResourceDefinition } from "./types";

export const GAME_SCHEMA_VERSION = 1;

export const DEFAULT_RULESET_PRESET = "original-mvp";

export const DEFAULT_PLAYER_COLOR_MODE = "curated";

export const DEFAULT_GAME_NAME = "Table Session";

export const MIN_PLAYERS = 2;

export const MAX_PLAYERS = 4;

export const CURATED_PLAYER_COLORS = [
  {
    label: "White",
    value: "#f3efe7",
    iconClassName: "text-night-deep"
  },
  {
    label: "Orange",
    value: "#d77a2d",
    iconClassName: "text-white"
  },
  {
    label: "Blue",
    value: "#2f6db3",
    iconClassName: "text-white"
  },
  {
    label: "Red",
    value: "#b33a3a",
    iconClassName: "text-white"
  }
] as const;

export const DEFAULT_RESOURCES: ResourceDefinition[] = [
  {
    id: "wheat",
    name: "Wheat",
    shortLabel: "WHT",
    color: "#c8942c"
  },
  {
    id: "wood",
    name: "Wood",
    shortLabel: "WOD",
    color: "#176b4d"
  },
  {
    id: "brick",
    name: "Brick",
    shortLabel: "BRK",
    color: "#b4472f"
  },
  {
    id: "sheep",
    name: "Sheep",
    shortLabel: "SHP",
    color: "#6d9f5c"
  },
  {
    id: "ore",
    name: "Ore",
    shortLabel: "ORE",
    color: "#66706a"
  }
];
