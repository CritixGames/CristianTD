import { useState } from 'react';
import { Zap, RotateCcw, Info, X, ArrowLeftRight } from 'lucide-react';
import { extremeDares } from '@/data/prompts';

interface ExtremeGameScreenProps {
  players: string[];
  onReset: () => void;
}

type Phase = 'ready' | 'reveal';

export function ExtremeGameScreen({ players, onReset }: ExtremeGameScreenProps) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set());
  const [showInfo, setShowInfo] = useState(false);
  const [round, setRound] = useState(1);

  const currentPlayer = players[currentPlayerIndex];
  const partnerPlayer = players[currentPlayerIndex === 0 ? 1 : 0];

  const getRandomDare = (): string => {
    if (usedDares.size >= extremeDares.length) {
      setUsedDares(new Set());
      usedDares.clear();
    }

    let index: number;
    do {
      index = Math.floor(Math.random() * extremeDares.length);
    } while (usedDares.has(index));

    setUsedDares(prev => new Set([...prev, index]));
    return extremeDares[index];
  };

  const pullDare = () => {
    setPrompt(getRandomDare());
    setPhase('reveal');
  };

  const nextRound = () => {
    setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
    setPrompt(null);
    setPhase('ready');
    setRound(prev => prev + 1);
  };

  return (
    <div className="min-h-screen retro-grid scanline flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {showInfo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-orange-500/50 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_0_40px_rgba(255,165,0,0.3)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-['Press_Start_2P'] text-sm text-orange-500 mb-6">1v1 EXTREME</h3>
            <div className="font-['VT323'] text-xl text-white leading-relaxed space-y-4">
              <p>No truths. No mercy. Dares only.</p>
              <p>These are not for the faint of heart. Every round is a dare -- wild, intense, and unapologetic.</p>
              <p>You pull it, you do it. No backing out.</p>
              <p className="text-orange-400 mt-4">You've been warned.</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 border border-orange-500/40 rounded-lg text-orange-400 hover:bg-orange-500/20 transition-colors"
          title="Info"
        >
          <Info size={20} />
        </button>
        <button
          onClick={onReset}
          className="p-2 border border-orange-500/40 rounded-lg text-orange-400 hover:bg-orange-500/20 transition-colors"
          title="New Game"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <h1 className="font-['Press_Start_2P'] text-xs sm:text-sm md:text-base text-orange-500 mb-4 text-center px-2">
        1v1 Extreme
      </h1>
      <p className="font-['VT323'] text-lg text-orange-400/50 mb-6">DARES ONLY</p>

      {/* Player display */}
      <div className="flex items-center gap-3 sm:gap-5 mb-8 md:mb-10">
        <div className={`text-center transition-all duration-500 ${currentPlayerIndex === 0 ? 'scale-110' : 'opacity-50'}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center ${currentPlayerIndex === 0 ? 'border-orange-400 shadow-[0_0_15px_rgba(255,165,0,0.4)]' : 'border-orange-500/30'} bg-black/60`}>
            <span className="font-['Press_Start_2P'] text-lg sm:text-xl text-orange-400">
              {players[0]?.[0]?.toUpperCase()}
            </span>
          </div>
          <p className={`font-['VT323'] text-lg mt-2 ${currentPlayerIndex === 0 ? 'text-white' : 'text-orange-500/50'}`}>
            {players[0]}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Zap size={20} className="text-orange-500 mb-1" fill="currentColor" />
          <ArrowLeftRight size={16} className="text-orange-500/50" />
        </div>

        <div className={`text-center transition-all duration-500 ${currentPlayerIndex === 1 ? 'scale-110' : 'opacity-50'}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center ${currentPlayerIndex === 1 ? 'border-orange-400 shadow-[0_0_15px_rgba(255,165,0,0.4)]' : 'border-orange-500/30'} bg-black/60`}>
            <span className="font-['Press_Start_2P'] text-lg sm:text-xl text-orange-400">
              {players[1]?.[0]?.toUpperCase()}
            </span>
          </div>
          <p className={`font-['VT323'] text-lg mt-2 ${currentPlayerIndex === 1 ? 'text-white' : 'text-orange-500/50'}`}>
            {players[1]}
          </p>
        </div>
      </div>

      {/* Round indicator */}
      <p className="font-['VT323'] text-lg text-orange-500/40 mb-6">Round {round}</p>

      {/* Game area */}
      <div className="w-full max-w-md">
        {phase === 'ready' && (
          <div className="slide-up text-center">
            <p className="font-['Press_Start_2P'] text-sm sm:text-base text-white mb-2">
              {currentPlayer}'s turn
            </p>
            <p className="font-['VT323'] text-xl text-orange-300/60 mb-8">
              {partnerPlayer} is watching...
            </p>
            <button
              onClick={pullDare}
              className="px-8 py-5 bg-gradient-to-r from-orange-700 to-red-900 text-white font-['VT323'] text-2xl sm:text-3xl rounded-lg hover:from-orange-600 hover:to-red-800 transition-all duration-300 shadow-[0_0_20px_rgba(255,165,0,0.3)] throb flex items-center justify-center gap-3 mx-auto"
            >
              <span className="text-2xl">🌶️</span>
              PULL A DARE
            </button>
          </div>
        )}

        {phase === 'reveal' && prompt && (
          <div className="slide-up text-center">
            <div className="bg-black/80 border border-orange-500/40 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <span className="font-['Press_Start_2P'] text-xs text-orange-400 mb-1 block">
                ~ EXTREME DARE ~
              </span>
              <p className="font-['VT323'] text-sm text-orange-500/40 mb-4">
                {currentPlayer} must do this:
              </p>
              <p className="font-['VT323'] text-2xl md:text-3xl text-white leading-relaxed">
                {prompt}
              </p>
            </div>
            <button
              onClick={nextRound}
              className="px-8 py-3 bg-gradient-to-r from-orange-700 to-red-900 text-white font-['VT323'] text-2xl rounded-lg hover:from-orange-600 hover:to-red-800 transition-all duration-300 shadow-[0_0_15px_rgba(255,165,0,0.2)]"
            >
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
