import { createPortal } from "react-dom";
import "../styles/HelpTermsPrivacy.css";


const PrivacyOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const content = (
    <div className="edit-overlay" onClick={onClose}>
      <div className="edit-modal max-h-[90vh] max-w-2xl w-[95vw] help-terms-privacy-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="edit-header">
          <h3>Privacy Policy</h3>
          <button className="edit-close" onClick={onClose}>×</button>
        </div>
        
        <div className="prose prose-invert max-w-none p-6 space-y-6 overflow-y-auto">
          <h4 className="text-emerald-400 mb-4 mt-0">Anime Card Empire - Privacy Policy</h4>
          <p className="text-sm leading-relaxed">Last Updated: January 2025</p>
          
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">1. Data We Collect</h5>
            <p><strong>Privacy-First Game</strong> - Only:</p>
            <ul className="text-sm space-y-2 mt-3">
              <li><strong>Auth Info:</strong> Name/email from Firebase sign-in (never stored)</li>
              <li><strong>Game Data:</strong> Coins/stars/cards/NFTs/levels (localStorage only)</li>
            </ul>
            <p className="font-bold mt-4 text-emerald-400"> No IP, device info, location, or personal tracking</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">2. Data Usage</h5>
            <ul className="text-sm space-y-2 mt-3">
              <li>• Display Profile stats/achievements</li>
              <li>• Save progress locally</li>
              <li>• Calculate levels/streaks</li>
            </ul>
            <p className="mt-4 font-semibold text-orange-300"> All data stays on YOUR device</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">3. No Tracking</h5>
            <ul className="text-sm space-y-2 mt-3">
              <li> No Google Analytics</li>
              <li> No Facebook Pixel</li>
              <li> No ads/trackers</li>
              <li> Pure client-side</li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">4. Firebase Auth Only</h5>
            <p>Used for sign-in (name/email). Game data <strong>NOT</strong> stored in Firestore.</p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">5. Your Control</h5>
            <ul className="text-sm space-y-2 mt-3">
              <li><strong>Clear:</strong> DevTools → Application → Local Storage → Clear</li>
              <li><strong>Reset:</strong> Sign out + clear browser data</li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h5 className="font-bold mb-4 text-lg">6. No Sharing</h5>
            <p className="text-lg font-bold text-green-400 mb-2"> Your data is 100% private</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
            <button className="flex-1 edit-cancel" onClick={onClose}>
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default PrivacyOverlay;
