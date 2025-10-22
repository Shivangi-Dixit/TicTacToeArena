import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Stack,
  Zoom,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

interface GameResultModalProps {
  open: boolean;
  winner: string | null;
  onClose: () => void;
  playerSymbol?: "X" | "O";
}

export function GameResultModal({
  open,
  winner,
  onClose,
  playerSymbol
}: GameResultModalProps) {
  if (!winner) return null;

  const isDraw = winner === "Draw";
  const isPlayer1Win = winner === "Player 1";
  const isPlayer2Win = winner === "Player 2";
  const didYouWin =
    (isPlayer1Win && playerSymbol === "X") ||
    (isPlayer2Win && playerSymbol === "O");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#f8f9fa",
          border: "3px solid #f05232",
          boxShadow: "0 12px 40px rgba(240, 82, 50, 0.3)",
          borderRadius: 2,
        }
      }}
    >
      <DialogContent sx={{ p: 4 }} data-testid="modal-game-result">
        <Stack alignItems="center" spacing={3}>
          {/* Icon */}
          <Zoom in={open} timeout={400}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: isDraw ? "rgba(245, 158, 11, 0.1)" :
                  didYouWin ? "rgba(34, 197, 94, 0.1)" :
                    "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: didYouWin && !isDraw ? "celebration 1s ease" : "none",
                "@keyframes celebration": {
                  "0%, 100%": { transform: "scale(1) rotate(0deg)" },
                  "25%": { transform: "scale(1.1) rotate(-5deg)" },
                  "50%": { transform: "scale(1.15) rotate(5deg)" },
                  "75%": { transform: "scale(1.1) rotate(-5deg)" },
                },
              }}
            >
              {isDraw ? (
                <PeopleIcon sx={{ fontSize: 40, color: "#f59e0b" }} />
              ) : (
                <TrophyIcon sx={{
                  fontSize: 40,
                  color: didYouWin ? "#22c55e" : "#6c757d"
                }} />
              )}
            </Box>
          </Zoom>

          <Typography
            variant="h4"
            fontWeight="700"
            textAlign="center"
            sx={{ color: "#434b51" }}
            data-testid="text-result-title"
          >
            {isDraw && "It's a Draw!"}
            {didYouWin && "You Won!"}
            {!isDraw && !didYouWin && "You Lost"}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            data-testid="text-result-message"
          >
            {isDraw && "Well played! The game ended in a tie."}
            {didYouWin && "Congratulations on your victory!"}
            {!isDraw && !didYouWin && `${winner} wins this round. Better luck next time!`}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{
            py: 1.5,
            bgcolor: "#f05232",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "1rem",
            "&:hover": {
              bgcolor: "#d64728",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(240, 82, 50, 0.4)",
            },
            transition: "all 0.3s ease",
          }}
          data-testid="button-return-home"
        >
          Return to Home
        </Button>
      </DialogActions>
    </Dialog>
  );
}
