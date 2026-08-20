import { useState } from 'react';
import { Flame, Heart, RotateCcw, Info, X, ArrowLeftRight } from 'lucide-react';
import { couplesTruths, couplesDares } from '@/data/prompts';

interface CouplesGameScreenProps {
  players: string[];
  onReset: () => void;
}

type Phase = 'pick' | 'reveal';

export function CouplesGameScreen({ players, onReset }: CouplesGameScreenProps) {
  const [phase, setPhase] = useState<Phase>('pick');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<'truth' | 'dare' | null>(null);
  const [hiddenTruths, setHiddenTruths] = useState<string[]>([]);
  const [hiddenDares, setHiddenDares] = useState<string[]>([]);
  const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set());
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set());
  const [showInfo, setShowInfo] = useState(false);
  const [round, setRound] = useState(1);

  const currentPlayer = players[currentPlayerIndex];
  const partnerPlayer = players[currentPlayerIndex === 0 ? 1 : 0];

  const getUniquePrompts = (type: 'truth' | 'dare', count: number): string[] => {
    const pool = type === 'truth' ? couplesTruths : couplesDares;
    const used = type === 'truth' ? usedTruths : usedDares;
    const results: string[] = [];
    const pickedIndices: number[] = [];

    if (used.size >= pool.length - count) {
      if (type === 'truth') setUsedTruths(new Set());
      else setUsedDares(new Set());
      used.clear();
    }

    for (let c = 0; c < count; c++) {
      let index: number;
      do {
        index = Math.floor(Math.random() * pool.length);
      } while (used.has(index) || pickedIndices.includes(index));
      pickedIndices.push(index);
      results.push(pool[index]);
    }

    pickedIndices.forEach(idx => {
      if (type === 'truth') setUsedTruths(prev => new Set([...prev, idx]));
      else setUsedDares(prev => new Set([...prev, idx]));
    });

    return results;
  };

  const generateOptions = () => {
    setHiddenTruths(getUniquePrompts('truth', 2));
    setHiddenDares(getUniquePrompts('dare', 2));
  };

  const pickOption = (type: 'truth' | 'dare', index: number) => {
    const text = type === 'truth' ? hiddenTruths[index] : hiddenDares[index];
    setPromptType(type);
    setPrompt(text);
    setPhase('reveal');
  };

  const nextRound = () => {
    setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
    setPrompt(null);
    setPromptType(null);
    setHiddenTruths([]);
    setHiddenDares([]);
    setPhase('pick');
    setRound(prev => prev + 1);
  };

  if (phase === 'pick' && hiddenTruths.length === 0) {
    generateOptions();
  }

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
              <p>Take turns picking from 4 hidden options.</p>
              <p>2 truths and 2 dares -- you won't know what it says until you commit.</p>
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

      <p className="font-['VT323'] text-lg text-red-500/40 mb-6">Round {round}</p>

      {/* Game area */}
      <div className="w-full max-w-md">
        {phase === 'pick' && hiddenTruths.length > 0 && (
          <div className="slide-up text-center">
            <p className="font-['Press_Start_2P'] text-sm sm:text-base text-white mb-2 neon-text">
              {currentPlayer}'s turn
            </p>
            <p className="font-['VT323'] text-xl text-red-300/60 mb-5">
              directed at {partnerPlayer} -- pick one:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => pickOption('truth', 0)}
                className="py-4 bg-gradient-to-b from-red-900/80 to-red-950/80 border border-red-400/50 text-white font-['VT323'] text-xl sm:text-2xl rounded-lg hover:border-red-300 hover:bg-red-900/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Heart size={18} className="text-red-400" />
                TRUTH 1
              </button>
              <button
                onClick={() => pickOption('dare', 0)}
                className="py-4 bg-gradient-to-b from-red-800/80 to-black/80 border border-red-600/50 text-white font-['VT323'] text-xl sm:text-2xl rounded-lg hover:border-red-400 hover:bg-red-800/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Flame size={18} className="text-orange-400" />
                DARE 1
              </button>
              <button
                onClick={() => pickOption('truth', 1)}
                className="py-4 bg-gradient-to-b from-red-900/80 to-red-950/80 border border-red-400/50 text-white font-['VT323'] text-xl sm:text-2xl rounded-lg hover:border-red-300 hover:bg-red-900/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Heart size={18} className="text-red-400" />
                TRUTH 2
              </button>
              <button
                onClick={() => pickOption('dare', 1)}
                className="py-4 bg-gradient-to-b from-red-800/80 to-black/80 border border-red-600/50 text-white font-['VT323'] text-xl sm:text-2xl rounded-lg hover:border-red-400 hover:bg-red-800/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Flame size={18} className="text-orange-400" />
                DARE 2
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
