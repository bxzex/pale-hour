/**
 * Night sky: stars, a moon with real craters, and the haze around it.
 *
 * The whole dome is parented to a group that follows the camera's position, so
 * it never gets closer no matter how far you walk — the cheap trick that makes
 * a 260-metre map feel like it is under an actual sky.
 */

import * as THREE from 'three';
import { makeRng } from '../core/rng.js';

const DOME = 340;

export class Sky {
  constructor(seed, scene) {
    this.group = new THREE.Group();
    this.group.name = 'sky';
    scene.add(this.group);

    const rng = makeRng(seed ^ 0x5eed);
    this._buildStars(rng);
    this._buildMoon();
    this._time = 0;
  }

  /* ── stars ──────────────────────────────────────────────────── */

  _buildStars(rng) {
    const COUNT = 2600;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Upper hemisphere only, biased away from the horizon where fog eats them.
      const theta = rng() * Math.PI * 2;
      const y = Math.pow(rng(), 0.62);
      const r = Math.sqrt(1 - y * y);
      pos[i * 3] = Math.cos(theta) * r * DOME;
      pos[i * 3 + 1] = y * DOME;
      pos[i * 3 + 2] = Math.sin(theta) * r * DOME;

      // Most stars are cold white; a few run warm. Brightness is heavily
      // weighted toward dim so the bright ones actually read as bright.
      const warm = rng() < 0.16;
      const b = 0.25 + Math.pow(rng(), 2.4) * 0.75;
      col[i * 3] = b * (warm ? 1 : 0.86);
      col[i * 3 + 1] = b * (warm ? 0.86 : 0.9);
      col[i * 3 + 2] = b * (warm ? 0.72 : 1);

      size[i] = (0.7 + Math.pow(rng(), 3) * 3.4) * DOME * 0.004;
      phase[i] = rng() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vColor = color;
          // Two incommensurate frequencies: the twinkle never finds a pattern.
          vTwinkle = 0.72 + 0.28 * sin(uTime * 1.7 + aPhase)
                          * sin(uTime * 0.63 + aPhase * 1.7);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * (300.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vTwinkle;
        uniform float uOpacity;
        void main() {
          // round, soft-edged point with a tight core
          vec2 d = gl_PointCoord - 0.5;
          float r = length(d) * 2.0;
          float a = smoothstep(1.0, 0.0, r);
          a *= a;
          a += smoothstep(0.35, 0.0, r) * 0.6;
          gl_FragColor = vec4(vColor * vTwinkle, a * vTwinkle * uOpacity);
        }
      `,
    });
    mat.vertexColors = true;

    this.stars = new THREE.Points(geo, mat);
    this.stars.frustumCulled = false;
    this.starMat = mat;
    this.group.add(this.stars);
  }

  /* ── moon ───────────────────────────────────────────────────── */

  _buildMoon() {
    // Direction must match the DirectionalLight in game.js, or the moon casts
    // shadows from a place it visibly is not.
    const dir = new THREE.Vector3(-60, 90, 40).normalize();
    const at = dir.clone().multiplyScalar(DOME * 0.86);

    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(19, 48),
      new THREE.MeshBasicMaterial({ map: moonTexture(), fog: false, transparent: true, depthWrite: false })
    );
    disc.position.copy(at);
    disc.lookAt(0, 0, 0);

    // Two halos: a tight bright one and a wide atmospheric bloom.
    const halo = (radius, opacity) => {
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(radius, 40),
        new THREE.MeshBasicMaterial({
          map: glowTexture(), fog: false, transparent: true, depthWrite: false,
          blending: THREE.AdditiveBlending, opacity,
        })
      );
      m.position.copy(at);
      m.lookAt(0, 0, 0);
      return m;
    };

    this.moonGroup = new THREE.Group();
    this.moonGroup.add(halo(120, 0.19), halo(46, 0.34), disc);
    this.moonGroup.renderOrder = -1;
    this.group.add(this.moonGroup);
    this.moonDisc = disc;
  }

  /** Follow the camera so the sky stays at infinity, and twinkle. */
  update(dt, camera) {
    this._time += dt;
    this.starMat.uniforms.uTime.value = this._time;
    this.group.position.set(camera.position.x, 0, camera.position.z);
  }

  /** Dim the sky as the run tightens — the world closes over you. */
  setDim(t) {
    this.starMat.uniforms.uOpacity.value = 1 - t * 0.72;
    this.moonGroup.children.forEach((c) => {
      if (c.material.blending === THREE.AdditiveBlending) return;
      c.material.opacity = 1 - t * 0.4;
    });
  }

  dispose() {
    this.group.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
  }
}

/* ── procedural moon + glow textures ──────────────────────────── */

let _moonTex = null;
function moonTexture() {
  if (_moonTex) return _moonTex;
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const rng = makeRng(24601);

  ctx.clearRect(0, 0, S, S);
  ctx.save();
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 1, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#e9e7e0';
  ctx.fillRect(0, 0, S, S);

  // maria — the big dark seas
  for (let i = 0; i < 7; i++) {
    const x = rng.range(0.2, 0.8) * S, y = rng.range(0.2, 0.8) * S;
    const r = rng.range(0.08, 0.24) * S;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(150,150,156,0.5)');
    g.addColorStop(1, 'rgba(150,150,156,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }

  // craters: a lit rim and a shadowed floor, offset the same way on each
  for (let i = 0; i < 90; i++) {
    const x = rng.range(0, S), y = rng.range(0, S);
    const r = Math.pow(rng(), 2.3) * 22 + 1.6;
    ctx.fillStyle = `rgba(120,120,126,${rng.range(0.16, 0.42)})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.fillStyle = `rgba(255,255,250,${rng.range(0.2, 0.5)})`;
    ctx.beginPath(); ctx.arc(x - r * 0.16, y - r * 0.16, r * 0.82, 0, 7); ctx.fill();
    ctx.fillStyle = `rgba(112,112,120,${rng.range(0.2, 0.45)})`;
    ctx.beginPath(); ctx.arc(x + r * 0.1, y + r * 0.1, r * 0.6, 0, 7); ctx.fill();
  }

  // terminator: darken the limb away from the light
  const lim = ctx.createRadialGradient(S * 0.38, S * 0.36, S * 0.1, S * 0.5, S * 0.5, S * 0.5);
  lim.addColorStop(0, 'rgba(255,255,255,0.16)');
  lim.addColorStop(0.75, 'rgba(0,0,0,0)');
  lim.addColorStop(1, 'rgba(10,12,18,0.55)');
  ctx.fillStyle = lim;
  ctx.fillRect(0, 0, S, S);
  ctx.restore();

  _moonTex = new THREE.CanvasTexture(c);
  _moonTex.colorSpace = THREE.SRGBColorSpace;
  return _moonTex;
}

let _glowTex = null;
function glowTexture() {
  if (_glowTex) return _glowTex;
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(196,214,240,0.85)');
  g.addColorStop(0.22, 'rgba(150,175,215,0.28)');
  g.addColorStop(0.6, 'rgba(90,110,150,0.07)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  _glowTex = new THREE.CanvasTexture(c);
  _glowTex.colorSpace = THREE.SRGBColorSpace;
  return _glowTex;
}
