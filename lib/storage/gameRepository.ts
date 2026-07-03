import Dexie, { type Table } from "dexie";
import type { GameState } from "@/lib/domain/types";

const DB_NAME = "projectbg";
const DB_VERSION = 1;

type StoredGame = GameState & {
  persistedAt: string;
};

class ProjectBgDatabase extends Dexie {
  games!: Table<StoredGame, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores({
      games: "id, updatedAt, schemaVersion"
    });
  }
}

const db = new ProjectBgDatabase();

export type GameRepository = {
  saveGame(game: GameState): Promise<void>;
  getGame(gameId: string): Promise<GameState | undefined>;
  getMostRecentGame(): Promise<GameState | undefined>;
};

export const indexedDbGameRepository: GameRepository = {
  async saveGame(game) {
    await db.games.put({
      ...game,
      persistedAt: new Date().toISOString()
    });
  },

  async getGame(gameId) {
    const storedGame = await db.games.get(gameId);
    return stripPersistenceMetadata(storedGame);
  },

  async getMostRecentGame() {
    const storedGame = await db.games.orderBy("updatedAt").last();
    return stripPersistenceMetadata(storedGame);
  }
};

function stripPersistenceMetadata(storedGame: StoredGame | undefined): GameState | undefined {
  if (!storedGame) {
    return undefined;
  }

  const { persistedAt: _persistedAt, ...game } = storedGame;
  return game;
}

