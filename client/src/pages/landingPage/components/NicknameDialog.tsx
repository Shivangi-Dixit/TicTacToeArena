import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { LANDING_MODULE_TEXTS } from "../LandingPage.texts";
import * as styles from "../LandingPage.styles";

interface NicknameDialogProps {
  open: boolean;
  nicknameInput: string;
  setNicknameInput: (v: string) => void;
  onSave: () => void;
  error?: string;
  onClose: () => void;
}

export default function NicknameDialog({ open, nicknameInput, setNicknameInput, onSave, error, onClose,
}: NicknameDialogProps) {
  return (
    <Dialog open={open} onClose={(_, reason) => {
      if (reason !== "backdropClick") onClose();
    }} maxWidth="xs"
      fullWidth    >
      <DialogTitle sx={styles.nicknameDialogTitleSx}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonIcon color="primary" />
          <span>{LANDING_MODULE_TEXTS.NICKNAME_DIALOG.TITLE}</span>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <TextField autoFocus margin="dense" label="Nickname" type="text"
          fullWidth variant="outlined" value={nicknameInput} onChange={(e) => setNicknameInput(e.target.value)}
          error={!!error} helperText={error} onKeyPress={(e) => {
            if (e.key === "Enter") onSave();
          }} data-testid="input-nickname" />
      </DialogContent>

      <DialogActions sx={styles.dialogActionsSx}>
        <Button onClick={onSave}
          variant="contained" fullWidth
          size="large" data-testid="button-save-nickname" sx={styles.saveButtonSx}
        >  {LANDING_MODULE_TEXTS.NICKNAME_DIALOG.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
