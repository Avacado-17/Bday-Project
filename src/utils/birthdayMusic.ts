/**
 * Subtle Acoustic Piano Instrumental: "Happy Birthday to You"
 * Synthesizes a natural, warm acoustic upright piano with authentic harmonics,
 * traditional waltz tempo, and gentle chordal accompaniment.
 * 100% Web Audio API - offline, 0 latency, seamless loop.
 */

interface PianoNote {
  freq: number;
  time: number;
  duration: number;
  velocity?: number; // 0.0 to 1.0
}

// Standard 12-TET Concert Pitch Frequencies (Hz)
const C2 = 65.41;
const F2 = 87.31;
const G2 = 98.00;
const C3 = 130.81, E3 = 164.81, F3 = 174.61, G3 = 196.00, A3 = 220.00;
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

// Traditional Happy Birthday Score in C Major (Tempo: 100 BPM waltz, beat = 0.60s)
const PIANO_SCORE: PianoNote[] = [
  // --- Measure 0: Pick-up ("Hap-py") ---
  { freq: G4, time: 0.00, duration: 0.28, velocity: 0.42 },
  { freq: G4, time: 0.30, duration: 0.28, velocity: 0.45 },

  // --- Measure 1: "Birth-day to" (C Major) ---
  { freq: A4, time: 0.60, duration: 0.55, velocity: 0.50 },
  { freq: C3, time: 0.60, duration: 1.60, velocity: 0.30 }, // Left Hand Bass root
  { freq: G4, time: 1.20, duration: 0.55, velocity: 0.44 },
  { freq: E4, time: 1.20, duration: 0.45, velocity: 0.20 }, // Chord accompaniment
  { freq: G4, time: 1.20, duration: 0.45, velocity: 0.20 },
  { freq: C5, time: 1.80, duration: 0.55, velocity: 0.52 },
  { freq: E4, time: 1.80, duration: 0.45, velocity: 0.20 },
  { freq: G4, time: 1.80, duration: 0.45, velocity: 0.20 },

  // --- Measure 2: "you" (G Major) ---
  { freq: B4, time: 2.40, duration: 1.15, velocity: 0.48 },
  { freq: G2, time: 2.40, duration: 1.60, velocity: 0.32 }, // LH Bass
  { freq: D4, time: 3.00, duration: 0.45, velocity: 0.20 },
  { freq: F4, time: 3.00, duration: 0.45, velocity: 0.20 },
  // Pick-up for phrase 2 ("Hap-py")
  { freq: G4, time: 3.60, duration: 0.28, velocity: 0.42 },
  { freq: G4, time: 3.90, duration: 0.28, velocity: 0.45 },

  // --- Measure 3: "Birth-day to" (G7 / G Major) ---
  { freq: A4, time: 4.20, duration: 0.55, velocity: 0.50 },
  { freq: G2, time: 4.20, duration: 1.60, velocity: 0.32 }, // LH Bass
  { freq: G4, time: 4.80, duration: 0.55, velocity: 0.44 },
  { freq: F4, time: 4.80, duration: 0.45, velocity: 0.20 },
  { freq: B4, time: 4.80, duration: 0.45, velocity: 0.20 },
  { freq: D5, time: 5.40, duration: 0.55, velocity: 0.52 },
  { freq: F4, time: 5.40, duration: 0.45, velocity: 0.20 },
  { freq: B4, time: 5.40, duration: 0.45, velocity: 0.20 },

  // --- Measure 4: "you" (C Major) ---
  { freq: C5, time: 6.00, duration: 1.15, velocity: 0.50 },
  { freq: C3, time: 6.00, duration: 1.60, velocity: 0.30 }, // LH Bass
  { freq: E4, time: 6.60, duration: 0.45, velocity: 0.20 },
  { freq: G4, time: 6.60, duration: 0.45, velocity: 0.20 },
  // Pick-up for phrase 3 ("Hap-py")
  { freq: G4, time: 7.20, duration: 0.28, velocity: 0.42 },
  { freq: G4, time: 7.50, duration: 0.28, velocity: 0.45 },

  // --- Measure 5: "Birth-day dear" (C Major / C7) ---
  { freq: G5, time: 7.80, duration: 0.55, velocity: 0.54 },
  { freq: C3, time: 7.80, duration: 1.60, velocity: 0.32 }, // LH Bass
  { freq: E5, time: 8.40, duration: 0.55, velocity: 0.48 },
  { freq: G4, time: 8.40, duration: 0.45, velocity: 0.20 },
  { freq: C5, time: 8.40, duration: 0.45, velocity: 0.20 },
  { freq: C5, time: 9.00, duration: 0.55, velocity: 0.46 },
  { freq: G4, time: 9.00, duration: 0.45, velocity: 0.20 },
  { freq: E4, time: 9.00, duration: 0.45, velocity: 0.20 },

  // --- Measure 6: "celebrant" (F Major) ---
  { freq: B4, time: 9.60, duration: 0.55, velocity: 0.46 },
  { freq: F2, time: 9.60, duration: 1.60, velocity: 0.32 }, // LH Bass
  { freq: A4, time: 10.20, duration: 1.00, velocity: 0.52 },
  { freq: A3, time: 10.20, duration: 0.50, velocity: 0.20 },
  { freq: C4, time: 10.20, duration: 0.50, velocity: 0.20 },
  { freq: F4, time: 10.20, duration: 0.50, velocity: 0.20 },
  // Pick-up for phrase 4 ("Hap-py")
  { freq: F5, time: 10.80, duration: 0.28, velocity: 0.48 },
  { freq: F5, time: 11.10, duration: 0.28, velocity: 0.50 },

  // --- Measure 7: "Birth-day to" (C Major -> G7) ---
  { freq: E5, time: 11.40, duration: 0.55, velocity: 0.50 },
  { freq: C3, time: 11.40, duration: 1.00, velocity: 0.30 }, // LH Bass
  { freq: E4, time: 11.40, duration: 0.50, velocity: 0.20 },
  { freq: G4, time: 11.40, duration: 0.50, velocity: 0.20 },
  { freq: C5, time: 12.00, duration: 0.55, velocity: 0.48 },
  { freq: D5, time: 12.60, duration: 0.55, velocity: 0.50 },
  { freq: G2, time: 12.60, duration: 1.00, velocity: 0.30 }, // LH Bass
  { freq: F4, time: 12.60, duration: 0.50, velocity: 0.20 },
  { freq: B4, time: 12.60, duration: 0.50, velocity: 0.20 },

  // --- Measure 8: "you!" (C Major Full Harmonic Resolution) ---
  { freq: C5, time: 13.20, duration: 2.20, velocity: 0.54 },
  { freq: C2, time: 13.20, duration: 2.50, velocity: 0.36 }, // Deep warm bass
  { freq: C3, time: 13.20, duration: 2.50, velocity: 0.32 },
  { freq: G3, time: 13.20, duration: 2.20, velocity: 0.26 },
  { freq: E4, time: 13.20, duration: 2.20, velocity: 0.24 },
  { freq: G4, time: 13.20, duration: 2.20, velocity: 0.24 },
];

