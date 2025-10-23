import { SxProps } from "@mui/system";

export const container: SxProps = {
  minHeight: "100vh",
  bgcolor: "background.default",
  py: 6,
  position: "relative",
  overflow: "hidden",
};

export const inner: SxProps = { position: "relative", zIndex: 1 };

export const grid: SxProps = {
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  gap: 4,
  mt: 3,
};

export const headerBox = {
  mb: 6,
  textAlign: "center",
};

export const actionStack = {
  mb: 6,
  display: "flex",
  gap: 3,
  flexDirection: { xs: "column", sm: "row" },
};

export const containedButton = {
  py: 3,
  fontSize: "1.1rem",
  background: "linear-gradient(135deg, #f05232 0%, #ff6b4a 100%)",
  boxShadow: "0 8px 24px rgba(240, 82, 50, 0.4)",
  "&:hover": { boxShadow: "0 12px 32px rgba(240, 82, 50, 0.6)" },
};
export const outlinedButton = {
  py: 3,
  fontSize: "1.1rem",
  borderWidth: 2,
  borderColor: "primary.main",
  color: "primary.main",
};

export const leaderboardCardSx = {
  flex: { lg: "1 1 40%" },
  bgcolor: "background.paper",
  border: "2px solid rgba(245,158,11,0.4)",
  boxShadow: "0 8px 24px rgba(245,158,11,0.15)",
};

export const leaderboardHeaderSx = { mb: 3 };

export const leaderboardIconSx = { fontSize: 32, color: "warning.main" };

export const leaderboardDividerSx = {
  mb: 3,
  borderColor: "rgba(251,191,36,0.2)",
};

export const loadingBoxSx = {
  display: "flex",
  justifyContent: "center",
  py: 6,
};

export const emptyBoxSx = { textAlign: "center", py: 6 };
export const emptyIconSx = { fontSize: 64, color: "text.disabled", mb: 2 };

export const tableHeaderCellSx = { fontWeight: 700 };

export const getRankChipSx = (index: number) => ({
  fontWeight: 800,
  fontSize: "0.85rem",
  minWidth: 45,
  bgcolor:
    index === 0
      ? "#FFD700"
      : index === 1
      ? "#C0C0C0"
      : index === 2
      ? "#CD7F32"
      : "rgba(240,82,50,0.2)",
  color: index < 3 ? "#000" : "#fff",
});

export const getPlayerNameSx = (index: number) => ({
  fontWeight: index < 3 ? 700 : 600,
  color: index < 3 ? "warning.main" : "text.primary",
});

export const winsChipSx = {
  fontWeight: 800,
  bgcolor: "primary.main",
  color: "white",
  minWidth: 40,
};

export const recentGamesCardSx = {
  flex: { lg: "1 1 60%" },
  bgcolor: "background.paper",
  border: "2px solid rgba(240,82,50,0.3)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

export const headerBoxSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3,
};
export const headerStackSx = { display: "flex", alignItems: "center", gap: 1 };
export const refreshButtonSx = { bgcolor: "rgba(240,82,50,0.1)" };

export const dividerSx = { mb: 3, borderColor: "rgba(240,82,50,0.2)" };

export const tableHeaderPlayer1Sx = { fontWeight: 700, color: "primary.main" };
export const tableHeaderPlayer2Sx = { fontWeight: 700, color: "info.main" };
export const tableHeaderDefaultSx = { fontWeight: 700 };

export const playerNameSx = { fontWeight: 600 };

export const drawChipSx = {
  bgcolor: "warning.main",
  color: "black",
  fontWeight: 700,
};
export const player1WinChipSx = {
  bgcolor: "primary.main",
  color: "white",
  fontWeight: 700,
};
export const player2WinChipSx = {
  bgcolor: "info.main",
  color: "white",
  fontWeight: 700,
};
export const pendingChipSx = { fontWeight: 700 };

export const getStatusChipSx = (status: string) => ({
  bgcolor:
    status === "completed"
      ? "success.main"
      : status === "playing"
      ? "warning.main"
      : "info.main",
  color: status === "playing" ? "black" : "white",
  fontWeight: 700,
});

export const actionStackheaderBoxSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 3,
};
