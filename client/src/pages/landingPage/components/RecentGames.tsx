import { Card, CardContent, Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Stack, Divider, IconButton, Fade } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GamingIcon from "@mui/icons-material/SportsEsports";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import type { Game } from "@shared/schema";
import { OIcon, XIcon } from "@/shared/Icons";

export default function RecentGames({ games, loading, onRefresh }: { games?: Game[]; loading: boolean; onRefresh?: () => void; }) {
  const recentGames = games?.slice(0, 5) || [];

  return (
    <Card sx={{ flex: { lg: "1 1 60%" }, bgcolor: "background.paper", border: "2px solid rgba(240,82,50,0.3)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box><XIcon size={28} /></Box>
            <Typography variant="h5" fontWeight="700">Recent Games</Typography>
            <Chip label="Last 5" size="small" color="primary" />
          </Stack>
          <IconButton onClick={() => onRefresh?.()} size="small" sx={{ bgcolor: "rgba(240,82,50,0.1)" }}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "rgba(240,82,50,0.2)" }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        ) : recentGames.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <GamingIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary" variant="h6">No games yet</Typography>
            <Typography color="text.secondary" variant="body2">Create a room to get started!</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Player 1</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "info.main" }}>Player 2</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Result</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentGames.map((game, index) => (
                  <Fade in timeout={300 + index * 100} key={game.id}>
                    <TableRow hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <XIcon size={20} />
                          <Typography variant="body2" fontWeight={600}>{game.player1Nickname}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <OIcon size={20} />
                          <Typography variant="body2" fontWeight={600}>{game.player2Nickname || "Waiting..."}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {game.winner === "Draw" && <Chip label="DRAW" size="small" sx={{ bgcolor: "warning.main", color: "black", fontWeight: 700 }} />}
                        {game.winner === "Player 1" && <Chip label={`${game.player1Nickname} WON`} size="small" icon={<TrophyIcon />} sx={{ bgcolor: "primary.main", color: "white", fontWeight: 700 }} />}
                        {game.winner === "Player 2" && <Chip label={`${game.player2Nickname} WON`} size="small" icon={<TrophyIcon />} sx={{ bgcolor: "info.main", color: "white", fontWeight: 700 }} />}
                        {!game.winner && game.status !== "completed" && <Chip label="-" size="small" variant="outlined" />}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={game.status === "waiting" ? "WAITING" : game.status === "playing" ? "LIVE" : "COMPLETED"}
                          size="small"
                          sx={{
                            bgcolor: game.status === "completed" ? "success.main" : game.status === "playing" ? "warning.main" : "info.main",
                            color: game.status === "playing" ? "black" : "white",
                            fontWeight: 700,
                          }}
                        />
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