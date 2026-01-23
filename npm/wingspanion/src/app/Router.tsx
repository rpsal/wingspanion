import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PlayersPage from "../pages/PlayersPage";
import NewGamePage from "../pages/NewGamePage";
import ScoringPage from "../pages/ScoringPage";
import ResultsPage from "../pages/ResultsPage";
import HistoryPage from "../pages/HistoryPage";
import GameDetailPage from "../pages/GameDetailPage";
import SettingsPage from "../pages/SettingsPage";

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/new-game" element={<NewGamePage />} />
        <Route path="/score" element={<ScoringPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<GameDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}