import type { AdjustResourcesCommand, CommandResult, GameState } from "./types";
import { createEntityId } from "./id";

export class ResourceCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResourceCommandError";
  }
}

export function adjustResources(command: AdjustResourcesCommand): CommandResult<GameState> {
  const { game, playerId, resourceId, delta } = command;

  if (!Number.isInteger(delta) || delta === 0) {
    throw new ResourceCommandError("Resource adjustment must be a non-zero integer.");
  }

  const player = game.players.find((candidate) => candidate.id === playerId);
  if (!player) {
    throw new ResourceCommandError("Player does not exist.");
  }

  const resource = game.resources.find((candidate) => candidate.id === resourceId);
  if (!resource) {
    throw new ResourceCommandError("Resource does not exist.");
  }

  const currentQuantity = player.resources[resourceId] ?? 0;
  const nextQuantity = currentQuantity + delta;

  if (nextQuantity < 0) {
    throw new ResourceCommandError("Resource quantity cannot go below zero.");
  }

  const now = command.now ?? new Date().toISOString();
  const idFactory = command.idFactory ?? cryptoRandomId;
  const nextPlayers = game.players.map((candidate) =>
    candidate.id === playerId
      ? {
          ...candidate,
          resources: {
            ...candidate.resources,
            [resourceId]: nextQuantity
          }
        }
      : candidate
  );

  const verb = delta > 0 ? "gained" : "spent";
  const absoluteDelta = Math.abs(delta);
  const reason = command.reason ? ` (${command.reason})` : "";
  const historyEntry = {
    id: idFactory(),
    type: "resource.adjusted" as const,
    playerId,
    createdAt: now,
    message: `${player.name} ${verb} ${absoluteDelta} ${resource.name}${reason}.`,
    metadata: {
      resourceId,
      delta,
      previousQuantity: currentQuantity,
      nextQuantity
    }
  };

  return {
    state: {
      ...game,
      updatedAt: now,
      players: nextPlayers,
      history: [historyEntry, ...game.history]
    },
    historyEntry
  };
}

function cryptoRandomId() {
  return createEntityId("history");
}
