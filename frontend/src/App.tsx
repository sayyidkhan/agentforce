import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DuelForm from './components/DuelForm';
import BattleArena from './components/BattleArena';
import type { DuelResponse } from './types';
import './index.css';

const queryClient = new QueryClient();

function App() {
  const [duelResult, setDuelResult] = useState<DuelResponse | null>(null);

  const handleDuelComplete = (duel: DuelResponse) => {
    setDuelResult(duel);
  };

  const handleNewBattle = () => {
    setDuelResult(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        {duelResult && duelResult.status === 'complete' ? (
          <>
            <button
              onClick={handleNewBattle}
              className="fixed top-4 left-4 z-50 px-4 py-2 bg-anime-purple hover:bg-purple-600 text-white font-semibold rounded-lg transition-all text-sm"
            >
              New Battle
            </button>
            <BattleArena duel={duelResult} />
          </>
        ) : (
          <DuelForm onDuelComplete={handleDuelComplete} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
