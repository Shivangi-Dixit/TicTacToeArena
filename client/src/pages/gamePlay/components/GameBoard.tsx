import { Box, Typography } from "@mui/material";

interface GameBoardProps {
  board: (string | null)[];
  onCellClick?: (index: number) => void;
  disabled?: boolean;
  winningCells?: number[];
  currentPlayer?: "X" | "O";
}

export function GameBoard({
  board,
  onCellClick,
  disabled = false,
  winningCells = [],
  currentPlayer = "X"
}: GameBoardProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <Box
        sx={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2, p: 3, bgcolor: "#f8f9fa",
          borderRadius: 2, border: "3px solid #e5e7eb",
        }}
        data-testid="game-board"
      >
        {board.map((cell, index) => {
          const isWinningCell = winningCells.includes(index);
          const isEmpty = cell === null;
          const isClickable = !disabled && isEmpty;

          return (
            <Box
              key={index}
              component="button"
              onClick={() => isClickable && onCellClick?.(index)}
              disabled={!isClickable}
              data-testid={`cell-${index}`}
              sx={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: "2.5rem", sm: "3rem" },
                fontWeight: 800,
                borderRadius: 2,
                border: isWinningCell ? "3px solid #22c55e" : "2px solid #d1d5db",
                bgcolor: isWinningCell ? "rgba(34, 197, 94, 0.1)" : "#ffffff",
                transition: "all 0.2s ease",
                cursor: isClickable ? "pointer" : disabled && isEmpty ? "not-allowed" : "default",
                opacity: disabled && isEmpty ? 0.5 : 1,
                "&:hover": isClickable ? {
                  bgcolor: "rgba(240, 82, 50, 0.05)",
                  borderColor: "#f05232",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(240, 82, 50, 0.2)",
                } : {},
                "&:active": isClickable ? {
                  transform: "translateY(0)",
                } : {},
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 3px rgba(240, 82, 50, 0.3)",
                },
              }}
            >
              {cell && (
                <Typography
                  sx={{
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    color: cell === "X" ? "#f05232" : "#3b82f6",
                    animation: "fadeInZoom 0.3s ease",
                    "@keyframes fadeInZoom": {
                      "0%": {
                        opacity: 0,
                        transform: "scale(0.5)",
                      },
                      "100%": {
                        opacity: 1,
                        transform: "scale(1)",
                      },
                    },
                  }}
                  data-testid={`mark-${cell}`}
                >
                  {cell}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {!disabled && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Current Turn:{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: "1rem",
                color: currentPlayer === "X" ? "#f05232" : "#3b82f6",
              }}
              data-testid="current-turn"
            >
              {currentPlayer}
            </Typography>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
