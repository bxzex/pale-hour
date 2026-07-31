/**
 * Procedural texture library.
 *
 * Everything the game renders is painted here into 2D canvases at boot: bark,
 * forest floor, rotting planks, rusted steel, wet concrete, the fragments'
 * handwriting, foliage cutouts. No image files ship with this game.
 */

import * as THREE from 'three';
import { fbm, noise2, makeRng, clamp01 } from '../core/rng.js';

const cache = new Map();

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}

function finish(c, { repeat = 1, srgb = true, aniso = 8 } = {}) {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = aniso;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Memoise by key so the same texture object is shared across instances. */
function once(key, build) {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key);
}

/* ── per-pixel helpers ───────────────────────────────────────── */

function pixels(size, fn) {
  const c = canvas(size);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const out = fn(x, y, size);
      d[i] = out[0];
      d[i + 1] = out[1];
      d[i + 2] = out[2];
      d[i + 3] = out[3] ?? 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Height field → tangent-space normal map. */
function normalFrom(size, heightFn, strength = 2.4) {
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) h[y * size + x] = heightFn(x, y, size);
  }
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  return pixels(size, (x, y) => {
    const dx = (at(x - 1, y) - at(x + 1, y)) * strength;
    const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
    const len = Math.hypot(dx, dy, 1);
    return [
      ((dx / len) * 0.5 + 0.5) * 255,
      ((dy / len) * 0.5 + 0.5) * 255,
      ((1 / len) * 0.5 + 0.5) * 255,
    ];
  });
}

/* ══════════════════════════════════════════════════════════════
   BARK
   ══════════════════════════════════════════════════════════════ */

const barkHeight = (x, y, size) => {
  const u = (x / size) * 5.5;
  const v = (y / size) * 1.6;
  // Vertical fibres, warped so they wander like real bark
  const warp = fbm(u * 0.7, v * 2.2, 31, 3) * 0.9;
  const fibre = Math.abs(noise2(u * 7 + warp * 3, v * 1.3, 77));
  const cracks = Math.pow(1 - Math.abs(fbm(u * 3.1, v * 9, 903, 4)), 5);
  const grit = fbm(u * 26, v * 26, 5, 2) * 0.14;
  return clamp01(fibre * 0.75 + cracks * 0.6 + grit);
};

export function barkTexture() {
  return once('bark', () =>
    finish(
      pixels(512, (x, y, size) => {
        const h = barkHeight(x, y, size);
        const moss = clamp01(fbm((x / size) * 4, (y / size) * 2.4, 411, 3) * 1.5 - 0.35);
        // dead, ashen brown that greens out where damp
        let r = 86 + h * 74;
        let g = 74 + h * 64;
        let b = 58 + h * 48;
        r -= moss * 24;
        g += moss * 30;
        b -= moss * 6;
        return [r, g, b];
      }),
      { repeat: 1 }
    )
  );
}

export function barkNormal() {
  return once('barkN', () => {
    const t = finish(normalFrom(512, barkHeight, 3.0), { srgb: false });
    return t;
  });
}

/* ══════════════════════════════════════════════════════════════
   FOREST FLOOR
   ══════════════════════════════════════════════════════════════ */

const groundHeight = (x, y, size) => {
  const u = (x / size) * 8, v = (y / size) * 8;
  const clumps = fbm(u * 1.4, v * 1.4, 12, 4) * 0.5 + 0.5;
  const twigs = Math.pow(Math.abs(noise2(u * 11, v * 3.3, 88)), 3) * 0.5;
  const grit = fbm(u * 40, v * 40, 3, 2) * 0.25 + 0.25;
  return clamp01(clumps * 0.6 + twigs + grit * 0.4);
};

