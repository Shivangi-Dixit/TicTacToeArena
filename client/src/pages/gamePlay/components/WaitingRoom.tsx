import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Stack, LinearProgress, Chip, Fade } from "@mui/material";
import { HourglassEmpty as HourglassIcon, Cancel as CancelIcon, ContentCopy as CopyIcon } from "@mui/icons-material";
import { apiRequest } from "@/lib/queryClient";

interface WaitingRoomProps {
  gameId: string;
  playerNickname: string;
  onCancel: () => void;
}

const EXPIRY_TIME_MINUTES = 10;

export function WaitingRoom({ gameId, playerNickname, onCancel }: WaitingRoomProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(EXPIRY_TIME_MINUTES * 60);
  const [progress, setProgress] = useState<number>(100);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          apiRequest("DELETE", `/api/games/${gameId}`)
            .then(() => console.log(`Game ${gameId} deleted due to expiry`))
            .catch((err) => console.error("Failed to delete expired game:", err))
            .finally(() => onCancel());
          return 0;
        }
        setProgress((next / (EXPIRY_TIME_MINUTES * 60)) * 100);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameId, onCancel]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyGameId = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelClick = async () => {
    try {
      await apiRequest("DELETE", `/api/games/${gameId}`);
      console.log(`Game ${gameId} cancelled and deleted`);
    } catch (error) {
      console.error("Failed to delete cancelled game:", error);
    }
    onCancel();
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
      <Fade in timeout={600}>
        <Card sx={{ maxWidth: 500, width: "100%", p: 4 }}>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <HourglassIcon sx={{ fontSize: 40, color: "#f05232" }} />
              <Typography variant="h4">Waiting for Opponent</Typography>
              <Typography variant="body1">Share the Game ID below with another player to start the match!</Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Typography variant="body2">Your Nickname</Typography>
                <Typography variant="body1" fontWeight={600}>{playerNickname}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Typography variant="body2">Game ID</Typography>
                <Chip label={gameId.slice(0, 8)} size="small" onClick={handleCopyGameId} icon={<CopyIcon />} />
              </Box>

              <Box sx={{ width: "100%", mt: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Time Remaining</Typography>
                  <Typography variant="h6" fontFamily="monospace" color={timeRemaining < 60 ? "error" : "primary"}>
                    {formatTime(timeRemaining)}
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Button variant="outlined" fullWidth startIcon={<CancelIcon />} onClick={handleCancelClick} sx={{ mt: 2 }}>
                Cancel Game
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
