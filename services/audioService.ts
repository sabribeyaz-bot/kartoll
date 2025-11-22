
// Web Audio API kullanarak sentetik daktilo sesleri üretir.
// Harici dosya gerektirmez, tamamen kod ile ses üretilir.

class AudioService {
  private context: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Tarayıcı desteği kontrolü
    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    if (AudioContextClass) {
      this.context = new AudioContextClass();
    }
  }

  public toggle(enabled: boolean) {
    this.isEnabled = enabled;
    // Kullanıcı etkileşimi sonrası context'i başlatmak gerekir (Tarayıcı politikaları)
    if (enabled && this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public getEnabled() {
    return this.isEnabled;
  }

  // Standart Tuş Sesi (Mekanik "Tak")
  public playKeySound(isSpace: boolean = false) {
    if (!this.isEnabled || !this.context) return;
    this.resumeContext();

    const t = this.context.currentTime;
    
    // 1. Gürültü Katmanı (Tuş vuruş etkisi)
    const bufferSize = this.context.sampleRate * 0.1; // 0.1 saniye
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = this.context.createGain();
    noiseGain.gain.setValueAtTime(isSpace ? 0.5 : 0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.context.destination);
    noise.start(t);

    // 2. Gövde Sesi (Mekanik tını)
    const osc = this.context.createOscillator();
    osc.type = 'triangle';
    // Her vuruşta hafif ton farkı (doğallık için)
    osc.frequency.setValueAtTime((isSpace ? 150 : 300) + Math.random() * 50, t); 

    const oscGain = this.context.createGain();
    oscGain.gain.setValueAtTime(isSpace ? 0.4 : 0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.context.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Hata Sesi (Tok ve boğuk "Güm")
  public playErrorSound() {
    if (!this.isEnabled || !this.context) return;
    this.resumeContext();

    const t = this.context.currentTime;

    const osc = this.context.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.15);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.context.destination);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Başarı/Bitiş Sesi (Daktilo Zili "Çın")
  public playSuccessSound() {
    if (!this.isEnabled || !this.context) return;
    this.resumeContext();

    const t = this.context.currentTime;

    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // Uzun çınlama

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start(t);
    osc.stop(t + 2);
  }

  private resumeContext() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }
}

export const audioService = new AudioService();
