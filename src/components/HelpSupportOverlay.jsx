import { createPortal } from "react-dom";
import "../styles/HelpTermsPrivacy.css";


const HelpSupportOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const content = (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal max-h-[90vh] max-w-2xl w-[95vw] help-terms-privacy-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="edit-header">
          <h3>Help & Support</h3>
          <button className="edit-close" onClick={onClose}>×</button>
        </div>
        
        <div className="prose prose-invert max-w-none p-6 space-y-6 overflow-y-auto">
          <h4 className="text-emerald-400 mb-6 mt-0">Game Guide - How to Play</h4>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur border border-white/10">
              <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                Home - Tap to Earn
              </h5>
              <p><strong>Tap Action:</strong> Click the big central button to earn coins (max 100 taps per session, auto-refills). Coins per tap increases with your level!</p>
              <p><strong>Daily Streak:</strong> 🔥 Fire badge gives bonus coins (1.07x multiplier per day + 100x milestone rewards).</p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur border border-white/10">
              <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></span>
                Cards
              </h5>
              <p><strong>Upgrade Cards:</strong> Spend coins to level up anime cards (Starter card included).</p>
              <p><strong>Passive Stars:</strong> Level 4+ cards generate stars per hour automatically.</p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur border border-white/10">
              <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></span>
                NFT Marketplace
              </h5>
              <p><strong>Premium NFTs:</strong> Spend stars to buy rare anime NFTs.</p>
              <p><strong>Super Passive:</strong> NFTs generate massive stars per hour + status symbols.</p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur border border-white/10">
              <h5 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full"></span>
                Profile
              </h5>
              <p><strong>Stats Dashboard:</strong> Track coins, stars, cards, NFTs, level, achievements.</p>
              <p><strong>Progress Tracking:</strong> Level guide, achievement tracker, all stats at glance.</p>
            </div>
          </div>

          <h4 className="text-emerald-400 mb-6 mt-12">Frequently Asked Questions</h4>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="faq-item border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer" onClick={() => {}}>
              <h5 className="font-bold text-white mb-2">Q: How do I earn coins?</h5>
              <p className="text-gray-300 text-sm">A: Tap the main button on Home up to 100 times per session. Level up for more coins per tap!</p>
            </div>

            <div className="faq-item border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer" onClick={() => {}}>
              <h5 className="font-bold text-white mb-2">Q: What are stars for?</h5>
              <p className="text-gray-300 text-sm">A: Stars = premium currency from leveled cards. Use to buy powerful NFT cards in Marketplace.</p>
            </div>

            <div className="faq-item border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer" onClick={() => {}}>
              <h5 className="font-bold text-white mb-2">Q: How does leveling work?</h5>
              <p className="text-gray-300 text-sm">A: Level based on highest coins ever. Check Profile "i" icon for full Level Guide.</p>
            </div>

            <div className="faq-item border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer" onClick={() => {}}>
              <h5 className="font-bold text-white mb-2">Q: Daily streak bonus?</h5>
              <p className="text-gray-300 text-sm">A: Badge on Home = bonus coins (1.07x/day multiplier). 7/30/90 days = 100x rewards!</p>
            </div>

            <div className="faq-item border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer" onClick={() => {}}>
              <h5 className="font-bold text-white mb-2">Q: Tap limit?</h5>
              <p className="text-gray-300 text-sm">A: 100 taps/session, refills 1/sec. Progress bar shows status.</p>
            </div>

            <div className="faq-item border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:bg-white/10 transition-all cursor-pointer" onClick={() => {}}>
              <h5 className="font-bold text-white mb-2">Q: Progress safe?</h5>
              <p className="text-gray-300 text-sm">A: All localStorage. Clear browser data = reset (backup Profile stats first).</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
            <button className="flex-1 edit-cancel" onClick={onClose}>
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default HelpSupportOverlay;
