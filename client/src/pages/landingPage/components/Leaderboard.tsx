import { Card, CardContent, Stack, Typography, Divider, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Fade } from "@mui/material";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import type { LeaderboardEntry } from "@shared/schema";

export default function Leaderboard({ leaderboard, loading }: { leaderboard?: LeaderboardEntry[]; loading: boolean; }) {
  return (
    <Card sx={{ flex: { lg: "1 1 40%" }, bgcolor: "background.paper", border: "2px solid rgba(245,158,11,0.4)", boxShadow: "0 8px 24px rgba(245,158,11,0.15)" }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <TrophyIcon sx={{ fontSize: 32, color: "warning.main" }} />
          <Typography variant="h5" fontWeight="700">Top Players</Typography>
        </Stack>

        <Divider sx={{ mb: 3, borderColor: "rgba(251,191,36,0.2)" }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        ) : !leaderboard || leaderboard.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <TrophyIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">No champions yet</Typography>
            <Typography color="text.secondary" variant="body2">Be the first to win!</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Wins</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <Fade in timeout={300 + index * 80} key={entry.playerNickname}>
                    <TableRow hover>
                      <TableCell>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.85rem",
                            minWidth: 45,
                            bgcolor: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : index === 2 ? "#CD7F32" : "rgba(240,82,50,0.2)",
                            color: index < 3 ? "#000" : "#fff",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={index < 3 ? 700 : 600} sx={{ color: index < 3 ? "warning.main" : "text.primary" }}>
                          {entry.playerNickname}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={entry.wins} size="small" sx={{ fontWeight: 800, bgcolor: "primary.main", color: "white", minWidth: 40 }} />
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}