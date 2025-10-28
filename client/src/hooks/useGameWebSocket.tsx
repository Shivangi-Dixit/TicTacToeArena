import { useEffect, useRef, useState } from "react";
import { type WSMessage, type Game } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface UseGameWebSocketArgs {
  gameId?: string;
  playerNickname: string;
  maxReconnectAttempts?: number;
}

export function useGameWebSocket({
  gameId,
  playerNickname,
  maxReconnectAttempts = 5,
}: UseGameWebSocketArgs) {
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!gameId || !playerNickname) return;

    isMountedRef.current = true;

    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) return;

        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;

        const joinMessage: WSMessage = {
          type: "join",
          gameId: gameId!,
          playerNickname,
        };
        ws.send(JSON.stringify(joinMessage));
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const message: WSMessage = JSON.parse(event.data);

          switch (message.type) {
            case "gameUpdate":
            case "gameStarted":
              queryClient.setQueryData(["/api/games", gameId], message.game);

              if (message.game.player1Nickname === playerNickname) {
                setPlayerSymbol("X");
              } else if (message.game.player2Nickname === playerNickname) {
                setPlayerSymbol("O");
              }

              if (message.game.status === "completed" && message.game.winner) {
                setTimeout(() => setShowResultModal(true), 500);
              }
              break;

            case "error":
              console.error("WebSocket error:", message.message);
              break;

            case "playerDisconnected":
              console.log("Opponent disconnected");
              break;
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);
      };

      ws.onclose = () => {
        if (!isMountedRef.current) return;

        setIsConnected(false);

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          setIsReconnecting(true);
          const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
          reconnectAttemptsRef.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) connectWebSocket();
          }, delay);
        } else {
          setIsReconnecting(false);
        }
      };
    };

    connectWebSocket();

    return () => {
      isMountedRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) wsRef.current.close();
    };
  }, [gameId, playerNickname, maxReconnectAttempts]);

  const sendMove = (game: Game, cellIndex: number) => {
    if (!wsRef.current || !playerSymbol) return;
    const moveMessage: WSMessage = {
      type: "move",
      gameId: game.id,
      cellIndex,
      playerSymbol,
    };
    wsRef.current.send(JSON.stringify(moveMessage));
  };

  const sendForfeit = (game: Game) => {
    if (!wsRef.current) return;
    const forfeitMessage: WSMessage = {
      type: "forfeit",
      gameId: game.id,
      playerNickname,
    };
    wsRef.current.send(JSON.stringify(forfeitMessage));
  };

  const closeWs = () => {
    wsRef.current?.close();
  };

  return {
    playerSymbol,
    isConnected,
    isReconnecting,
    showResultModal,
    setShowResultModal,
    sendMove,
    sendForfeit,
    closeWs,
  };
}
