import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Cards from "./pages/Cards";
import NFTMarketplace from "./pages/NFTMarketplace";
import Profile from "./pages/Profile";
import Setup from "./pages/Setup";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/nfts" element={<NFTMarketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setup" element={<Setup />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
