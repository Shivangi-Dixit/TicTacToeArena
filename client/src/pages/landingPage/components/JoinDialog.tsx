import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export default function JoinDialog({
  open, gameIdInput, setGameIdInput, onJoin, onClose,
}: {
  open: boolean;
  gameIdInput: string;
  setGameIdInput: (v: string) => void;
  onJoin: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LoginIcon color="primary" />
          <span>Join Room</span>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 1 }}>
          Enter the Game ID shared by another player to join their room.
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          label="Game ID"
          type="text"
          fullWidth
          variant="outlined"
          value={gameIdInput}
          onChange={(e) => setGameIdInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === "Enter") onJoin(); }}
          data-testid="input-game-id"
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button onClick={onJoin} variant="contained" disabled={!gameIdInput.trim()} data-testid="button-join-confirm" sx={{ px: 4, fontWeight: 700 }}>
          Join Game
        </Button>
      </DialogActions>
    </Dialog>
  );
}