export function groundTexture() {
  return once('ground', () =>
    finish(
      pixels(512, (x, y, size) => {
        const u = (x / size) * 8, v = (y / size) * 8;
        const h = groundHeight(x, y, size);
        const leaf = clamp01(fbm(u * 2.6, v * 2.6, 202, 4) * 1.3 + 0.35);
        const dirt = clamp01(fbm(u * 0.8, v * 0.8, 55, 3) + 0.5);
        // damp earth → wet leaf litter
        let r = 52 + dirt * 44 + leaf * 52 + h * 30;
        let g = 47 + dirt * 40 + leaf * 38 + h * 27;
        let b = 36 + dirt * 26 + leaf * 17 + h * 20;
        // scattered pale stones catch the flashlight
        const stone = fbm(u * 18, v * 18, 707, 2);
        if (stone > 0.62) { r += 56; g += 54; b += 50; }
        return [r, g, b];
      }),
      { repeat: 1 }
    )
  );
}

export function groundNormal() {
  return once('groundN', () => finish(normalFrom(512, groundHeight, 2.0), { srgb: false }));
}

/* ══════════════════════════════════════════════════════════════
   PLANKS / CONCRETE / RUST
   ══════════════════════════════════════════════════════════════ */

const plankHeight = (x, y, size) => {
  const rows = 6;
  const v = (y / size) * rows;
  const row = Math.floor(v);
  const inRow = v - row;
  const gap = inRow < 0.06 || inRow > 0.94 ? 0 : 1;
  const grain = Math.abs(noise2((x / size) * 14 + row * 9.1, v * 3, 61)) * 0.5 + 0.4;
  return clamp01(gap * grain);
};

export function plankTexture() {
  return once('plank', () =>
    finish(
      pixels(512, (x, y, size) => {
        const h = plankHeight(x, y, size);
        const rot = clamp01(fbm((x / size) * 5, (y / size) * 5, 313, 3) + 0.4);
        const r = 26 + h * (92 + rot * 40);
        const g = 23 + h * (76 + rot * 30);
        const b = 18 + h * (58 + rot * 18);
        return [r, g, b];
      })
    )
  );
}

export function plankNormal() {
  return once('plankN', () => finish(normalFrom(512, plankHeight, 3.4), { srgb: false }));
}

const concreteHeight = (x, y, size) => {
  const u = (x / size) * 6, v = (y / size) * 6;
  const pits = Math.pow(clamp01(fbm(u * 9, v * 9, 141, 3) + 0.5), 2);
  const crack = Math.pow(1 - Math.abs(fbm(u * 2.2, v * 2.2, 902, 4)), 8);
  return clamp01(0.55 + pits * 0.3 - crack * 0.75);
};

export function concreteTexture() {
  return once('concrete', () =>
    finish(
      pixels(512, (x, y, size) => {
        const h = concreteHeight(x, y, size);
        const stain = clamp01(fbm((x / size) * 3, (y / size) * 3, 66, 4) + 0.5);
        const v = 70 + h * 96 - stain * 26;
        return [v * 1.02, v, v * 0.95];
      })
    )
  );
}

export function concreteNormal() {
  return once('concreteN', () => finish(normalFrom(512, concreteHeight, 1.6), { srgb: false }));
}

export function rustTexture() {
  return once('rust', () =>
    finish(
      pixels(256, (x, y, size) => {
        const u = (x / size) * 6, v = (y / size) * 6;
        const rust = clamp01(fbm(u * 2.4, v * 2.4, 480, 4) * 1.4 + 0.5);
        const grit = fbm(u * 22, v * 22, 9, 2) * 0.5 + 0.5;
        const base = 62 + grit * 34;
        return [
          base + rust * 112,
          base + rust * 52,
          base + rust * 20,
        ];
      })
    )
  );
}

/* ══════════════════════════════════════════════════════════════
   FOLIAGE (alpha cutout for canopy / undergrowth cards)
   ══════════════════════════════════════════════════════════════ */

