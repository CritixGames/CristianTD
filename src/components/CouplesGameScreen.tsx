import { useState } from 'react';
import { Flame, Heart, RotateCcw, Info, X, ArrowLeftRight } from 'lucide-react';
import { couplesTruths, couplesDares } from '@/data/prompts';

interface CouplesGameScreenProps {
  players: string[];
  onReset: () => void;
}

type Phase = 'pick' | 'choose' | 'reveal';

export function CouplesGameScreen({ players, onReset }: CouplesGameScreenProps) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<'truth' | 'dare' | null>(null);
  const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set());
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set());
  const [showInfo, setShowInfo] = useState(false);
  const [round, setRound] = useState(1);

  const currentPlayer = players[currentPlayerIndex];
  const partnerPlayer = players[currentPlayerIndex === 0 ? 1 : 0];

  const getRandomPrompt = (type: 'truth' | 'dare'): string => {
    const pool = type === 'truth' ? couplesTruths : couplesDares;
    const used = type === 'truth' ? usedTruths : usedDares;

    if (used.size >= pool.length) {
      if (type === 'truth') setUsedTruths(new Set());
      else setUsedDares(new Set());
      used.clear();
    }

    let index: number;
    do {
      index = Math.floor(Math.random() * pool.length);
    } while (used.has(index));

    if (type === 'truth') setUsedTruths(prev => new Set([...prev, index]));
    else setUsedDares(prev => new Set([...prev, index]));

    return pool[index];
  };

  const chooseType = (type: 'truth' | 'dare') => {
    setPromptType(type);
    setPrompt(getRandomPrompt(type));
    setPhase('reveal');
  };

  const nextRound = () => {
    setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
    setPrompt(null);
    setPromptType(null);
    setPhase('pick');
    setRound(prev => prev + 1);
  };

  return (
    <div className="min-h-screen retro-grid scanline flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {showInfo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-red-500/50 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_0_40px_rgba(255,0,0,0.3)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-['Press_Start_2P'] text-sm text-red-500 mb-6 neon-text">1v1 MODE</h3>
            <div className="font-['VT323'] text-xl text-white leading-relaxed space-y-4">
              <p>Take turns choosing truth or dare.</p>
              <p>These prompts are designed for two -- intimate, spicy, and meant to bring you closer.</p>
              <p>No wheel needed. Just you two.</p>
              <p className="text-red-400 mt-4">Have fun together.</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          title="Info"
        >
          <Info size={20} />
        </button>
        <button
          onClick={onReset}
          className="p-2 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          title="New Game"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <h1 className="font-['Press_Start_2P'] text-xs sm:text-sm md:text-base text-red-500 neon-text mb-4 text-center px-2">
        1v1 Mode
      </h1>

      {/* Couple display */}
      <div className="flex items-center gap-3 sm:gap-5 mb-8 md:mb-10">
        <div className={`text-center transition-all duration-500 ${currentPlayerIndex === 0 ? 'scale-110' : 'opacity-50'}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center ${currentPlayerIndex === 0 ? 'border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'border-red-500/30'} bg-black/60`}>
            <span className="font-['Press_Start_2P'] text-lg sm:text-xl text-red-400">
              {players[0]?.[0]?.toUpperCase()}
            </span>
          </div>
          <p className={`font-['VT323'] text-lg mt-2 ${currentPlayerIndex === 0 ? 'text-white' : 'text-red-500/50'}`}>
            {players[0]}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Heart size={20} className="text-red-500 mb-1" fill="currentColor" />
          <ArrowLeftRight size={16} className="text-red-500/50" />
        </div>

        <div className={`text-center transition-all duration-500 ${currentPlayerIndex === 1 ? 'scale-110' : 'opacity-50'}`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center ${currentPlayerIndex === 1 ? 'border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'border-red-500/30'} bg-black/60`}>
            <span className="font-['Press_Start_2P'] text-lg sm:text-xl text-red-400">
              {players[1]?.[0]?.toUpperCase()}
            </span>
          </div>
          <p className={`font-['VT323'] text-lg mt-2 ${currentPlayerIndex === 1 ? 'text-white' : 'text-red-500/50'}`}>
            {players[1]}
          </p>
        </div>
      </div>

      {/* Round indicator */}
      <p className="font-['VT323'] text-lg text-red-500/40 mb-6">Round {round}</p>

      {/* Game area */}
      <div className="w-full max-w-md">
        {phase === 'pick' && (
          <div className="slide-up text-center">
            <p className="font-['Press_Start_2P'] text-sm sm:text-base text-white mb-2 neon-text">
              {currentPlayer}'s turn
            </p>
            <p className="font-['VT323'] text-xl text-red-300/60 mb-8">
              directed at {partnerPlayer}
            </p>
            <p className="font-['VT323'] text-2xl text-red-200 mb-5">Truth or Dare?</p>
            <div className="flex gap-4">
              <button
                onClick={() => chooseType('truth')}
                className="flex-1 py-5 bg-gradient-to-b from-red-900/80 to-red-950/80 border border-red-400/50 text-white font-['VT323'] text-2xl rounded-lg hover:border-red-300 hover:bg-red-900/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Heart size={20} className="text-red-400" />
                TRUTH
              </button>
              <button
                onClick={() => chooseType('dare')}
                className="flex-1 py-5 bg-gradient-to-b from-red-800/80 to-black/80 border border-red-600/50 text-white font-['VT323'] text-2xl rounded-lg hover:border-red-400 hover:bg-red-800/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Flame size={20} className="text-orange-400" />
                DARE
              </button>
            </div>
          </div>
        )}

        {phase === 'reveal' && prompt && (
          <div className="slide-up text-center">
            <div className="bg-black/80 border border-red-500/40 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <span className={`font-['Press_Start_2P'] text-xs ${promptType === 'truth' ? 'text-red-400' : 'text-orange-400'} mb-1 block`}>
                {promptType === 'truth' ? '~ TRUTH ~' : '~ DARE ~'}
              </span>
              <p className="font-['VT323'] text-sm text-red-500/40 mb-4">
                {currentPlayer} asks {partnerPlayer}:
              </p>
              <p className="font-['VT323'] text-2xl md:text-3xl text-white leading-relaxed">
                {prompt}
              </p>
            </div>
            <button
              onClick={nextRound}
              className="px-8 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-['VT323'] text-2xl rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 neon-box"
            >
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
