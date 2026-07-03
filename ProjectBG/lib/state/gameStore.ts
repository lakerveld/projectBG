"use client";

import { create } from "zustand";
import { gameService } from "@/lib/api/gameService";
import { recordDiceRoll } from "@/lib/domain/dice";
import { createGame, startGame } from "@/lib/domain/game";
import { adjustResources } from "@/lib/domain/resources";
import { sampleGame } from "@/lib/domain/sampleGame";
import type { CreateGameCommand, GameState } from "@/lib/domain/types";

type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error";

type GameStore = {
  game: GameState;
  saveStatus: SaveStatus;
  error: string | null;
  hydrate: () => Promise<void>;
  createLocalGame: (command: CreateGameCommand) => Promise<GameState | null>;
  startLocalGame: () => Promise<GameState | null>;
  recordDiceTotal: (total: number) => Promise<GameState | null>;
  adjustPlayerResource: (playerId: string, resourceId: string, delta: number) => Promise<void>;
};

export const useGameStore = create<GameStore>((set, get) => ({
  game: sampleGame,
  saveStatus: "idle",
  error: null,

  async hydrate() {
    set({ saveStatus: "loading", error: null });

    try {
      const game = await gameService.loadInitialGame();
      set({ game, saveStatus: "idle" });
    } catch (error) {
      set({
        saveStatus: "error",
        error: error instanceof Error ? error.message : "Unable to load local game."
      });
    }
  },

  async createLocalGame(command) {
    try {
      const result = createGame(command);

      set({ game: result.state, saveStatus: "saving", error: null });
      await gameService.saveGame(result.state);
      set({ saveStatus: "saved" });

      return result.state;
    } catch (error) {
      set({
        saveStatus: "error",
        error: error instanceof Error ? error.message : "Unable to create local game."
      });

      return null;
    }
  },

  async startLocalGame() {
    try {
      const result = startGame({
        game: get().game
      });

      set({ game: result.state, saveStatus: "saving", error: null });
      await gameService.saveGame(result.state);
      set({ saveStatus: "saved" });

      return result.state;
    } catch (error) {
      set({
        saveStatus: "error",
        error: error instanceof Error ? error.message : "Unable to start game."
      });

      return null;
    }
  },

  async adjustPlayerResource(playerId, resourceId, delta) {
    try {
      const result = adjustResources({
        game: get().game,
        playerId,
        resourceId,
        delta
      });

      set({ game: result.state, saveStatus: "saving", error: null });
      await gameService.saveGame(result.state);
      set({ saveStatus: "saved" });
    } catch (error) {
      set({
        saveStatus: "error",
        error: error instanceof Error ? error.message : "Unable to adjust resource."
      });
    }
  },

  async recordDiceTotal(total) {
    try {
      const result = recordDiceRoll({
        game: get().game,
        total
      });

      set({ game: result.state, saveStatus: "saving", error: null });
      await gameService.saveGame(result.state);
      set({ saveStatus: "saved" });

      return result.state;
    } catch (error) {
      set({
        saveStatus: "error",
        error: error instanceof Error ? error.message : "Unable to record dice roll."
      });

      return null;
    }
  }
}));
