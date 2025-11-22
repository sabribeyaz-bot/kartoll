import { KeyInfo, Lesson } from './types';

// --- Content Data Sets ---

const CHARS = {
  home: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ş', 'i'], // 'i' Q klavyede sağda
  top: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'ı', 'o', 'p', 'ğ', 'ü'],
  bot: ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'ö', 'ç'],
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  basicPunctuation: ['.', ',', ';', ':'],
  arithmetic: ['+', '-', '*', '=', '/', '%'],
  brackets: ['(', ')', '[', ']', '{', '}', '<', '>'],
  special: ['!', '\'', '^', '#', '$', '&', '_', '?', '\\', '|', '@', '"', '€']
};

const SYLLABLES = {
  home: ['ak', 'al', 'as', 'ad', 'la', 'ka', 'şa', 'fa', 'jak', 'kas', 'fal', 'sak', 'da'],
  top: ['er', 'et', 'yu', 'op', 'po', 're', 'te', 'ye', 'kur', 'tur', 'yol', 'kot', 'pot', 'koy', 'toy'],
  bot: ['zam', 'cam', 'nal', 'maç', 'çan', 'van', 'nam', 'zan', 'mal', 'can', 'cem', 'men'],
  mixed: ['yaz', 'kış', 'bal', 'gel', 'git', 'koş', 'sev', 'bak', 'gör', 'duy', 'oku']
};

const WORDS = [
  'bir', 've', 'bu', 'da', 'çok', 'için', 'ama', 'o', 'ile', 'ne',
  'gibi', 'her', 'var', 'yok', 'ben', 'sen', 'biz', 'siz', 'şu', 'en',
  'daha', 'kadar', 'diye', 'yeni', 'önce', 'sonra', 'güzel', 'iyi',
  'kitap', 'kalem', 'masa', 'okul', 'bilgi', 'veri', 'ekran', 'tuş'
];

const SENTENCES = [
  "Damlaya damlaya göl olur.",
  "Sakla samanı gelir zamanı.",
  "Ayağını yorganına göre uzat.",
  "Gülme komşuna gelir başına.",
  "Acele işe şeytan karışır.",
  "Bugünün işini yarına bırakma.",
  "İşleyen demir ışıldar.",
  "Zahmetsiz rahmet olmaz."
];

const CODE_SNIPPETS = [
  "if (x > 0) { return true; }",
  "print('Merhaba Dünya');",
  "var total = price * 0.18;",
  "<div><span>Test</span></div>",
  "for (i = 0; i < 10; i++)",
  "user_id = 'admin_01';",
  "email: test@domain.com",
  "#include <stdio.h>",
  "SELECT * FROM users;",
  "width: 100%; height: 50px;",
  "array = [1, 2, 3, 4];",
  "x = (a + b) / (c - d);"
];

// Helper: Rastgele tam sayı
const rand = (max: number) => Math.floor(Math.random() * max);
const randItem = <T>(arr: T[]): T => arr[rand(arr.length)];

