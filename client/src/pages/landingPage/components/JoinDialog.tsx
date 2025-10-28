import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography, } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { LANDING_MODULE_TEXTS } from "../LandingPage.texts";
import * as styles from "../LandingPage.styles";

export default function JoinDialog({ open, gameIdInput, setGameIdInput, onJoin, onClose, }: {
  open: boolean; gameIdInput: string;
  setGameIdInput: (v: string) => void;
  onJoin: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={styles.dialogTitleSx}>
        <Stack sx={styles.titleStackSx}>
          <LoginIcon color="primary" />
          <span>{LANDING_MODULE_TEXTS.JOIN_DIALOG.TITLE}</span>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={styles.contentTextSx}>
          {LANDING_MODULE_TEXTS.JOIN_DIALOG.PLACEHOLDER}
        </Typography>

        <TextField autoFocus margin="dense"
          label="Game ID" type="text"
          fullWidth variant="outlined"
          value={gameIdInput} onChange={(e) => setGameIdInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") onJoin();
          }} data-testid="input-game-id" />      </DialogContent>

      <DialogActions sx={styles.actionsSx}>
        <Button onClick={onClose} sx={styles.cancelButtonSx}>
          {LANDING_MODULE_TEXTS.JOIN_DIALOG.CANCEL}
        </Button>
        <Button onClick={onJoin} variant="contained" disabled={!gameIdInput.trim()}
          data-testid="button-join-confirm" sx={styles.joinButtonSx}
        >{LANDING_MODULE_TEXTS.JOIN_DIALOG.JOIN}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
