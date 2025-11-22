import React from 'react';
import { KeyInfo, KeyboardLayoutType } from '../types';
import { Q_LAYOUT, F_LAYOUT, FINGER_COLORS } from '../constants';

interface VirtualKeyboardProps {
  activeChar: string;
  layoutType: KeyboardLayoutType;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeChar, layoutType }) => {
  const layout = layoutType === KeyboardLayoutType.TR_F ? F_LAYOUT : Q_LAYOUT;

  // Group keys by row
  const rows: KeyInfo[][] = [[], [], [], [], []];
  layout.forEach(key => {
    if (rows[key.row]) rows[key.row].push(key);
  });

  // Helper to check if a key matches the active character
  const isActive = (key: KeyInfo) => {
    if (!activeChar) return false;
    if (key.code === 'Space' && activeChar === ' ') return true;
    // Simple case-insensitive check for letters
    return key.char.toLowerCase() === activeChar.toLowerCase();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 bg-[var(--bg-panel)] rounded-xl shadow-2xl border border-[var(--text-dim)]/20 select-none transition-colors duration-300">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => {
              const active = isActive(key);
              // Reduced heights and font sizes slightly for compact look
              const baseClasses = "h-12 sm:h-13 lg:h-16 flex items-center justify-center rounded-lg shadow-sm font-bold text-base sm:text-lg lg:text-xl transition-all duration-100 border-b-[4px] sm:border-b-[5px]";
              
              // Finger color or default theme key color
              const colorClass = active 
                ? FINGER_COLORS[key.finger] + " text-slate-900 translate-y-1 border-b-0 mb-[4px] sm:mb-[5px]" 
                : "bg-[var(--key-bg)] border-[var(--text-dim)]/30 text-[var(--key-text)]";

              // Width handling
              const widthStyle = { flex: key.width || 1 };

              return (
                <div
                  key={key.code}
                  style={widthStyle}
                  className={`${baseClasses} ${colorClass} ${active ? 'brightness-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : ''}`}
                >
                  {key.char === 'Space' ? ' ' : key.char.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Finger Legend - Compacted margin */}
      <div className="mt-4 sm:mt-5 flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[var(--text-dim)] font-medium">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400 shadow-sm"></div> Serçe</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div> Yüzük</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div> Orta</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div> İşaret</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm"></div> Baş</div>
      </div>
    </div>
  );
};