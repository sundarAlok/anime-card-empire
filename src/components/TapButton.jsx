import { useGame } from "../context/useGame";
import tapImg from "../assets/tap.png";

const TapButton = () => {
  const { tap, tapLimit } = useGame();

  return (
    <div className="flex flex-col items-center mt-12">

      <button
        onClick={tap}
        disabled={tapLimit <= 0}
        className="
          relative
          w-[150px]
          h-[150px]
          rounded-full
          overflow-hidden
          flex items-center justify-center
          bg-gradient-to-b from-indigo-600 to-indigo-900
          shadow-[0_20px_40px_rgba(0,0,0,0.8)]
          transition-all duration-150
          active:translate-y-3
          active:shadow-[0_8px_15px_rgba(0,0,0,0.8)]
        "
      >

        {/* Image fully fills circular button */}
        <img
          src={tapImg}
          alt="Tap"
          className="
            w-full
            h-full
            object-cover
            pointer-events-none
          "
        />

        {/* Glossy 3D overlay */}
        <div className="
          absolute inset-0
          rounded-full
          bg-gradient-to-t from-black/50 via-transparent to-white/30
          pointer-events-none
        " />

      </button>

      <p className="mt-6 text-xl font-bold text-yellow-400">
        Tap Limit: {tapLimit}
      </p>
    </div>
  );
};

export default TapButton;
