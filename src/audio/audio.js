/**
 * Procedural sound. There is not a single audio file in this project — the
 * wind, the drone, the heartbeat, the footsteps, the static and the scream are
 * all synthesised with Web Audio at runtime.
 *
 * The continuous layers (wind / drone / static / heartbeat) are built once and
 * then driven by gain automation, because tearing down and rebuilding graphs
 * every frame is what makes browser audio crackle.
 */

import { clamp01 } from '../core/rng.js';

export class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.ready = false;
    this._heartAt = 0;
    this._whisperAt = 0;
  }

  /** Must be called from a user gesture. */
  async init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    if (this.ctx.state === 'suspended') await this.ctx.resume();

    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.settings.volume;

    // A gentle limiter so a scream over a drone never clips to mush.
    this.limiter = ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -10;
    this.limiter.knee.value = 12;
    this.limiter.ratio.value = 8;
    this.limiter.attack.value = 0.004;
    this.limiter.release.value = 0.22;

    this.master.connect(this.limiter).connect(ctx.destination);

    this.noiseBuf = this._makeNoise(4.0);
    this._buildWind();
    this._buildDrone();
    this._buildStatic();
    this.ready = true;
  }

  setVolume(v) {
    this.settings.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  /* ── shared building blocks ─────────────────────────────────── */

  _makeNoise(seconds) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      // pink-ish noise via a cheap one-pole cascade — less harsh than white
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.0990460;
        b1 = 0.96300 * b1 + w * 0.2965164;
        b2 = 0.57000 * b2 + w * 1.0526913;
        data[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22;
      }
    }
    return buf;
  }

  _noiseSource(loop = true) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = loop;
    return src;
  }

  /* ── continuous layers ──────────────────────────────────────── */

  _buildWind() {
    const ctx = this.ctx;
    const src = this._noiseSource();
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 420;
    band.Q.value = 0.7;

    const shelf = ctx.createBiquadFilter();
    shelf.type = 'lowpass';
    shelf.frequency.value = 1400;

    this.windGain = ctx.createGain();
    this.windGain.gain.value = 0;

    // two slow LFOs make the gusts feel unscripted
    for (const [rate, depth] of [[0.055, 260], [0.021, 140]]) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = rate;
      const amp = ctx.createGain();
      amp.gain.value = depth;
      lfo.connect(amp).connect(band.frequency);
      lfo.start();
    }
    const gustLfo = ctx.createOscillator();
    gustLfo.frequency.value = 0.037;
    const gustAmp = ctx.createGain();
    gustAmp.gain.value = 0.14;
    gustLfo.connect(gustAmp).connect(this.windGain.gain);
    gustLfo.start();

    src.connect(band).connect(shelf).connect(this.windGain).connect(this.master);
    src.start();
  }

  _buildDrone() {
    const ctx = this.ctx;
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 240;
    lp.Q.value = 3;
    this.droneFilter = lp;

    // A minor-second cluster an octave apart: the interval that will not settle.
    const freqs = [38.5, 39.8, 57.5, 77.1];
    this.droneOscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? 'sawtooth' : 'triangle';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.24;
      // slow detune drift
      const drift = ctx.createOscillator();
      drift.frequency.value = 0.03 + i * 0.017;
      const dAmp = ctx.createGain();
      dAmp.gain.value = 1.4 + i;
      drift.connect(dAmp).connect(osc.detune);
      drift.start();
      osc.connect(g).connect(lp);
      osc.start();
      return osc;
    });

    lp.connect(this.droneGain).connect(this.master);
  }

  _buildStatic() {
    const ctx = this.ctx;
    const src = this._noiseSource();
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    const peak = ctx.createBiquadFilter();
    peak.type = 'peaking';
    peak.frequency.value = 5200;
    peak.gain.value = 8;
    peak.Q.value = 0.8;

    this.staticGain = ctx.createGain();
    this.staticGain.gain.value = 0;
    src.connect(hp).connect(peak).connect(this.staticGain).connect(this.master);
    src.start();
  }

  /* ── per-frame mix ──────────────────────────────────────────── */

  /**
   * @param {number} dt
   * @param {object} s
   * @param {number} s.staticLevel 0..1 entity static
   * @param {number} s.proximity   0..1 dread
   * @param {boolean} s.observed
   * @param {number} s.speed       player speed
   * @param {boolean} s.playing
   */
  update(dt, s) {
    if (!this.ready) return;
    const now = this.ctx.currentTime;
    const set = (param, value, time = 0.12) => {
      param.setTargetAtTime(value, now, time);
    };

    if (!s.playing) {
      set(this.windGain.gain, 0.05, 0.6);
      set(this.droneGain.gain, 0.05, 0.6);
      set(this.staticGain.gain, 0, 0.3);
      return;
    }

    set(this.windGain.gain, 0.26 + s.proximity * 0.1, 0.5);
    set(this.droneGain.gain, 0.06 + s.proximity * 0.42, 0.35);
    set(this.droneFilter.frequency, 190 + s.proximity * 900, 0.4);
    set(this.staticGain.gain, Math.pow(s.staticLevel, 1.4) * 0.34, 0.08);

    // heartbeat: only once dread has actually started
    if (s.proximity > 0.12) {
      const bpm = 52 + s.proximity * 108;
      const interval = 60 / bpm;
      if (now - this._heartAt > interval) {
        this._heartAt = now;
        this._heartbeat(0.16 + s.proximity * 0.5);
      }
    }

    // whispers when it is watching you and you have not looked away
    if (s.observed && s.proximity > 0.3 && now - this._whisperAt > 3.2 + Math.random() * 4) {
      this._whisperAt = now;
      this.whisper(s.proximity);
    }
  }

  /* ── one-shots ──────────────────────────────────────────────── */

  _heartbeat(level) {
    const ctx = this.ctx, t = ctx.currentTime;
    const thump = (at, gain, from, to) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(from, at);
      osc.frequency.exponentialRampToValueAtTime(to, at + 0.14);
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(gain, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
      osc.connect(g).connect(this.master);
      osc.start(at);
      osc.stop(at + 0.3);
    };
    thump(t, level, 74, 34);
    thump(t + 0.17, level * 0.62, 62, 30);
  }

  footstep(intensity, running) {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = this._noiseSource(false);
    src.playbackRate.value = 0.8 + Math.random() * 0.5;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 260 + Math.random() * 340;
    bp.Q.value = 0.9;

    const g = ctx.createGain();
    const dur = running ? 0.16 : 0.2;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.09 * intensity, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    // a soft thud under the leaf-crunch
    const body = ctx.createOscillator();
    body.type = 'sine';
    body.frequency.setValueAtTime(96, t);
    body.frequency.exponentialRampToValueAtTime(48, t + 0.1);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.055 * intensity, t);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    src.connect(bp).connect(g).connect(this.master);
    body.connect(bg).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
    body.start(t);
    body.stop(t + 0.16);
  }

  /** Paper being torn off a nail. */
  pickup() {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = this._noiseSource(false);
    src.playbackRate.value = 1.7;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.3;
    bp.frequency.setValueAtTime(1400, t);
    bp.frequency.exponentialRampToValueAtTime(4200, t + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + 0.4);
  }

  /** Dissonant stab: fired when the count goes up and it wakes further. */
  escalate(count) {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const base = 110 * Math.pow(1.045, count); // creeps sharp with every page
    [1, 1.06, 1.5, 2.02].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      osc.type = i > 1 ? 'sawtooth' : 'square';
      osc.frequency.value = base * mult;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.09 / (i + 1), t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6 + i * 0.2);
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3400, t);
      lp.frequency.exponentialRampToValueAtTime(320, t + 1.8);
      osc.connect(lp).connect(g).connect(this.master);
      osc.start(t);
      osc.stop(t + 2.2);
    });
    this.staticBurst(0.5);
  }

  /** Hard tape-head noise, tied to the entity repositioning. */
  staticBurst(level = 1) {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = this._noiseSource(false);
    src.playbackRate.value = 1.4;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.26 * level, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    src.connect(hp).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + 0.4);
  }

  /** The charge. Descending metallic shriek plus a sub drop. */
  scream() {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;

    const shape = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 4.2);
    }
    shape.curve = curve;
    const out = ctx.createGain();
    out.gain.value = 0.5;
    shape.connect(out).connect(this.master);

    [1, 1.48, 2.51, 3.77].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880 * mult, t);
      osc.frequency.exponentialRampToValueAtTime(120 * mult, t + 1.1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12 / (i + 1), t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
      osc.connect(g).connect(shape);
      osc.start(t);
      osc.stop(t + 1.4);
    });

    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(120, t);
    sub.frequency.exponentialRampToValueAtTime(28, t + 1.5);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0, t);
    sg.gain.linearRampToValueAtTime(0.42, t + 0.03);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    sub.connect(sg).connect(this.master);
    sub.start(t);
    sub.stop(t + 1.9);

    this.staticBurst(1);
  }

  /** Formant-ish breath: not a word, just the shape of one. */
  whisper(level = 0.5) {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = this._noiseSource(false);
    src.playbackRate.value = 0.6;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.06 + level * 0.09, t + 0.25);
    out.gain.linearRampToValueAtTime(0, t + 1.5);
    // three moving formants read as a mouth even with no pitch at all
    [520, 1180, 2600].forEach((f, i) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 7 + i * 3;
      bp.frequency.setValueAtTime(f, t);
      bp.frequency.linearRampToValueAtTime(f * (0.7 + Math.random() * 0.6), t + 1.4);
      const g = ctx.createGain();
      g.gain.value = 1 / (i + 1);
      src.connect(bp).connect(g).connect(out);
    });
    out.connect(this.master);
    src.start(t);
    src.stop(t + 1.6);
  }

  /** Death: everything collapses into a swallowed low end. */
  death() {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    this.staticGain.gain.cancelScheduledValues(t);
    this.staticGain.gain.setValueAtTime(0.5, t);
    this.staticGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    this.droneGain.gain.cancelScheduledValues(t);
    this.droneGain.gain.setValueAtTime(0.7, t);
    this.droneGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, t);
    osc.frequency.exponentialRampToValueAtTime(19, t + 2.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.6, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + 3.1);
  }

  /** Escape: a single clean tone, the only consonance in the game. */
  victory() {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    [220, 330, 440].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + i * 0.5);
      g.gain.linearRampToValueAtTime(0.16, t + i * 0.5 + 0.4);
      g.gain.linearRampToValueAtTime(0, t + i * 0.5 + 4);
      osc.connect(g).connect(this.master);
      osc.start(t + i * 0.5);
      osc.stop(t + i * 0.5 + 4.2);
    });
  }

  /** UI blip for menus. */
  ui(kind = 'move') {
    if (!this.ready) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = kind === 'select' ? 180 : 1200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(kind === 'select' ? 0.1 : 0.035, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'select' ? 0.18 : 0.05));
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
}

export const mix = (a, b, t) => a + (b - a) * clamp01(t);
