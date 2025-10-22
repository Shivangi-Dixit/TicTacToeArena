import { Card, CardContent, Stack, Box, Typography, CircularProgress } from "@mui/material";
import GamingIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function StatsCards({ stats, loading }: { stats?: any; loading: boolean }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 6 }}>
      <Card sx={{ flex: 1, background: "linear-gradient(135deg, rgba(240,82,50,0.08), rgba(240,82,50,0.03))", border: "2px solid rgba(240,82,50,0.3)" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(240,82,50,0.15)", borderRadius: 2 }}>
              <GamingIcon sx={{ fontSize: 32, color: "primary.main" }} />
            </Box>
            <Box>
              <Typography color="text.secondary" variant="body2" fontWeight={600}>TOTAL GAMES</Typography>
              <Typography variant="h3" fontWeight="800" color="primary.main">
                {loading ? <CircularProgress size={24} /> : stats?.totalGames || 0}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))", border: "2px solid rgba(34,197,94,0.3)" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(34,197,94,0.15)", borderRadius: 2 }}>
              <EmojiEventsIcon sx={{ fontSize: 32, color: "success.main" }} />
            </Box>
            <Box>
              <Typography color="text.secondary" variant="body2" fontWeight={600}>COMPLETED</Typography>
              <Typography variant="h3" fontWeight="800" color="success.main">
                {loading ? <CircularProgress size={24} /> : (stats?.player1Wins || 0) + (stats?.player2Wins || 0) + (stats?.draws || 0)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))", border: "2px solid rgba(59,130,246,0.3)" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, bgcolor: "rgba(59,130,246,0.15)", borderRadius: 2 }}>
              <CircularProgress variant="determinate" value={75} size={32} sx={{ color: "info.main" }} />
            </Box>
            <Box>
              <Typography color="text.secondary" variant="body2" fontWeight={600}>ACTIVE GAMES</Typography>
              <Typography variant="h3" fontWeight="800" color="info.main">
                {loading ? <CircularProgress size={24} /> : stats?.totalGames ? stats.totalGames - ((stats.player1Wins || 0) + (stats.player2Wins || 0) + (stats.draws || 0)) : 0}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}