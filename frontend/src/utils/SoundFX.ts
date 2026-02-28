class SoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Initialize AudioContext on first interaction if possible, or lazy load
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  private initContext() {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a simple tone
  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 0.1) {
    if (!this.ctx || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    gain.gain.setValueAtTime(volume, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  public play(sound: 'start' | 'hit' | 'win' | 'bloop' | 'fight' | 'ko' | 'round') {
    this.initContext();
    if (!this.ctx) return;

    switch (sound) {
      case 'start':
        this.playTone(220, 'sine', 0.5, 0);
        this.playTone(440, 'sine', 0.5, 0.1);
        this.playTone(880, 'square', 0.8, 0.2);
        break;
      
      case 'hit':
        this.playTone(150, 'sawtooth', 0.15, 0, 0.25);
        this.playTone(80, 'square', 0.25, 0.03, 0.2);
        this.playTone(200, 'sawtooth', 0.1, 0.08, 0.15);
        break;

      case 'bloop':
        this.playTone(800, 'sine', 0.1, 0, 0.05);
        break;

      case 'fight': {
        this.playTone(80, 'sawtooth', 0.5, 0, 0.3);
        this.playTone(120, 'square', 0.4, 0.05, 0.25);
        this.playTone(200, 'sawtooth', 0.3, 0.1, 0.2);
        this.playTone(300, 'square', 0.2, 0.15, 0.15);
        break;
      }

      case 'ko': {
        this.playTone(60, 'sawtooth', 0.8, 0, 0.3);
        this.playTone(45, 'square', 1.0, 0.1, 0.25);
        this.playTone(30, 'sine', 1.2, 0.2, 0.2);
        this.playTone(80, 'sawtooth', 0.3, 0.05, 0.15);
        break;
      }

      case 'round': {
        this.playTone(440, 'square', 0.12, 0, 0.12);
        this.playTone(550, 'square', 0.12, 0.12, 0.12);
        this.playTone(660, 'square', 0.18, 0.24, 0.14);
        break;
      }

      case 'win': {
        const vol = 0.15;
        this.playTone(523.25, 'square', 0.2, 0, vol);
        this.playTone(659.25, 'square', 0.2, 0.1, vol);
        this.playTone(783.99, 'square', 0.2, 0.2, vol);
        this.playTone(1046.50, 'square', 0.6, 0.3, vol);
        break;
      }
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

export const soundFX = new SoundFX();
