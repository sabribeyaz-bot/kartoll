import React from 'react';
import { Theme } from '../types';

interface ThemePanelProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  resetTheme: () => void;
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ isOpen, setIsOpen, theme, setTheme, resetTheme }) => {
  const handleChange = (key: keyof Theme, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  return (
    <div className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Toggle Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-0 top-1/2 -translate-x-full bg-[var(--bg-panel)] border-l border-t border-b border-[var(--text-dim)]/20 p-3 rounded-l-lg shadow-lg hover:bg-[var(--primary)] hover:text-white text-[var(--text-main)] transition-colors"
          title="Temayı Özelleştir"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      )}

      {/* Panel Content */}
      <div className="h-full w-72 bg-[var(--bg-panel)] border-l border-[var(--text-dim)]/20 shadow-2xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-[var(--text-dim)]/20 pb-4">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Görünüm Ayarları</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[var(--text-dim)] hover:text-[var(--primary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <ColorInput label="Arka Plan" value={theme.bgMain} onChange={(v) => handleChange('bgMain', v)} />
          <ColorInput label="Panel Rengi" value={theme.bgPanel} onChange={(v) => handleChange('bgPanel', v)} />
          <ColorInput label="Vurgu Rengi" value={theme.primary} onChange={(v) => handleChange('primary', v)} />
          <ColorInput label="Yazı Rengi" value={theme.textMain} onChange={(v) => handleChange('textMain', v)} />
          <ColorInput label="Tuş Rengi" value={theme.keyBg} onChange={(v) => handleChange('keyBg', v)} />
          <ColorInput label="Tuş Yazısı" value={theme.keyText} onChange={(v) => handleChange('keyText', v)} />
          
          <div className="pt-6 border-t border-[var(--text-dim)]/20">
            <button
              onClick={resetTheme}
              className="w-full py-2 px-4 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold"
            >
              Varsayılanlara Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorInput: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)]">{label}</label>
    <div className="flex items-center gap-3 bg-[var(--bg-main)]/50 p-2 rounded border border-[var(--text-dim)]/20">
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" 
      />
      <span className="text-xs font-mono text-[var(--text-main)]">{value}</span>
    </div>
  </div>
);
