import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/constants/apiConstants";
import { LANDING_MODULE_TEXTS } from "./LandingPage.texts";
import { type Game, type GameStats, type LeaderboardEntry } from "@shared/schema";

import Header from "./components/Header";
import ActionButtons from "./components/ActionButtons";
import NicknameDialog from "./components/NicknameDialog";
import Leaderboard from "./components/Leaderboard";
import JoinDialog from "./components/JoinDialog";
import RecentGames from "./components/RecentGames";
import StatsCards from "./components/StatsCards";
import * as styles from "./LandingPage.styles";

export default function LandingPage() {
  const navigate = useNavigate();

  const [playerNickname, setPlayerNickname] = useState<string | null>(null);
  const [showNicknameDialog, setShowNicknameDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [gameIdInput, setGameIdInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LANDING_MODULE_TEXTS.STORAGE_KEYS.PLAYER_NICKNAME);
    if (saved) setPlayerNickname(saved);
    else setShowNicknameDialog(true);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.STATS] });
    queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.GAMES] });
    queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.LEADERBOARD] });
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery<GameStats>({
    queryKey: [API_ENDPOINTS.STATS],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const { data: games, isLoading: gamesLoading, refetch } = useQuery<Game[]>({
    queryKey: [API_ENDPOINTS.GAMES],
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const { data: leaderboard, isLoading: leaderboardLoading } =
    useQuery<LeaderboardEntry[]>({
      queryKey: [API_ENDPOINTS.LEADERBOARD],
      refetchOnWindowFocus: true,
      refetchOnMount: "always",
    });

  const handleSaveNickname = () => {
    if (!nicknameInput.trim()) {
      setNicknameError(LANDING_MODULE_TEXTS.ERRORS.NICKNAME_REQUIRED);
      return;
    }
    if (nicknameInput.length < 2) {
      setNicknameError(LANDING_MODULE_TEXTS.ERRORS.NICKNAME_TOO_SHORT);
      return;
    }
    localStorage.setItem(LANDING_MODULE_TEXTS.STORAGE_KEYS.PLAYER_NICKNAME, nicknameInput.trim());
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
      const game = await apiRequest<Game>("POST", API_ENDPOINTS.CREATE_GAME, {
        playerNickname,
      });
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error(LANDING_MODULE_TEXTS.ERRORS.CREATE_FAILED, error);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerNickname) {
      setShowNicknameDialog(true);
      return;
    }
    if (!gameIdInput.trim()) return;
    try {
      const game = await apiRequest<Game>("POST", API_ENDPOINTS.CREATE_GAME, {
        playerNickname,
        gameId: gameIdInput.trim(),
      });
      setShowJoinDialog(false);
      setGameIdInput("");
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error(LANDING_MODULE_TEXTS.ERRORS.JOIN_FAILED, error);
      alert(LANDING_MODULE_TEXTS.ERRORS.JOIN_FAILED);
    }
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth="lg" sx={styles.inner}>
        <Header playerNickname={playerNickname} />
        <ActionButtons
          onCreate={handleCreateRoom}
          onOpenJoin={() => setShowJoinDialog(true)}
        />
        <StatsCards stats={stats} loading={statsLoading} />
        <Box sx={styles.grid}>
          <RecentGames games={games} loading={gamesLoading} onRefresh={refetch} />
          <Leaderboard leaderboard={leaderboard} loading={leaderboardLoading} />
        </Box>
        <NicknameDialog open={showNicknameDialog} nicknameInput={nicknameInput}
          setNicknameInput={setNicknameInput} onSave={handleSaveNickname}
          error={nicknameError} onClose={() => setShowNicknameDialog(false)}
        />
        <JoinDialog open={showJoinDialog} gameIdInput={gameIdInput}
          setGameIdInput={setGameIdInput} onJoin={handleJoinRoom}
          onClose={() => {
            setShowJoinDialog(false);
            setGameIdInput("");
          }}
        />
      </Container>
    </Box>
  );
}
