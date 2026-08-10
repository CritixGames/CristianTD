import { useState } from 'react';
import { SetupScreen, type GameMode } from '@/components/SetupScreen';
import { GameScreen } from '@/components/GameScreen';
import { CouplesGameScreen } from '@/components/CouplesGameScreen';
import { ExtremeGameScreen } from '@/components/ExtremeGameScreen';
import { SilhouetteBackground } from '@/components/SilhouetteBackground';

function App() {
  const [players, setPlayers] = useState<string[] | null>(null);
  const [mode, setMode] = useState<GameMode>('party');

  const handleStart = (playerNames: string[], selectedMode: GameMode) => {
    setPlayers(playerNames);
    setMode(selectedMode);
  };

  const handleReset = () => {
    setPlayers(null);
  };

  return (
    <>
      <SilhouetteBackground />
      {!players ? (
        <SetupScreen onStart={handleStart} />
      ) : mode === 'couples' ? (
        <CouplesGameScreen players={players} onReset={handleReset} />
      ) : mode === 'extreme' ? (
        <ExtremeGameScreen players={players} onReset={handleReset} />
      ) : (
        <GameScreen players={players} onReset={handleReset} />
      )}
    </>
  );
}

export default App;
