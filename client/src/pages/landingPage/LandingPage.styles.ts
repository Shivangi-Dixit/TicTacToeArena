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

export const dialogTitleSx: SxProps = {
  fontWeight: 700,
  fontSize: "1.5rem",
};

export const titleStackSx: SxProps = {
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
};

export const contentTextSx: SxProps = {
  mb: 3,
  mt: 1,
  color: "text.secondary",
};

export const actionsSx: SxProps = {
  p: 3,
  pt: 1,
};

export const cancelButtonSx: SxProps = {
  fontWeight: 600,
};

export const joinButtonSx: SxProps = {
  px: 4,
  fontWeight: 700,
};




export const headheaderBoxSx: SxProps = {
  textAlign: "center",
  mb: 6,
};

export const headTitleStackSx: SxProps = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
  mb: 2,
};

export const iconBoxSx: SxProps = {
  display: "inline-flex",
  animation: "pulse 2s infinite",
};

export const titleTextSx: SxProps = {
  color: "#434b51",
  letterSpacing: "0.02em",
  fontWeight: 800,
};

export const subtitleTextSx: SxProps = {
  fontWeight: 300,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "text.secondary",
};

export const chipSx: SxProps = {
  mt: 2,
  px: 2,
  fontSize: "1rem",
  fontWeight: 600,
};



export const nicknameDialogTitleSx: SxProps = {
  fontWeight: 700,
  fontSize: "1.5rem",
};

export const dialogActionsSx: SxProps = {
  p: 3,
  pt: 1,
};

export const saveButtonSx: SxProps = {
  py: 1.5,
  fontWeight: 700,
};



export const containerSx: SxProps = { mb: 6 };

export const labelSx: SxProps = {
  color: "text.secondary",
  fontWeight: 600,
  fontSize: "0.9rem",
};

// --- Total Games ---
export const totalGamesCardSx: SxProps = {
  flex: 1,
  background: "linear-gradient(135deg, rgba(240,82,50,0.08), rgba(240,82,50,0.03))",
  border: "2px solid rgba(240,82,50,0.3)",
};
export const totalGamesIconBoxSx: SxProps = {
  p: 1.5,
  bgcolor: "rgba(240,82,50,0.15)",
  borderRadius: 2,
};
export const totalGamesIconSx: SxProps = { fontSize: 32, color: "primary.main" };
export const totalGamesValueSx: SxProps = { fontWeight: 800, fontSize: "2rem", color: "primary.main" };

// --- Completed Games ---
export const completedGamesCardSx: SxProps = {
  flex: 1,
  background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))",
  border: "2px solid rgba(34,197,94,0.3)",
};
export const completedGamesIconBoxSx: SxProps = {
  p: 1.5,
  bgcolor: "rgba(34,197,94,0.15)",
  borderRadius: 2,
};
export const completedGamesIconSx: SxProps = { fontSize: 32, color: "success.main" };
export const completedGamesValueSx: SxProps = { fontWeight: 800, fontSize: "2rem", color: "success.main" };

// --- Active Games ---
export const activeGamesCardSx: SxProps = {
  flex: 1,
  background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))",
  border: "2px solid rgba(59,130,246,0.3)",
};
export const activeGamesIconBoxSx: SxProps = {
  p: 1.5,
  bgcolor: "rgba(59,130,246,0.15)",
  borderRadius: 2,
};
export const activeGamesIconSx: SxProps = { color: "info.main" };
export const activeGamesValueSx: SxProps = { fontWeight: 800, fontSize: "2rem", color: "info.main" };
