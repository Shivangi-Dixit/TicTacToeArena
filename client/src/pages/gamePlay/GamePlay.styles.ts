import { SxProps, Theme } from "@mui/system";

export const container: SxProps<Theme> = {
  minHeight: "100vh",
  bgcolor: "#ffffff",
};

export const appBar: SxProps<Theme> = {
  bgcolor: "#f8f9fa",
  borderBottom: "2px solid #e5e7eb",
};

export const backButton: SxProps<Theme> = {
  color: "#434b51",
  fontWeight: 600,
  textTransform: "uppercase",
  "&:hover": { bgcolor: "rgba(240, 82, 50, 0.05)" },
};

export const connectionChip: SxProps<Theme> = {
  fontWeight: 600,
};

export const contentContainer: SxProps<Theme> = {
  py: 6,
};

export const grid: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
  gap: 4,
};

export const playersCard: SxProps<Theme> = {
  border: "2px solid #f05232",
  boxShadow: "0 4px 12px rgba(240, 82, 50, 0.15)",
};

export const playerBoxBase: SxProps<Theme> = {
  p: 2,
  borderRadius: 2,
  transition: "all 0.3s ease",
};

export const playerBoxActiveX: SxProps<Theme> = {
  bgcolor: "rgba(240, 82, 50, 0.1)",
  border: "2px solid #f05232",
};

export const playerBoxActiveO: SxProps<Theme> = {
  bgcolor: "rgba(59, 130, 246, 0.1)",
  border: "2px solid #3b82f6",
};

export const playerBoxInactive: SxProps<Theme> = {
  bgcolor: "#f8f9fa",
  border: "2px solid #e5e7eb",
};

export const statusCard: SxProps<Theme> = {
  border: "2px solid #3b82f6",
  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
};

export const forfeitButton: SxProps<Theme> = {
  mt: 2,
  py: 1.5,
  borderColor: "#ef4444",
  color: "#ef4444",
  fontWeight: 600,
  textTransform: "uppercase",
  "&:hover": {
    borderColor: "#dc2626",
    bgcolor: "rgba(239, 68, 68, 0.05)",
    color: "#dc2626",
  },
};

export const loadingBox: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "#ffffff",
};

export const notFoundBox: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 3,
  bgcolor: "#ffffff",
};

export const notFoundCard: SxProps<Theme> = {
  maxWidth: 500,
  width: "100%",
  border: "2px solid #d1d5db",
  boxShadow: 3,
};

export const returnHomeButton: SxProps<Theme> = {
  bgcolor: "#f05232",
  "&:hover": { bgcolor: "#d64728" },
};