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
