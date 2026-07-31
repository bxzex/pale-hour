/**
 * The forest itself: a few thousand trees drawn as three instanced meshes
 * (trunks, dead branches, conifer canopies) plus alpha-cut undergrowth.
 *
 * The forest also owns collision and line-of-sight. Trunks are registered in a
 * uniform spatial grid, which the player uses to slide along trees and the
 * entity uses to know when it is hidden.
 */

import * as THREE from 'three';
import { WORLD_HALF } from './terrain.js';
import { barkTexture, barkNormal, foliageTexture } from './textures.js';

const CELL = 8; // spatial-grid cell size, metres

export class Forest {
  /**
   * @param {import('./terrain.js').Terrain} terrain
   * @param {() => number} rng
   * @param {THREE.Scene} scene
   */
  constructor(terrain, rng, scene) {
    this.terrain = terrain;
    this.trees = [];          // { x, z, r, h }
    this.grid = new Map();    // "cx,cz" → tree indices
    this.group = new THREE.Group();
    this.group.name = 'forest';
    scene.add(this.group);

    this._plan(rng);
    this._build(rng);
  }

  /* ── layout ─────────────────────────────────────────────────── */

  _plan(rng) {
    const target = 1500;
    const clearRadius = 9;      // don't spawn on top of the player's start

    for (let i = 0; i < target * 3 && this.trees.length < target; i++) {
      const x = rng.range(-WORLD_HALF + 4, WORLD_HALF - 4);
      const z = rng.range(-WORLD_HALF + 4, WORLD_HALF - 4);

      if (Math.hypot(x, z) < clearRadius) continue;
      if (this.terrain.slopeAt(x, z) > 0.42) continue;

      // Density varies so the forest breathes: dense walls, sudden clearings.
      const density = 0.5 + 0.5 * Math.sin(x * 0.045) * Math.cos(z * 0.041);
      const edge = Math.max(Math.abs(x), Math.abs(z)) / WORLD_HALF;
      const wall = edge > 0.78 ? 1 : 0;   // pack the border solid
      if (!wall && rng() > 0.34 + density * 0.5) continue;

      const r = rng.range(0.26, 0.62) * (wall ? 1.1 : 1);
      let tooClose = false;
      for (const t of this._near(x, z, 3.2)) {
        if ((t.x - x) ** 2 + (t.z - z) ** 2 < (r + t.r + 1.5) ** 2) { tooClose = true; break; }
      }
      if (tooClose) continue;

      const dead = rng() < 0.62;
      const tree = {
        x, z, r,
        h: rng.range(dead ? 12 : 9, dead ? 26 : 19),
        dead,
        lean: rng.range(0, Math.PI * 2),
        leanAmt: rng.range(0, dead ? 0.13 : 0.05),
      };
      this._insert(tree, this.trees.length);
      this.trees.push(tree);
    }
  }

  _key(cx, cz) { return cx * 4096 + cz; }

  _insert(tree, index) {
    const cx = Math.floor(tree.x / CELL), cz = Math.floor(tree.z / CELL);
    const k = this._key(cx, cz);
    let bucket = this.grid.get(k);
    if (!bucket) this.grid.set(k, (bucket = []));
    bucket.push(index);
  }

  /** Trees whose centre is within `radius` of (x,z). */
  _near(x, z, radius) {
    const out = [];
    const c0x = Math.floor((x - radius) / CELL), c1x = Math.floor((x + radius) / CELL);
    const c0z = Math.floor((z - radius) / CELL), c1z = Math.floor((z + radius) / CELL);
    for (let cx = c0x; cx <= c1x; cx++) {
      for (let cz = c0z; cz <= c1z; cz++) {
        const bucket = this.grid.get(this._key(cx, cz));
        if (!bucket) continue;
        for (const i of bucket) out.push(this.trees[i]);
      }
    }
    return out;
  }

  /* ── geometry ───────────────────────────────────────────────── */

