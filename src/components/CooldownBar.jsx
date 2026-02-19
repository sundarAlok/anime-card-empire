import { useGame } from "../context/useGame";
import { GAME_CONFIG } from "../constants/gameConfig";

const CooldownBar = () => {
  const { tapLimit } = useGame();

  const percent =
    (tapLimit / GAME_CONFIG.INITIAL_TAP_LIMIT) * 100;

  return (
    <div className="w-2/3 mx-auto mt-4">
      <div className="h-4 bg-gray-700 rounded-full shadow-inner">
        <div
          className="h-4 bg-green-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default CooldownBar;
