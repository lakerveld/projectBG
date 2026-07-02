import { describe, expect, it } from "vitest";
import { createGame, startGame } from "./game";
import { DiceCommandError, recordDiceRoll } from "./dice";

function createStartedGame() {
  const created = createGame({
    players: [
      { name: "Ada", color: "#b33a3a" },
      { name: "Lin", color: "#2f6db3" }
    ],
    idFactory: (() => {
      const ids = ["game-test", "created-history", "player-ada", "player-lin"];
      return () => ids.shift() ?? "fallback";
    })()
  });

  return startGame({
    game: created.state,
    random: () => 0,
    idFactory: () => "started-history"
  }).state;
}

describe("recordDiceRoll", () => {
  it("records a valid dice total and advances to the next player", () => {
    const result = recordDiceRoll({
      game: createStartedGame(),
      total: 8,
      now: "2026-07-02T13:00:00.000Z",
      idFactory: () => "dice-history"
    });

    expect(result.historyEntry.type).toBe("dice.recorded");
    expect(result.historyEntry.playerId).toBe("player-ada");
    expect(result.historyEntry.message).toBe("Ada entered dice total 8.");
    expect(result.historyEntry.metadata?.total).toBe(8);
    expect(result.historyEntry.metadata?.worldEventStatus).toBe("waiting_for_round_end");
    expect(result.state.currentRoundRolls).toEqual([{ playerId: "player-ada", total: 8 }]);
    expect(result.state.currentTurnPlayerId).toBe("player-lin");
  });

  it("applies a neutral world event when all players have rolled around average", () => {
    const afterFirstRoll = recordDiceRoll({
      game: createStartedGame(),
      total: 8,
      idFactory: () => "dice-history-1"
    });

    const result = recordDiceRoll({
      game: afterFirstRoll.state,
      total: 6,
      now: "2026-07-02T13:05:00.000Z",
      idFactory: (() => {
        const ids = ["dice-history-2", "event-history"];
        return () => ids.shift() ?? "fallback";
      })()
    });

    expect(result.historyEntry.type).toBe("world_event.applied");
    expect(result.historyEntry.message).toBe("Market Day affected the world after round 1.");
    expect(result.historyEntry.metadata?.averageRoll).toBe(7);
    expect(result.historyEntry.metadata?.category).toBe("neutral_world");
    expect(result.state.activeWorldEvent?.id).toBe("market-day");
    expect(result.state.currentRoundRolls).toEqual([]);
    expect(result.state.round).toBe(2);
    expect(result.state.history[0]?.type).toBe("world_event.applied");
    expect(result.state.history[1]?.type).toBe("dice.recorded");
  });

  it("rejects dice totals below two", () => {
    expect(() => recordDiceRoll({ game: createStartedGame(), total: 1 })).toThrow(
      DiceCommandError
    );
  });

  it("rejects dice totals above twelve", () => {
    expect(() => recordDiceRoll({ game: createStartedGame(), total: 13 })).toThrow(
      DiceCommandError
    );
  });

  it("rejects dice entry before the game starts", () => {
    const created = createGame({
      players: [
        { name: "Ada", color: "#b33a3a" },
        { name: "Lin", color: "#2f6db3" }
      ]
    });

    expect(() => recordDiceRoll({ game: created.state, total: 7 })).toThrow(DiceCommandError);
  });
});
