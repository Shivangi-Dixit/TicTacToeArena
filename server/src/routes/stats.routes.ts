import { Express } from "express";
import { statsService } from "../services/stats.service";

export function registerStatsRoutes(app: Express) {
  app.get("/api/stats", statsService.getStats);
}
