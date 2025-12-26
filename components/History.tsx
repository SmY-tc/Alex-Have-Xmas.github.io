
import React from 'react';
import { HistoryItem } from '../types';
import { History as HistoryIcon, Gift as GiftIcon } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <HistoryIcon className="text-blue-400" size={20} />
          抽獎記錄
        </h3>
        <span className="bg-slate-800 px-2 py-0.5 rounded text-xs font-bold text-slate-400">
          {history.length} 筆
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600 italic">
            <HistoryIcon size={40} className="mb-4 opacity-20" />
            <p>尚無任何記錄</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {history.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-4 flex items-center justify-between group transition-colors hover:bg-slate-800/30 ${index === 0 ? 'bg-red-900/10 border-l-4 border-red-600' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${item.drawerId === 'teacher' ? 'bg-red-600/20 text-red-500' : 'bg-green-600/20 text-green-500'}`}>
                    {item.drawerId === 'teacher' ? '師' : item.drawerId}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{item.drawerName}</p>
                    <p className="text-[10px] text-slate-500 uppercase">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                      <GiftIcon size={14} />
                      <span>{item.giftId} 號</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-slate-950/50 text-[10px] text-slate-500 border-t border-slate-800">
        抽獎記錄將會依序追蹤禮物與座號的關聯
      </div>
    </div>
  );
};
