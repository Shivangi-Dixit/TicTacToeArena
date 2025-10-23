import { Card, CardContent, Stack, Typography, Divider, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Fade } from "@mui/material";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import type { LeaderboardEntry } from "@shared/schema";
import * as styles from "../GameLandingPage.styles";

export default function Leaderboard({ leaderboard, loading }: { leaderboard?: LeaderboardEntry[]; loading: boolean; }) {
  return (
    <Card sx={styles.leaderboardCardSx}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={styles.leaderboardHeaderSx}>
          <TrophyIcon sx={styles.leaderboardIconSx} />
          <Typography variant="h5" fontWeight="700">Top Players</Typography>
        </Stack>

        <Divider sx={styles.leaderboardDividerSx} />

        {loading ? (
          <Box sx={styles.loadingBoxSx}>
            <CircularProgress size={48} thickness={4} />
          </Box>
        ) : !leaderboard || leaderboard.length === 0 ? (
          <Box sx={styles.emptyBoxSx}>
            <TrophyIcon sx={styles.emptyIconSx} />
            <Typography color="text.secondary">No champions yet</Typography>
            <Typography color="text.secondary" variant="body2">Be the first to win!</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeaderCellSx}>Rank</TableCell>
                  <TableCell sx={styles.tableHeaderCellSx}>Player</TableCell>
                  <TableCell align="right" sx={styles.tableHeaderCellSx}>Wins</TableCell>
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
                          sx={styles.getRankChipSx(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={styles.getPlayerNameSx(index)}>
                          {entry.playerNickname}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={entry.wins} size="small" sx={styles.winsChipSx} />
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