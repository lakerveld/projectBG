import { createEntityId } from "./id";
import { calculateRoundAverage, selectWorldEventForAverage } from "./events";
import type { CommandResult, GameState, RecordDiceRollCommand } from "./types";

export const MIN_DICE_TOTAL = 2;
export const MAX_DICE_TOTAL = 12;

export class DiceCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiceCommandError";
  }
}

export function recordDiceRoll(command: RecordDiceRollCommand): CommandResult<GameState> {
  const { game, total } = command;

  if (game.setupStatus !== "in-progress") {
    throw new DiceCommandError("Start the game before entering dice.");
  }

  if (!Number.isInteger(total)) {
    throw new DiceCommandError("Dice total must be a whole number.");
  }

  if (total < MIN_DICE_TOTAL || total > MAX_DICE_TOTAL) {
    throw new DiceCommandError("Dice total must be between 2 and 12.");
  }

  const activePlayer = game.players.find((player) => player.id === game.currentTurnPlayerId);
  if (!activePlayer) {
    throw new DiceCommandError("Current turn player is missing.");
  }

  const now = command.now ?? new Date().toISOString();
  const idFactory = command.idFactory ?? (() => createEntityId("history"));
  const currentRoundRolls = game.currentRoundRolls ?? [];

  if (currentRoundRolls.some((roll) => roll.playerId === activePlayer.id)) {
    throw new DiceCommandError("Current player has already rolled this round.");
  }

  const nextRoundRolls = [
    ...currentRoundRolls,
    {
      playerId: activePlayer.id,
      total
    }
  ];
  const hasCompletedRound = nextRoundRolls.length >= game.players.length;
  const nextPlayer = findNextPlayer(game, activePlayer.id);
  const historyEntry = {
    id: idFactory(),
    type: "dice.recorded" as const,
    createdAt: now,
    playerId: activePlayer.id,
    message: `${activePlayer.name} entered dice total ${total}.`,
    metadata: {
      total,
      round: game.round,
      resourceUpdateStatus: "deferred",
      momentumUpdateStatus: "deferred",
      worldEventStatus: hasCompletedRound ? "applied" : "waiting_for_round_end"
    }
  };

  if (hasCompletedRound) {
    const averageRoll = calculateRoundAverage(nextRoundRolls);
    const worldEvent = selectWorldEventForAverage(averageRoll);
    const eventHistoryEntry = {
      id: idFactory(),
      type: "world_event.applied" as const,
      createdAt: now,
      message: `${worldEvent.name} affected the world after round ${game.round}.`,
      metadata: {
        roundNumber: game.round,
        rolls: nextRoundRolls.map((roll) => roll.total),
        averageRoll,
        expectedAverage: 7,
        eventId: worldEvent.id,
        eventName: worldEvent.name,
        category: worldEvent.category,
        effectsApplied: worldEvent.effectsApplied
      }
    };

    return {
      state: {
        ...game,
        activeWorldEvent: worldEvent,
        currentRoundRolls: [],
        currentTurnPlayerId: game.kingPlayerId ?? game.players[0]?.id,
        round: game.round + 1,
        updatedAt: now,
        history: [eventHistoryEntry, historyEntry, ...game.history]
      },
      historyEntry: eventHistoryEntry,
      historyEntries: [eventHistoryEntry, historyEntry]
    };
  }

  return {
    state: {
      ...game,
      currentRoundRolls: nextRoundRolls,
      currentTurnPlayerId: nextPlayer.id,
      updatedAt: now,
      history: [historyEntry, ...game.history]
    },
    historyEntry,
    historyEntries: [historyEntry]
  };
}

function findNextPlayer(game: GameState, currentPlayerId: string) {
  const currentIndex = game.players.findIndex((player) => player.id === currentPlayerId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % game.players.length;
  const nextPlayer = game.players[nextIndex];

  if (!nextPlayer) {
    throw new DiceCommandError("Next turn player is missing.");
  }

  return nextPlayer;
}
