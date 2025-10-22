import { Stack, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import * as styles from "../GameLanding.styles";

export default function ActionButtons({ onCreate, onOpenJoin }: { onCreate: () => void; onOpenJoin: () => void; }) {
  return (
    <Stack sx={styles.actionStack}>
      <Button variant="contained" size="large" fullWidth startIcon={<AddIcon />} onClick={onCreate} data-testid="button-create-room"
        sx={styles.containedButton}>Create New Room</Button>
      <Button variant="outlined" size="large" fullWidth startIcon={<LoginIcon />}
        onClick={onOpenJoin} data-testid="button-join-room"
        sx={styles.outlinedButton}>Join Room by ID</Button>
    </Stack>
  );
}