  _build(rng) {
    const bark = barkTexture();
    const barkN = barkNormal();
    bark.repeat.set(2, 5);
    barkN.repeat.set(2, 5);

    const trunkMat = new THREE.MeshStandardMaterial({
      map: bark,
      normalMap: barkN,
      normalScale: new THREE.Vector2(1.5, 1.5),
      roughness: 0.95,
      metalness: 0,
      color: 0xffffff,
    });

    const trunkGeo = new THREE.CylinderGeometry(0.62, 1, 1, 7, 1, true);
    trunkGeo.translate(0, 0.5, 0);

    const branchGeo = new THREE.CylinderGeometry(0.06, 0.17, 1, 5, 1, true);
    branchGeo.translate(0, 0.5, 0);

    const canopyGeo = new THREE.ConeGeometry(1, 1, 9, 2);
    canopyGeo.translate(0, 0.5, 0);

    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x3c5334,
      roughness: 1,
      metalness: 0,
      flatShading: true,
    });

    // Count instances up front — InstancedMesh needs a fixed capacity.
    let branchCount = 0, canopyCount = 0;
    for (const t of this.trees) {
      t.branches = t.dead ? 3 + Math.floor(rng() * 4) : 0;
      t.canopies = t.dead ? 0 : 3;
      branchCount += t.branches;
      canopyCount += t.canopies;
    }

    this.trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, this.trees.length);
    this.branches = new THREE.InstancedMesh(branchGeo, trunkMat, branchCount);
    this.canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, canopyCount);
    for (const m of [this.trunks, this.branches, this.canopies]) {
      m.castShadow = true;
      m.receiveShadow = true;
      m.frustumCulled = false; // instances span the whole world
      this.group.add(m);
    }

    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    let bi = 0, ci = 0;

    this.trees.forEach((t, i) => {
      const y = this.terrain.heightAt(t.x, t.z);
      t.y = y;

      // trunk
      dummy.position.set(t.x, y - 0.4, t.z);
      dummy.rotation.set(
        Math.cos(t.lean) * t.leanAmt,
        rng.range(0, Math.PI * 2),
        Math.sin(t.lean) * t.leanAmt
      );
      dummy.scale.set(t.r, t.h, t.r);
      dummy.updateMatrix();
      this.trunks.setMatrixAt(i, dummy.matrix);

      const shade = 0.62 + rng() * 0.55;
      this.trunks.setColorAt(i, col.setRGB(shade, shade * 0.97, shade * 0.9));

      // dead branches, angled up and out
      for (let b = 0; b < t.branches; b++) {
        const frac = 0.45 + (b / Math.max(1, t.branches)) * 0.5;
        const ang = rng.range(0, Math.PI * 2);
        const len = t.h * rng.range(0.16, 0.34);
        dummy.position.set(t.x, y + t.h * frac, t.z);
        dummy.rotation.set(0, 0, 0);
        dummy.rotateY(ang);
        dummy.rotateZ(rng.range(0.75, 1.35)); // near-horizontal, drooping
        dummy.scale.set(t.r * 1.5, len, t.r * 1.5);
        dummy.updateMatrix();
        this.branches.setMatrixAt(bi, dummy.matrix);
        this.branches.setColorAt(bi, col.setRGB(shade * 0.8, shade * 0.78, shade * 0.72));
        bi++;
      }

      // conifer canopy: three stacked cones
      for (let c = 0; c < t.canopies; c++) {
        const frac = 0.34 + c * 0.22;
        const rad = t.r * (7.2 - c * 1.7);
        dummy.position.set(t.x, y + t.h * frac, t.z);
        dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
        dummy.scale.set(rad, t.h * (0.46 - c * 0.06), rad);
        dummy.updateMatrix();
        this.canopies.setMatrixAt(ci, dummy.matrix);
        const g = 0.7 + rng() * 0.6;
        this.canopies.setColorAt(ci, col.setRGB(g * 0.8, g, g * 0.75));
        ci++;
      }
    });

    this.trunks.instanceMatrix.needsUpdate = true;
    this.branches.instanceMatrix.needsUpdate = true;
    this.canopies.instanceMatrix.needsUpdate = true;

    this._buildUndergrowth(rng);
  }

  /** Crossed alpha cards: ferns and dry scrub that break up the floor. */
  _buildUndergrowth(rng) {
    const count = 1100;
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.translate(0, 0.5, 0);

    const merged = [];
    for (let i = 0; i < 2; i++) {
      const g = geo.clone();
      g.rotateY((i * Math.PI) / 2);
      merged.push(g);
    }
    // Two crossed quads baked into one geometry via a simple manual merge
    const cross = new THREE.BufferGeometry();
    const posA = merged[0].attributes.position.array;
    const posB = merged[1].attributes.position.array;
    const uvA = merged[0].attributes.uv.array;
    const nrA = merged[0].attributes.normal.array;
    const nrB = merged[1].attributes.normal.array;
    cross.setAttribute('position', new THREE.Float32BufferAttribute([...posA, ...posB], 3));
    cross.setAttribute('normal', new THREE.Float32BufferAttribute([...nrA, ...nrB], 3));
    cross.setAttribute('uv', new THREE.Float32BufferAttribute([...uvA, ...uvA], 2));
    const idxA = [...merged[0].index.array];
    cross.setIndex([...idxA, ...idxA.map((v) => v + 4)]);
    merged.forEach((g) => g.dispose());
    geo.dispose();

    const mat = new THREE.MeshStandardMaterial({
      map: foliageTexture(3),
      transparent: true,
      alphaTest: 0.42,
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0,
      color: 0xc8cfb4,
    });

    const mesh = new THREE.InstancedMesh(cross, mat, count);
    mesh.frustumCulled = false;
    mesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    let n = 0;
    for (let i = 0; i < count * 4 && n < count; i++) {
      const x = rng.range(-WORLD_HALF + 3, WORLD_HALF - 3);
      const z = rng.range(-WORLD_HALF + 3, WORLD_HALF - 3);
      if (this.terrain.slopeAt(x, z) > 0.5) continue;
      const s = rng.range(0.9, 2.6);
      dummy.position.set(x, this.terrain.heightAt(x, z) - 0.15, z);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.scale.set(s * rng.range(0.8, 1.3), s, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(n, dummy.matrix);
      const g = 0.55 + rng() * 0.7;
      mesh.setColorAt(n, col.setRGB(g * 0.9, g, g * 0.7));
      n++;
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    this.undergrowth = mesh;
    this.group.add(mesh);
  }

  /* ── queries ────────────────────────────────────────────────── */

  /**
   * Push a horizontal position out of any trunk it overlaps.
   * Mutates and returns `pos` (a Vector3; y untouched).
   */
  resolveCollision(pos, radius) {
    for (const t of this._near(pos.x, pos.z, radius + 2)) {
      const dx = pos.x - t.x, dz = pos.z - t.z;
      const min = radius + t.r * 0.92;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const push = (min - d) / d;
        pos.x += dx * push;
        pos.z += dz * push;
      }
    }
    return pos;
  }

  /**
   * Coarse line-of-sight between two points, sampled along the segment against
   * trunk radii. Much cheaper than raycasting instanced meshes every frame and
   * accurate enough for "is the tall thing hidden behind a tree".
   */
  hasLineOfSight(from, to) {
    const dx = to.x - from.x, dz = to.z - from.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.6) return true;
    const steps = Math.min(64, Math.max(6, Math.ceil(dist / 1.6)));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const px = from.x + dx * t, pz = from.z + dz * t;
      for (const tree of this._near(px, pz, 1.4)) {
        const ddx = px - tree.x, ddz = pz - tree.z;
        if (ddx * ddx + ddz * ddz < tree.r * tree.r * 1.05) return false;
      }
    }
    return true;
  }

  /** A walkable spot near (x,z), used to place fragments and the entity. */
  findOpenSpot(rng, { minRadius = 0, maxRadius = WORLD_HALF - 12, clearance = 2.4, tries = 90 } = {}) {
    for (let i = 0; i < tries; i++) {
      const a = rng() * Math.PI * 2;
      const r = minRadius + Math.sqrt(rng()) * (maxRadius - minRadius);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.abs(x) > WORLD_HALF - 10 || Math.abs(z) > WORLD_HALF - 10) continue;
      if (this.terrain.slopeAt(x, z) > 0.35) continue;
      let ok = true;
      for (const t of this._near(x, z, clearance + 1)) {
        if ((t.x - x) ** 2 + (t.z - z) ** 2 < (t.r + clearance) ** 2) { ok = false; break; }
      }
      if (ok) return new THREE.Vector3(x, this.terrain.heightAt(x, z), z);
    }
    return new THREE.Vector3(0, this.terrain.heightAt(0, 0), 0);
  }

  /** Nearest trunk to a point, for nailing fragments to trees. */
  nearestTree(x, z, maxDist = 12) {
    let best = null, bestD = maxDist * maxDist;
    for (const t of this._near(x, z, maxDist)) {
      const d = (t.x - x) ** 2 + (t.z - z) ** 2;
      if (d < bestD) { bestD = d; best = t; }
    }
    return best;
  }

  dispose() {
    for (const m of [this.trunks, this.branches, this.canopies, this.undergrowth]) {
      if (!m) continue;
      m.geometry.dispose();
      m.material.dispose();
    }
  }
}
