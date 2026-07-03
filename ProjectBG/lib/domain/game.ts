import {
  DEFAULT_PLAYER_COLOR_MODE,
  DEFAULT_GAME_NAME,
  DEFAULT_RESOURCES,
  DEFAULT_RULESET_PRESET,
  GAME_SCHEMA_VERSION,
  MAX_PLAYERS,
  MIN_PLAYERS
} from "./defaults";
import { createEntityId } from "./id";
import type { CommandResult, CreateGameCommand, GameState, StartGameCommand } from "./types";

export class CreateGameCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateGameCommandError";
  }
}

export function createGame(command: CreateGameCommand): CommandResult<GameState> {
  const name = command.name?.trim() || DEFAULT_GAME_NAME;
  const players = command.players ?? [];

  if (name.length > 60) {
    throw new CreateGameCommandError("Game name must be 60 characters or fewer.");
  }

  if (players.length < MIN_PLAYERS) {
    throw new CreateGameCommandError(`Add at least ${MIN_PLAYERS} players.`);
  }

  if (players.length > MAX_PLAYERS) {
    throw new CreateGameCommandError(`Add no more than ${MAX_PLAYERS} players.`);
  }

  const normalizedPlayers = players.map((player) => ({
    ...player,
    name: player.name.trim()
  }));

  const emptyPlayer = normalizedPlayers.find((player) => !player.name);
  if (emptyPlayer) {
    throw new CreateGameCommandError("Every player needs a name.");
  }

  const playerNames = normalizedPlayers.map((player) => player.name.toLocaleLowerCase());
  const uniquePlayerNames = new Set(playerNames);
  if (uniquePlayerNames.size !== playerNames.length) {
    throw new CreateGameCommandError("Player names must be unique.");
  }

  const playerColors = normalizedPlayers.map((player) => player.color);
  const uniquePlayerColors = new Set(playerColors);
  if (uniquePlayerColors.size !== playerColors.length) {
    throw new CreateGameCommandError("Player colors must be unique.");
  }

  const now = command.now ?? new Date().toISOString();
  const idFactory = command.idFactory ?? (() => createEntityId("game"));
  const gameId = idFactory();
  const historyId = idFactory();
  const startingResources = DEFAULT_RESOURCES.reduce<Record<string, number>>((resources, resource) => {
    resources[resource.id] = 0;
    return resources;
  }, {});

  const historyEntry = {
    id: historyId,
    type: "game.created" as const,
    createdAt: now,
    message: `${name} created.`,
    metadata: {
      rulesetPreset: command.rulesetPreset ?? DEFAULT_RULESET_PRESET,
      playerColorMode: command.playerColorMode ?? DEFAULT_PLAYER_COLOR_MODE
    }
  };

  return {
    state: {
      id: gameId,
      name,
      rulesetPreset: command.rulesetPreset ?? DEFAULT_RULESET_PRESET,
      playerColorMode: command.playerColorMode ?? DEFAULT_PLAYER_COLOR_MODE,
      setupStatus: "ready",
      round: 0,
      currentRoundRolls: [],
      schemaVersion: GAME_SCHEMA_VERSION,
      createdAt: now,
      updatedAt: now,
      resources: DEFAULT_RESOURCES,
      players: normalizedPlayers.map((player) => ({
        id: idFactory(),
        name: player.name,
        color: player.color,
        avatarId: player.avatarId,
        resources: { ...startingResources }
      })),
      history: [historyEntry]
    },
    historyEntry
  };
}

export class StartGameCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StartGameCommandError";
  }
}

export function startGame(command: StartGameCommand): CommandResult<GameState> {
  const { game } = command;

  if (game.players.length < MIN_PLAYERS) {
    throw new StartGameCommandError(`Start requires at least ${MIN_PLAYERS} players.`);
  }

  if (game.setupStatus === "in-progress") {
    throw new StartGameCommandError("Game has already started.");
  }

  const now = command.now ?? new Date().toISOString();
  const idFactory = command.idFactory ?? (() => createEntityId("history"));
  const random = command.random ?? Math.random;
  const kingIndex = Math.min(Math.floor(random() * game.players.length), game.players.length - 1);
  const king = game.players[kingIndex];

  if (!king) {
    throw new StartGameCommandError("Unable to select a King.");
  }

  const historyEntry = {
    id: idFactory(),
    type: "game.started" as const,
    createdAt: now,
    playerId: king.id,
    message: `${king.name} was crowned King and takes the first turn.`,
    metadata: {
      kingPlayerId: king.id,
      round: 1
    }
  };

  return {
    state: {
      ...game,
      setupStatus: "in-progress",
      kingPlayerId: king.id,
      currentTurnPlayerId: king.id,
      round: 1,
      currentRoundRolls: [],
      updatedAt: now,
      history: [historyEntry, ...game.history]
    },
    historyEntry
  };
}
