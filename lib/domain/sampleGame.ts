import type { GameState } from "./types";
import { CURATED_PLAYER_COLORS, DEFAULT_RESOURCES, GAME_SCHEMA_VERSION } from "./defaults";

const now = "2026-07-02T09:00:00.000Z";

export const sampleGame: GameState = {
  id: "game-sprint-1",
  name: "Demo Table",
  rulesetPreset: "original-mvp",
  playerColorMode: "curated",
  setupStatus: "ready",
  kingPlayerId: null,
  playersWhoHaveBeenKing: [],
  currentTurnPlayerId: null,
  completedRoundsSinceCrown: 0,
  isCrownSelectionPending: false,
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
      color: CURATED_PLAYER_COLORS[0]?.value ?? "#f3efe7",
      victoryPoints: 0,
      resources: {
        wheat: 2,
        wood: 1,
        brick: 0,
        sheep: 0,
        ore: 0
      }
    },
    {
      id: "player-2",
      name: "South",
      color: CURATED_PLAYER_COLORS[1]?.value ?? "#d77a2d",
      victoryPoints: 0,
      resources: {
        wheat: 1,
        wood: 2,
        brick: 0,
        sheep: 1,
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
