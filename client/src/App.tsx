import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { queryClient } from "./lib/queryClient";
import GamePlay from "@/pages/gamePlay/GamePlay";
import NotFound from "@/pages/notFound/not-found";
import { gamingTheme } from "./lib/theme";
import GameLandingPage from "./pages/landingPage/GameLandingPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={gamingTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GameLandingPage />} />
            <Route path="/game/:gameId" element={<GamePlay />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
