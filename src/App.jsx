import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Home from "./pages/Home";
import Cards from "./pages/Cards";
import NFTMarketplace from "./pages/NFTMarketplace";
import Profile from "./pages/Profile";

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/nfts" element={<NFTMarketplace />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
