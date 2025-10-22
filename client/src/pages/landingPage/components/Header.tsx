import { Box, Stack, Typography, Chip, Zoom, Fade } from "@mui/material";
import GamingIcon from "@mui/icons-material/SportsEsports";
import * as styles from "../GameLanding.styles";
import { OIcon, XIcon } from "@/shared/Icons";

export default function Header({ playerNickname }: { playerNickname: string | null }) {
  return (
    <Fade in timeout={800}>
      <Box sx={styles.headerBox}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Zoom in timeout={600}>
            <Box sx={{ display: "inline-flex", animation: "pulse 2s infinite" }}>
              <XIcon size={48} />
            </Box>
          </Zoom>
          <Typography variant="h2" component="h1" fontWeight="800" sx={{ color: "#434b51", letterSpacing: "0.02em" }}>
            TIC-TAC-TOE
          </Typography>
          <Zoom in timeout={600} style={{ transitionDelay: "100ms" }}>
            <Box sx={{ display: "inline-flex", animation: "pulse 2s infinite" }}>
              <OIcon size={48} />
            </Box>
          </Zoom>
        </Stack>

        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Multiplayer Arena
        </Typography>

        <Chip
          label={`Welcome, ${playerNickname || "Guest"}!`}
          icon={<GamingIcon />}
          color="primary"
          sx={{ mt: 2, px: 2, fontSize: "1rem", fontWeight: 600 }}
        />
      </Box>
    </Fade>
  );
}