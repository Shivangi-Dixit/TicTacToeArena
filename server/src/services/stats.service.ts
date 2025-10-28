import { Request, Response } from "express";
import { storage } from "../DatabaseStorage/index";

export const statsService = {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await storage.stats.getGameStats();
      res.json(stats);
    } catch {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  }
};
