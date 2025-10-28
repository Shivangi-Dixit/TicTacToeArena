import { GameStorage } from "./storage/game.storage";
import { LeaderboardStorage } from "./storage/leaderboard.storage";
import { StatsStorage } from "./storage/stats.storage";

class DatabaseStorage {
  games = new GameStorage();
  stats = new StatsStorage();
  leaderboard = new LeaderboardStorage();
}

export const storage = new DatabaseStorage();
