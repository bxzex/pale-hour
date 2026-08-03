/**
 * The day/night cycle — the clock every survival system keys off.
 *
 * Time is kept as a normalised fraction of a day in [0,1):
 *
 *   0.00  midnight        0.25  dawn
 *   0.50  midday          0.75  dusk
 *
 * Rather than lerping a handful of colours, the cycle drives a *keyframed
 * grade*: sun colour and intensity, ambient sky and ground bounce, fog colour
 * and density, and star opacity are all sampled from the same ordered table.
 * Adding a new time of day means adding one row, not touching five systems.
 */

import * as THREE from 'three';
import { clamp01, lerp } from '../core/rng.js';

/** Real seconds per in-game day. Roughly 16 min: long enough that a day is a
 *  journey, short enough that you see several in one sitting. */
export const DAY_LENGTH = 960;

/** Keyframes, in ascending `t`. Colours are hex; intensities are three.js units. */
const GRADE = [
  {
    t: 0.00, name: 'DEAD OF NIGHT',
    sun: 0x2c3c5e, sunI: 0.0,
    moonI: 1.35,
    skyTop: 0x0a0f1c, skyBottom: 0x05070c,
    ambSky: 0x22304a, ambGround: 0x080a09, ambI: 0.55,
    fog: 0x080b12, fogD: 0.022,
    stars: 1.0,
  },
  {
    t: 0.20, name: 'FALSE DAWN',
    sun: 0x5a4a6a, sunI: 0.12,
    moonI: 0.9,
    skyTop: 0x152036, skyBottom: 0x2a2436,
    ambSky: 0x33384f, ambGround: 0x100f0d, ambI: 0.9,
    fog: 0x141a26, fogD: 0.026,
    stars: 0.55,
  },
  {
    t: 0.27, name: 'DAWN',
    sun: 0xd9713a, sunI: 1.5,
    moonI: 0.2,
    skyTop: 0x3a5680, skyBottom: 0xc9764a,
    ambSky: 0x6b7d9c, ambGround: 0x2a2018, ambI: 1.5,
    fog: 0x6a5a52, fogD: 0.020,
    stars: 0.12,
  },
  {
    t: 0.36, name: 'MORNING',
    sun: 0xffd7a8, sunI: 2.6,
    moonI: 0,
    skyTop: 0x5f88c4, skyBottom: 0xa8c0d8,
    ambSky: 0x8fa8c8, ambGround: 0x4a4438, ambI: 1.9,
    fog: 0x9aa8b4, fogD: 0.011,
    stars: 0,
  },
  {
    t: 0.50, name: 'MIDDAY',
    sun: 0xfff4e0, sunI: 3.1,
    moonI: 0,
    skyTop: 0x5486c8, skyBottom: 0xb6cbdc,
    ambSky: 0x9db6d2, ambGround: 0x565040, ambI: 2.1,
    fog: 0xa8b6c2, fogD: 0.009,
    stars: 0,
  },
  {
    t: 0.68, name: 'AFTERNOON',
    sun: 0xffd9a0, sunI: 2.4,
    moonI: 0,
    skyTop: 0x5a82ba, skyBottom: 0xc0b49c,
    ambSky: 0x94a6bc, ambGround: 0x4e4636, ambI: 1.8,
    fog: 0xa39c92, fogD: 0.012,
    stars: 0,
  },
  {
    t: 0.76, name: 'DUSK',
    sun: 0xc4552a, sunI: 1.3,
    moonI: 0.25,
    skyTop: 0x3c4a72, skyBottom: 0xb85f34,
    ambSky: 0x64708e, ambGround: 0x2c2318, ambI: 1.3,
    fog: 0x6b5348, fogD: 0.019,
    stars: 0.15,
  },
  {
    t: 0.83, name: 'NIGHTFALL',
    sun: 0x3e3a58, sunI: 0.18,
    moonI: 0.85,
    skyTop: 0x131c30, skyBottom: 0x241f2e,
    ambSky: 0x2c3548, ambGround: 0x0c0d0c, ambI: 0.8,
    fog: 0x101622, fogD: 0.023,
    stars: 0.7,
  },
  {
    t: 1.00, name: 'DEAD OF NIGHT',
    sun: 0x2c3c5e, sunI: 0.0,
    moonI: 1.35,
    skyTop: 0x0a0f1c, skyBottom: 0x05070c,
    ambSky: 0x22304a, ambGround: 0x080a09, ambI: 0.55,
    fog: 0x080b12, fogD: 0.022,
    stars: 1.0,
  },
];

