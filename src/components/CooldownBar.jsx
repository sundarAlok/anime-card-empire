import { useGame } from "../context/useGame";
import { GAME_CONFIG } from "../constants/gameConfig";

const CooldownBar = () => {
  const { tapLimit } = useGame();

  const percent = Math.min((tapLimit / GAME_CONFIG.INITIAL_TAP_LIMIT) * 100, 100);

  // Determine color based on tap limit
  const getColor = () => {
    if (percent > 60) return 'from-emerald-500 to-green-400';
    if (percent > 30) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-rose-400';
  };

  // Determine glow color
  const getGlow = () => {
    if (percent > 60) return 'shadow-emerald-500/50';
    if (percent > 30) return 'shadow-yellow-500/50';
    return 'shadow-red-500/50';
  };

  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs uppercase tracking-wider text-indigo-300">Energy</span>
        <span className="text-sm font-semibold text-white">{tapLimit} / {GAME_CONFIG.INITIAL_TAP_LIMIT}</span>
      </div>
      
      {/* Progress bar container */}
      <div className="relative h-5 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )`
          }}
        />
        
        {/* Progress fill */}
        <div 
          className={`
            h-full 
            rounded-full 
            bg-gradient-to-r ${getColor()}
            transition-all duration-500 ease-out
            relative
            overflow-hidden
          `}
          style={{ width: `${percent}%` }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
          </div>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 blur-sm ${getGlow()} shadow-lg`} />
        </div>
        
        {/* Percentage marker dots */}
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-white/20" />
      </div>
      
      {/* Helper text */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-indigo-400/60">0</span>
        <span className={`text-[10px] ${percent > 30 ? 'text-emerald-400' : 'text-red-400'}`}>
          {percent > 60 ? 'Full Energy!' : percent > 30 ? 'Half Energy' : 'Low Energy'}
        </span>
      </div>
    </div>
  );
};

export default CooldownBar;
