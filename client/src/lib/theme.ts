import { createTheme } from "@mui/material";

export const gamingTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f05232",
      light: "#ff6b4a",
      dark: "#d43d1a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#434b51",
      light: "#5a6268",
      dark: "#2d3338",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f8f9fa",
    },
    text: {
      primary: "#434b51",
      secondary: "#6c757d",
    },
    success: {
      main: "#22c55e",
    },
    info: {
      main: "#3b82f6",
    },
    warning: {
      main: "#f59e0b",
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Exo 2", "Inter", system-ui, sans-serif',
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      letterSpacing: "0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(240, 82, 50, 0.4)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          boxShadow: "0 4px 14px rgba(240, 82, 50, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});
