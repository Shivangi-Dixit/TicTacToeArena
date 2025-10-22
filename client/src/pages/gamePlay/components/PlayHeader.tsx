import { AppBar, Toolbar, Button, Box, Chip } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Wifi as WifiIcon, WifiOff as WifiOffIcon, Autorenew as ReconnectIcon } from "@mui/icons-material";
import * as styles from "../GamePlay.styles";

export default function PlayHeader({
  onBack,
  isConnected,
  isReconnecting,
}: {
  onBack: () => void;
  isConnected: boolean;
  isReconnecting: boolean;
}) {
  return (
    <AppBar position="sticky" elevation={0} sx={styles.appBar}>
      <Toolbar>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={styles.backButton} data-testid="button-back">
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          icon={
            isConnected ? <WifiIcon /> : isReconnecting ? <ReconnectIcon className="animate-spin" /> : <WifiOffIcon />
          }
          label={isConnected ? "Connected" : isReconnecting ? "Reconnecting..." : "Disconnected"}
          color={isConnected ? "success" : isReconnecting ? "warning" : "error"}
          sx={styles.connectionChip}
          data-testid="badge-connection"
        />
      </Toolbar>
    </AppBar>
  );
}