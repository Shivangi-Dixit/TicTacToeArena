import { Express } from "express";
import { gameService } from "../services/game.service";

export function registerGameRoutes(app: Express) {
  app.get("/api/games", gameService.getAllGames);
  app.get("/api/games/:id", gameService.getGameById);
  app.post("/api/games/start", gameService.startOrJoinGame);
  app.delete("/api/games/:id", gameService.deleteGame);
}
