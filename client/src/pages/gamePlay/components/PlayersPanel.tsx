import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { OIcon, XIcon } from "../../../sharedComponent/Icons";
import type { Game } from "@shared/schema";
import * as styles from "../GamePlay.styles";
import { GAME_PLAY_TEXTS } from "../GamePlay.texts";

export default function PlayersPanel({ game }: { game: Game }) {
    return (
        <Card sx={styles.playersCard}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: "#434b51" }}>
                    {GAME_PLAY_TEXTS.PLAYERS_PANEL.PLAYERS}
                </Typography>

                <Stack spacing={2}>
                    <Box
                        sx={{
                            ...(styles.playerBoxBase as any),
                            ...(game.currentTurn === "X" ? (styles.playerBoxActiveX as any) : (styles.playerBoxInactive as any)),
                        }}
                        data-testid="player-1-info"
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="body1" fontWeight="600" sx={{ color: "#434b51" }}>
                                    {game.player1Nickname}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {GAME_PLAY_TEXTS.PLAYERS_PANEL.PLAYER_1}
                                </Typography>
                            </Box>
                            <XIcon size={32} />
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            ...(styles.playerBoxBase as any),
                            ...(game.currentTurn === "O" ? (styles.playerBoxActiveO as any) : (styles.playerBoxInactive as any)),
                        }}
                        data-testid="player-2-info"
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="body1" fontWeight="600" sx={{ color: "#434b51" }}>
                                    {game.player2Nickname}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {GAME_PLAY_TEXTS.PLAYERS_PANEL.PLAYER_2}
                                </Typography>
                            </Box>
                            <OIcon size={32} />
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}