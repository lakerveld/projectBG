import { describe, expect, it } from "vitest";
import { createGame, CreateGameCommandError, startGame, StartGameCommandError } from "./game";

describe("createGame", () => {
  it("creates a local game draft with defaults and history", () => {
    const ids = ["game-test", "history-test", "player-ada", "player-lin"];
    const result = createGame({
      players: [
        { name: "Ada", color: "#b33a3a" },
        { name: "Lin", color: "#2f6db3" }
      ],
      now: "2026-07-02T11:00:00.000Z",
      idFactory: () => ids.shift() ?? "fallback"
    });

    expect(result.state.id).toBe("game-test");
    expect(result.state.name).toBe("Table Session");
    expect(result.state.rulesetPreset).toBe("original-mvp");
    expect(result.state.playerColorMode).toBe("curated");
    expect(result.state.setupStatus).toBe("ready");
    expect(result.state.round).toBe(0);
    expect(result.state.players).toHaveLength(2);
    expect(result.state.players[0]?.name).toBe("Ada");
    expect(result.state.players[0]?.resources.wheat).toBe(0);
    expect(result.state.resources.map((resource) => resource.id)).toEqual([
      "wheat",
      "wood",
      "brick",
      "sheep",
      "ore"
    ]);
    expect(result.historyEntry.id).toBe("history-test");
    expect(result.historyEntry.message).toBe("Table Session created.");
  });

  it("rejects overly long generated or supplied game names", () => {
    expect(() =>
      createGame({
        name: "x".repeat(61),
        players: [
          { name: "Ada", color: "#b33a3a" },
          { name: "Lin", color: "#2f6db3" }
        ]
      })
    ).toThrow(CreateGameCommandError);
  });

  it("requires at least two players", () => {
    expect(() =>
      createGame({
        name: "Friday Table",
        players: [{ name: "Ada", color: "#b33a3a" }]
      })
    ).toThrow(CreateGameCommandError);
  });

  it("rejects duplicate player names", () => {
    expect(() =>
      createGame({
        name: "Friday Table",
        players: [
          { name: "Ada", color: "#b33a3a" },
          { name: " ada ", color: "#2f6db3" }
        ]
      })
    ).toThrow(CreateGameCommandError);
  });
});

describe("startGame", () => {
  it("selects a king, starts round one, and records history", () => {
    const created = createGame({
      name: "Friday Table",
      players: [
        { name: "Ada", color: "#b33a3a" },
        { name: "Lin", color: "#2f6db3" },
        { name: "Mira", color: "#176b4d" }
      ],
      idFactory: (() => {
        const ids = ["game-test", "created-history", "player-ada", "player-lin", "player-mira"];
        return () => ids.shift() ?? "fallback";
      })()
    });

    const result = startGame({
      game: created.state,
      now: "2026-07-02T12:00:00.000Z",
      idFactory: () => "started-history",
      random: () => 0.4
    });

    expect(result.state.setupStatus).toBe("in-progress");
    expect(result.state.round).toBe(1);
    expect(result.state.kingPlayerId).toBe("player-lin");
    expect(result.state.currentTurnPlayerId).toBe("player-lin");
    expect(result.historyEntry.type).toBe("game.started");
    expect(result.historyEntry.message).toBe("Lin was crowned King and takes the first turn.");
  });

  it("does not start an already started game", () => {
    const created = createGame({
      name: "Friday Table",
      players: [
        { name: "Ada", color: "#b33a3a" },
        { name: "Lin", color: "#2f6db3" }
      ],
      idFactory: (() => {
        const ids = ["game-test", "created-history", "player-ada", "player-lin"];
        return () => ids.shift() ?? "fallback";
      })()
    });

    const started = startGame({ game: created.state });

    expect(() => startGame({ game: started.state })).toThrow(StartGameCommandError);
  });
});
