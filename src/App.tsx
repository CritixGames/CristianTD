import { useState, useEffect } from 'react';
import { SetupScreen, type GameMode } from '@/components/SetupScreen';
import { GameScreen } from '@/components/GameScreen';
import { CouplesGameScreen } from '@/components/CouplesGameScreen';
import { ExtremeGameScreen } from '@/components/ExtremeGameScreen';
import { AIGameScreen } from '@/components/AIGameScreen';
import { SilhouetteBackground } from '@/components/SilhouetteBackground';

function DisclaimerScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black">
      <div className="max-w-md text-center slide-up">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-red-500/50 flex items-center justify-center">
          <span className="text-2xl">&#9888;&#65039;</span>
        </div>
        <p className="font-['VT323'] text-2xl sm:text-3xl text-white leading-relaxed">
          You should <span className="text-red-400 font-bold">NOT</span> pressure anyone into doing things they do <span className="text-red-400 font-bold">NOT</span> want to do.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [players, setPlayers] = useState<string[] | null>(null);
  const [mode, setMode] = useState<GameMode>('party');

  const handleStart = (playerNames: string[], selectedMode: GameMode) => {
    setPlayers(playerNames);
    setMode(selectedMode);
  };

  const handleReset = () => {
    setPlayers(null);
  };

  if (showDisclaimer) {
    return <DisclaimerScreen onDone={() => setShowDisclaimer(false)} />;
  }

  return (
    <>
      <SilhouetteBackground />
      {!players ? (
        <SetupScreen onStart={handleStart} />
      ) : mode === 'couples' ? (
        <CouplesGameScreen players={players} onReset={handleReset} />
      ) : mode === 'extreme' ? (
        <ExtremeGameScreen players={players} onReset={handleReset} />
      ) : mode === 'ai' ? (
        <AIGameScreen players={players} onReset={handleReset} />
      ) : (
        <GameScreen players={players} onReset={handleReset} />
      )}
    </>
  );
}

export default App;
