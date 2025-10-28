import { type Game, type InsertGame, type UpdateGame, type GameStats, type LeaderboardEntry } from "@shared/schema";

export interface IStorage {
  getGame(id: string): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, updates: UpdateGame): Promise<Game | undefined>;
  getAllGames(): Promise<Game[]>;
  getGameStats(): Promise<GameStats>;
  getWaitingGame(): Promise<Game | undefined>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  deleteGame(id: string): Promise<void>;
}
