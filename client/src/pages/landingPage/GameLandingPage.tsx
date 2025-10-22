import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { type Game, type GameStats, type LeaderboardEntry } from "@shared/schema";
import Header from "./components/Header";
import ActionButtons from "./components/ActionButtons";
import NicknameDialog from "./components/NicknameDialog";
import Leaderboard from "./components/Leaderboard";
import JoinDialog from "./components/JoinDialog";
import RecentGames from "./components/RecentGames";
import StatsCards from "./components/StatsCards";
import * as styles from "./GameLanding.styles";

export default function GameLandingPage() {
  const navigate = useNavigate();

  const [playerNickname, setPlayerNickname] = useState<string | null>(null);
  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [gameIdInput, setGameIdInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("playerNickname");
    if (saved) setPlayerNickname(saved);
    else setShowNicknameDialog(true);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery<GameStats>({
    queryKey: ["/api/stats"],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const { data: games, isLoading: gamesLoading, refetch } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const handleSaveNickname = () => {
    if (!nicknameInput.trim()) {
      setNicknameError("Nickname is required");
      return;
    }
    if (nicknameInput.length < 2) {
      setNicknameError("Nickname must be at least 2 characters");
      return;
    }
    localStorage.setItem("playerNickname", nicknameInput.trim());
    setPlayerNickname(nicknameInput.trim());
    setShowNicknameDialog(false);
    setNicknameError("");
  };

  const handleCreateRoom = async () => {
    if (!playerNickname) {
      setShowNicknameDialog(true);
      return;
    }
    try {
      const game = await apiRequest<Game>("POST", "/api/games/start", {
        playerNickname,
      });
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerNickname) {
      setShowNicknameDialog(true);
      return;
    }
    if (!gameIdInput.trim()) return;
    try {
      const game = await apiRequest<Game>("POST", "/api/games/start", {
        playerNickname,
        gameId: gameIdInput.trim(),
      });
      setShowJoinDialog(false);
      setGameIdInput("");
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Failed to join room. Please check the Game ID and try again.");
    }
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg" sx={styles.inner}>
        <Header playerNickname={playerNickname} />
        <ActionButtons onCreate={handleCreateRoom} onOpenJoin={() => setShowJoinDialog(true)}
        />
        <StatsCards stats={stats} loading={statsLoading} />
        <Box sx={styles.grid}>
          <RecentGames games={games} loading={gamesLoading} onRefresh={refetch} />
          <Leaderboard leaderboard={leaderboard} loading={leaderboardLoading} />
        </Box>

        <NicknameDialog
          open={showNicknameDialog} nicknameInput={nicknameInput}
          setNicknameInput={setNicknameInput} onSave={handleSaveNickname}
          error={nicknameError} onClose={() => setShowNicknameDialog(false)}
        />

        <JoinDialog
          open={showJoinDialog} gameIdInput={gameIdInput}
          setGameIdInput={setGameIdInput} onJoin={handleJoinRoom}
          onClose={() => { setShowJoinDialog(false); setGameIdInput(""); }}
        />
      </Container>
    </Box>
  );
}
