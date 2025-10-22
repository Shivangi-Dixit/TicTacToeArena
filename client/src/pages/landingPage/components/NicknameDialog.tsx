import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function NicknameDialog({
  open, nicknameInput, setNicknameInput, onSave, error, onClose,
}: {
  open: boolean;
  nicknameInput: string;
  setNicknameInput: (v: string) => void;
  onSave: () => void;
  error?: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={(_, reason) => { if (reason !== "backdropClick") onClose(); }} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonIcon color="primary" />
          <span>Enter Your Nickname</span>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nickname"
          type="text"
          fullWidth
          variant="outlined"
          value={nicknameInput}
          onChange={(e) => { setNicknameInput(e.target.value); }}
          error={!!error}
          helperText={error}
          onKeyPress={(e) => { if (e.key === "Enter") onSave(); }}
          data-testid="input-nickname"
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onSave} variant="contained" fullWidth size="large" data-testid="button-save-nickname" sx={{ py: 1.5, fontWeight: 700 }}>
          Start Playing
        </Button>
      </DialogActions>
    </Dialog>
  );
}