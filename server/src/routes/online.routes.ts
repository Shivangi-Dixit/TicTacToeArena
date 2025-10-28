import { Express, Request, Response } from "express";
import { wsManager } from "../ws/manager";

export function registerOnlineCountRoute(app: Express) {
  app.get("/api/online-count", (_req: Request, res: Response) => {
    res.json({ count: wsManager.getActiveConnectionCount() });
  });
}
