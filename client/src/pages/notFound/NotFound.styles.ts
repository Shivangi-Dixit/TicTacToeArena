import type { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  root: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "background.default",
    p: 2,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    mx: 2,
  },
  contentBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minHeight: 300,
  },
  icon: {
    fontSize: 48,
    color: (theme) => theme.palette.error.main,
    mb: 1,
  },
  title: {
    typography: "h5",
    fontWeight: 700,
    color: "text.primary",
  },
  message: {
    typography: "body2",
    color: "text.secondary",
    mt: 1.5,
  },
  button: {
    mt: 3,
  },
};
