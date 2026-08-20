import { useState, useRef } from 'react';
import { Flame, Heart, RotateCcw, Sparkles, Info, X } from 'lucide-react';
import { truths, dares } from '@/data/prompts';

interface GameScreenProps {
  players: string[];
  onReset: () => void;
}

type GamePhase = 'idle' | 'spinning' | 'pick' | 'reveal';

export function GameScreen({ players, onReset }: GameScreenProps) {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<'truth' | 'dare' | null>(null);
  const [hiddenTruths, setHiddenTruths] = useState<string[]>([]);
  const [hiddenDares, setHiddenDares] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const [lastPlayerIndex, setLastPlayerIndex] = useState<number | null>(null);
  const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set());
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set());
  const [showInfo, setShowInfo] = useState(false);
  const [spinDuration, setSpinDuration] = useState(4000);
  const [spinEasing, setSpinEasing] = useState('cubic-bezier(0.17,0.67,0.12,0.99)');
  const spinTimeout = useRef<ReturnType<typeof setTimeout>>();

  const getWeightedRandomPlayer = (): number => {
    const weights = players.map((_, i) => (i === lastPlayerIndex ? 0.3 : 1));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) return i;
    }
    return players.length - 1;
  };

  const getUniquePrompts = (type: 'truth' | 'dare', count: number): string[] => {
    const pool = type === 'truth' ? truths : dares;
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

  const spin = () => {
    setPhase('spinning');
    setPrompt(null);
    setPromptType(null);
    setHiddenTruths([]);
    setHiddenDares([]);

    // Vary duration between 3.5s and 6s
    const duration = 3500 + Math.random() * 2500;
    setSpinDuration(duration);

    // Vary the easing curve for different deceleration feels
    const p1 = (0.1 + Math.random() * 0.15).toFixed(2);
    const p2 = (0.6 + Math.random() * 0.2).toFixed(2);
    const p3 = (0.05 + Math.random() * 0.15).toFixed(2);
    const p4 = (0.95 + Math.random() * 0.05).toFixed(2);
    setSpinEasing(`cubic-bezier(${p1},${p2},${p3},${p4})`);

    const playerIndex = getWeightedRandomPlayer();
    const segmentAngle = 360 / players.length;
    // Land at a random spot within the segment (not always dead center)
    const offsetInSegment = segmentAngle * 0.15 + Math.random() * segmentAngle * 0.7;
    const segmentPosition = playerIndex * segmentAngle + offsetInSegment;
    // The pointer is at top (270deg). We need this segment position under the pointer.
    const targetRemainder = ((270 - segmentPosition) % 360 + 360) % 360;
    // Account for current wheel position
    const currentRemainder = ((rotation % 360) + 360) % 360;
    let needed = targetRemainder - currentRemainder;
    if (needed <= 0) needed += 360;
    // Add random full spins (4 to 9)
    const spins = 4 + Math.floor(Math.random() * 6);
    const totalRotation = spins * 360 + needed;

    setRotation(prev => prev + totalRotation);

    if (spinTimeout.current) clearTimeout(spinTimeout.current);
    spinTimeout.current = setTimeout(() => {
      setSelectedPlayer(players[playerIndex]);
      setSelectedPlayerIndex(playerIndex);
      setLastPlayerIndex(playerIndex);
      setHiddenTruths(getUniquePrompts('truth', 2));
      setHiddenDares(getUniquePrompts('dare', 2));
      setPhase('pick');
    }, duration + 200);
  };

  const pickOption = (type: 'truth' | 'dare', index: number) => {
    const text = type === 'truth' ? hiddenTruths[index] : hiddenDares[index];
    setPromptType(type);
    setPrompt(text);
    setPhase('reveal');
  };

  const nextRound = () => {
    setPhase('idle');
    setSelectedPlayer(null);
    setPrompt(null);
    setPromptType(null);
    setHiddenTruths([]);
    setHiddenDares([]);
  };

  const segmentAngle = 360 / players.length;
  const playerColors = [
    { bg: '#dc2626', glow: 'rgba(220,38,38,0.3)', text: '#fca5a5' },
    { bg: '#9f1239', glow: 'rgba(159,18,57,0.3)', text: '#fda4af' },
    { bg: '#b91c1c', glow: 'rgba(185,28,28,0.3)', text: '#fecaca' },
    { bg: '#c2410c', glow: 'rgba(194,65,12,0.3)', text: '#fdba74' },
    { bg: '#7f1d1d', glow: 'rgba(127,29,29,0.3)', text: '#f87171' },
    { bg: '#a16207', glow: 'rgba(161,98,7,0.3)', text: '#fcd34d' },
    { bg: '#991b1b', glow: 'rgba(153,27,27,0.3)', text: '#fecdd3' },
    { bg: '#9a3412', glow: 'rgba(154,52,18,0.3)', text: '#fb923c' },
    { bg: '#881337', glow: 'rgba(136,19,55,0.3)', text: '#fb7185' },
    { bg: '#78350f', glow: 'rgba(120,53,15,0.3)', text: '#fbbf24' },
    { bg: '#6b0f0f', glow: 'rgba(107,15,15,0.3)', text: '#ef4444' },
    { bg: '#92400e', glow: 'rgba(146,64,14,0.3)', text: '#f59e0b' },
  ];

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
            <h3 className="font-['Press_Start_2P'] text-sm text-red-500 mb-6 neon-text">ABOUT</h3>
            <div className="font-['VT323'] text-xl text-white leading-relaxed space-y-4">
              <p>Hi there,</p>
              <p>retired f*ckboy here. Thanks for using this website to play truth or dare. I hope you know that one day you will also have to move on from this life. You will be much happier.</p>
              <p>But until that time comes, this is the best truth or dare game you will ever play. I hope you enjoy.</p>
              <p className="text-red-400 mt-4">cheers</p>
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

      <h1 className="font-['Press_Start_2P'] text-xs sm:text-sm md:text-base text-red-500 neon-text mb-6 md:mb-8 text-center px-2">
        #1 Dirty Truth or Dare
      </h1>

      {/* Spinning Wheel */}
      <div className="relative mb-6 md:mb-8">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-[0_0_8px_#ff0000]" />
        </div>

        <div
          className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full relative border-4 border-red-500/60 shadow-[0_0_30px_rgba(255,0,0,0.4)]"
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
            <div className="w-8 h-8 bg-black rounded-full border-2 border-red-500 shadow-[0_0_10px_#ff0000]" />
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="w-full max-w-md">
        {phase === 'idle' && (
          <div className="slide-up text-center">
            <button
              onClick={spin}
              className="px-6 sm:px-8 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white font-['VT323'] text-2xl sm:text-3xl rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 neon-box throb"
            >
              <Sparkles className="inline mr-2" size={24} />
              SPIN THE WHEEL
            </button>
          </div>
        )}

        {phase === 'spinning' && (
          <div className="text-center">
            <p className="font-['VT323'] text-3xl text-red-400 animate-pulse">
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
            <p className="font-['VT323'] text-xl text-red-200 mb-4">Pick one:</p>
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
              <span className={`font-['Press_Start_2P'] text-xs ${promptType === 'truth' ? 'text-red-400' : 'text-orange-400'} mb-3 block`}>
                {promptType === 'truth' ? '~ TRUTH ~' : '~ DARE ~'}
              </span>
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
