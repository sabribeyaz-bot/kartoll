export enum KeyboardLayoutType {
  TR_Q = 'TR_Q',
  TR_F = 'TR_F'
}

export type LessonLevel = 'acemi' | 'orta' | 'ileri';

export interface KeyInfo {
  char: string;
  code: string; // e.g., 'KeyA'
  finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
  hand: 'left' | 'right';
  row: number; // 0-4
  width?: number; // relative width unit, default 1
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  description: string;
  level: LessonLevel;
  isAiGenerated?: boolean;
}

export interface Stats {
  wpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  startTime: number | null;
}

export interface Theme {
  bgMain: string;      // Ana arka plan
  bgPanel: string;     // Paneller (Header, Klavye zemin)
  textMain: string;    // Ana metin rengi
  textDim: string;     // İkincil metin rengi
  primary: string;     // Vurgu rengi (İmleç, Butonlar)
  keyBg: string;       // Tuş arka planı
  keyText: string;     // Tuş yazı rengi
}
