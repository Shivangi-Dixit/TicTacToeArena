import { Request, Response } from "express";
import { storage } from "../DatabaseStorage/index";

export const leaderboardService = {
  async getLeaderboard(req: Request, res: Response) {
    try {
      const leaderboard = await storage.leaderboard.getLeaderboard();
      res.json(leaderboard);
    } catch {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }
};
