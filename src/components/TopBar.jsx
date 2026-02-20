import { NavLink } from "react-router-dom";
import { useGame } from "../context/useGame";

const TopBar = () => {
  const { coins, stars } = useGame();

  return (
    <header className="relative w-full bg-gray-900/90 backdrop-blur-md border-b border-indigo-500/20 px-6 py-3">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Logo icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-lg rounded-lg" />
              <div className="relative w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold shadow-lg border border-indigo-400/30">
                ACE
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-white tracking-wide">Anime Card Empire</div>
              <div className="text-xs text-indigo-300/70">Idle • Tap • Collect</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 ml-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/cards"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`
              }
            >
              Cards
            </NavLink>

            <NavLink
              to="/nfts"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`
              }
            >
              NFTs
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`
              }
            >
              Profile
            </NavLink>
          </nav>
        </div>

        {/* Live stats on the right */}
        <div className="flex items-center gap-3">
          {/* Coins */}
          <div className="flex items-center gap-2 bg-gray-800/60 border border-yellow-500/20 rounded-full px-3 py-1.5">
            <span className="text-sm">🪙</span>
            <div className="text-sm font-semibold text-yellow-200">{Number(coins ?? 0).toLocaleString()}</div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2 bg-gray-800/60 border border-indigo-500/20 rounded-full px-3 py-1.5">
            <span className="text-sm">⭐</span>
            <div className="text-sm font-semibold text-indigo-200">{(Number(stars ?? 0)).toFixed(3)}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
