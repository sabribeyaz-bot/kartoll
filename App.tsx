import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KeyboardLayoutType, Lesson, Stats, LessonLevel, Theme } from './types';
import { STATIC_LESSONS } from './constants';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { StatsBoard } from './components/StatsBoard';
import { ThemePanel } from './components/ThemePanel';
import { generateLessonContent, generateRemedialContent } from './services/geminiService';
import { audioService } from './services/audioService';

// Varsayılan Tema (Orjinal Slate/Green Tasarımı)
const DEFAULT_THEME: Theme = {
  bgMain: '#0f172a',    // slate-900
  bgPanel: '#1e293b',   // slate-800
  textMain: '#f1f5f9',  // slate-100
  textDim: '#94a3b8',   // slate-400
  primary: '#22c55e',   // brand-500
  keyBg: '#e2e8f0',     // slate-200
  keyText: '#475569'    // slate-600
};

const App: React.FC = () => {
  // State
  const [layoutType, setLayoutType] = useState<KeyboardLayoutType>(KeyboardLayoutType.TR_Q);
  const [activeLevel, setActiveLevel] = useState<LessonLevel>('acemi');
  const [currentLesson, setCurrentLesson] = useState<Lesson>(STATIC_LESSONS[0]);
  const [inputValue, setInputValue] = useState('');
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    totalChars: 0,
    startTime: null
  });
  const [isFinished, setIsFinished] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);

  // Analysis State
  const [mistakeHistory, setMistakeHistory] = useState<Record<string, number>>({});
  const [completionCounts, setCompletionCounts] = useState<Record<string, number>>({});

  // Auto Advance State
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter lessons by level
  const filteredLessons = STATIC_LESSONS.filter(l => l.level === activeLevel);

  // Calculate Progress for Current Level
  const totalLessonsInLevel = filteredLessons.length;
  const completedLessonsInLevel = filteredLessons.filter(l => (completionCounts[l.id] || 0) > 0).length;
  const progressPercent = totalLessonsInLevel > 0 ? (completedLessonsInLevel / totalLessonsInLevel) * 100 : 0;

  // Focus management
  useEffect(() => {
    if (!isFinished && !isThemePanelOpen) {
      inputRef.current?.focus();
    }
  }, [isFinished, currentLesson, isThemePanelOpen]);

  // Update audio service state
  useEffect(() => {
    audioService.toggle(isSoundEnabled);
  }, [isSoundEnabled]);

  // Auto Advance Logic
  useEffect(() => {
    let timer: any;

    if (isFinished) {
      // Criteria: Speed >= 60 AND Accuracy >= 90
      const isPerformanceGood = stats.wpm >= 60 && stats.accuracy >= 90;
      const currentIndex = filteredLessons.findIndex(l => l.id === currentLesson.id);
      const hasNextLesson = currentIndex !== -1 && currentIndex < filteredLessons.length - 1;

      if (isPerformanceGood && hasNextLesson) {
        // Start countdown
        setAutoAdvanceTimer(3);
        
        timer = setInterval(() => {
          setAutoAdvanceTimer((prev) => {
            if (prev === null) return null;
            if (prev <= 1) {
              clearInterval(timer);
              handleLessonChange(filteredLessons[currentIndex + 1]);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      setAutoAdvanceTimer(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isFinished]); // Run when finished state changes

  // Calculate Stats
  const calculateStats = useCallback(() => {
    const { startTime } = stats;
    if (!startTime) return;
    
    const now = Date.now();
    const timeMinutes = (now - startTime) / 60000;
    const wordsTyped = inputValue.length / 5;
    const wpm = timeMinutes > 0 ? wordsTyped / timeMinutes : 0;
    
    const accuracy = inputValue.length > 0 
      ? Math.max(0, ((inputValue.length - stats.errors) / inputValue.length) * 100)
      : 100;

    setStats(prev => ({
      ...prev,
      wpm,
      accuracy,
      totalChars: inputValue.length
    }));
  }, [inputValue.length, stats.errors, stats.startTime]);

  // Timer for realtime WPM update
  useEffect(() => {
    if (stats.startTime && !isFinished) {
      const interval = setInterval(calculateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [stats.startTime, isFinished, calculateStats]);

  // Handle Typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isThemePanelOpen) return; // Disable typing when theme panel is open

    const value = e.target.value;
    const length = value.length;

    // Start timer on first char
    if (!stats.startTime && length === 1) {
      setStats(prev => ({ ...prev, startTime: Date.now() }));
    }

    // Error Checking & Sound Logic
    const targetChar = currentLesson.content[length - 1];
    const typedChar = value[length - 1];
    
    if (length > inputValue.length) {
        // User added a character
        if (typedChar !== targetChar) {
             // Yanlış tuş
             setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
             audioService.playErrorSound();

             // Hatalı harfi kaydet (Boşluk hariç)
             if (targetChar !== ' ') {
               setMistakeHistory(prev => ({
                 ...prev,
                 [targetChar]: (prev[targetChar] || 0) + 1
               }));
             }

        } else {
            // Doğru tuş
            audioService.playKeySound(typedChar === ' ');
        }
    }

    setInputValue(value);

    // Check Completion
    if (length >= currentLesson.content.length) {
      setIsFinished(true);
      audioService.playSuccessSound();
      calculateStats();
      
      // Ders tamamlanma sayısını artır
      setCompletionCounts(prev => ({
        ...prev,
        [currentLesson.id]: (prev[currentLesson.id] || 0) + 1
      }));
    }
  };

  const resetLesson = (fullReset: boolean = false) => {
    setInputValue('');
    setStats({ wpm: 0, accuracy: 100, errors: 0, totalChars: 0, startTime: null });
    setIsFinished(false);
    setAutoAdvanceTimer(null); // Cancel auto advance if user resets manually
    
    if (fullReset) {
       setMistakeHistory({});
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleLessonChange = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    resetLesson(true); // Yeni ders, temiz sayfa
  };

  const handleAILessonClick = async () => {
    setIsLoadingAI(true);
    const content = await generateLessonContent("günlük yaşam, teknoloji veya doğa");
    setIsLoadingAI(false);
    
    const newLesson: Lesson = {
      id: `ai-${Date.now()}`,
      title: 'Yapay Zeka Dersi',
      description: 'Gemini tarafından sizin için üretildi.',
      content: content,
      level: 'ileri', // Yapay zeka dersleri genellikle karışıktır
      isAiGenerated: true
    };
    
    handleLessonChange(newLesson);
  };

  const handleRemedialLessonClick = async () => {
    setIsLoadingAI(true);
    setAutoAdvanceTimer(null); // Stop auto advance
    
    const weakKeys = Object.entries(mistakeHistory)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 5)
        .map(([key]) => key);

    const content = await generateRemedialContent(weakKeys);
    setIsLoadingAI(false);

    const newLesson: Lesson = {
        id: `remedial-${Date.now()}`,
        title: 'Hata Telafi Dersi',
        description: `Şu tuşlara odaklanıldı: ${weakKeys.join(', ')}`,
        content: content,
        level: 'orta',
        isAiGenerated: true
    };

    handleLessonChange(newLesson);
  };

  // Render the text with highlighting
  const renderText = () => {
    return currentLesson.content.split('').map((char, index) => {
      // Increased Text Size
      let className = "font-mono text-2xl sm:text-3xl transition-colors duration-75 ";
      const typedChar = inputValue[index];
      const isCurrent = index === inputValue.length;

      if (index < inputValue.length) {
        if (typedChar === char) {
          className += "text-[var(--primary)] opacity-70"; // Correct
        } else {
          className += "text-red-500 bg-red-900/30"; // Incorrect
        }
      } else if (isCurrent) {
        className += "bg-[var(--primary)] text-[var(--bg-main)] animate-pulse rounded px-1 -mx-1 z-10 relative"; // Cursor
      } else {
        className += "text-[var(--text-dim)]"; // Upcoming
      }

      return <span key={index} className={className}>{char}</span>;
    });
  };

  const nextChar = currentLesson.content[inputValue.length] || '';
  const completedCount = completionCounts[currentLesson.id] || 0;
  const hasMistakes = Object.keys(mistakeHistory).length > 0;
  const showRemedialButton = completedCount >= 2 && hasMistakes;

  // CSS Variables for Theme
  const themeStyles = {
    '--bg-main': theme.bgMain,
    '--bg-panel': theme.bgPanel,
    '--text-main': theme.textMain,
    '--text-dim': theme.textDim,
    '--primary': theme.primary,
    '--key-bg': theme.keyBg,
    '--key-text': theme.keyText,
  } as React.CSSProperties;

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300" 
      onClick={() => !isThemePanelOpen && inputRef.current?.focus()}
      ref={containerRef}
      style={themeStyles}
    >
      <ThemePanel 
        isOpen={isThemePanelOpen} 
        setIsOpen={setIsThemePanelOpen} 
        theme={theme}
        setTheme={setTheme}
        resetTheme={() => setTheme(DEFAULT_THEME)}
      />

      {/* Header - Compact */}
      <header className="shrink-0 flex justify-between items-center px-4 py-2 border-b border-[var(--text-dim)]/20 bg-[var(--bg-panel)]/90 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--primary)]/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
             <h1 className="text-lg font-bold text-[var(--text-main)]">
              Hızlı Klavye Ustası
            </h1>
            <p className="text-[10px] text-[var(--text-dim)] truncate max-w-[150px]">{currentLesson.title}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
             
             {/* Theme Toggle Button */}
             <button
                onClick={(e) => { e.stopPropagation(); setIsThemePanelOpen(true); }}
                className="p-2 rounded-full text-[var(--text-dim)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] transition-colors"
                title="Temayı Özelleştir"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
             </button>

             {/* Sound Toggle */}
             <button
                onClick={(e) => { e.stopPropagation(); setIsSoundEnabled(!isSoundEnabled); }}
                className={`p-2 rounded-full transition-colors ${isSoundEnabled ? 'text-[var(--primary)] bg-[var(--primary)]/20' : 'text-[var(--text-dim)] bg-[var(--bg-main)]'}`}
                title={isSoundEnabled ? "Sesleri Kapat" : "Sesleri Aç"}
             >
                {isSoundEnabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 1.414L10.414 12l3.293 3.293a1 1 0 01-1.414 1.414L9 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L7.586 12 4.293 8.707a1 1 0 011.414-1.414L9 10.586l3.293-3.293z" clipRule="evenodd" />
                  </svg>
                )}
             </button>

             <button 
                onClick={(e) => { e.stopPropagation(); setLayoutType(prev => prev === KeyboardLayoutType.TR_Q ? KeyboardLayoutType.TR_F : KeyboardLayoutType.TR_Q); }}
                className="px-3 py-1 text-xs font-medium bg-[var(--bg-main)] hover:bg-[var(--primary)] hover:text-white text-[var(--text-main)] border border-[var(--text-dim)]/20 rounded transition-colors"
             >
                {layoutType === KeyboardLayoutType.TR_Q ? 'TR-Q' : 'TR-F'}
             </button>
        </div>
      </header>

      {/* Main Scrollable Content - Flex Item */}
      <div className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4 max-w-7xl mx-auto w-full gap-2">
        
        {/* Controls Row: Tabs & AI Buttons */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
            <div className="flex bg-[var(--bg-panel)] p-1 rounded-lg border border-[var(--text-dim)]/20">
                {(['acemi', 'orta', 'ileri'] as LessonLevel[]).map((level) => (
                    <button
                        key={level}
                        onClick={(e) => { e.stopPropagation(); setActiveLevel(level); }}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                            activeLevel === level 
                            ? 'bg-[var(--primary)] text-white shadow' 
                            : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); handleAILessonClick(); }}
                disabled={isLoadingAI}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all border border-[var(--primary)]/50 text-[var(--primary)] hover:bg-[var(--primary)]/10 flex items-center gap-2"
            >
                {isLoadingAI ? '...' : '✨ Yapay Zeka'}
            </button>
        </div>

        {/* Lesson Grid - Compressed Height */}
        <div className="shrink-0 bg-[var(--bg-panel)]/50 rounded-lg p-1.5 border border-[var(--text-dim)]/20 max-h-14 overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap gap-1">
                {filteredLessons.map(lesson => {
                    const isCompleted = (completionCounts[lesson.id] || 0) > 0;
                    const lessonNum = lesson.id.split('-')[1];
                    return (
                        <button
                            key={lesson.id}
                            onClick={(e) => { e.stopPropagation(); handleLessonChange(lesson); }}
                            className={`w-7 h-5 text-[10px] font-bold rounded transition-all flex items-center justify-center border ${
                                currentLesson.id === lesson.id 
                                ? 'bg-[var(--primary)] border-[var(--primary)] text-white scale-110 shadow-md' 
                                : isCompleted
                                    ? 'bg-[var(--bg-main)] border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/20'
                                    : 'bg-[var(--bg-main)] border-[var(--text-dim)]/20 text-[var(--text-dim)] hover:bg-[var(--primary)]/10 hover:text-[var(--text-main)]'
                            }`}
                            title={lesson.title}
                        >
                            {lessonNum}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Stats - Compact */}
        <div className="shrink-0">
             <StatsBoard stats={stats} />
        </div>

        {/* Typing Area - Flexible but with larger Min-Height */}
        <div className="flex-1 relative group min-h-[120px] flex flex-col">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-blue-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative flex-1 bg-[var(--bg-panel)] border border-[var(--text-dim)]/20 rounded-lg p-4 sm:p-6 overflow-y-auto flex items-center content-center flex-wrap gap-y-2 leading-relaxed shadow-inner custom-scrollbar">
             {isFinished ? (
                 <div className="w-full flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                     <h2 className="text-3xl font-bold text-[var(--text-main)]">Tebrikler!</h2>
                     
                     <div className="flex gap-4 text-lg">
                         <div className="bg-[var(--bg-main)] px-4 py-1 rounded border border-[var(--text-dim)]/20 text-[var(--text-main)]">Hız: <span className="text-[var(--primary)] font-mono">{Math.round(stats.wpm)} WPM</span></div>
                         <div className="bg-[var(--bg-main)] px-4 py-1 rounded border border-[var(--text-dim)]/20 text-[var(--text-main)]">Doğruluk: <span className="text-blue-400 font-mono">%{Math.round(stats.accuracy)}</span></div>
                     </div>

                     {/* Progress Bar for Current Level */}
                     <div className="w-full max-w-md my-2">
                        <div className="flex justify-between text-xs text-[var(--text-dim)] mb-1 uppercase tracking-wide font-bold">
                          <span className="capitalize">{activeLevel} Seviyesi İlerleme</span>
                          <span>{completedLessonsInLevel} / {totalLessonsInLevel}</span>
                        </div>
                        <div className="w-full bg-[var(--bg-main)] rounded-full h-3 border border-[var(--text-dim)]/20 overflow-hidden shadow-inner">
                          <div 
                            className="bg-[var(--primary)] h-full transition-all duration-1000 ease-out shadow-[0_0_10px_var(--primary)]" 
                            style={{ width: `${progressPercent}%` }}
                          ></div>
                        </div>
                     </div>

                     {/* Auto Advance Message */}
                     {autoAdvanceTimer !== null && (
                        <div className="flex flex-col items-center animate-pulse bg-[var(--primary)]/10 px-4 py-2 rounded-lg border border-[var(--primary)]/20">
                           <span className="text-[var(--primary)] font-bold">🚀 Mükemmel Performans!</span>
                           <span className="text-[var(--text-dim)] text-sm">Sonraki derse geçiliyor: <span className="text-[var(--text-main)] font-bold">{autoAdvanceTimer}</span></span>
                        </div>
                     )}

                     <div className="flex gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); resetLesson(false); }}
                            className="px-6 py-2 bg-[var(--text-dim)]/20 hover:bg-[var(--text-dim)]/30 text-[var(--text-main)] text-sm font-bold rounded-lg transition-transform active:scale-95"
                        >
                            Tekrar Dene
                        </button>

                        {showRemedialButton && (
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemedialLessonClick(); }}
                                disabled={isLoadingAI}
                                className="px-6 py-2 bg-[var(--primary)] hover:opacity-90 text-white text-sm font-bold rounded-lg shadow-lg active:scale-95"
                            >
                                {isLoadingAI ? '...' : 'Özel Çalışma'}
                            </button>
                        )}
                     </div>
                     
                     {!showRemedialButton && autoAdvanceTimer === null && (
                         <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = filteredLessons.findIndex(l => l.id === currentLesson.id);
                                if (currentIndex >= 0 && currentIndex < filteredLessons.length - 1) {
                                    handleLessonChange(filteredLessons[currentIndex + 1]);
                                } else {
                                    resetLesson(false);
                                }
                            }}
                            className="text-xs text-[var(--primary)] hover:underline mt-2"
                         >
                             Sonraki &rarr;
                         </button>
                     )}
                 </div>
             ) : (
                 <div className="w-full break-all whitespace-pre-wrap text-center">
                    {renderText()}
                 </div>
             )}
          </div>
        </div>
      </div>

      {/* Keyboard - Fixed Bottom with Less Padding */}
      <div className="shrink-0 bg-[var(--bg-panel)]/50 p-2 pt-1 z-10">
           <VirtualKeyboard activeChar={nextChar} layoutType={layoutType} />
      </div>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="absolute opacity-0 top-0 left-0 cursor-default"
        autoFocus={!isThemePanelOpen}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        disabled={isFinished || isThemePanelOpen}
      />
    </div>
  );
};

export default App;