export function foliageTexture(seed = 1) {
  return once(`foliage${seed}`, () => {
    const size = 256;
    const c = canvas(size);
    const ctx = c.getContext('2d');
    const rng = makeRng(seed * 7717 + 13);
    ctx.clearRect(0, 0, size, size);

    // clusters of needles radiating from a few stems
    for (let stem = 0; stem < 5; stem++) {
      const sx = rng.range(0.15, 0.85) * size;
      const sy = rng.range(0.55, 1.0) * size;
      const dir = rng.range(-1.2, 1.2) - Math.PI / 2;
      const len = rng.range(0.35, 0.62) * size;
      for (let n = 0; n < 190; n++) {
        const t = n / 190;
        const px = sx + Math.cos(dir) * len * t + rng.range(-9, 9);
        const py = sy + Math.sin(dir) * len * t + rng.range(-9, 9);
        const spread = (1 - t) * 22 + 6;
        const a = rng.range(0, Math.PI * 2);
        const nl = rng.range(6, 15);
        const dark = rng.range(0, 1);
        ctx.strokeStyle = `rgba(${18 + dark * 26}, ${30 + dark * 40}, ${16 + dark * 20}, ${rng.range(0.5, 0.95)})`;
        ctx.lineWidth = rng.range(0.8, 1.9);
        ctx.beginPath();
        ctx.moveTo(px + Math.cos(a) * spread * 0.2, py + Math.sin(a) * spread * 0.2);
        ctx.lineTo(px + Math.cos(a) * (spread * 0.2 + nl), py + Math.sin(a) * (spread * 0.2 + nl));
        ctx.stroke();
      }
    }
    const tex = finish(c, { repeat: 1 });
    return tex;
  });
}

/* ══════════════════════════════════════════════════════════════
   FRAGMENTS — the eight pages
   ══════════════════════════════════════════════════════════════ */

/** Scrawled handwriting: not readable text, just the shape of panic. */
function scrawl(ctx, rng, x, y, w, lines, wobble = 1) {
  ctx.strokeStyle = 'rgba(14,12,10,0.86)';
  for (let l = 0; l < lines; l++) {
    const ly = y + l * 15;
    let cx = x + rng.range(0, 8);
    const end = x + w - rng.range(0, w * 0.42);
    ctx.lineWidth = rng.range(1.1, 2.3);
    ctx.beginPath();
    ctx.moveTo(cx, ly);
    while (cx < end) {
      const step = rng.range(4, 11);
      ctx.quadraticCurveTo(
        cx + step * 0.5, ly + rng.range(-7, 7) * wobble,
        cx + step, ly + rng.range(-2.5, 2.5) * wobble
      );
      cx += step;
    }
    ctx.stroke();
  }
}

/**
 * Each fragment is a distinct drawing — one is a map, one is a tally, one is
 * just the same word four hundred times. Index 0-7.
 */
