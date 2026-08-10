import { useState } from 'react';
import { Users, ArrowRight, Info, X, Heart, Users2 } from 'lucide-react';

export type GameMode = 'party' | 'couples' | 'extreme';

interface SetupScreenProps {
  onStart: (players: string[], mode: GameMode) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [step, setStep] = useState<'mode' | 'count' | 'names'>('mode');
  const [mode, setMode] = useState<GameMode>('party');
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(['', '']);
  const [showInfo, setShowInfo] = useState(false);

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    if (selectedMode === 'couples' || selectedMode === 'extreme') {
      setNames(['', '']);
      setStep('names');
    } else {
      setStep('count');
    }
  };

  const handleCountSubmit = () => {
    setNames(Array(playerCount).fill(''));
    setStep('names');
  };

  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleStart = () => {
    const validNames = names.filter(n => n.trim() !== '');
    if (validNames.length >= 2) {
      onStart(validNames, mode);
    }
  };

  return (
    <div className="min-h-screen retro-grid scanline flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Info Button */}
      <button
        onClick={() => setShowInfo(true)}
        className="absolute top-4 right-4 p-2 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors z-10"
        title="Info"
      >
        <Info size={20} />
      </button>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-red-500/50 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_0_40px_rgba(255,0,0,0.3)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-['Press_Start_2P'] text-sm text-red-500 mb-6 neon-text">ABOUT</h3>
            <div className="font-['VT323'] text-xl text-white leading-relaxed space-y-4">
              <p>Hi there,</p>
              <p>A settled and retired f*ckboy here. Thanks for using this website to play truth or dare. I hope you know that one day you will also have to move on from this life. You will be much happier.</p>
              <p>But until that time comes, this is the best truth or dare game you will ever play. I hope you enjoy.</p>
              <p>I consider this... my legacy.</p>
              <p className="text-red-400 mt-4">Cheers</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1
            className="font-['Press_Start_2P'] text-lg sm:text-xl md:text-2xl text-red-500 neon-text mb-4 leading-relaxed"
          >
            Cristian's
          </h1>
          <h2 className="font-['VT323'] text-4xl sm:text-5xl md:text-6xl text-white tracking-wider mb-2">
            DIRTY
          </h2>
          <h2 className="font-['VT323'] text-3xl sm:text-4xl md:text-5xl text-red-400 tracking-wider">
            Truth or Dare
          </h2>
          <p className="font-['VT323'] text-lg sm:text-xl text-red-300/50 mt-3">
            the only T&D game you will ever need.
          </p>
        </div>

        {step === 'mode' && (
          <div className="slide-up space-y-4">
            <button
              onClick={() => handleModeSelect('party')}
              className="w-full bg-black/80 border border-red-500/40 rounded-lg p-5 sm:p-6 backdrop-blur-sm hover:border-red-400 hover:bg-red-950/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 group-hover:bg-red-500/20 transition-colors">
                  <Users2 className="text-red-400" size={28} />
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-white mb-2">PARTY MODE</h3>
                  <p className="font-['VT323'] text-lg text-red-300/70">3+ players with the spinning wheel</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('couples')}
              className="w-full bg-black/80 border border-red-500/40 rounded-lg p-5 sm:p-6 backdrop-blur-sm hover:border-red-400 hover:bg-red-950/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 group-hover:bg-red-500/20 transition-colors">
                  <Heart className="text-red-400" size={28} />
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-white mb-2">1v1 MODE</h3>
                  <p className="font-['VT323'] text-lg text-red-300/70">Intimate truths & dares for two</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('extreme')}
              className="w-full bg-black/80 border border-orange-500/40 rounded-lg p-5 sm:p-6 backdrop-blur-sm hover:border-orange-400 hover:bg-orange-950/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 group-hover:bg-orange-500/20 transition-colors">
                  <span className="text-2xl">🌶️</span>
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-white mb-2">1v1 EXTREME</h3>
                  <p className="font-['VT323'] text-lg text-orange-300/70">Crazy dares only. No mercy.</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {step === 'count' && (
          <div className="slide-up bg-black/80 border border-red-500/40 rounded-lg p-5 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep('mode')}
                className="p-2 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <ArrowRight size={18} className="rotate-180" />
              </button>
              <Users className="text-red-500" size={24} />
              <h3 className="font-['VT323'] text-2xl text-white">How many players?</h3>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <input
                type="range"
                min={2}
                max={12}
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                className="flex-1 accent-red-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-['Press_Start_2P'] text-2xl text-red-500 min-w-[3ch] text-center">
                {playerCount}
              </span>
            </div>
            <button
              onClick={handleCountSubmit}
              className="w-full py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-['VT323'] text-2xl rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 neon-box flex items-center justify-center gap-2"
            >
              Next <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 'names' && (
          <div className="slide-up bg-black/80 border border-red-500/40 rounded-lg p-5 sm:p-8 backdrop-blur-sm w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep(mode === 'couples' || mode === 'extreme' ? 'mode' : 'count')}
                className="p-2 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <ArrowRight size={18} className="rotate-180" />
              </button>
              <h3 className="font-['VT323'] text-2xl text-white">
                {mode === 'couples' ? 'Enter your names' : 'Enter your names'}
              </h3>
            </div>
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {names.map((name, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={mode === 'couples' || mode === 'extreme' ? (i === 0 ? 'Player 1...' : 'Player 2...') : `Player ${i + 1}...`}
                  value={name}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-red-500/30 rounded-lg text-white font-['VT323'] text-xl placeholder:text-red-500/30 transition-all duration-300"
                  maxLength={20}
                />
              ))}
            </div>
            <button
              onClick={handleStart}
              disabled={names.filter(n => n.trim()).length < 2}
              className="w-full py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-['VT323'] text-2xl rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 neon-box disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Start Game <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
