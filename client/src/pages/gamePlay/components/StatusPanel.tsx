import { Card, CardContent, Typography, Stack, Button, Chip } from "@mui/material";
import { ExitToApp as ForfeitIcon } from "@mui/icons-material";
import * as styles from "../GamePlay.styles";

export default function StatusPanel({
  playerSymbol,
  isPlayerTurn,
  showForfeit,
  onForfeit,
}: {
  playerSymbol: "X" | "O" | null;
  isPlayerTurn: boolean;
  showForfeit: boolean;
  onForfeit: () => void;
}) {
  return (
    <Card sx={styles.statusCard}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: "#434b51" }}>
          Game Status
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Your Symbol
            </Typography>
            <Typography variant="body1" fontWeight="700" sx={{ fontFamily: "monospace", color: "#434b51" }} data-testid="text-your-symbol">
              {playerSymbol || "—"}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Turn
            </Typography>
            <Chip label={isPlayerTurn ? "Your Turn" : "Opponent's Turn"} color={isPlayerTurn ? "primary" : "default"} size="small" sx={{ fontWeight: 600 }} data-testid="badge-turn-status" />
          </Stack>

          {showForfeit && (
            <Button variant="outlined" fullWidth startIcon={<ForfeitIcon />} onClick={onForfeit} sx={styles.forfeitButton} data-testid="button-forfeit">
              Forfeit Game
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}