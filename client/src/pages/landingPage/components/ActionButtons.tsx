import { Stack, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import * as styles from "../LandingPage.styles";
import { LANDING_MODULE_TEXTS } from "../LandingPage.texts";

export default function ActionButtons({ onCreate, onOpenJoin }: { onCreate: () => void; onOpenJoin: () => void; }) {
  return (
    <Stack sx={styles.actionStack}>
      <Button variant="contained" size="large" fullWidth startIcon={<AddIcon />} onClick={onCreate} data-testid="button-create-room"
        sx={styles.containedButton}>{LANDING_MODULE_TEXTS.ACTION_BUTTONS.CREATE_NEW_ROOM}</Button>
      <Button variant="outlined" size="large" fullWidth startIcon={<LoginIcon />}
        onClick={onOpenJoin} data-testid="button-join-room"
        sx={styles.outlinedButton}>{LANDING_MODULE_TEXTS.ACTION_BUTTONS.JOIN_ROOM_BY_ID}</Button>
    </Stack>
  );
}