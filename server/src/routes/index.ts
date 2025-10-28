import { Express } from "express";
import { registerStatsRoutes } from "./stats.routes";
import { registerOnlineCountRoute } from "./online.routes";
import { registerGameRoutes } from "./game.routes";
import { configureWebSocketServer } from "../ws/server";
import { registerLeaderboardRoutes } from "./leaderboard.routes";

export async function registerRoutes(app: Express) {
  registerGameRoutes(app);
  registerStatsRoutes(app);
  registerLeaderboardRoutes(app);
  registerOnlineCountRoute(app);
  return configureWebSocketServer(app);
}
