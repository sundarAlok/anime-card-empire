import { useState, useEffect } from "react";
import { useGame } from "../context/useGame";
import tapImg from "../assets/tap.png";

const TapButton = () => {
  const { tap, tapLimit } = useGame();
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleTap = (e) => {
    if (tapLimit <= 0) return;
    
    // Trigger press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    
    // Trigger ripple effect
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 400);
    
    // Call the actual tap function
    tap();
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl scale-150 animate-pulse" />
      
      {/* Main button container */}
      <button
        onClick={handleTap}
        disabled={tapLimit <= 0}
        className={`
          relative
          w-[180px]
          h-[180px]
          rounded-full
          overflow-hidden
          flex items-center justify-center
          transition-all duration-150
          ${isPressed 
            ? 'scale-95 shadow-[0_0_20px_rgba(99,102,241,0.8)]' 
            : 'scale-100 shadow-[0_0_40px_rgba(99,102,241,0.6),0_20px_60px_rgba(0,0,0,0.5)] hover:scale-105'
          }
          ${tapLimit <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-900
          border-2 border-indigo-400/50
        `}
      >
        {/* Ripple effect */}
        {showRipple && (
          <div className="absolute inset-0 rounded-full">
            <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
          </div>
        )}

        {/* Image */}
        <img
          src={tapImg}
          alt="Tap"
          className={`
            w-[85%]
            h-[85%]
            object-cover
            pointer-events-none
            transition-transform duration-100
            ${isPressed ? 'scale-90' : 'scale-100'}
          `}
        />

        {/* Inner glow overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/60 via-transparent to-white/20 pointer-events-none" />
        
        {/* Highlight shine */}
        <div className="absolute top-2 left-4 right-4 h-1/3 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-indigo-400/40 to-transparent pointer-events-none" />
      </button>

      {/* Tap indicator text */}
      <div className="mt-6 text-center">
        <p className={`text-xl font-bold ${tapLimit > 0 ? 'text-yellow-400 glow-text' : 'text-gray-500'}`}>
          TAP
        </p>
        <p className="text-sm text-indigo-300 mt-1">
          Limit: <span className="font-bold text-white">{tapLimit}</span>
        </p>
      </div>

      {/* Decorative particles */}
      {tapLimit > 0 && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-indigo-500/30 blur-md rounded-full" />
      )}
    </div>
  );
};

export default TapButton;
