import type { GameState } from "./types";
import { DEFAULT_RESOURCES, GAME_SCHEMA_VERSION } from "./defaults";

const now = "2026-07-02T09:00:00.000Z";

export const sampleGame: GameState = {
  id: "game-sprint-1",
  name: "Demo Table",
  rulesetPreset: "original-mvp",
  playerColorMode: "curated",
  setupStatus: "ready",
  round: 0,
  currentRoundRolls: [],
  schemaVersion: GAME_SCHEMA_VERSION,
  createdAt: now,
  updatedAt: now,
  resources: DEFAULT_RESOURCES,
  players: [
    {
      id: "player-1",
      name: "North",
      color: "#b33a3a",
      resources: {
        grain: 2,
        timber: 1,
        ore: 0
      }
    },
    {
      id: "player-2",
      name: "South",
      color: "#2f6db3",
      resources: {
        grain: 1,
        timber: 2,
        ore: 1
      }
    }
  ],
  history: [
    {
      id: "history-1",
      type: "game.created",
      createdAt: now,
      message: "Demo Table created."
    }
  ]
};
