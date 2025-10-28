export type Board = (string | null)[];

export function isValidMove(board: Board, cellIndex: number): boolean {
  if (cellIndex < 0 || cellIndex > 8) {
    return false;
  }
  return board[cellIndex] === null;
}

export function applyMove(
  board: Board,
  cellIndex: number,
  symbol: "X" | "O"
): Board {
  const newBoard = [...board];
  newBoard[cellIndex] = symbol;
  return newBoard;
}

export function toggleTurn(currentTurn: "X" | "O"): "X" | "O" {
  return currentTurn === "X" ? "O" : "X";
}

export function checkWinner(board: Board): "X" | "O" | "Draw" | null {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as "X" | "O";
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "Draw";
  }

  return null;
}

export function getWinnerDisplay(result: "X" | "O" | "Draw"): string {
  if (result === "Draw") return "Draw";
  if (result === "X") return "Player 1";
  if (result === "O") return "Player 2";
  return "Unknown";
}