export class DayNight {
  /**
   * @param {THREE.Scene} scene
   * @param {number} startT normalised time of day to begin at
   */
  constructor(scene, startT = 0.30) {
    this.scene = scene;
    this.t = startT;
    this.day = 1;
    this.paused = false;

    // ── sun: the only shadow caster during the day
    this.sun = new THREE.DirectionalLight(0xfff4e0, 0);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const cam = this.sun.shadow.camera;
    cam.near = 1; cam.far = 320;
    cam.left = -70; cam.right = 70; cam.top = 70; cam.bottom = -70;
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.05;
    scene.add(this.sun, this.sun.target);

    // ── moon: a second directional so night still has shape
    this.moon = new THREE.DirectionalLight(0x8fa8cc, 0);
    scene.add(this.moon, this.moon.target);

    // ── ambient
    this.ambient = new THREE.HemisphereLight(0x9db6d2, 0x565040, 0);
    scene.add(this.ambient);

    this.fog = new THREE.FogExp2(0x0b1016, 0.02);
    scene.fog = this.fog;

    this._colA = new THREE.Color();
    this._colB = new THREE.Color();
    this.state = { ...GRADE[0] };

    this.apply();
  }

  /** Advance the clock. Returns true on the frame a new day begins. */
  update(dt) {
    if (this.paused) return false;
    const before = this.t;
    this.t += dt / DAY_LENGTH;
    let rolled = false;
    while (this.t >= 1) {
      this.t -= 1;
      this.day++;
      rolled = true;
    }
    this.apply();
    void before;
    return rolled;
  }

  /** Sample the grade table and push it into the lights, fog and sky. */
  apply() {
    const t = this.t;
    let i = 0;
    while (i < GRADE.length - 2 && GRADE[i + 1].t <= t) i++;
    const a = GRADE[i], b = GRADE[i + 1];
    const span = Math.max(1e-6, b.t - a.t);
    const k = clamp01((t - a.t) / span);

    const mixC = (ca, cb, out) => out.setHex(ca).lerp(this._colB.setHex(cb), k);

    // sun position: a real arc, highest at midday, below the horizon at night
    const ang = (t - 0.25) * Math.PI * 2;
    const elev = Math.sin(ang);
    const azim = Math.cos(ang);
    this.sun.position.set(azim * 140, elev * 150, 60);
    this.sun.target.position.set(0, 0, 0);
    this.moon.position.set(-azim * 140, -elev * 150, -60);
    this.moon.target.position.set(0, 0, 0);

    this.sun.intensity = lerp(a.sunI, b.sunI, k);
    this.sun.color.copy(mixC(a.sun, b.sun, this._colA));
    // Shadows are expensive and meaningless once the sun is down.
    this.sun.castShadow = this.sun.intensity > 0.15;

    this.moon.intensity = lerp(a.moonI, b.moonI, k);

    this.ambient.intensity = lerp(a.ambI, b.ambI, k);
    this.ambient.color.copy(mixC(a.ambSky, b.ambSky, this._colA));
    this.ambient.groundColor.copy(mixC(a.ambGround, b.ambGround, this._colA));

    this.fog.color.copy(mixC(a.fog, b.fog, this._colA));
    this.fog.density = lerp(a.fogD, b.fogD, k);
    this.scene.background = this.fog.color;

    this.state = {
      name: k < 0.5 ? a.name : b.name,
      stars: lerp(a.stars, b.stars, k),
      skyTop: mixC(a.skyTop, b.skyTop, this._colA).clone(),
      skyBottom: mixC(a.skyBottom, b.skyBottom, this._colA).clone(),
      sunElevation: elev,
    };
  }

  /* ── queries the rest of the game asks ──────────────────────── */

  /** 0 = pitch dark, 1 = full daylight. Drives temperature and threat. */
  get daylight() {
    return clamp01((this.sun.intensity - 0.1) / 2.4);
  }

  get isNight() {
    return this.t < 0.24 || this.t > 0.80;
  }

  get isDeepNight() {
    return this.t < 0.16 || this.t > 0.88;
  }

  /** Clock face for the HUD, e.g. "DAY 3 · 04:12". */
  get clockText() {
    const mins = Math.floor(this.t * 24 * 60);
    const h = String(Math.floor(mins / 60)).padStart(2, '0');
    const m = String(mins % 60).padStart(2, '0');
    return `${h}:${m}`;
  }

  /** Hours until the sun comes back — what you actually want to know at night. */
  get hoursToDawn() {
    const dawn = 0.25;
    let d = dawn - this.t;
    if (d < 0) d += 1;
    return d * 24;
  }

  dispose() {
    for (const l of [this.sun, this.moon, this.ambient]) l.removeFromParent();
    this.sun.target.removeFromParent();
    this.moon.target.removeFromParent();
  }
}
