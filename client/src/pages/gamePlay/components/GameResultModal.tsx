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
import * as styles from "../GamePlay.styles";

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
        sx: styles.dialogPaperSx,
      }}
    >
      <DialogContent sx={styles.dialogContentSx} data-testid="modal-game-result">
        <Stack alignItems="center" spacing={3}>
          <Zoom in={open} timeout={400}>
            <Box sx={styles.getIconBoxSx(isDraw, didYouWin)}>
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
            sx={styles.titleSx}
            data-testid="text-result-title"
          >
            {isDraw && "It's a Draw!"}
            {didYouWin && "You Won!"}
            {!isDraw && !didYouWin && "You Lost"}
          </Typography>

          <Typography
            variant="body1"
            sx={styles.messageSx}
            data-testid="text-result-message"
          >
            {isDraw && "Well played! The game ended in a tie."}
            {didYouWin && "Congratulations on your victory!"}
            {!isDraw && !didYouWin && `${winner} wins this round. Better luck next time!`}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={styles.actionsSx}>
        <Button variant="contained"
          onClick={onClose} fullWidth sx={styles.buttonSx}
          data-testid="button-return-home"        >
          Return to Home
        </Button>
      </DialogActions>
    </Dialog>
  );
}
