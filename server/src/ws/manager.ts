import { WebSocketServer, WebSocket } from "ws";
import { storage } from "../DatabaseStorage/index";
import { isValidMove, applyMove, checkWinner, toggleTurn, getWinnerDisplay } from "../gameLogic/gameLogic";

class WSManager {
  gameConnections: Map<string, Set<WebSocket>> = new Map();
  activeConnections: Set<WebSocket> = new Set();

  attach(wss: WebSocketServer) {
    wss.on("connection", (ws: WebSocket) => {
      this.activeConnections.add(ws);
      ws.on("message", async (data: Buffer) => {
        await this.handleGameMessage(ws, data);
      });
      ws.on("close", () => {
        this.cleanupSocket(ws);
      });
    });
  }

  cleanupSocket(ws: WebSocket) {
    this.activeConnections.delete(ws);
    for (const [gameId, clients] of this.gameConnections.entries()) {
      if (clients.has(ws)) {
        clients.delete(ws);
        this.broadcastToGame(gameId, { type: "playerDisconnected", gameId });
        if (clients.size === 0) {
          this.gameConnections.delete(gameId);
        }
      }
    }
  }

  cleanupRoomOnGameDelete(gameId: string) {
    const clients = this.gameConnections.get(gameId);
    if (clients) {
      for (const ws of clients) {
        this.sendToClient(ws, { type: "gameDeleted", gameId });
      }
      this.gameConnections.delete(gameId);
    }
  }

  getActiveConnectionCount() {
    return this.activeConnections.size;
  }

  broadcastToGame(gameId: string, message: any) {
    const clients = this.gameConnections.get(gameId);
    if (!clients) return;
    const msgStr = JSON.stringify(message);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) client.send(msgStr);
    }
  }

  sendToClient(client: WebSocket, message: any) {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(message));
  }

  async handleGameMessage(ws: WebSocket, data: Buffer) {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case "join": {
          const { gameId, playerNickname } = message;
          const game = await storage.games.getGame(gameId);
          if (!game) {
            this.sendToClient(ws, { type: "error", message: "Game not found" });
            return;
          }
          if (!this.gameConnections.has(gameId)) this.gameConnections.set(gameId, new Set());
          this.gameConnections.get(gameId)!.add(ws);

          this.broadcastToGame(gameId, {
            type: (game.status === "playing" ? "gameStarted" : "gameUpdate"),
            game,
          });
          break;
        }
        case "move": {
          const { gameId, cellIndex, playerSymbol } = message;
          const game = await storage.games.getGame(gameId);
          if (!game) {
            this.sendToClient(ws, { type: "error", message: "Game not found" });
            return;
          }
          if (game.status !== "playing") {
            this.sendToClient(ws, { type: "error", message: "Game is not active" });
            return;
          }
          if (game.currentTurn !== playerSymbol) {
            this.sendToClient(ws, { type: "error", message: "Not your turn" });
            return;
          }
          const board = game.boardState as (string | null)[];
          if (!isValidMove(board, cellIndex)) {
            this.sendToClient(ws, { type: "error", message: "Invalid move" });
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
          const updatedGame = await storage.games.updateGame(gameId, updates);
          this.broadcastToGame(gameId, { type: "gameUpdate", game: updatedGame });
          if (result) {
            setTimeout(() => this.cleanupRoomOnGameDelete(gameId), 5000);
          }
          break;
        }
        case "forfeit": {
          const { gameId, playerNickname } = message;
          const game = await storage.games.getGame(gameId);
          if (!game) {
            this.sendToClient(ws, { type: "error", message: "Game not found" });
            return;
          }
          let winner: string;
          if (game.player1Nickname === playerNickname) winner = "Player 2";
          else if (game.player2Nickname === playerNickname) winner = "Player 1";
          else {
            this.sendToClient(ws, {
              type: "error", message: "You are not a player in this game"
            });
            return;
          }
          const updatedGame = await storage.games.updateGame(gameId, {
            winner,
            status: "completed",
            completedAt: new Date(),
          });
          this.broadcastToGame(gameId, {
            type: "gameUpdate", game: updatedGame,
          });
          setTimeout(() => this.cleanupRoomOnGameDelete(gameId), 5000);
          break;
        }
        default:
          this.sendToClient(ws, { type: "error", message: "Unknown message type" });
      }
    } catch (error) {
      this.sendToClient(ws, { type: "error", message: "Invalid WebSocket message" });
    }
  }
}
export const wsManager = new WSManager();
