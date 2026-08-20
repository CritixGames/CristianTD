import { useState } from 'react';
import { Users, ArrowRight, Info, X, Heart, Users2, Sparkles, Smartphone } from 'lucide-react';

export type GameMode = 'party' | 'couples' | 'extreme' | 'ai';

interface SetupScreenProps {
  onStart: (players: string[], mode: GameMode) => void;
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [step, setStep] = useState<'mode' | 'count' | 'names' | 'extreme-warning'>('mode');
  const [mode, setMode] = useState<GameMode>('party');
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(['', '']);
  const [showInfo, setShowInfo] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  const handleModeSelect = (selectedMode: GameMode) => {
    setMode(selectedMode);
    if (selectedMode === 'extreme') {
      setNames(['', '']);
      setStep('extreme-warning');
    } else if (selectedMode === 'couples') {
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

  const handleShare = async () => {
    const shareData = {
      title: '#1 Dirty Truth or Dare',
      text: 'Play the best truth or dare game ever made.',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen retro-grid scanline flex flex-col items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden">
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
              <p>retired single guy here. Thanks for using this website to play truth or dare. I hope you know that one day you will also have to move on from this life. You will be much happier.</p>
              <p>But until that time comes, this is the best truth or dare game you will ever play. I hope you enjoy.</p>
              <p className="text-red-400 mt-4">cheers</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-10">
          <h1
            className="font-['Press_Start_2P'] text-base sm:text-xl md:text-2xl text-red-500 neon-text mb-2 sm:mb-4 leading-relaxed"
          >
            #1
          </h1>
          <h2 className="font-['VT323'] text-3xl sm:text-5xl md:text-6xl text-white tracking-wider mb-1 sm:mb-2">
            DIRTY
          </h2>
          <h2 className="font-['VT323'] text-2xl sm:text-4xl md:text-5xl text-red-400 tracking-wider">
            Truth or Dare
          </h2>
          <p className="font-['VT323'] text-base sm:text-xl text-red-300/50 mt-2 sm:mt-3">
            the only T&D game you will ever need.
          </p>
        </div>

        {step === 'mode' && (
          <div className="slide-up space-y-2.5 sm:space-y-4">
            <button
              onClick={() => handleModeSelect('party')}
              className="w-full bg-black/80 border border-red-500/40 rounded-lg p-3.5 sm:p-6 backdrop-blur-sm hover:border-red-400 hover:bg-red-950/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/30 group-hover:bg-red-500/20 transition-colors">
                  <Users2 className="text-red-400" size={22} />
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-[10px] sm:text-sm text-white mb-1">PARTY MODE</h3>
                  <p className="font-['VT323'] text-base sm:text-lg text-red-300/70">3+ players with the spinning wheel</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('couples')}
              className="w-full bg-black/80 border border-red-500/40 rounded-lg p-3.5 sm:p-6 backdrop-blur-sm hover:border-red-400 hover:bg-red-950/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/30 group-hover:bg-red-500/20 transition-colors">
                  <Heart className="text-red-400" size={22} />
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-[10px] sm:text-sm text-white mb-1">1v1 MODE</h3>
                  <p className="font-['VT323'] text-base sm:text-lg text-red-300/70">Intimate truths & dares for two</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('extreme')}
              className="w-full bg-black/80 border border-orange-500/40 rounded-lg p-3.5 sm:p-6 backdrop-blur-sm hover:border-orange-400 hover:bg-orange-950/20 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 group-hover:bg-orange-500/20 transition-colors">
                  <span className="text-xl sm:text-2xl">🌶️</span>
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-[10px] sm:text-sm text-white mb-1">1v1 EXTREME</h3>
                  <p className="font-['VT323'] text-base sm:text-lg text-orange-300/70">EXTREME DARES ONLY</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('ai')}
              className="w-full bg-black/80 border border-purple-500/40 rounded-lg p-3.5 sm:p-6 backdrop-blur-sm hover:border-purple-400 hover:bg-purple-950/20 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-violet-600/5 group-hover:from-purple-600/10 group-hover:to-violet-600/10 transition-all duration-500" />
              <div className="flex items-center gap-3 sm:gap-4 relative">
                <div className="p-2.5 sm:p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:bg-purple-500/20 transition-colors">
                  <Sparkles className="text-purple-400" size={22} />
                </div>
                <div className="text-left">
                  <h3 className="font-['Press_Start_2P'] text-[10px] sm:text-sm text-white mb-1">AI MODE</h3>
                  <p className="font-['VT323'] text-base sm:text-lg text-purple-300/70">AI generates unique prompts on the spot</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {step === 'extreme-warning' && (
          <div className="slide-up bg-black/80 border border-orange-500/40 rounded-lg p-5 sm:p-8 backdrop-blur-sm text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-orange-500/50 flex items-center justify-center">
              <span className="text-3xl">🔞</span>
            </div>
            <h3 className="font-['Press_Start_2P'] text-xs sm:text-sm text-orange-400 mb-4" style={{ textShadow: '0 0 10px rgba(249,115,22,0.6)' }}>
              18+ ONLY
            </h3>
            <p className="font-['VT323'] text-xl sm:text-2xl text-white/90 leading-relaxed mb-2">
              This mode contains <span className="text-orange-400">explicit adult content</span> and extreme dares.
            </p>
            <p className="font-['VT323'] text-lg text-white/60 mb-8">
              By continuing, you confirm that all players are 18 years or older and consent to participating.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('mode')}
                className="flex-1 py-3 border border-white/20 text-white/70 font-['VT323'] text-xl rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                Go Back
              </button>
              <button
                onClick={() => setStep('names')}
                className="flex-1 py-3 bg-gradient-to-r from-orange-700 to-orange-900 text-white font-['VT323'] text-xl rounded-lg hover:from-orange-600 hover:to-orange-800 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                I'm 18+ Continue
              </button>
            </div>
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
                className="flex-1 accent-red-500 h-3 sm:h-4 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:sm:w-8 [&::-webkit-slider-thumb]:sm:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(239,68,68,0.6)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-red-300 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:sm:w-8 [&::-moz-range-thumb]:sm:h-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-red-300"
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
                onClick={() => setStep(mode === 'extreme' ? 'extreme-warning' : mode === 'couples' ? 'mode' : 'count')}
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

      {showLegal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-red-500/50 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_0_40px_rgba(255,0,0,0.3)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLegal(false)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-['Press_Start_2P'] text-xs text-red-500 mb-6 neon-text">LEGAL</h3>
            <div className="font-['VT323'] text-lg text-white/80 leading-relaxed space-y-4">
              <p><span className="text-red-400">Privacy:</span> This website does not collect, store, or share any personal information. Player names are kept in your browser only and are never sent to any server.</p>
              <p><span className="text-red-400">No Accounts:</span> No sign-ups, no cookies, no tracking. Nothing is saved once you close the page.</p>
              <p><span className="text-red-400">Content:</span> This game contains adult content intended for players aged 18+. All prompts are for entertainment purposes only.</p>
              <p><span className="text-red-400">Disclaimer:</span> Play responsibly. Never pressure anyone into doing something they are uncomfortable with. All participants must give enthusiastic consent.</p>
              <p><span className="text-red-400">Liability:</span> The creators of this website are not responsible for any actions taken as a result of playing this game.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-2 pb-4">
        {!(window as any).Capacitor && (
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black/80 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[9px] text-white/60 font-['VT323'] leading-none">Download on the</div>
                <div className="text-sm text-white font-['VT323'] leading-tight">App Store</div>
              </div>
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black/80 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
              </svg>
              <div className="text-left">
                <div className="text-[9px] text-white/60 font-['VT323'] leading-none">GET IT ON</div>
                <div className="text-sm text-white font-['VT323'] leading-tight">Google Play</div>
              </div>
            </button>
          </div>
        )}
        <button
          onClick={handleShare}
          className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-900/80 to-red-800/60 border border-red-500/40 hover:border-red-400/70 hover:from-red-800/70 hover:to-red-700/50 transition-all duration-500 shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] hover:scale-105 backdrop-blur-sm"
        >
          <span className="text-base group-hover:scale-125 transition-transform duration-300">👀</span>
          <span className="font-['VT323'] text-lg text-red-300/80 group-hover:text-white transition-colors">
            Share with a friend?
          </span>
        </button>
        <button
          onClick={() => setShowLegal(true)}
          className="font-['VT323'] text-sm text-red-400/40 hover:text-red-300/70 transition-colors"
        >
          Privacy & Disclaimer
        </button>
      </div>
    </div>
  );
}
