import { createPortal } from "react-dom";
import "../styles/HelpTermsPrivacy.css";


const TermsOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const content = (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal max-h-[90vh] max-w-2xl w-[95vw] help-terms-privacy-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="edit-header">
          <h3>Terms of Service</h3>
          <button className="edit-close" onClick={onClose}>×</button>
        </div>
        
        <div className="prose prose-invert max-w-none p-6 space-y-6 overflow-y-auto">
          <h4 className="text-emerald-400 mb-4 mt-0">Anime Card Empire - Terms of Service</h4>
          <p className="text-sm leading-relaxed">Last Updated: January 2025</p>
          
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">1. Acceptance of Terms</h5>
            <p>By accessing Anime Card Empire (the "Game"), you agree to these Terms. If you do not agree, please do not use the Game.</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">2. Game Mechanics</h5>
            <ul className="text-sm space-y-2 mt-3">
              <li> Taps limited to 100/session (auto-refill)</li>
              <li> Coins/stars virtual, no real-world value</li>
              <li> Daily streaks reset midnight UTC</li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">3. User Conduct</h5>
            <p>Do not:</p>
            <ul className="text-sm space-y-2 mt-3">
              <li> Use bots/macros</li>
              <li> Exploit bugs</li>
              <li> Account sharing/selling</li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">4. Virtual Items</h5>
            <ul className="text-sm space-y-2 mt-2">
              <li> Cards/NFTs/coins/stars non-transferable</li>
              <li> No monetary value outside Game</li>
              <li> Developer may modify balances</li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">5. Account Termination</h5>
            <p>Violations may result in suspension/termination without notice.</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">6. No Warranty</h5>
            <p>Game provided "AS IS". Not liable for lost progress/downtime.</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">7. Governing Law</h5>
            <p>Governed by developer's jurisdiction laws.</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
            <button className="flex-1 edit-cancel" onClick={onClose}>
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default TermsOverlay;
