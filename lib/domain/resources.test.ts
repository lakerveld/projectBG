import { describe, expect, it } from "vitest";
import { sampleGame } from "./sampleGame";
import { adjustResources, ResourceCommandError } from "./resources";

describe("adjustResources", () => {
  it("increments a player resource and records history", () => {
    const result = adjustResources({
      game: sampleGame,
      playerId: "player-1",
      resourceId: "wheat",
      delta: 2,
      now: "2026-07-02T10:00:00.000Z",
      idFactory: () => "history-test"
    });

    const player = result.state.players.find((candidate) => candidate.id === "player-1");

    expect(player?.resources.wheat).toBe(4);
    expect(result.historyEntry.message).toBe("North gained 2 Wheat.");
    expect(result.state.history[0]?.id).toBe("history-test");
  });

  it("rejects negative balances", () => {
    expect(() =>
      adjustResources({
        game: sampleGame,
        playerId: "player-1",
        resourceId: "ore",
        delta: -1
      })
    ).toThrow(ResourceCommandError);
  });
});
