import { Request, Response } from "express";
import { storage } from "../DatabaseStorage/index";
import { wsManager } from "../ws/manager";

export const gameService = {
  async getAllGames(req: Request, res: Response) {
    try {
      const allGames = await storage.games.getAllGames();
      res.json(allGames);
    } catch {
      res.status(500).json({ error: "Failed to fetch games" });
    }
  },

  async getGameById(req: Request, res: Response) {
    try {
      const game = await storage.games.getGame(req.params.id);
      if (!game) return res.status(404).json({ error: "Game not found" });
      res.json(game);
    } catch {
      res.status(500).json({ error: "Failed to fetch game" });
    }
  },

  async startOrJoinGame(req: Request, res: Response) {
    try {
      const { playerNickname, gameId } = req.body;
      if (!playerNickname) return res.status(400).json({ error: "Player nickname is required" });

      if (gameId) {
        const existingGame = await storage.games.getGame(gameId);
        if (existingGame) {
          if (existingGame.status === "waiting" && !existingGame.player2Nickname) {
            const updatedGame = await storage.games.updateGame(gameId, {
              player2Nickname: playerNickname, status: "playing"
            });
            if (updatedGame) return res.json(updatedGame);
          } else {
            return res.status(400).json({ error: "Game is not available for joining" });
          }
        } else {
          return res.status(404).json({ error: "Game not found" });
        }
      }
      // Create new game if not found
      const newGame = await storage.games.createGame({
        player1Nickname: playerNickname,
        player2Nickname: null,
        boardState: Array(9).fill(null),
        currentTurn: "X",
        winner: null,
        status: "waiting"
      });
      res.json(newGame);
    } catch {
      res.status(500).json({ error: "Failed to create game" });
    }
  },

  async deleteGame(req: Request, res: Response) {
    try {
      const gameId = req.params.id;
      await storage.games.deleteGame(gameId);
      wsManager.cleanupRoomOnGameDelete(gameId); // Full WS cleanup
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete game" });
    }
  },
};
