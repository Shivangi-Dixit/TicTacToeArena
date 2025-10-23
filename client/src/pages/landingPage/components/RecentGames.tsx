import { Card, CardContent, Box, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Stack, Divider, IconButton, Fade } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import GamingIcon from "@mui/icons-material/SportsEsports";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import type { Game } from "@shared/schema";
import { OIcon, XIcon } from "@/shared/Icons";
import * as styles from "../GameLandingPage.styles";

export default function RecentGames({ games, loading, onRefresh }: { games?: Game[]; loading: boolean; onRefresh?: () => void; }) {
  const recentGames = games?.slice(0, 5) || [];

  return (
    <Card sx={styles.recentGamesCardSx}>
      <CardContent>
        <Box sx={styles.actionStackheaderBoxSx}>
          <Stack direction="row" alignItems="center" spacing={1} sx={styles.headerStackSx}>
            <Box><XIcon size={28} /></Box>
            <Typography variant="h5" fontWeight="700">Recent Games</Typography>
            <Chip label="Last 5" size="small" color="primary" />
          </Stack>
          <IconButton onClick={() => onRefresh?.()} size="small" sx={styles.refreshButtonSx}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Divider sx={styles.dividerSx} />

        {loading ? (
          <Box sx={styles.loadingBoxSx}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        ) : recentGames.length === 0 ? (
          <Box sx={styles.emptyBoxSx}>
            <GamingIcon sx={styles.emptyIconSx} />
            <Typography color="text.secondary" variant="h6">No games yet</Typography>
            <Typography color="text.secondary" variant="body2">Create a room to get started!</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeaderPlayer1Sx}>Player 1</TableCell>
                  <TableCell sx={styles.tableHeaderPlayer2Sx}>Player 2</TableCell>
                  <TableCell sx={styles.tableHeaderDefaultSx}>Result</TableCell>
                  <TableCell align="right" sx={styles.tableHeaderDefaultSx}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentGames.map((game, index) => (
                  <Fade in timeout={300 + index * 100} key={game.id}>
                    <TableRow hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <XIcon size={20} />
                          <Typography variant="body2" sx={styles.playerNameSx}>{game.player1Nickname}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <OIcon size={20} />
                          <Typography variant="body2" sx={styles.playerNameSx}>{game.player2Nickname || "Waiting..."}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {game.winner === "Draw" && <Chip label="DRAW" size="small" sx={styles.drawChipSx} />}
                        {game.winner === "Player 1" && <Chip label={`${game.player1Nickname} WON`} size="small" icon={<TrophyIcon />} sx={styles.player1WinChipSx} />}
                        {game.winner === "Player 2" && <Chip label={`${game.player2Nickname} WON`} size="small" icon={<TrophyIcon />} sx={styles.player2WinChipSx} />}
                        {!game.winner && game.status !== "completed" && <Chip label="-" size="small" variant="outlined" sx={styles.pendingChipSx} />}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={game.status === "waiting" ? "WAITING" : game.status === "playing" ? "LIVE" : "COMPLETED"}
                          size="small"
                          sx={styles.getStatusChipSx(game.status)}
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