import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Box, Container, Typography, Button, Card, CardContent, Stack, CircularProgress, Fade,
} from "@mui/material";
import { GameBoard } from "@/pages/gamePlay/components/GameBoard";
import { WaitingRoom } from "@/pages/gamePlay/components/WaitingRoom";
import { GameResultModal } from "@/pages/gamePlay/components/GameResultModal";
import { type Game } from "@shared/schema";
import * as styles from "./GamePlay.styles";

import PlayHeader from "./components/PlayHeader";
import PlayersPanel from "./components/PlayersPanel";
import StatusPanel from "./components/StatusPanel";
import { useGameWebSocket } from "@/hooks/useGameWebSocket";

export default function GamePlay() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [playerNickname] = useState(() => localStorage.getItem("playerNickname") || "Player");

  const { data: game, isLoading } = useQuery<Game | undefined>({
    queryKey: ["/api/games", gameId],
    enabled: !!gameId,
  });

  const {
    playerSymbol,
    isConnected,
    isReconnecting,
    showResultModal,
    setShowResultModal,
    sendMove,
    sendForfeit,
    closeWs,
  } = useGameWebSocket({ gameId, playerNickname });

  const handleCellClick = (cellIndex: number) => {
    if (!game || !playerSymbol) return;
    const isPlayerTurn =
      (game.currentTurn === "X" && playerSymbol === "X") ||
      (game.currentTurn === "O" && playerSymbol === "O");
    if (!isPlayerTurn) return;
    sendMove(game, cellIndex);
  };

  const handleCancelGame = () => {
    closeWs();
    navigate("/");
  };

  const handleForfeit = () => {
    if (!game) return;
    sendForfeit(game);
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
