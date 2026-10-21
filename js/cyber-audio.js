/**
 * CYBERPUNK 2077 PROCEDURAL WEB AUDIO SYNTHESIZER
 * Zero external audio files. 100% synthesized in real-time
 * with Web Audio API nodes (oscillators, biquad filters, gain ramps).
 */

class CyberAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    try { this.isMuted = localStorage.getItem("cyber_audio_muted") === "true"; } catch (e) {}
    this.masterGain = null;
    this.initialized = false;
    this.unlocked = false;
    this.ambient = null;
    this.armUnlock();
  }

  /* The AudioContext may only be created after a user gesture. Until then
     every sound call is a no-op  no console warnings, no wasted nodes. */
  armUnlock() {
    const unlock = () => {
      this.unlocked = true;
      this.init();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("touchstart", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true, passive: true });
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio initialization skipped:", e);
    }
  }

  ensureContext() {
    if (!this.unlocked) return;
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try { localStorage.setItem("cyber_audio_muted", String(this.isMuted)); } catch (e) {}
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Futuristic crisp button click
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(3.5, t);

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.06);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Subtle digital UI hover blip
  playHover() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.setValueAtTime(2600, t + 0.015);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.04);
  }

  // Cyber Tab Switch chirp
  playTab() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "triangle";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(800, t);
    osc1.frequency.exponentialRampToValueAtTime(1400, t + 0.08);

    osc2.frequency.setValueAtTime(1600, t);
    osc2.frequency.exponentialRampToValueAtTime(2800, t + 0.08);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.09);
    osc2.stop(t + 0.09);
  }

  // Cyber transmission / Jack-in success chime
  playSuccess() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.19);
    });
  }

  // Terminal keystroke tick
  playKeypress() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(600 + Math.random() * 200, t);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  /* --- Signal-fault burst: filtered noise with a swept resonance -------- */
  playGlitch(strength) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const amount = Math.max(0.2, Math.min(1, strength || 0.6));
    const duration = 0.12 + amount * 0.16;

    const frames = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, frames, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      const decay = 1 - i / frames;
      data[i] = (Math.random() * 2 - 1) * decay * decay;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.setValueAtTime(2.4, t);
    filter.frequency.setValueAtTime(3400 * amount, t);
    filter.frequency.exponentialRampToValueAtTime(240, t + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.16 * amount, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(t);
    source.stop(t + duration + 0.02);
  }

  /* --- Deeper navigation chirp for the rail ------------------------------- */
  playNav() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    sub.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(980, t + 0.07);
    sub.frequency.setValueAtTime(130, t);
    sub.frequency.exponentialRampToValueAtTime(240, t + 0.07);

    gain.gain.setValueAtTime(0.11, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    sub.start(t);
    osc.stop(t + 0.11);
    sub.stop(t + 0.11);
  }

  /* --- Refusal tone -------------------------------------------------------- */
  playDeny() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.setValueAtTime(150, t + 0.09);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, t);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /* --- Ambient bed: a slow evolving drone with distant relay noise -------- */
  setAmbient(on) {
    if (on && !this.ambient) {
      this.ensureContext();
      if (!this.ctx) return false;
      const t = this.ctx.currentTime;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(220, t);
      filter.Q.setValueAtTime(6, t);

      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      oscA.type = "sawtooth";
      oscA.frequency.setValueAtTime(48, t);
      oscB.type = "sine";
      oscB.frequency.setValueAtTime(72.5, t);

      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.06, t);
      lfoGain.gain.setValueAtTime(60, t);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      oscA.start(t);
      oscB.start(t);
      lfo.start(t);

      this.ambient = { gain, oscA, oscB, lfo };
      return true;
    }

    if (!on && this.ambient) {
      const t = this.ctx.currentTime;
      this.ambient.gain.gain.cancelScheduledValues(t);
      this.ambient.gain.gain.setValueAtTime(this.ambient.gain.gain.value, t);
      this.ambient.gain.gain.linearRampToValueAtTime(0, t + 1.2);
      const nodes = this.ambient;
      setTimeout(() => {
        try {
          nodes.oscA.stop();
          nodes.oscB.stop();
          nodes.lfo.stop();
        } catch (e) {
          /* already stopped */
        }
      }, 1400);
      this.ambient = null;
    }
    return Boolean(this.ambient);
  }
}

const cyberAudio = new CyberAudio();
