import { Express } from "express";
import { leaderboardService } from "../services/leaderboard.service";

export function registerLeaderboardRoutes(app: Express) {
  app.get("/api/leaderboard", leaderboardService.getLeaderboard);
}
