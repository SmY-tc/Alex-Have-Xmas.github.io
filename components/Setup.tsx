
import React from 'react';
import { Participant } from '../types';
import { UserMinus, CheckCircle, Play, Info, Users } from 'lucide-react';

interface SetupProps {
  participants: Participant[];
  onToggle: (id: string | number) => void;
  onStart: () => void;
}

export const Setup: React.FC<SetupProps> = ({ participants, onToggle, onStart }) => {
  const students = participants.filter(p => p.type === 'STUDENT');
  const activeCount = participants.filter(p => p.isParticipating).length;

  return (
    <div className="flex flex-col items-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-bold mb-2">
          <Users size={16} className="text-green-500" />
          目前共有 {activeCount} 位參與者
        </div>
        <h2 className="text-4xl font-bold text-slate-100 festive-font">
          設定參與座號
        </h2>
        <p className="text-slate-400 leading-relaxed">
          請排除今天不參與活動的同學座號。<br />
          系統將自動根據抽到的禮物編號，決定下一位抽獎者。
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 w-full p-2">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => onToggle(student.id)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300 group
              flex flex-col items-center justify-center gap-1 overflow-hidden
              ${student.isParticipating 
                ? 'bg-slate-800/40 border-slate-700/50 hover:border-green-500/50 text-slate-100 shadow-lg' 
                : 'bg-slate-950/40 border-slate-800/50 opacity-40 text-slate-600 grayscale scale-95'}
            `}
          >
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">座號</span>
            <span className="text-2xl font-black">{student.id}</span>
            {student.isParticipating ? (
              <CheckCircle className="absolute top-1 right-1 w-4 h-4 text-green-500 fill-slate-900" />
            ) : (
              <UserMinus className="absolute top-1 right-1 w-4 h-4 text-red-500 fill-slate-900" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="group relative px-12 py-5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black text-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 shadow-[0_10px_40px_rgba(220,38,38,0.3)]"
        >
          <Play size={28} className="fill-current" />
          確認並開始
          <div className="absolute inset-0 rounded-2xl animate-ping bg-red-500 opacity-10 pointer-events-none"></div>
        </button>
        <p className="text-slate-500 text-xs font-bold flex items-center gap-1 italic">
          <Info size={14} /> 老師將會首先啟動抽獎環節
        </p>
      </div>
    </div>
  );
};