const LOOP_TOTAL_TIME = 16.5; // Natural pause before looping again

export class BirthdayMusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundboardFilter: BiquadFilterNode | null = null;
  private loopTimer: number | null = null;
  private isMuted = true;
  private isPlaying = false;

  private initAudio() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0001 : 0.09, this.ctx.currentTime);

      // Acoustic wooden piano soundboard filter: smooths harsh highs and enriches warmth
      this.soundboardFilter = this.ctx.createBiquadFilter();
      this.soundboardFilter.type = 'lowpass';
      this.soundboardFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
      this.soundboardFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      this.soundboardFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Synthesize a warm acoustic piano key strike
   * Uses triangle fundamental + natural integer harmonic overtones with hammer strike envelope
   */
  private playPianoNote(freq: number, startTime: number, duration: number, velocity = 0.5) {
    if (!this.ctx || !this.soundboardFilter) return;

    const ctx = this.ctx;

    // Harmonic partials matching real steel piano strings
    const partials = [
      { mult: 1, gainMult: 0.65, decayMult: 1.4, wave: 'triangle' as OscillatorType },
      { mult: 2, gainMult: 0.24, decayMult: 1.0, wave: 'sine' as OscillatorType },
      { mult: 3, gainMult: 0.10, decayMult: 0.7, wave: 'sine' as OscillatorType },
    ];

    partials.forEach((partial) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = partial.wave;
      osc.frequency.setValueAtTime(freq * partial.mult, startTime);

      const noteGain = velocity * partial.gainMult;
      const decayTime = duration * partial.decayMult;

      gain.gain.setValueAtTime(0.0001, startTime);
      // Fast acoustic hammer impact (4ms attack)
      gain.gain.linearRampToValueAtTime(noteGain, startTime + 0.004);
      // Natural logarithmic acoustic string decay
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decayTime);

      osc.connect(gain);
      gain.connect(this.soundboardFilter!);

      osc.start(startTime);
      osc.stop(startTime + decayTime + 0.05);
    });
  }

  private scheduleMelodyCycle() {
    if (!this.ctx || !this.isPlaying) return;

    const startAudioTime = this.ctx.currentTime + 0.05;

    PIANO_SCORE.forEach((note) => {
      this.playPianoNote(
        note.freq,
        startAudioTime + note.time,
        note.duration,
        note.velocity ?? 0.4
      );
    });

    // Schedule next seamless loop cycle
    this.loopTimer = window.setTimeout(() => {
      this.scheduleMelodyCycle();
    }, LOOP_TOTAL_TIME * 1000);
  }

  public setMuted(mute: boolean) {
    this.isMuted = mute;
    this.initAudio();

    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended' && !mute) {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    const targetVolume = mute ? 0.0001 : 0.09;
    this.masterGain.gain.linearRampToValueAtTime(targetVolume, now + 0.4);

    if (!mute && !this.isPlaying) {
      this.isPlaying = true;
      this.scheduleMelodyCycle();
    }
  }

  public toggle(): boolean {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    return nextMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public cleanup() {
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.isPlaying = false;
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
  }
}

export const birthdayMusic = new BirthdayMusicEngine();