export function fragmentTexture(index) {
  return once(`frag${index}`, () => {
    const W = 384, H = 512;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const rng = makeRng(9001 + index * 131);

    // aged paper
    ctx.fillStyle = '#d8d2bf';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {
      const s = rng.range(1, 5);
      ctx.fillStyle = `rgba(${rng.int(120, 190)},${rng.int(105, 170)},${rng.int(80, 135)},${rng.range(0.02, 0.14)})`;
      ctx.fillRect(rng.range(0, W), rng.range(0, H), s, s);
    }
    // damp edges
    const edge = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.68);
    edge.addColorStop(0, 'rgba(0,0,0,0)');
    edge.addColorStop(1, 'rgba(58,44,26,0.55)');
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(rng.range(-0.03, 0.03));
    ctx.translate(-W / 2, -H / 2);

    switch (index) {
      case 0: { // ALWAYS FACING YOU — a crude tall figure
        scrawl(ctx, rng, 40, 62, 300, 2);
        ctx.fillStyle = 'rgba(20,18,16,0.9)';
        ctx.fillRect(176, 150, 30, 190);           // torso
        ctx.beginPath(); ctx.ellipse(191, 138, 24, 30, 0, 0, 7); ctx.fill(); // head
        ctx.strokeStyle = 'rgba(20,18,16,0.9)'; ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(176, 180); ctx.lineTo(112, 300);   // arms, too long
        ctx.moveTo(206, 180); ctx.lineTo(272, 300);
        ctx.moveTo(182, 340); ctx.lineTo(168, 452);   // legs
        ctx.moveTo(200, 340); ctx.lineTo(216, 452);
        ctx.stroke();
        ctx.font = 'bold 27px monospace';
        ctx.fillStyle = 'rgba(18,16,14,0.92)';
        ctx.fillText('NO FACE', 122, 486);
        break;
      }
      case 1: { // tally marks
        scrawl(ctx, rng, 40, 56, 300, 1);
        ctx.strokeStyle = 'rgba(20,18,16,0.88)';
        ctx.lineWidth = 3.4;
        let n = 0;
        for (let row = 0; row < 9; row++) {
          for (let g = 0; g < 5; g++) {
            const gx = 44 + g * 62, gy = 110 + row * 42;
            for (let i = 0; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(gx + i * 9, gy);
              ctx.lineTo(gx + i * 9 + rng.range(-3, 3), gy + 26);
              ctx.stroke();
            }
            ctx.beginPath(); ctx.moveTo(gx - 4, gy + 24); ctx.lineTo(gx + 34, gy + 2); ctx.stroke();
            n += 5;
          }
        }
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = 'rgba(120,20,12,0.9)';
        ctx.fillText('AND ME', 240, 494);
        break;
      }
      case 2: { // map of the forest
        ctx.strokeStyle = 'rgba(24,20,16,0.75)';
        ctx.lineWidth = 2;
        ctx.strokeRect(48, 96, 288, 320);
        for (let i = 0; i < 46; i++) { // trees
          const x = rng.range(60, 324), y = rng.range(108, 404);
          ctx.beginPath(); ctx.moveTo(x, y + 7); ctx.lineTo(x + 5, y - 7); ctx.lineTo(x + 10, y + 7); ctx.closePath(); ctx.stroke();
        }
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = 'rgba(120,20,12,0.85)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(70, 390);
        for (let i = 0; i < 7; i++) ctx.lineTo(rng.range(70, 320), 390 - i * 42);
        ctx.stroke();
        ctx.setLineDash([]);
        scrawl(ctx, rng, 48, 56, 288, 2);
        ctx.font = 'bold 21px monospace';
        ctx.fillStyle = 'rgba(120,20,12,0.9)';
        ctx.fillText('THE PATH LOOPS', 92, 452);
        break;
      }
      case 3: { // DON'T LOOK, repeated until the pen tears through
        ctx.font = 'bold 19px monospace';
        for (let row = 0; row < 22; row++) {
          for (let col = 0; col < 3; col++) {
            const a = 0.28 + (row / 22) * 0.66;
            ctx.fillStyle = `rgba(20,18,16,${a})`;
            ctx.save();
            ctx.translate(30 + col * 118, 70 + row * 20);
            ctx.rotate(rng.range(-0.05, 0.05) * (row / 8));
            ctx.fillText("DON'T LOOK", 0, 0);
            ctx.restore();
          }
        }
        break;
      }
      case 4: { // a door drawn from the inside
        ctx.strokeStyle = 'rgba(22,19,16,0.85)';
        ctx.lineWidth = 4;
        ctx.strokeRect(112, 120, 160, 280);
        ctx.beginPath(); ctx.arc(248, 262, 7, 0, 7); ctx.stroke();
        for (let i = 0; i < 5; i++) { // scratches
          ctx.lineWidth = rng.range(1, 2.6);
          ctx.beginPath();
          ctx.moveTo(rng.range(120, 264), rng.range(140, 380));
          ctx.lineTo(rng.range(120, 264), rng.range(140, 380));
          ctx.stroke();
        }
        scrawl(ctx, rng, 44, 60, 296, 2);
        ctx.font = 'bold 23px monospace';
        ctx.fillStyle = 'rgba(20,18,16,0.9)';
        ctx.fillText('IT KNOCKS BACK', 74, 446);
        break;
      }
      case 5: { // frantic eyes
        for (let i = 0; i < 26; i++) {
          const x = rng.range(56, 328), y = rng.range(110, 400);
          const w = rng.range(16, 34), h = w * rng.range(0.42, 0.66);
          ctx.strokeStyle = `rgba(20,18,16,${rng.range(0.5, 0.9)})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.ellipse(x, y, w, h, rng.range(-0.3, 0.3), 0, 7); ctx.stroke();
          ctx.fillStyle = 'rgba(20,18,16,0.85)';
          ctx.beginPath(); ctx.arc(x, y, h * 0.42, 0, 7); ctx.fill();
        }
        scrawl(ctx, rng, 44, 62, 296, 2);
        ctx.font = 'bold 25px monospace';
        ctx.fillStyle = 'rgba(120,20,12,0.9)';
        ctx.fillText('ALL OF THEM MINE', 52, 452);
        break;
      }
      case 6: { // torn-out block of text with one legible line
        scrawl(ctx, rng, 40, 70, 304, 12, 0.7);
        ctx.fillStyle = '#d8d2bf';
        ctx.fillRect(36, 250, 312, 54);
        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = 'rgba(20,18,16,0.94)';
        ctx.fillText('EIGHT AND THEN', 66, 274);
        ctx.fillText('IT STOPS HIDING', 60, 298);
        scrawl(ctx, rng, 40, 330, 304, 9, 0.7);
        break;
      }
      default: { // 7 — a hand, pressed flat
        ctx.fillStyle = 'rgba(96,18,12,0.62)';
        ctx.beginPath();
        ctx.ellipse(192, 300, 62, 74, 0, 0, 7);
        ctx.fill();
        const fingers = [[-52, -70], [-20, -104], [14, -108], [46, -86], [70, -18]];
        for (const [fx, fy] of fingers) {
          ctx.beginPath();
          ctx.ellipse(192 + fx * 0.85, 300 + fy * 0.9, 15, 40, Math.atan2(fy, fx) + Math.PI / 2, 0, 7);
          ctx.fill();
        }
        scrawl(ctx, rng, 44, 64, 296, 2);
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = 'rgba(20,18,16,0.9)';
        ctx.fillText('COUNT THEM', 108, 470);
        break;
      }
    }

    // creases + a corner tear on every page
    ctx.restore();
    ctx.strokeStyle = 'rgba(90,74,50,0.28)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const y = rng.range(60, H - 60);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y + rng.range(-10, 10));
      ctx.stroke();
    }
    return finish(c, { repeat: 1 });
  });
}

/* ══════════════════════════════════════════════════════════════
   MISC
   ══════════════════════════════════════════════════════════════ */

/** Warning sign for the fence lines — pure geometry, no fonts needed. */
export function signTexture() {
  return once('sign', () => {
    const c = canvas(256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b8ad3c';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#171512';
    ctx.font = 'bold 46px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DO NOT', 128, 108);
    ctx.fillText('ENTER', 128, 158);
    ctx.fillRect(20, 186, 216, 6);
    // rust bleed
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(${80 + Math.random() * 60},${40 + Math.random() * 30},20,${Math.random() * 0.28})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 7, Math.random() * 7);
    }
    return finish(c, { repeat: 1 });
  });
}

/** The entity's skin: bone-pale, faintly veined, no pores. */
export function paleTexture() {
  return once('pale', () =>
    finish(
      pixels(256, (x, y, size) => {
        const u = (x / size) * 4, v = (y / size) * 4;
        const veins = Math.pow(1 - Math.abs(fbm(u * 3, v * 3, 1337, 4)), 9);
        const mottle = fbm(u * 7, v * 7, 21, 3) * 0.5 + 0.5;
        const base = 158 + mottle * 30;
        return [base - veins * 46, base - veins * 60, base - veins * 52];
      })
    )
  );
}

/** Static noise sheet used by the post-processing pass. */
export function staticTexture() {
  return once('static', () => {
    const t = finish(
      pixels(256, () => {
        const v = Math.random() * 255;
        return [v, v, v];
      }),
      { srgb: false, aniso: 1 }
    );
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    return t;
  });
}

export function disposeTextures() {
  for (const t of cache.values()) t.dispose?.();
  cache.clear();
}
