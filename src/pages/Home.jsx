import TopBar from "../components/TopBar";
import TapButton from "../components/TapButton";
import CooldownBar from "../components/CooldownBar";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";
import { useGame } from "../context/useGame";

const Home = () => {
  const { stars, coins, tapLimit } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9ff] to-white text-gray-900">

      <TopBar />

      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Grid: left = main, right = sidebar */}
        <div className="grid grid-cols-12 gap-8">

          {/* LEFT: Main Play Area */}
          <section className="col-span-8">
            <div className="bg-white rounded-3xl p-10 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900">Tap to Earn</h2>
                  <p className="text-sm text-gray-500 mt-1">Active income — upgrade cards to increase passive stars.</p>
                </div>

                {/* Big star display (very visible) */}
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-lg text-center">
                    <p className="text-xs text-yellow-600">Total Stars</p>
                    <p className="text-3xl font-semibold text-yellow-700">⭐ <span className="ml-1">{Number(stars ?? 0).toFixed(3)}</span></p>
                  </div>
                </div>
              </div>

              {/* Cooldown + Tap area */}
              <div className="mb-8">
                <CooldownBar />
              </div>

              <div className="flex flex-col items-center">
                <TapButton />
                <p className="mt-6 text-sm text-gray-600">Tap Limit: <span className="font-medium text-gray-900">{tapLimit}</span></p>
                <p className="mt-2 text-sm text-gray-500">Coins: <span className="font-semibold text-gray-900">{Number(coins ?? 0)}</span></p>
              </div>
            </div>
          </section>

          {/* RIGHT: Sidebar with quick links + stats */}
          <aside className="col-span-4">
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Quick Links</h3>

                <div className="grid grid-cols-1 gap-3">
                  <Link to="/cards" className="block px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-indigo-700 font-medium">Cards</div>
                        <div className="text-xs text-gray-500">View & upgrade your cards</div>
                      </div>
                      <div className="text-indigo-700 font-semibold">→</div>
                    </div>
                  </Link>

                  <Link to="/nfts" className="block px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-100 hover:bg-yellow-100 transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-yellow-700 font-medium">NFT Marketplace</div>
                        <div className="text-xs text-gray-500">Claim with stars</div>
                      </div>
                      <div className="text-yellow-700 font-semibold">→</div>
                    </div>
                  </Link>

                  <Link to="/profile" className="block px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-800 font-medium">Profile</div>
                        <div className="text-xs text-gray-500">Account & settings</div>
                      </div>
                      <div className="text-gray-600 font-semibold">→</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Overview</h3>

                <div className="grid grid-cols-1 gap-4">
                  <StatCard label="Total Stars" value={stars ?? 0} large />
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Active Coins" value={coins ?? 0} />
                    <StatCard label="Tap Limit" value={tapLimit ?? 0} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
