import { useState, useRef } from 'react';
import { Flame, Heart, RotateCcw, Sparkles, Info, X, Loader2 } from 'lucide-react';

interface AIGameScreenProps {
  players: string[];
  onReset: () => void;
}

type GamePhase = 'idle' | 'spinning' | 'pick' | 'generating' | 'reveal';

export function AIGameScreen({ players, onReset }: AIGameScreenProps) {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<'truth' | 'dare' | null>(null);
  const [rotation, setRotation] = useState(0);
  const [lastPlayerIndex, setLastPlayerIndex] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spinDuration, setSpinDuration] = useState(4000);
  const [spinEasing, setSpinEasing] = useState('cubic-bezier(0.17,0.67,0.12,0.99)');
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const spinTimeout = useRef<ReturnType<typeof setTimeout>>();

  const getWeightedRandomPlayer = (): number => {
    const weights = players.map((_, i) => (i === lastPlayerIndex ? 0.1 : 1));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) return i;
    }
    return players.length - 1;
  };

  const generatePrompt = async (type: 'truth' | 'dare', playerName: string) => {
    setPhase('generating');
    setPromptType(type);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-prompt`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, playerName, players, previousPrompts: promptHistory }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setPrompt(data.prompt);
      setPromptHistory(prev => [...prev, data.prompt]);
      setPhase('reveal');
    } catch (err) {
      setError('Could not generate a prompt. Try again!');
      setPhase('pick');
    }
  };

  const spin = () => {
    setPhase('spinning');
    setPrompt(null);
    setPromptType(null);
    setError(null);

    const duration = 3500 + Math.random() * 2500;
    setSpinDuration(duration);

    const p1 = (0.1 + Math.random() * 0.15).toFixed(2);
    const p2 = (0.6 + Math.random() * 0.2).toFixed(2);
    const p3 = (0.05 + Math.random() * 0.15).toFixed(2);
    const p4 = (0.95 + Math.random() * 0.05).toFixed(2);
    setSpinEasing(`cubic-bezier(${p1},${p2},${p3},${p4})`);

    const playerIndex = getWeightedRandomPlayer();
    const segmentAngle = 360 / players.length;
    const offsetInSegment = segmentAngle * 0.15 + Math.random() * segmentAngle * 0.7;
    const segmentPosition = playerIndex * segmentAngle + offsetInSegment;
    const targetRemainder = ((270 - segmentPosition) % 360 + 360) % 360;
    const currentRemainder = ((rotation % 360) + 360) % 360;
    let needed = targetRemainder - currentRemainder;
    if (needed <= 0) needed += 360;
    const spins = 4 + Math.floor(Math.random() * 6);
    const totalRotation = spins * 360 + needed;

    setRotation(prev => prev + totalRotation);

    if (spinTimeout.current) clearTimeout(spinTimeout.current);
    spinTimeout.current = setTimeout(() => {
      setSelectedPlayer(players[playerIndex]);
      setSelectedPlayerIndex(playerIndex);
      setLastPlayerIndex(playerIndex);
      setPhase('pick');
    }, duration + 200);
  };

  const nextRound = () => {
    setPhase('idle');
    setSelectedPlayer(null);
    setPrompt(null);
    setPromptType(null);
    setError(null);
  };

  const segmentAngle = 360 / players.length;
  const playerColors = [
    { bg: '#7c3aed', glow: 'rgba(124,58,237,0.3)', text: '#c4b5fd' },
    { bg: '#6d28d9', glow: 'rgba(109,40,217,0.3)', text: '#a78bfa' },
    { bg: '#5b21b6', glow: 'rgba(91,33,182,0.3)', text: '#c4b5fd' },
    { bg: '#4c1d95', glow: 'rgba(76,29,149,0.3)', text: '#ddd6fe' },
    { bg: '#6366f1', glow: 'rgba(99,102,241,0.3)', text: '#a5b4fc' },
    { bg: '#4f46e5', glow: 'rgba(79,70,229,0.3)', text: '#c7d2fe' },
    { bg: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', text: '#ede9fe' },
    { bg: '#7e22ce', glow: 'rgba(126,34,206,0.3)', text: '#e9d5ff' },
    { bg: '#581c87', glow: 'rgba(88,28,135,0.3)', text: '#d8b4fe' },
    { bg: '#4338ca', glow: 'rgba(67,56,202,0.3)', text: '#e0e7ff' },
    { bg: '#3730a3', glow: 'rgba(55,48,163,0.3)', text: '#c7d2fe' },
    { bg: '#312e81', glow: 'rgba(49,46,129,0.3)', text: '#a5b4fc' },
  ];

  return (
    <div className="min-h-screen retro-grid scanline flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {showInfo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-purple-500/50 rounded-lg p-6 sm:p-8 max-w-sm w-full relative shadow-[0_0_40px_rgba(139,92,246,0.3)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-['Press_Start_2P'] text-sm text-purple-400 mb-6" style={{ textShadow: '0 0 10px rgba(139,92,246,0.8)' }}>AI MODE</h3>
            <div className="font-['VT323'] text-xl text-white leading-relaxed space-y-4">
              <p>Every truth and dare is generated fresh by AI just for your group.</p>
              <p>No repeats. No limits. Always unique.</p>
              <p className="text-purple-400 mt-4">have fun</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <button
          onClick={() => setShowInfo(true)}
          className="p-2 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors"
          title="Info"
        >
          <Info size={20} />
        </button>
        <button
          onClick={onReset}
          className="p-2 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors"
          title="New Game"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 md:mb-8">
        <Sparkles size={16} className="text-purple-400" />
        <h1 className="font-['Press_Start_2P'] text-xs sm:text-sm md:text-base text-purple-400 text-center" style={{ textShadow: '0 0 10px rgba(139,92,246,0.8)' }}>
          AI Generated Mode
        </h1>
        <Sparkles size={16} className="text-purple-400" />
      </div>

      {/* Spinning Wheel */}
      <div className="relative mb-6 md:mb-8">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-purple-500 drop-shadow-[0_0_8px_#8b5cf6]" />
        </div>

        <div
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full relative border-4 border-purple-500/60 shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: `transform ${spinDuration}ms ${spinEasing}`,
          }}
        >
          {players.map((player, i) => {
            const startAngle = i * segmentAngle;
            const midAngle = startAngle + segmentAngle / 2;
            const radStart = (startAngle * Math.PI) / 180;
            const radEnd = ((startAngle + segmentAngle) * Math.PI) / 180;
            const color = playerColors[i % playerColors.length].bg;

            const x1 = 50 + 50 * Math.cos(radStart);
            const y1 = 50 + 50 * Math.sin(radStart);
            const x2 = 50 + 50 * Math.cos(radEnd);
            const y2 = 50 + 50 * Math.sin(radEnd);
            const largeArc = segmentAngle > 180 ? 1 : 0;

            const textRadius = 35;
            const textX = 50 + textRadius * Math.cos((midAngle * Math.PI) / 180);
            const textY = 50 + textRadius * Math.sin((midAngle * Math.PI) / 180);

            return (
              <svg
                key={i}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={color}
                  opacity={0.85}
                  stroke="#0a0a0a"
                  strokeWidth="0.5"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={players.length > 6 ? '3.5' : '4.5'}
                  fontFamily="VT323"
                  transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                >
                  {player.length > 8 ? player.slice(0, 8) + '...' : player}
                </text>
              </svg>
            );
          })}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-black rounded-full border-2 border-purple-500 shadow-[0_0_10px_#8b5cf6]" />
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="w-full max-w-md">
        {phase === 'idle' && (
          <div className="slide-up text-center">
            <button
              onClick={spin}
              className="px-6 sm:px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-['VT323'] text-2xl sm:text-3xl rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] throb"
            >
              <Sparkles className="inline mr-2" size={24} />
              SPIN THE WHEEL
            </button>
          </div>
        )}

        {phase === 'spinning' && (
          <div className="text-center">
            <p className="font-['VT323'] text-3xl text-purple-400 animate-pulse">
              Spinning...
            </p>
          </div>
        )}

        {phase === 'pick' && selectedPlayer && selectedPlayerIndex !== null && (
          <div className="slide-up text-center">
            <p
              className="font-['Press_Start_2P'] text-sm sm:text-lg mb-5 break-all"
              style={{
                color: playerColors[selectedPlayerIndex % playerColors.length].text,
                textShadow: `0 0 6px ${playerColors[selectedPlayerIndex % playerColors.length].glow}`,
              }}
            >
              {selectedPlayer}
            </p>
            <p className="font-['VT323'] text-xl text-purple-200 mb-4">Pick one:</p>
            {error && (
              <p className="font-['VT323'] text-lg text-red-400 mb-3">{error}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => generatePrompt('truth', selectedPlayer)}
                className="py-4 bg-gradient-to-b from-purple-900/80 to-purple-950/80 border border-purple-400/50 text-white font-['VT323'] text-xl sm:text-2xl rounded-lg hover:border-purple-300 hover:bg-purple-900/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Heart size={18} className="text-purple-400" />
                TRUTH
              </button>
              <button
                onClick={() => generatePrompt('dare', selectedPlayer)}
                className="py-4 bg-gradient-to-b from-violet-800/80 to-black/80 border border-violet-600/50 text-white font-['VT323'] text-xl sm:text-2xl rounded-lg hover:border-violet-400 hover:bg-violet-800/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Flame size={18} className="text-orange-400" />
                DARE
              </button>
            </div>
          </div>
        )}

        {phase === 'generating' && (
          <div className="slide-up text-center">
            <div className="bg-black/80 border border-purple-500/40 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <Loader2 size={32} className="text-purple-400 animate-spin mx-auto mb-3" />
              <p className="font-['VT323'] text-2xl text-purple-300 animate-pulse">
                AI is cooking up a {promptType}...
              </p>
            </div>
          </div>
        )}

        {phase === 'reveal' && prompt && (
          <div className="slide-up text-center">
            <div className="bg-black/80 border border-purple-500/40 rounded-lg p-6 mb-6 backdrop-blur-sm">
              <span className={`font-['Press_Start_2P'] text-xs ${promptType === 'truth' ? 'text-purple-400' : 'text-orange-400'} mb-3 block`}>
                {promptType === 'truth' ? '~ TRUTH ~' : '~ DARE ~'}
              </span>
              <p className="font-['VT323'] text-2xl md:text-3xl text-white leading-relaxed">
                {prompt}
              </p>
            </div>
            <button
              onClick={nextRound}
              className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-900 text-white font-['VT323'] text-2xl rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              Next Round
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
