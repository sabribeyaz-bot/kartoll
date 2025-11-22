import React from 'react';
import { Stats } from '../types';

interface StatsBoardProps {
  stats: Stats;
}

export const StatsBoard: React.FC<StatsBoardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-4xl mx-auto">
      <div className="bg-[var(--bg-panel)] p-4 rounded-lg border border-[var(--text-dim)]/20 flex flex-col items-center shadow-sm">
        <span className="text-[var(--text-dim)] text-xs uppercase tracking-wider">Hız (WPM)</span>
        <span className="text-3xl font-mono font-bold text-[var(--primary)]">{Math.round(stats.wpm)}</span>
      </div>
      <div className="bg-[var(--bg-panel)] p-4 rounded-lg border border-[var(--text-dim)]/20 flex flex-col items-center shadow-sm">
        <span className="text-[var(--text-dim)] text-xs uppercase tracking-wider">Doğruluk</span>
        <span className={`text-3xl font-mono font-bold ${stats.accuracy > 95 ? 'text-blue-400' : stats.accuracy > 80 ? 'text-yellow-400' : 'text-red-400'}`}>
          %{Math.round(stats.accuracy)}
        </span>
      </div>
      <div className="bg-[var(--bg-panel)] p-4 rounded-lg border border-[var(--text-dim)]/20 flex flex-col items-center shadow-sm">
        <span className="text-[var(--text-dim)] text-xs uppercase tracking-wider">Hatalar</span>
        <span className="text-3xl font-mono font-bold text-red-500">{stats.errors}</span>
      </div>
    </div>
  );
};