// Helper: Shuffle Array
const shuffle = (array: any[]) => {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Ders Üretici Fonksiyon
const generateLessons = (): Lesson[] => {
  const lessons: Lesson[] = [];

  // ----------------------------------------------------------------
  // --- ACEMİ (1-100): Harfler, Kelimeler ve Temel Noktalama ---
  // ----------------------------------------------------------------
  for (let i = 1; i <= 100; i++) {
    let content = "";
    let title = "";
    let desc = "";

    if (i <= 20) {
      // Temel Sıra (ASDF JKLŞ)
      title = `Acemi ${i}: Temel Sıra`;
      desc = "Sadece orta sıra harfleri.";
      const pool = CHARS.home;
      for (let j = 0; j < 40; j++) content += randItem(pool); // Boşluksuz akış (hotkey stili) veya bloklu
      // Okunabilirlik için 5'li gruplara böl
      content = content.match(/.{1,5}/g)?.join(" ") || content;
    } 
    else if (i <= 40) {
      // Üst Sıra + Temel
      title = `Acemi ${i}: Üst Sıra`;
      desc = "Temel ve üst sıra karışık.";
      const pool = [...SYLLABLES.home, ...SYLLABLES.top];
      for (let j = 0; j < 10; j++) content += randItem(pool) + " ";
      content = content.trim();
    } 
    else if (i <= 60) {
      // Alt Sıra + Tümü
      title = `Acemi ${i}: Alt Sıra ve Tümü`;
      desc = "Tüm harfler devrede.";
      const pool = [...SYLLABLES.home, ...SYLLABLES.top, ...SYLLABLES.bot];
      for (let j = 0; j < 12; j++) content += randItem(pool) + " ";
      content = content.trim();
    } 
    else if (i <= 80) {
      // Basit Cümleler ve Nokta/Virgül
      title = `Acemi ${i}: Cümle Başlangıcı`;
      desc = "Nokta ve virgül kullanımı.";
      content = randItem(SENTENCES);
      // Tekrar ettir
      content += " " + randItem(SENTENCES);
    } 
    else {
      // Hızlanma
      title = `Acemi ${i}: Hızlanma`;
      desc = "Karışık kelimeler.";
      for (let j = 0; j < 15; j++) content += randItem(WORDS) + " ";
      content = content.trim();
    }

    lessons.push({
      id: `acemi-${i}`,
      title,
      description: desc,
      content: content.substring(0, 200), // Limit length
      level: 'acemi'
    });
  }

  // ----------------------------------------------------------------
  // --- ORTA (1-100): Büyük Harf, Rakamlar, Tarih, Aritmetik ---
  // ----------------------------------------------------------------
  for (let i = 1; i <= 100; i++) {
    let content = "";
    let title = "";
    let desc = "";

    if (i <= 25) {
      // Büyük Harf Pratiği
      title = `Orta ${i}: Büyük Harfler`;
      desc = "Shift tuşu kullanımı.";
      const words = [...WORDS];
      for (let j = 0; j < 10; j++) {
        let w = randItem(words);
        // Rastgele baş harf veya tümü büyük
        if (Math.random() > 0.5) w = w.charAt(0).toUpperCase() + w.slice(1);
        else w = w.toUpperCase();
        content += w + " ";
      }
    } 
    else if (i <= 50) {
      // Rakamlar (0-9)
      title = `Orta ${i}: Rakamlar`;
      desc = "Sayı tuşları.";
      // Telefon no benzeri: 0555 123 45 67
      // Yıllar: 1990 2023
      const templates = [
        `${rand(1000)}`, 
        `${1900 + rand(130)}`, 
        `05${rand(9)}${rand(9)} ${rand(9)}${rand(9)}${rand(9)}`,
        `${rand(31)}.${rand(12)}.${2000 + rand(25)}` // Tarih
      ];
      for (let j = 0; j < 8; j++) content += randItem(templates) + " ";
    } 
    else if (i <= 75) {
      // Aritmetik İşlemler (+ - * / =)
      title = `Orta ${i}: İşlemler`;
      desc = "Matematiksel semboller.";
      for (let j = 0; j < 6; j++) {
        content += `${rand(100)} ${randItem(CHARS.arithmetic)} ${rand(100)} = ${rand(200)}   `;
      }
    } 
    else {
      // Karışık Metin (Harf + Sayı + Temel Noktalama)
      title = `Orta ${i}: Karışık Metin`;
      desc = "Adres ve saat formatları.";
      const templates = [
        `Saat ${rand(23)}:${rand(5)}0'da`,
        `No:${rand(100)} Daire:${rand(20)}`,
        `%${rand(100)} oranında`,
        `${rand(10)}. Yıl Marşı`,
        `3. Cadde 5. Sokak`
      ];
      for (let j = 0; j < 6; j++) content += randItem(templates) + " ";
    }

    lessons.push({
      id: `orta-${i}`,
      title,
      description: desc,
      content: content.trim(),
      level: 'orta'
    });
  }

  // ----------------------------------------------------------------
  // --- İLERİ (1-100): Tüm Semboller, Kodlama, Parantezler ---
  // ----------------------------------------------------------------
  for (let i = 1; i <= 100; i++) {
    let content = "";
    let title = "";
    let desc = "";

    if (i <= 30) {
      // Parantez Grupları ( ) [ ] { } < >
      title = `İleri ${i}: Parantezler`;
      desc = "Köşeli, süslü ve normal parantezler.";
      const items = ["(test)", "[kutu]", "{blok}", "<html >", "(1+2)", "[x,y]", "{ id: 1 }"];
      for (let j = 0; j < 8; j++) content += randItem(items) + " ";
    }
    else if (i <= 60) {
      // Özel Semboller (Shift ve AltGr gerektirenler: # $ & @ | \ _ )
      title = `İleri ${i}: Özel Semboller`;
      desc = "Hashtag, dolar, e-posta vb.";
      const items = [
        "#hashtag", "$100", "user@mail", "kdv%18", "ve&veya", 
        "alt_tire", "C:\\Dosya", "a | b", "'tek tırnak'", "\"çift\""
      ];
      for (let j = 0; j < 8; j++) content += randItem(items) + " ";
    }
    else if (i <= 90) {
      // Kodlama ve Teknik Metin (Tüm tuşların kombinasyonu)
      title = `İleri ${i}: Kodlama Modu`;
      desc = "Yazılım sözdizimi pratikleri.";
      content = randItem(CODE_SNIPPETS) + " " + randItem(CODE_SNIPPETS);
    }
    else {
      // Final: Kaos Modu (Şifre benzeri zor metinler)
      title = `İleri ${i}: Ustalık`;
      desc = "Maksimum parmak esnekliği.";
      // Rastgele karakterler üret
      const allChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!?+-*/=()[]{}<>@#$%&_";
      for (let j = 0; j < 40; j++) {
        if (j > 0 && j % 8 === 0) content += " "; // 8'li gruplar
        content += allChars[Math.floor(Math.random() * allChars.length)];
      }
    }

    lessons.push({
      id: `ileri-${i}`,
      title,
      description: desc,
      content: content.trim(),
      level: 'ileri'
    });
  }

  return lessons;
};

export const STATIC_LESSONS: Lesson[] = generateLessons();

// --- Keyboard Data ---

const createKey = (char: string, code: string, finger: KeyInfo['finger'], hand: KeyInfo['hand'], row: number, width: number = 1): KeyInfo => ({
  char, code, finger, hand, row, width
});

export const Q_LAYOUT: KeyInfo[] = [
  // Row 0 (Numbers & Symbols)
  createKey('"', 'Backquote', 'pinky', 'left', 0),
  createKey('1', 'Digit1', 'pinky', 'left', 0),
  createKey('2', 'Digit2', 'ring', 'left', 0),
  createKey('3', 'Digit3', 'middle', 'left', 0),
  createKey('4', 'Digit4', 'index', 'left', 0),
  createKey('5', 'Digit5', 'index', 'left', 0),
  createKey('6', 'Digit6', 'index', 'right', 0),
  createKey('7', 'Digit7', 'index', 'right', 0),
  createKey('8', 'Digit8', 'middle', 'right', 0),
  createKey('9', 'Digit9', 'ring', 'right', 0),
  createKey('0', 'Digit0', 'pinky', 'right', 0),
  createKey('*', 'Minus', 'pinky', 'right', 0),
  createKey('-', 'Equal', 'pinky', 'right', 0),
  createKey('Del', 'Backspace', 'pinky', 'right', 0, 2),

  // Row 1
  createKey('Tab', 'Tab', 'pinky', 'left', 1, 1.5),
  createKey('q', 'KeyQ', 'pinky', 'left', 1),
  createKey('w', 'KeyW', 'ring', 'left', 1),
  createKey('e', 'KeyE', 'middle', 'left', 1),
  createKey('r', 'KeyR', 'index', 'left', 1),
  createKey('t', 'KeyT', 'index', 'left', 1),
  createKey('y', 'KeyY', 'index', 'right', 1),
  createKey('u', 'KeyU', 'index', 'right', 1),
  createKey('ı', 'KeyI', 'middle', 'right', 1),
  createKey('o', 'KeyO', 'ring', 'right', 1),
  createKey('p', 'KeyP', 'pinky', 'right', 1),
  createKey('ğ', 'BracketLeft', 'pinky', 'right', 1),
  createKey('ü', 'BracketRight', 'pinky', 'right', 1),

  // Row 2
  createKey('Caps', 'CapsLock', 'pinky', 'left', 2, 1.8),
  createKey('a', 'KeyA', 'pinky', 'left', 2),
  createKey('s', 'KeyS', 'ring', 'left', 2),
  createKey('d', 'KeyD', 'middle', 'left', 2),
  createKey('f', 'KeyF', 'index', 'left', 2),
  createKey('g', 'KeyG', 'index', 'left', 2),
  createKey('h', 'KeyH', 'index', 'right', 2),
  createKey('j', 'KeyJ', 'index', 'right', 2),
  createKey('k', 'KeyK', 'middle', 'right', 2),
  createKey('l', 'KeyL', 'ring', 'right', 2),
  createKey('ş', 'Semicolon', 'pinky', 'right', 2),
  createKey('i', 'Quote', 'pinky', 'right', 2),
  createKey(',', 'Backslash', 'pinky', 'right', 2),
  createKey('Enter', 'Enter', 'pinky', 'right', 2, 2.2),

  // Row 3
  createKey('Shift', 'ShiftLeft', 'pinky', 'left', 3, 2.4),
  createKey('<', 'IntlBackslash', 'pinky', 'left', 3),
  createKey('z', 'KeyZ', 'pinky', 'left', 3),
  createKey('x', 'KeyX', 'ring', 'left', 3),
  createKey('c', 'KeyC', 'middle', 'left', 3),
  createKey('v', 'KeyV', 'index', 'left', 3),
  createKey('b', 'KeyB', 'index', 'left', 3),
  createKey('n', 'KeyN', 'index', 'right', 3),
  createKey('m', 'KeyM', 'index', 'right', 3),
  createKey('ö', 'Comma', 'middle', 'right', 3),
  createKey('ç', 'Period', 'ring', 'right', 3),
  createKey('.', 'Slash', 'pinky', 'right', 3),
  createKey('Shift', 'ShiftRight', 'pinky', 'right', 3, 2.4),

  // Row 4
  createKey('Space', 'Space', 'thumb', 'right', 4, 15),
];

export const F_LAYOUT: KeyInfo[] = [
  // Row 0
  createKey('+', 'Backquote', 'pinky', 'left', 0),
  createKey('1', 'Digit1', 'pinky', 'left', 0),
  createKey('2', 'Digit2', 'ring', 'left', 0),
  createKey('3', 'Digit3', 'middle', 'left', 0),
  createKey('4', 'Digit4', 'index', 'left', 0),
  createKey('5', 'Digit5', 'index', 'left', 0),
  createKey('6', 'Digit6', 'index', 'right', 0),
  createKey('7', 'Digit7', 'index', 'right', 0),
  createKey('8', 'Digit8', 'middle', 'right', 0),
  createKey('9', 'Digit9', 'ring', 'right', 0),
  createKey('0', 'Digit0', 'pinky', 'right', 0),
  createKey('/', 'Minus', 'pinky', 'right', 0),
  createKey('-', 'Equal', 'pinky', 'right', 0),
  createKey('Del', 'Backspace', 'pinky', 'right', 0, 2),

  // Row 1
  createKey('Tab', 'Tab', 'pinky', 'left', 1, 1.5),
  createKey('f', 'KeyQ', 'pinky', 'left', 1),
  createKey('g', 'KeyW', 'ring', 'left', 1),
  createKey('ğ', 'KeyE', 'middle', 'left', 1),
  createKey('ı', 'KeyR', 'index', 'left', 1),
  createKey('o', 'KeyT', 'index', 'left', 1),
  createKey('d', 'KeyY', 'index', 'right', 1),
  createKey('r', 'KeyU', 'index', 'right', 1),
  createKey('n', 'KeyI', 'middle', 'right', 1),
  createKey('h', 'KeyO', 'ring', 'right', 1),
  createKey('p', 'KeyP', 'pinky', 'right', 1),
  createKey('q', 'BracketLeft', 'pinky', 'right', 1),
  createKey('w', 'BracketRight', 'pinky', 'right', 1),

  // Row 2
  createKey('Caps', 'CapsLock', 'pinky', 'left', 2, 1.8),
  createKey('u', 'KeyA', 'pinky', 'left', 2),
  createKey('i', 'KeyS', 'ring', 'left', 2),
  createKey('e', 'KeyD', 'middle', 'left', 2),
  createKey('a', 'KeyF', 'index', 'left', 2),
  createKey('ü', 'KeyG', 'index', 'left', 2),
  createKey('t', 'KeyH', 'index', 'right', 2),
  createKey('k', 'KeyJ', 'index', 'right', 2),
  createKey('m', 'KeyK', 'middle', 'right', 2),
  createKey('l', 'KeyL', 'ring', 'right', 2),
  createKey('y', 'Semicolon', 'pinky', 'right', 2),
  createKey('ş', 'Quote', 'pinky', 'right', 2),
  createKey('x', 'Backslash', 'pinky', 'right', 2),
  createKey('Enter', 'Enter', 'pinky', 'right', 2, 2.2),

    // Row 3
  createKey('Shift', 'ShiftLeft', 'pinky', 'left', 3, 2.4),
  createKey('j', 'IntlBackslash', 'pinky', 'left', 3),
  createKey('ö', 'KeyZ', 'pinky', 'left', 3),
  createKey('v', 'KeyX', 'ring', 'left', 3),
  createKey('c', 'KeyC', 'middle', 'left', 3),
  createKey('ç', 'KeyV', 'index', 'left', 3),
  createKey('z', 'KeyB', 'index', 'left', 3),
  createKey('s', 'KeyN', 'index', 'right', 3),
  createKey('b', 'KeyM', 'index', 'right', 3),
  createKey('.', 'Comma', 'middle', 'right', 3),
  createKey(',', 'Period', 'ring', 'right', 3),
  createKey('/', 'Slash', 'pinky', 'right', 3),
  createKey('Shift', 'ShiftRight', 'pinky', 'right', 3, 2.4),

    // Row 4
  createKey('Space', 'Space', 'thumb', 'right', 4, 15),
];

export const FINGER_COLORS = {
  pinky: 'bg-red-400 border-red-600',
  ring: 'bg-orange-400 border-orange-600',
  middle: 'bg-yellow-400 border-yellow-600',
  index: 'bg-green-400 border-green-600',
  thumb: 'bg-blue-400 border-blue-600'
};