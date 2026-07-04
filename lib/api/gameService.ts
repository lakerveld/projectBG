import { sampleGame } from "@/lib/domain/sampleGame";
import type { GameState } from "@/lib/domain/types";
import { DEFAULT_RESOURCES, GAME_SCHEMA_VERSION } from "@/lib/domain/defaults";
import { indexedDbGameRepository, type GameRepository } from "@/lib/storage/gameRepository";

export class GameService {
  constructor(private readonly repository: GameRepository = indexedDbGameRepository) {}

  async loadInitialGame(): Promise<GameState> {
    const existingGame = await this.repository.getMostRecentGame();
    return existingGame ? normalizeGame(existingGame) : sampleGame;
  }

  async saveGame(game: GameState): Promise<void> {
    await this.repository.saveGame(normalizeGame(game));
  }
}

export const gameService = new GameService();

function normalizeGame(game: GameState): GameState {
  const defaultResourceIds = DEFAULT_RESOURCES.map((resource) => resource.id);

  return {
    ...game,
    schemaVersion: GAME_SCHEMA_VERSION,
    kingPlayerId: game.kingPlayerId ?? null,
    playersWhoHaveBeenKing: game.playersWhoHaveBeenKing ?? [],
    currentTurnPlayerId: game.currentTurnPlayerId ?? null,
    completedRoundsSinceCrown: game.completedRoundsSinceCrown ?? 0,
    isCrownSelectionPending: game.isCrownSelectionPending ?? false,
    resources: DEFAULT_RESOURCES,
    players: game.players.map((player) => {
      const migratedResources: Record<string, number> = {
        ...player.resources,
        wheat: player.resources.wheat ?? player.resources.grain ?? 0,
        wood: player.resources.wood ?? player.resources.timber ?? 0
      };

      return {
        ...player,
        victoryPoints: player.victoryPoints ?? 0,
        resources: defaultResourceIds.reduce<Record<string, number>>((resources, resourceId) => {
          resources[resourceId] = migratedResources[resourceId] ?? 0;
          return resources;
        }, {})
      };
    })
  };
}
