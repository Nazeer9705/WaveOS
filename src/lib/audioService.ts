import { Song } from '../types';
import { getLocalAudio } from './indexedDb';

export class AudioService {
  private static instance: AudioService | null = null;
  private audio: HTMLAudioElement;
  private audioCtx: AudioContext | null = null;
  private synthNodes: AudioNode[] = [];
  private synthInterval: any = null;
  private currentSong: Song | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private speed: number = 1.0;
  private mode: 'html5' | 'synth' = 'html5';
  private synthStartTime: number = 0;
  private synthDuration: number = 0;
  private synthCurrentTime: number = 0;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private onPlayStatusChange: ((playing: boolean) => void) | null = null;
  private activeBlobUrl: string | null = null;

  private constructor() {
    this.audio = new Audio();
    this.audio.volume = this.volume;
    this.audio.preload = 'none';

    // HTML5 Audio Event Listeners
    this.audio.addEventListener('timeupdate', () => {
      if (this.mode !== 'html5' || !this.audio.duration || isNaN(this.audio.duration)) return;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.audio.currentTime, this.audio.duration);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.mode !== 'html5') return;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.audio.currentTime, this.audio.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    });

    this.audio.addEventListener('error', () => {
      if (this.currentSong && this.audio.src && this.audio.src !== window.location.href) {
        console.warn("HTML5 audio failed to play. Falling back to client-side synthesizer.");
        this.startSynthMode(this.currentSong);
      }
    });
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public registerCallbacks(
    onTimeUpdate: (time: number, duration: number) => void,
    onEnded: () => void,
    onPlayStatus: (playing: boolean) => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndedCallback = onEnded;
    this.onPlayStatusChange = onPlayStatus;
  }

  public async play(song: Song) {
    this.currentSong = song;
    this.stopAll();

    // Reset callbacks
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0, song.dur);
    }

    let url = song.urls && song.urls[0];
    
    if (url && url.startsWith('local://')) {
      const songId = parseInt(url.replace('local://', ''), 10);
      try {
        const blob = await getLocalAudio(songId);
        if (blob) {
          this.activeBlobUrl = URL.createObjectURL(blob);
          url = this.activeBlobUrl;
        } else {
          url = '';
        }
      } catch (e) {
        console.error("Failed to load local audio from IndexedDB", e);
        url = '';
      }
    }

    if (url) {
      this.audio.src = url;
      this.audio.load();
      this.audio.playbackRate = this.speed;
      this.audio.volume = this.volume;
      this.audio.play()
        .then(() => {
          this.mode = 'html5';
          this.isPlaying = true;
          if (this.onPlayStatusChange) this.onPlayStatusChange(true);
        })
        .catch(err => {
          if (err.name === 'NotAllowedError') {
            this.isPlaying = false;
            if (this.onPlayStatusChange) this.onPlayStatusChange(false);
          } else {
            this.startSynthMode(song);
          }
        });
    } else {
      this.startSynthMode(song);
    }
  }

  private startSynthMode(song: Song) {
    this.mode = 'synth';
    this.isPlaying = true;
    if (this.onPlayStatusChange) this.onPlayStatusChange(true);
    this.startSynth(song);
  }

  private startSynth(song: Song) {
    this.stopSynth();
    
    // Create AudioContext lazily on user gesture
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const ctx = this.audioCtx;
    this.synthStartTime = ctx.currentTime;
    this.synthDuration = song.dur || 180;

    // Define pitch sets and tempos based on genre
    const styles: Record<string, { base: number[]; tempo: number; wave: OscillatorType }> = {
      Electronic: { base: [220, 277, 330, 440], tempo: 140, wave: 'sawtooth' },
      Techno:     { base: [110, 165, 220, 330], tempo: 160, wave: 'square' },
      Ambient:    { base: [174, 220, 261, 329], tempo: 60,  wave: 'sine' },
      Chillout:   { base: [196, 246, 261, 330], tempo: 80,  wave: 'sine' },
      Jazz:       { base: [246, 293, 369, 440], tempo: 100, wave: 'triangle' },
      Indie:      { base: [262, 330, 392, 494], tempo: 120, wave: 'triangle' },
      Folk:       { base: [261, 294, 349, 392], tempo: 90,  wave: 'triangle' },
      'Dream Pop':{ base: [174, 220, 277, 370], tempo: 70,  wave: 'sine' },
      Synthpop:   { base: [220, 293, 370, 440], tempo: 128, wave: 'sawtooth' },
      Alternative:{ base: [196, 247, 294, 392], tempo: 110, wave: 'square' },
      'R&B':      { base: [220, 277, 330, 415], tempo: 95,  wave: 'sine' },
      Rock:       { base: [165, 220, 294, 392], tempo: 130, wave: 'sawtooth' },
    };

    const style = styles[song.genre] || styles.Electronic;
    const beatLen = 60 / style.tempo;

    // Create master gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(this.volume * 0.25, ctx.currentTime + 0.5);
    masterGain.connect(ctx.destination);
    this.synthNodes.push(masterGain);

    // Reverb node
    const reverb = ctx.createConvolver();
    const irLen = ctx.sampleRate * 1.5;
    const irBuf = ctx.createBuffer(2, irLen, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = irBuf.getChannelData(c);
      for (let i = 0; i < irLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3);
      }
    }
    reverb.buffer = irBuf;
    const rvGain = ctx.createGain();
    rvGain.gain.value = 0.2;
    reverb.connect(rvGain);
    rvGain.connect(masterGain);

    const now = ctx.currentTime;
    const noteLen = 120; // Pre-schedule 120 beats (approx 1-2 mins of dynamic track)

    // 1. Bass Line (lower octaves)
    const bassFreqs = style.base;
    for (let i = 0; i < noteLen; i++) {
      const freq = bassFreqs[i % bassFreqs.length];
      const t = now + i * beatLen;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      
      osc.type = style.wave;
      osc.frequency.value = freq / 2;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + beatLen * 0.85);
      
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t);
      osc.stop(t + beatLen);
      this.synthNodes.push(osc, g);
    }

    // 2. Lead Arpeggio Melody
    const melodyFreqs = style.base.map(f => f * 1.5);
    for (let i = 0; i < noteLen; i++) {
      if (Math.random() < 0.4) continue; // add some rhythmic interest
      const freq = melodyFreqs[Math.floor(Math.random() * melodyFreqs.length)];
      const t = now + i * beatLen * 0.5;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + beatLen * 1.1);
      
      osc.connect(g);
      g.connect(masterGain);
      g.connect(rvGain);
      osc.start(t);
      osc.stop(t + beatLen * 1.5);
      this.synthNodes.push(osc, g);
    }

    // 3. Synth Chord Pads (slowly breathing chords)
    const chord = [style.base[0], style.base[1], style.base[2]];
    for (let i = 0; i < Math.floor(noteLen / 4); i++) {
      chord.forEach(freq => {
        const t = now + i * beatLen * 4;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.03, t + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, t + beatLen * 3.8);
        
        osc.connect(g);
        g.connect(rvGain);
        osc.start(t);
        osc.stop(t + beatLen * 4);
        this.synthNodes.push(osc, g);
      });
    }

    // 4. Drums / Kick (high-intensity rhythms for upbeat genres)
    if (style.tempo >= 100) {
      for (let i = 0; i < noteLen; i++) {
        const t = now + i * beatLen;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(0.001, t + 0.1);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.12);
        this.synthNodes.push(osc, g);
      }
    }

    // Interval to track synth progress
    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;
      this.synthCurrentTime = this.audioCtx.currentTime - this.synthStartTime;
      if (this.synthCurrentTime >= this.synthDuration) {
        this.stopSynth();
        if (this.onEndedCallback) {
          this.onEndedCallback();
        }
        return;
      }
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.synthCurrentTime, this.synthDuration);
      }
    }, 200);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.synthNodes.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {}
    });
    this.synthNodes = [];
    this.synthCurrentTime = 0;
  }

  public togglePlay() {
    if (!this.currentSong) return;
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.mode === 'html5') {
      this.audio.pause();
    } else {
      if (this.audioCtx) {
        this.audioCtx.suspend();
      }
      if (this.synthInterval) {
        clearInterval(this.synthInterval);
        this.synthInterval = null;
      }
    }
    if (this.onPlayStatusChange) this.onPlayStatusChange(false);
  }

  public resume() {
    if (!this.currentSong) return;
    this.isPlaying = true;
    if (this.onPlayStatusChange) this.onPlayStatusChange(true);

    if (this.mode === 'html5') {
      this.audio.play().catch(() => {
        this.startSynthMode(this.currentSong!);
      });
    } else {
      if (this.audioCtx) {
        this.audioCtx.resume();
        // Re-trigger interval
        if (!this.synthInterval) {
          const startTime = this.audioCtx.currentTime - this.synthCurrentTime;
          this.synthStartTime = startTime;
          this.synthInterval = setInterval(() => {
            if (!this.isPlaying || !this.audioCtx) return;
            this.synthCurrentTime = this.audioCtx.currentTime - this.synthStartTime;
            if (this.synthCurrentTime >= this.synthDuration) {
              this.stopSynth();
              if (this.onEndedCallback) this.onEndedCallback();
              return;
            }
            if (this.onTimeUpdateCallback) {
              this.onTimeUpdateCallback(this.synthCurrentTime, this.synthDuration);
            }
          }, 200);
        }
      }
    }
  }

  public stopAll() {
    this.audio.pause();
    try {
      this.audio.currentTime = 0;
    } catch (e) {}
    this.stopSynth();
    this.isPlaying = false;
    if (this.onPlayStatusChange) this.onPlayStatusChange(false);
    
    if (this.activeBlobUrl) {
      try {
        URL.revokeObjectURL(this.activeBlobUrl);
      } catch (e) {}
      this.activeBlobUrl = null;
    }
  }

  public seek(percent: number) {
    if (this.mode === 'html5') {
      if (this.audio.duration) {
        this.audio.currentTime = percent * this.audio.duration;
      }
    } else {
      // Synthesizer cannot seek backwards or forwards cleanly because notes are pre-scheduled.
      // So we restart the synthesizer at the matching time offset.
      if (this.currentSong) {
        this.synthCurrentTime = percent * this.synthDuration;
        // Visual seek
        if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.synthCurrentTime, this.synthDuration);
        }
        // Restart notes relative to offset
        this.startSynth(this.currentSong);
        // Adjust start time to simulate offset
        if (this.audioCtx) {
          this.synthStartTime = this.audioCtx.currentTime - this.synthCurrentTime;
        }
      }
    }
  }

  public setVolume(val: number) {
    this.volume = val;
    this.audio.volume = val;
    if (this.audioCtx && this.mode === 'synth') {
      this.synthNodes.forEach(node => {
        if (node instanceof GainNode) {
          try {
            node.gain.setValueAtTime(val * 0.25, this.audioCtx!.currentTime);
          } catch (e) {}
        }
      });
    }
  }

  public setSpeed(rate: number) {
    this.speed = rate;
    this.audio.playbackRate = rate;
  }

  public getPlaybackMode() {
    return this.mode;
  }
}
export const audioService = AudioService.getInstance();
