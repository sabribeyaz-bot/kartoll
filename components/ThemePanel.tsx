import React from 'react';
import { Theme } from '../types';

interface ThemePanelProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  resetTheme: () => void;
}

// Hazır Tema Paketleri
const PRESETS: { name: string; theme: Theme }[] = [
  {
    name: 'Varsayılan',
    theme: {
      bgMain: '#0f172a',
      bgPanel: '#1e293b',
      textMain: '#f1f5f9',
      textDim: '#94a3b8',
      primary: '#22c55e',
      keyBg: '#e2e8f0',
      keyText: '#475569'
    }
  },
  {
    name: 'Matrix',
    theme: {
      bgMain: '#000000',
      bgPanel: '#111111',
      textMain: '#00ff41',
      textDim: '#008f11',
      primary: '#00ff41',
      keyBg: '#0d0208',
      keyText: '#003b00'
    }
  },
  {
    name: 'Cyberpunk',
    theme: {
      bgMain: '#0b0014',
      bgPanel: '#1a0b2e',
      textMain: '#ff2a6d',
      textDim: '#05d9e8',
      primary: '#d1f7ff',
      keyBg: '#2d1b4e',
      keyText: '#d1f7ff'
    }
  },
  {
    name: 'Okyanus',
    theme: {
      bgMain: '#0f1c2e',
      bgPanel: '#1f3a5f',
      textMain: '#d1e8ff',
      textDim: '#5b86b5',
      primary: '#37bcf7',
      keyBg: '#1f2937',
      keyText: '#9ca3af'
    }
  },
  {
    name: 'Kahve & Kağıt',
    theme: {
      bgMain: '#f5f5dc',
      bgPanel: '#e8e4c9',
      textMain: '#4b3621',
      textDim: '#8b5a2b',
      primary: '#d2691e',
      keyBg: '#ffffff',
      keyText: '#4b3621'
    }
  },
  {
    name: 'Dracula',
    theme: {
      bgMain: '#282a36',
      bgPanel: '#44475a',
      textMain: '#f8f8f2',
      textDim: '#6272a4',
      primary: '#ff79c6',
      keyBg: '#bd93f9',
      keyText: '#282a36'
    }
  }
];

export const ThemePanel: React.FC<ThemePanelProps> = ({ isOpen, setIsOpen, theme, setTheme, resetTheme }) => {
  
  const handleChange = (key: keyof Theme, value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  const applyPreset = (presetTheme: Theme) => {
    setTheme(presetTheme);
  };

  return (
    <>
      {/* Backdrop (Panel açıkken arkası kararsın ve tıklayınca kapansın) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-[var(--bg-panel)]/95 backdrop-blur-xl border-l border-[var(--text-dim)]/20 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[var(--text-dim)]/10">
          <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary)]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
            Tema Tasarımı
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-[var(--text-main)]/10 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar space-y-8">
          
          {/* Presets Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] mb-3">Hazır Temalar</h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.theme)}
                  className="group relative flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--text-dim)]/20 hover:border-[var(--primary)] transition-all overflow-hidden bg-[var(--bg-main)]/50 hover:shadow-lg"
                  style={{ backgroundColor: preset.theme.bgPanel }}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.theme.primary }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.theme.bgMain }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.theme.textMain }}></div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: preset.theme.textMain }}>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[var(--text-dim)]/10"></div>

          {/* Manual Colors Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-dim)] mb-3">Özel Renkler</h3>
            <div className="space-y-3">
              <ColorInput label="Arka Plan" value={theme.bgMain} onChange={(v) => handleChange('bgMain', v)} />
              <ColorInput label="Panel & Klavye Zemin" value={theme.bgPanel} onChange={(v) => handleChange('bgPanel', v)} />
              <ColorInput label="Vurgu Rengi (Primary)" value={theme.primary} onChange={(v) => handleChange('primary', v)} />
              <ColorInput label="Ana Metin" value={theme.textMain} onChange={(v) => handleChange('textMain', v)} />
              <ColorInput label="Soluk Metin" value={theme.textDim} onChange={(v) => handleChange('textDim', v)} />
              <ColorInput label="Tuş Rengi" value={theme.keyBg} onChange={(v) => handleChange('keyBg', v)} />
              <ColorInput label="Tuş Yazısı" value={theme.keyText} onChange={(v) => handleChange('keyText', v)} />
            </div>
          </div>

          <div className="pt-4">
             <button
              onClick={resetTheme}
              className="w-full py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Varsayılanlara Dön
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

// Yeni Modern Renk Input Bileşeni
const ColorInput: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between group">
    <label className="text-sm font-medium text-[var(--text-main)]">{label}</label>
    <div className="relative flex items-center gap-2">
      <span className="text-[10px] font-mono text-[var(--text-dim)] opacity-50 uppercase">{value}</span>
      <div className="relative w-8 h-8 rounded-full shadow-inner border border-[var(--text-dim)]/20 overflow-hidden cursor-pointer hover:scale-110 transition-transform">
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: value }}
        />
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
        />
      </div>
    </div>
  </div>
);
