import { NavLink } from "react-router-dom";
import { useGame } from "../context/useGame";

const TopBar = () => {
  const { coins, stars } = useGame();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-600 text-white font-bold shadow-sm">
            ACE
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">Anime Card Empire</div>
            <div className="text-xs text-gray-500">Idle • Tap • Collect</div>
          </div>
        </div>

        <nav className="hidden md:flex gap-6 ml-6 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `py-2 px-3 rounded-md ${isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/cards"
            className={({ isActive }) =>
              `py-2 px-3 rounded-md ${isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"}`
            }
          >
            Cards
          </NavLink>

          <NavLink
            to="/nfts"
            className={({ isActive }) =>
              `py-2 px-3 rounded-md ${isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"}`
            }
          >
            NFTs
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `py-2 px-3 rounded-md ${isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"}`
            }
          >
            Profile
          </NavLink>
        </nav>
      </div>

      {/* Live small stats on the right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 shadow-sm">
          <span className="text-sm text-yellow-600">🪙</span>
          <div className="text-sm font-semibold text-gray-900">{Number(coins ?? 0)}</div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 shadow-sm">
          <span className="text-sm">⭐</span>
          <div className="text-sm font-semibold text-gray-900">{(Number(stars ?? 0)).toFixed(3)}</div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
