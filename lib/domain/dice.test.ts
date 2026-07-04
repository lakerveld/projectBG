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

  it("applies a tactical world event when all players have rolled around average", () => {
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
      })(),
      random: () => 0.2
    });

    expect(result.historyEntry.type).toBe("world_event.applied");
    expect(result.historyEntry.message).toBe("Market Day affected the world for round 2.");
    expect(result.historyEntry.metadata?.averageRoll).toBe(7);
    expect(result.historyEntry.metadata?.category).toBe("tactical");
    expect(result.state.activeWorldEvent?.id).toBe("market-day");
    expect(result.state.currentRoundRolls).toEqual([]);
    expect(result.state.round).toBe(2);
    expect(result.state.history[0]?.type).toBe("world_event.applied");
    expect(result.state.history[1]?.type).toBe("dice.recorded");
  });

  it("applies Great Harvest wheat gains immediately", () => {
    const afterFirstRoll = recordDiceRoll({
      game: createStartedGame(),
      total: 10,
      idFactory: () => "dice-history-1"
    });

    const result = recordDiceRoll({
      game: afterFirstRoll.state,
      total: 10,
      idFactory: (() => {
        const ids = ["dice-history-2", "event-history"];
        return () => ids.shift() ?? "fallback";
      })(),
      random: () => 0
    });

    expect(result.state.activeWorldEvent?.id).toBe("great-harvest");
    expect(result.state.players[0]?.resources.wheat).toBe(2);
    expect(result.state.players[1]?.resources.wheat).toBe(2);
    expect(result.historyEntry.metadata?.resourceAdjustments).toEqual([
      { playerId: "player-ada", resourceId: "wheat", delta: 2 },
      { playerId: "player-lin", resourceId: "wheat", delta: 2 }
    ]);
  });

  it("can select a negative world event from low round averages", () => {
    const afterFirstRoll = recordDiceRoll({
      game: createStartedGame(),
      total: 4,
      idFactory: () => "dice-history-1"
    });

    const result = recordDiceRoll({
      game: afterFirstRoll.state,
      total: 4,
      idFactory: (() => {
        const ids = ["dice-history-2", "event-history"];
        return () => ids.shift() ?? "fallback";
      })(),
      random: () => 0.2
    });

    expect(result.state.activeWorldEvent?.id).toBe("forest-fire");
    expect(result.historyEntry.metadata?.category).toBe("negative");
  });

  it("flags crown selection after every third completed round", () => {
    let game = createStartedGame();
    let result;

    for (let round = 0; round < 3; round += 1) {
      result = recordDiceRoll({
        game,
        total: 8,
        idFactory: () => `dice-history-a-${round}`
      });
      game = result.state;

      result = recordDiceRoll({
        game,
        total: 6,
        idFactory: (() => {
          const ids = [`dice-history-b-${round}`, `event-history-${round}`];
          return () => ids.shift() ?? "fallback";
        })(),
        random: () => 0.2
      });
      game = result.state;
    }

    expect(game.round).toBe(4);
    expect(game.completedRoundsSinceCrown).toBe(3);
    expect(game.isCrownSelectionPending).toBe(true);
    expect(game.currentTurnPlayerId).toBe("player-ada");
  });

  it("rejects dice entry while crown selection is pending", () => {
    const started = createStartedGame();

    expect(() =>
      recordDiceRoll({
        game: {
          ...started,
          isCrownSelectionPending: true
        },
        total: 7
      })
    ).toThrow(DiceCommandError);
  });

  it("rejects dice totals below two", () => {
    expect(() => recordDiceRoll({ game: createStartedGame(), total: 1 })).toThrow(DiceCommandError);
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
