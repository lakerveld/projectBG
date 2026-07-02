export type EntityId = string;

export type ResourceDefinition = {
  id: EntityId;
  name: string;
  shortLabel: string;
  color: string;
};

export type Player = {
  id: EntityId;
  name: string;
  color: string;
  resources: Record<EntityId, number>;
};

export type RulesetPreset = "original-mvp";

export type PlayerColorMode = "curated";

export type GameSetupStatus = "adding-players" | "ready" | "in-progress";

export type HistoryEntryType =
  | "game.created"
  | "game.started"
  | "dice.recorded"
  | "world_event.applied"
  | "player.added"
  | "resource.adjusted"
  | "correction.added";

export type HistoryEntry = {
  id: EntityId;
  type: HistoryEntryType;
  message: string;
  createdAt: string;
  playerId?: EntityId;
  metadata?: Record<string, unknown>;
};

export type GameState = {
  id: EntityId;
  name: string;
  rulesetPreset: RulesetPreset;
  playerColorMode: PlayerColorMode;
  setupStatus: GameSetupStatus;
  tableNote?: string;
  kingPlayerId?: EntityId;
  currentTurnPlayerId?: EntityId;
  round: number;
  currentRoundRolls: RoundRoll[];
  activeWorldEvent?: WorldEvent;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  resources: ResourceDefinition[];
  players: Player[];
  history: HistoryEntry[];
};

export type RoundRoll = {
  playerId: EntityId;
  total: number;
};

export type WorldEventCategory = "positive_world" | "neutral_world" | "negative_world";

export type WorldEventSeverity = "minor" | "medium" | "major";

export type WorldEventDuration = "instant" | "1_round" | "2_rounds";

export type WorldEvent = {
  id: string;
  name: string;
  description: string;
  trigger: "end_of_round";
  category: WorldEventCategory;
  targeting: "global";
  severity: WorldEventSeverity;
  duration: WorldEventDuration;
  effectsApplied: string[];
  mvp: boolean;
};

export type AdjustResourcesCommand = {
  game: GameState;
  playerId: EntityId;
  resourceId: EntityId;
  delta: number;
  reason?: string;
  now?: string;
  idFactory?: () => EntityId;
};

export type CreateGameCommand = {
  name?: string;
  rulesetPreset?: RulesetPreset;
  playerColorMode?: PlayerColorMode;
  players?: CreateGamePlayerInput[];
  now?: string;
  idFactory?: () => EntityId;
};

export type CreateGamePlayerInput = {
  name: string;
  color: string;
};

export type StartGameCommand = {
  game: GameState;
  now?: string;
  idFactory?: () => EntityId;
  random?: () => number;
};

export type RecordDiceRollCommand = {
  game: GameState;
  total: number;
  now?: string;
  idFactory?: () => EntityId;
};

export type CommandResult<TState> = {
  state: TState;
  historyEntry: HistoryEntry;
  historyEntries?: HistoryEntry[];
};
