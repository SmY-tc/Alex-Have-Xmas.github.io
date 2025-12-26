
import React, { useState, useEffect, useCallback } from 'react';
import { Setup } from './components/Setup';
import { DrawBoard } from './components/DrawBoard';
import { History } from './components/History';
import { VideoModal } from './components/VideoModal';
import { Participant, Gift, GameState, HistoryItem } from './types';

const TOTAL_STUDENTS = 38;
const YOUTUBE_IDS = [
  'G2rap7ktp0E', 'w8cSdNqa0RY', '53QjLXhvxA4', 'xx0j4iTUS4g', 
  '7MFm3xEUHg4', 'hjJr3NKH4Q8', 'cV7xXIxex98', 'k6PF9l6MDDo', 
  'NDRjVAMoaq0', 'NMuwoTb_a2Q', 'c19yEuB1z9w', 'iYfeGzQBi2k', 
  '5aFLzhOUzDE', 'KfeNeUb4XJk'
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentDrawerId, setCurrentDrawerId] = useState<string | number | null>(null);
  const [lastGiftId, setLastGiftId] = useState<number | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  useEffect(() => {
    const initialParticipants: Participant[] = [
      { id: 'teacher', name: '老師', isParticipating: true, hasDrawn: false, type: 'TEACHER' },
      ...Array.from({ length: TOTAL_STUDENTS }, (_, i) => ({
        id: i + 1,
        name: `${i + 1} 號`,
        isParticipating: true,
        hasDrawn: false,
        type: 'STUDENT' as const,
      })),
    ];
    setParticipants(initialParticipants);
  }, []);

  const toggleParticipation = (id: string | number) => {
    if (id === 'teacher') return;
    setParticipants(prev => prev.map(p => 
      p.id === id ? { ...p, isParticipating: !p.isParticipating } : p
    ));
  };

  const startGame = () => {
    const activeCount = participants.filter(p => p.isParticipating).length;
    
    // Rule: Total gifts = total participating people
    // Numbered 1 to activeCount
    const initialGifts: Gift[] = Array.from({ length: activeCount }, (_, i) => ({
      id: i + 1,
      isTaken: false,
    }));

    // Ensure Gift 11 exists in the pool for the teacher, even if activeCount < 11
    // But since there are 38 students, activeCount is likely >= 11 if many play.
    // If activeCount < 11, we force the highest gift ID to be 11? 
    // Actually, usually "11號禮物" implies the gift brought by seat 11.
    // Let's ensure the gift pool contains ID 11 specifically for the teacher's requirement.
    if (activeCount < 11) {
        // Find if 11 is in the pool, if not, replace the last one with 11
        if (!initialGifts.some(g => g.id === 11)) {
            initialGifts[initialGifts.length - 1].id = 11;
        }
    }

    setGifts(initialGifts);
    setGameState('PLAYING');
    setCurrentDrawerId('teacher');
    setHistory([]);
    setLastGiftId(null);
  };

  const findNextAvailableParticipant = useCallback((targetId: number): Participant | null => {
    // Search starting from targetId (seat number)
    const startSearchId = targetId;
    
    for (let i = 0; i < TOTAL_STUDENTS; i++) {
      let currentCheck = ((startSearchId - 1 + i) % TOTAL_STUDENTS) + 1;
      const found = participants.find(p => p.id === currentCheck);
      if (found && found.isParticipating && !found.hasDrawn) {
        return found;
      }
    }
    // If no specific seat found, just find any remaining
    return participants.find(p => p.isParticipating && !p.hasDrawn) || null;
  }, [participants]);

  const handleDraw = (giftId: number) => {
    if (currentDrawerId === null) return;

    const drawer = participants.find(p => p.id === currentDrawerId);
    if (!drawer) return;

    setParticipants(prev => prev.map(p => 
      p.id === currentDrawerId ? { ...p, hasDrawn: true, giftReceived: giftId } : p
    ));
    
    setGifts(prev => prev.map(g => 
      g.id === giftId ? { ...g, isTaken: true, ownerId: currentDrawerId } : g
    ));

    const newHistoryItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      drawerId: drawer.id,
      drawerName: drawer.name,
      giftId,
      timestamp: new Date(),
    };
    setHistory(prev => [newHistoryItem, ...prev]);
    setLastGiftId(giftId);

    // Pick a random video
    const randomVideo = YOUTUBE_IDS[Math.floor(Math.random() * YOUTUBE_IDS.length)];
    setCurrentVideoId(randomVideo);

    // Determine next drawer
    const nextCandidate = findNextAvailableParticipant(giftId);
    if (nextCandidate) {
      setCurrentDrawerId(nextCandidate.id);
    } else {
      setCurrentDrawerId(null);
      setGameState('FINISHED');
    }
  };

  const resetGame = () => {
    setGameState('SETUP');
    setParticipants(prev => prev.map(p => ({ ...p, hasDrawn: false, giftReceived: null })));
    setGifts([]);
    setHistory([]);
    setCurrentDrawerId(null);
    setLastGiftId(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center py-8 px-4 z-10 selection:bg-red-500/30">
      {/* Background Snowflakes */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="snowflake" style={{ 
          left: `${Math.random() * 100}vw`, 
          animationDuration: `${Math.random() * 10 + 15}s`,
          animationDelay: `-${Math.random() * 20}s`,
          fontSize: `${Math.random() * 1.2 + 0.5}rem`,
          opacity: Math.random() * 0.5 + 0.2
        }}>❄</div>
      ))}

      <header className="mb-12 text-center space-y-3">
        <h1 className="text-6xl md:text-8xl festive-font text-red-600 font-bold drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          Merry Christmas
        </h1>
        <p className="text-xl text-green-500 font-bold uppercase tracking-[0.3em] festive-font">
          聖誕交換禮物
        </p>
      </header>

      <main className="w-full max-w-6xl bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-slate-800/50 p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {gameState === 'SETUP' && (
          <Setup participants={participants} onToggle={toggleParticipation} onStart={startGame} />
        )}

        {(gameState === 'PLAYING' || gameState === 'FINISHED') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <DrawBoard 
                currentDrawerId={currentDrawerId}
                participants={participants}
                gifts={gifts}
                onDraw={handleDraw}
                isFinished={gameState === 'FINISHED'}
                lastGiftId={lastGiftId}
                onReset={resetGame}
                historyCount={history.length}
              />
            </div>
            <div className="lg:col-span-1">
              <History history={history} />
            </div>
          </div>
        )}
      </main>

      <VideoModal videoId={currentVideoId} onClose={() => setCurrentVideoId(null)} />

      <footer className="mt-12 text-slate-600 text-xs font-medium tracking-widest uppercase">
        &copy; {new Date().getFullYear()} Christmas Draw System • Festive & Dark
      </footer>
    </div>
  );
};

export default App;
