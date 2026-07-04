import { describe, expect, it } from "vitest";
import { CURATED_PLAYER_COLORS } from "./defaults";
import {
  crownKing,
  CrownKingCommandError,
  createGame,
  CreateGameCommandError,
  startGame,
  StartGameCommandError
} from "./game";

describe("createGame", () => {
  it("creates a local game draft with defaults and history", () => {
    const ids = ["game-test", "history-test", "player-ada", "player-lin"];
    const result = createGame({
      players: [
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" }
      ],
      now: "2026-07-02T11:00:00.000Z",
      idFactory: () => ids.shift() ?? "fallback"
    });

    expect(result.state.id).toBe("game-test");
    expect(result.state.name).toBe("Table Session");
    expect(result.state.rulesetPreset).toBe("original-mvp");
    expect(result.state.playerColorMode).toBe("curated");
    expect(result.state.setupStatus).toBe("ready");
    expect(result.state.kingPlayerId).toBeNull();
    expect(result.state.currentTurnPlayerId).toBeNull();
    expect(result.state.completedRoundsSinceCrown).toBe(0);
    expect(result.state.isCrownSelectionPending).toBe(false);
    expect(result.state.round).toBe(0);
    expect(result.state.players).toHaveLength(2);
    expect(result.state.players[0]?.name).toBe("Ada");
    expect(result.state.players[0]?.victoryPoints).toBe(0);
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

  it("requires no more than four players", () => {
    expect(() =>
      createGame({
        name: "Friday Table",
        players: [
          { name: "Ada", color: CURATED_PLAYER_COLORS[0]?.value ?? "#f3efe7" },
          { name: "Lin", color: CURATED_PLAYER_COLORS[1]?.value ?? "#d77a2d" },
          { name: "Mira", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" },
          { name: "Noah", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
          { name: "Tess", color: "#7f7f7f" }
        ]
      })
    ).toThrow(CreateGameCommandError);
  });

  it("rejects overly long generated or supplied game names", () => {
    expect(() =>
      createGame({
        name: "x".repeat(61),
        players: [
          { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
          { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" }
        ]
      })
    ).toThrow(CreateGameCommandError);
  });

  it("requires at least two players", () => {
    expect(() =>
      createGame({
        name: "Friday Table",
        players: [{ name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" }]
      })
    ).toThrow(CreateGameCommandError);
  });

  it("rejects duplicate player names", () => {
    expect(() =>
      createGame({
        name: "Friday Table",
        players: [
          { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
          { name: " ada ", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" }
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
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" },
        { name: "Mira", color: CURATED_PLAYER_COLORS[1]?.value ?? "#d77a2d" }
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
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" }
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

describe("crownKing", () => {
  it("automatically crowns an eligible next king and resets the crown countdown", () => {
    const created = createGame({
      name: "Friday Table",
      players: [
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" },
        { name: "Mira", color: CURATED_PLAYER_COLORS[1]?.value ?? "#d77a2d" }
      ],
      idFactory: (() => {
        const ids = ["game-test", "created-history", "player-ada", "player-lin", "player-mira"];
        return () => ids.shift() ?? "fallback";
      })()
    });
    const started = startGame({
      game: created.state,
      random: () => 0,
      idFactory: () => "started-history"
    });

    const result = crownKing({
      game: {
        ...started.state,
        currentTurnPlayerId: "player-ada",
        playersWhoHaveBeenKing: ["player-ada"],
        completedRoundsSinceCrown: 3,
        isCrownSelectionPending: true
      },
      now: "2026-07-02T13:00:00.000Z",
      idFactory: () => "king-history",
      random: () => 0.9
    });

    expect(result.state.kingPlayerId).toBe("player-mira");
    expect(result.state.currentTurnPlayerId).toBe("player-mira");
    expect(result.state.playersWhoHaveBeenKing).toEqual(["player-ada", "player-mira"]);
    expect(result.state.completedRoundsSinceCrown).toBe(0);
    expect(result.state.isCrownSelectionPending).toBe(false);
    expect(result.historyEntry.type).toBe("king.crowned");
  });

  it("does not repeat kings until everyone has had a turn", () => {
    const created = createGame({
      players: [
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" },
        { name: "Mira", color: CURATED_PLAYER_COLORS[1]?.value ?? "#d77a2d" }
      ],
      idFactory: (() => {
        const ids = ["game-test", "created-history", "player-ada", "player-lin", "player-mira"];
        return () => ids.shift() ?? "fallback";
      })()
    });

    const started = startGame({
      game: created.state,
      random: () => 0,
      idFactory: () => "started-history"
    });

    const result = crownKing({
      game: {
        ...started.state,
        playersWhoHaveBeenKing: ["player-ada", "player-lin"],
        kingPlayerId: "player-lin",
        currentTurnPlayerId: "player-lin",
        completedRoundsSinceCrown: 3,
        isCrownSelectionPending: true
      },
      random: () => 0
    });

    expect(result.state.kingPlayerId).toBe("player-mira");
    expect(result.state.playersWhoHaveBeenKing).toEqual(["player-ada", "player-lin", "player-mira"]);
  });

  it("restarts the king rotation after everyone has ruled once", () => {
    const created = createGame({
      players: [
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" },
        { name: "Mira", color: CURATED_PLAYER_COLORS[1]?.value ?? "#d77a2d" }
      ],
      idFactory: (() => {
        const ids = ["game-test", "created-history", "player-ada", "player-lin", "player-mira"];
        return () => ids.shift() ?? "fallback";
      })()
    });

    const started = startGame({
      game: created.state,
      random: () => 0,
      idFactory: () => "started-history"
    });

    const result = crownKing({
      game: {
        ...started.state,
        playersWhoHaveBeenKing: ["player-ada", "player-lin", "player-mira"],
        kingPlayerId: "player-mira",
        currentTurnPlayerId: "player-mira",
        completedRoundsSinceCrown: 3,
        isCrownSelectionPending: true
      },
      random: () => 0
    });

    expect(result.state.kingPlayerId).toBe("player-ada");
    expect(result.state.playersWhoHaveBeenKing).toEqual(["player-mira", "player-ada"]);
    expect(result.historyEntry.metadata?.cycleReset).toBe(true);
  });

  it("requires a pending crown selection", () => {
    const created = createGame({
      players: [
        { name: "Ada", color: CURATED_PLAYER_COLORS[3]?.value ?? "#b33a3a" },
        { name: "Lin", color: CURATED_PLAYER_COLORS[2]?.value ?? "#2f6db3" }
      ]
    });
    const started = startGame({ game: created.state });

    expect(() =>
      crownKing({
        game: started.state
      })
    ).toThrow(CrownKingCommandError);
  });
});
