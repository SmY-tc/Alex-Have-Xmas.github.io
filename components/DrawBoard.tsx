
import React, { useState, useMemo } from 'react';
import { Participant, Gift } from '../types';
import { Gift as GiftIcon, RotateCcw, User, Star, ChevronRight, Gift as GiftFilled, ArrowDown } from 'lucide-react';

interface DrawBoardProps {
  currentDrawerId: string | number | null;
  participants: Participant[];
  gifts: Gift[];
  onDraw: (giftId: number) => void;
  isFinished: boolean;
  lastGiftId: number | null;
  onReset: () => void;
  historyCount: number;
}

export const DrawBoard: React.FC<DrawBoardProps> = ({ 
  currentDrawerId, 
  participants, 
  gifts, 
  onDraw, 
  isFinished,
  lastGiftId,
  onReset,
  historyCount
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPreviewId, setDrawPreviewId] = useState<number | null>(null);

  const currentDrawer = useMemo(() => 
    participants.find(p => p.id === currentDrawerId), 
    [participants, currentDrawerId]
  );

  const availableGifts = useMemo(() => 
    gifts.filter(g => !g.isTaken),
    [gifts]
  );

  const handleStartDraw = async () => {
    if (!currentDrawer || isDrawing) return;

    setIsDrawing(true);

    // Rule: Teacher (first draw) always gets Gift 11
    if (currentDrawer.type === 'TEACHER' && historyCount === 0) {
      let count = 0;
      const interval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * availableGifts.length);
        setDrawPreviewId(availableGifts[randomIdx].id);
        count++;
        if (count > 25) {
          clearInterval(interval);
          setDrawPreviewId(11);
          setTimeout(() => {
            onDraw(11);
            setIsDrawing(false);
            setDrawPreviewId(null);
          }, 800);
        }
      }, 50);
      return;
    }

    // Standard Random Logic for others
    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * availableGifts.length);
      setDrawPreviewId(availableGifts[randomIdx].id);
      count++;
      if (count > 35) {
        clearInterval(interval);
        const finalGift = availableGifts[Math.floor(Math.random() * availableGifts.length)];
        setDrawPreviewId(finalGift.id);
        setTimeout(() => {
          onDraw(finalGift.id);
          setIsDrawing(false);
          setDrawPreviewId(null);
        }, 1000);
      }
    }, 45);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-700 py-16">
        <div className="relative">
            <GiftFilled size={140} className="text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
            <Star className="absolute -top-6 -right-6 text-white animate-bounce" size={56} />
        </div>
        <div className="text-center space-y-3">
            <h2 className="text-5xl font-black festive-font text-white">抽獎結束！</h2>
            <p className="text-slate-400 text-lg font-medium">祝大家聖誕快樂！</p>
        </div>
        <button onClick={onReset} className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all text-slate-200 border border-slate-700">
          <RotateCcw size={20} />
          返回設定
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-1000">
      <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-6 z-10">
          <div className={`p-6 rounded-[2rem] transition-all duration-500 ${currentDrawer?.type === 'TEACHER' ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'bg-green-600 shadow-[0_0_30px_rgba(22,163,74,0.4)]'}`}>
            <User size={40} className="text-white" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">目前抽獎者</p>
            <h3 className="text-4xl font-black text-white">{currentDrawer?.name || '---'}</h3>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">禮物剩餘</p>
          <span className="text-5xl font-black text-green-500">{availableGifts.length}</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] bg-slate-950/60 rounded-[3rem] border border-slate-800/80 flex flex-col items-center justify-center overflow-hidden shadow-inner group">
        <div className="z-10 text-center space-y-8 px-4">
          {drawPreviewId !== null ? (
            <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                <div className="w-56 h-56 bg-slate-900 rounded-[2.5rem] border-4 border-yellow-500/30 flex items-center justify-center shadow-2xl">
                    <span className="text-9xl font-black text-yellow-400 font-mono tracking-tighter">
                      {drawPreviewId.toString().padStart(2, '0')}
                    </span>
                </div>
                <div className="mt-6 text-yellow-500/80 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <GiftIcon size={16} /> 抽獎中...
                </div>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-36 h-36 bg-slate-900/80 border border-slate-800 rounded-[2rem] flex items-center justify-center shadow-xl">
                <GiftIcon size={72} className="text-slate-700" />
              </div>
              <h4 className="text-slate-400 font-bold tracking-wide">按下按鈕揭曉驚喜</h4>
            </div>
          )}

          <button
            disabled={isDrawing || !currentDrawer}
            onClick={handleStartDraw}
            className={`mt-4 px-16 py-6 rounded-2xl font-black text-2xl transition-all ${isDrawing || !currentDrawer ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-white text-slate-950 hover:bg-slate-200 active:scale-95'}`}
          >
            {isDrawing ? '正在揭曉...' : '啟動抽獎'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">所有禮物編號</h5>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-13 gap-3">
          {gifts.sort((a,b) => a.id - b.id).map(gift => (
            <div 
              key={gift.id}
              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all duration-700 ${gift.isTaken ? 'bg-slate-950/80 text-slate-800 border border-slate-900' : lastGiftId === gift.id ? 'bg-yellow-500 text-slate-950 scale-125 z-20 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'}`}
            >
              {gift.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
