import { sampleGame } from "@/lib/domain/sampleGame";
import type { GameState } from "@/lib/domain/types";
import {
  indexedDbGameRepository,
  type GameRepository
} from "@/lib/storage/gameRepository";

export class GameService {
  constructor(private readonly repository: GameRepository = indexedDbGameRepository) {}

  async loadInitialGame(): Promise<GameState> {
    const existingGame = await this.repository.getMostRecentGame();
    return existingGame ?? sampleGame;
  }

  async saveGame(game: GameState): Promise<void> {
    await this.repository.saveGame(game);
  }
}

export const gameService = new GameService();

