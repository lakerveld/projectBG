import type { ResourceDefinition } from "./types";

export const GAME_SCHEMA_VERSION = 1;

export const DEFAULT_RULESET_PRESET = "original-mvp";

export const DEFAULT_PLAYER_COLOR_MODE = "curated";

export const DEFAULT_GAME_NAME = "Table Session";

export const MIN_PLAYERS = 2;

export const MAX_PLAYERS = 6;

export const CURATED_PLAYER_COLORS = [
  "#b33a3a",
  "#2f6db3",
  "#176b4d",
  "#c8942c",
  "#6d4db3",
  "#16888a"
];

export const DEFAULT_RESOURCES: ResourceDefinition[] = [
  {
    id: "grain",
    name: "Grain",
    shortLabel: "GRN",
    color: "#c8942c"
  },
  {
    id: "timber",
    name: "Timber",
    shortLabel: "TMB",
    color: "#176b4d"
  },
  {
    id: "ore",
    name: "Ore",
    shortLabel: "ORE",
    color: "#66706a"
  }
];
