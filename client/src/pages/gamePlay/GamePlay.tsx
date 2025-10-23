import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { Box, Container, Typography, Button, Card, CardContent, Chip, Stack, CircularProgress, Fade } from "@mui/material";
import { GameBoard } from "@/pages/gamePlay/components/GameBoard";
import { WaitingRoom } from "@/pages/gamePlay/components/WaitingRoom";
import { GameResultModal } from "@/pages/gamePlay/components/GameResultModal";
import { type Game, type WSMessage } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import * as styles from "./GamePlay.styles";

import PlayHeader from "./components/PlayHeader";
import PlayersPanel from "./components/PlayersPanel";
import StatusPanel from "./components/StatusPanel";

export default function GamePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [playerNickname] = useState(() => localStorage.getItem("playerNickname") || "Player");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const maxReconnectAttempts = 5;

  const { data: game, isLoading } = useQuery<Game>({
    queryKey: ["/api/games", gameId],
    enabled: !!gameId,
  });

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
          gameId,
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
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
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
  }, [gameId, playerNickname]);

  const handleCellClick = (cellIndex: number) => {
    if (!game || !wsRef.current || !playerSymbol) return;

    const isPlayerTurn =
      (game.currentTurn === "X" && playerSymbol === "X") ||
      (game.currentTurn === "O" && playerSymbol === "O");

    if (!isPlayerTurn) return;

    const moveMessage: WSMessage = {
      type: "move",
      gameId: game.id,
      cellIndex,
      playerSymbol,
    };

    wsRef.current.send(JSON.stringify(moveMessage));
  };

  const handleCancelGame = () => {
    if (wsRef.current) wsRef.current.close();
    navigate("/");
  };

  const handleForfeit = () => {
    if (!wsRef.current || !game || !playerNickname) return;

    const forfeitMessage: WSMessage = {
      type: "forfeit",
      gameId: game.id,
      playerNickname,
    };

    wsRef.current.send(JSON.stringify(forfeitMessage));
  };

  const handleResultClose = () => {
    setShowResultModal(false);
    navigate("/");
  };

  const getWinningCells = (): number[] => {
    if (!game || !game.winner || game.winner === "Draw") return [];

    const board = game.boardState as (string | null)[];
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return pattern;
    }

    return [];
  };

  if (isLoading) {
    return (
      <Box sx={styles.loadingBox}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} sx={{ color: "#f05232" }} />
          <Typography variant="body1" color="text.secondary">Loading game...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!game) {
    return (
      <Box sx={styles.notFoundBox}>
        <Card sx={styles.notFoundCard}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 2, color: "#434b51" }}>Game Not Found</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>This game doesn't exist or has been removed.</Typography>
            <Button variant="contained" onClick={() => navigate("/")} data-testid="button-back-home" sx={styles.returnHomeButton}>Return Home</Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (game.status === "waiting") {
    return <WaitingRoom gameId={game.id} playerNickname={playerNickname} onCancel={handleCancelGame} />;
  }

  const isPlayerTurn =
    (game.currentTurn === "X" && playerSymbol === "X") ||
    (game.currentTurn === "O" && playerSymbol === "O");

  return (
    <Box sx={styles.container}>
      <PlayHeader onBack={() => navigate("/")} isConnected={isConnected} isReconnecting={isReconnecting} />

      <Container maxWidth="lg" sx={styles.contentContainer}>
        <Fade in timeout={600}>
          <Box sx={styles.grid}>
            <Box>
              <GameBoard board={game.boardState as (string | null)[]} onCellClick={handleCellClick}
                disabled={!isPlayerTurn || game.status === "completed"}
                winningCells={getWinningCells()} currentPlayer={game.currentTurn as "X" | "O"}
              />
            </Box>

            <Stack spacing={3}>
              <PlayersPanel game={game} />
              <StatusPanel playerSymbol={playerSymbol} isPlayerTurn={isPlayerTurn} showForfeit={game.status === "playing"} onForfeit={handleForfeit} />
            </Stack>
          </Box>
        </Fade>
      </Container>

      <GameResultModal open={showResultModal} winner={game.winner} onClose={handleResultClose} playerSymbol={playerSymbol || undefined} />
    </Box>
  );
}
