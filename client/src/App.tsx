import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { queryClient } from "./lib/queryClient";
import GamePlay from "@/pages/gamePlay/GamePlay";
import NotFound from "@/pages/notFound/NotFound";
import { gamingTheme } from "./lib/theme";
import LandingPage from "./pages/landingPage/LandingPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={gamingTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game/:gameId" element={<GamePlay />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
