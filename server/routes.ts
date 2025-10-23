// Reference: javascript_websocket blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertGameSchema, type WSMessage, type Game } from "@shared/schema";
import { 
  isValidMove, 
  applyMove, 
  toggleTurn, 
  checkWinner, 
  getWinnerDisplay 
} from "./gameLogic";

const gameConnections = new Map<string, Set<WebSocket>>();
const activeConnections = new Set<WebSocket>();

function broadcastToGame(gameId: string, message: WSMessage) {
  const clients = gameConnections.get(gameId);
  if (!clients) return;

  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

function sendToClient(client: WebSocket, message: WSMessage) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  }
}

async function handleGameMessage(ws: WebSocket, message: WSMessage) {
  try {
    switch (message.type) {
      case "join": {
        const { gameId, playerNickname } = message;
        console.log(`[WS] Player ${playerNickname} joining game ${gameId}`);
        console.log(`[WS] Total active connections: ${activeConnections.size}`);
        console.log(`[WS] Room exists: ${gameConnections.has(gameId)}, current room size: ${gameConnections.has(gameId) ? gameConnections.get(gameId)!.size : 0}`);
        
        const game = await storage.getGame(gameId);
        if (!game) {
          console.log(`[WS] Game ${gameId} not found`);
          sendToClient(ws, {
            type: "error",
            message: "Game not found",
          });
          return;
        }

        if (!gameConnections.has(gameId)) {
          console.log(`[WS] Creating new room for game ${gameId}`);
          gameConnections.set(gameId, new Set());
        }
        
        const wasAlreadyInRoom = gameConnections.get(gameId)!.has(ws);
        gameConnections.get(gameId)!.add(ws);
        
        console.log(`[WS] Player ${playerNickname} ${wasAlreadyInRoom ? 'already in' : 'added to'} room ${gameId}`);
        console.log(`[WS] Game ${gameId} room size after join: ${gameConnections.get(gameId)!.size}`);
        console.log(`[WS] Game state:`, {
          status: game.status,
          player1: game.player1Nickname,
          player2: game.player2Nickname,
        });
        console.log(`[WS] All clients in room ${gameId}:`, Array.from(gameConnections.get(gameId)!).map((c, i) => `Client${i+1}(${c === ws ? 'THIS' : 'OTHER'})`));

        const messageType = game.status === "playing" ? "gameStarted" : "gameUpdate";
        console.log(`[WS] Broadcasting ${messageType} to ${gameConnections.get(gameId)!.size} clients`);
        broadcastToGame(gameId, {
          type: messageType,
          game,
        });
        break;
      }

      case "move": {
        const { gameId, cellIndex, playerSymbol } = message;
        console.log(`[WS] Move request: Player ${playerSymbol} wants to move at cell ${cellIndex} in game ${gameId}`);
        console.log(`[WS] Current room size for game ${gameId}: ${gameConnections.has(gameId) ? gameConnections.get(gameId)!.size : 0}`);
        
        const game = await storage.getGame(gameId);
        if (!game) {
          console.log(`[WS] Error: Game ${gameId} not found for move`);
          sendToClient(ws, {
            type: "error",
            message: "Game not found",
          });
          return;
        }
        console.log(`[WS] Game ${gameId} current state before move: currentTurn=${game.currentTurn}, status=${game.status}`);

        if (game.status !== "playing") {
          sendToClient(ws, {
            type: "error",
            message: "Game is not active",
          });
          return;
        }

        if (game.currentTurn !== playerSymbol) {
          sendToClient(ws, {
            type: "error",
            message: "Not your turn",
          });
          return;
        }

        const board = game.boardState as (string | null)[];
        if (!isValidMove(board, cellIndex)) {
          sendToClient(ws, {
            type: "error",
            message: "Invalid move",
          });
          return;
        }

        const newBoard = applyMove(board, cellIndex, playerSymbol);
        const result = checkWinner(newBoard);

        const updates: any = {
          boardState: newBoard,
          currentTurn: toggleTurn(playerSymbol),
        };

        if (result) {
          updates.winner = getWinnerDisplay(result);
          updates.status = "completed";
          updates.completedAt = new Date();
        }

        const updatedGame = await storage.updateGame(gameId, updates);
        
        if (updatedGame) {
          console.log(`[WS] Move processed successfully. Broadcasting to ${gameConnections.has(gameId) ? gameConnections.get(gameId)!.size : 0} clients in room ${gameId}`);
          console.log(`[WS] Updated game state: currentTurn=${updatedGame.currentTurn}, status=${updatedGame.status}, winner=${updatedGame.winner}`);
          
          broadcastToGame(gameId, {
            type: "gameUpdate",
            game: updatedGame,
          });
          
          console.log(`[WS] Broadcast complete for game ${gameId}`);

          if (result) {
            console.log(`[WS] Game ${gameId} completed with result: ${result}. Will clean up room in 5s`);
            setTimeout(() => {
              gameConnections.delete(gameId);
            }, 5000);
          }
        } else {
          console.error(`[WS] Failed to update game ${gameId} in database`);
        }
        break;
      }

      case "forfeit": {
        const { gameId, playerNickname } = message;
        console.log(`[WS] Player ${playerNickname} forfeiting game ${gameId}`);
        
        const game = await storage.getGame(gameId);
        if (!game) {
          console.log(`[WS] Error: Game ${gameId} not found for forfeit`);
          sendToClient(ws, {
            type: "error",
            message: "Game not found",
          });
          return;
        }

        let winner: string;
        if (game.player1Nickname === playerNickname) {
          winner = "Player 2";
        } else if (game.player2Nickname === playerNickname) {
          winner = "Player 1";
        } else {
          console.warn(`[WS] Player ${playerNickname} not found in game ${gameId}`);
          sendToClient(ws, {
            type: "error",
            message: "You are not a player in this game",
          });
          return;
        }

        const updatedGame = await storage.updateGame(gameId, {
          winner,
          status: "completed",
          completedAt: new Date(),
        });

        if (updatedGame) {
          console.log(`[WS] Game ${gameId} forfeited by ${playerNickname}. Winner: ${winner}`);
          
          broadcastToGame(gameId, {
            type: "gameUpdate",
            game: updatedGame,
          });

          setTimeout(() => {
            gameConnections.delete(gameId);
          }, 5000);
        } else {
          console.error(`[WS] Failed to update forfeited game ${gameId}`);
        }
        break;
      }
    }
  } catch (error) {
    console.error("Error handling WebSocket message:", error);
    sendToClient(ws, {
      type: "error",
      message: "Internal server error",
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * GET /api/games - Get all games
   */
  app.get("/api/games", async (_req, res) => {
    try {
      const allGames = await storage.getAllGames();
      res.json(allGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  /**
   * GET /api/games/:id - Get a specific game
   */
  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      console.error("Error fetching game:", error);
      res.status(500).json({ error: "Failed to fetch game" });
    }
  });

  /**
     * POST /api/games/start - Start a new game (matchmaking)
     * Joins existing waiting game if available, otherwise creates new one
     */
    app.post("/api/games/start", async (req, res) => {
      try {
        const { playerNickname, gameId } = req.body;
        
        if (!playerNickname) {
          return res.status(400).json({ error: "Player nickname is required" });
        }
  
        // If gameId is provided, try to join the existing game
        if (gameId) {
          const existingGame = await storage.getGame(gameId);
          
          if (existingGame) {
            // Check if the game is waiting and join as player 2
            if (existingGame.status === "waiting" && !existingGame.player2Nickname) {
              const updatedGame = await storage.updateGame(gameId, {
                player2Nickname: playerNickname,
                status: "playing",
              });
              
              if (updatedGame) {
                console.log(`Player ${playerNickname} joined existing game ${gameId}`);
                return res.json(updatedGame);
              }
            } else {
              return res.status(400).json({ error: "Game is not available for joining" });
            }
          } else {
            return res.status(404).json({ error: "Game not found" });
          }
        }
  
        // No gameId provided or no existing game found, create a new one
        const newGame = await storage.createGame({
          player1Nickname: playerNickname,
          player2Nickname: null,
          boardState: [null, null, null, null, null, null, null, null, null],
          currentTurn: "X",
          winner: null,
          status: "waiting",
        });
  
        console.log(`Player ${playerNickname} created new game ${newGame.id}`);
        res.json(newGame);
      } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ error: "Failed to create game" });
      }
    });

  /**
   * GET /api/stats - Get game statistics
   */
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getGameStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  /**
   * GET /api/leaderboard - Get top players by wins
   */
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  /**
   * DELETE /api/games/:id - Delete a game (for expired waiting rooms)
   */
  app.delete("/api/games/:id", async (req, res) => {
    try {
      const gameId = req.params.id;
      await storage.deleteGame(gameId);
      
      // Clean up WebSocket connections for this game
      gameConnections.delete(gameId);
      console.log(`Game ${gameId} deleted and connections cleaned up`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting game:", error);
      res.status(500).json({ error: "Failed to delete game" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server on /ws path to avoid conflict with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected to WebSocket");
    activeConnections.add(ws);

    ws.on("message", async (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        await handleGameMessage(ws, message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        sendToClient(ws, {
          type: "error",
          message: "Invalid message format",
        });
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
      activeConnections.delete(ws);
      
      // Remove from all game rooms
      gameConnections.forEach((clients, gameId) => {
        if (clients.has(ws)) {
          clients.delete(ws);
          
          // Notify other players
          broadcastToGame(gameId, {
            type: "playerDisconnected",
            gameId,
          });

          // Clean up empty rooms
          if (clients.size === 0) {
            gameConnections.delete(gameId);
          }
        }
      });
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  /**
   * GET /api/online-count - Get count of active WebSocket connections
   */
  app.get("/api/online-count", (_req, res) => {
    res.json({ count: activeConnections.size });
  });

  console.log("WebSocket server configured on /ws");

  return httpServer;
}
