/**
 * Harvestable world objects.
 *
 * Three kinds, deliberately different in feel:
 *
 *  - **Nodes you hit**: trees and rock. They take repeated hits, shake when
 *    struck, and drop more with the right tool. Bare hands work on trees but
 *    badly, which is the pressure that gets you to craft an axe.
 *  - **Nodes you take**: berry bushes and mushrooms. Instant, but they respawn
 *    on a timer so a patch is a place you come back to.
 *  - **Water**: ponds. Unlimited, but the water is murky until boiled.
 *
 * Existing forest trunks are reused as choppable targets rather than spawning
 * a parallel set of props, so the forest you already walk through is the forest
 * you harvest.
 */

import * as THREE from 'three';
import { WORLD_HALF } from './terrain.js';
import { makeRng, clamp01, damp } from '../core/rng.js';
import { applyWind } from './wind.js';

export const HARVEST = {
  tree:   { hits: 5, tool: 'axe',  bareMult: 0.5,  label: 'TREE' },
  rock:   { hits: 6, tool: 'pick', bareMult: 0.0,  label: 'ROCK' },
  bush:     { hits: 1, tool: null,   bareMult: 1,    label: 'BERRY BUSH' },
  deadfall: { hits: 1, tool: null,   bareMult: 1,    label: 'FALLEN BRANCHES' },
  flint:    { hits: 1, tool: null,   bareMult: 1,    label: 'LOOSE STONE' },
  fungus: { hits: 1, tool: null,   bareMult: 1,    label: 'MUSHROOMS' },
  water:  { hits: 0, tool: null,   bareMult: 1,    label: 'WATER' },
};

export class Resources {
  constructor(terrain, forest, seed, scene) {
    this.terrain = terrain;
    this.forest = forest;
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'resources';
    scene.add(this.group);

    /** @type {object[]} every harvestable thing in the world */
    this.nodes = [];

    const rng = makeRng(seed ^ 0x9e5);
    this._buildTrees(rng);
    this._buildRocks(rng);
    this._buildForage(rng);
    this._buildGroundLoot(rng);
    this._buildPonds(rng);
  }

  /* ── trees: reuse the instanced forest ──────────────────────── */

  _buildTrees(rng) {
    // Only a subset is choppable, so the forest still reads as scenery and
    // harvesting means walking to a specific tree rather than any tree.
    for (const t of this.forest.trees) {
      if (rng() > 0.42) continue;
      this.nodes.push({
        kind: 'tree',
        x: t.x, z: t.z, y: t.y,
        radius: t.r + 1.5,
        hp: HARVEST.tree.hits,
        maxHp: HARVEST.tree.hits,
        drops: t.dead
          ? { branch: [2, 4], wood: [1, 2], fibre: [0, 1] }
          : { wood: [2, 3], branch: [1, 3], fibre: [1, 2] },
        tree: t,
        depleted: false,
        respawn: 0,
        shake: 0,
      });
    }
  }

  /* ── rock outcrops ──────────────────────────────────────────── */

  _buildRocks(rng) {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    // rough it up so outcrops do not read as balls
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      v.multiplyScalar(0.78 + Math.abs(Math.sin(i * 12.9898)) * 0.42);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x8d8b86, roughness: 0.96, metalness: 0.02, flatShading: true,
    });
    const oreMat = new THREE.MeshStandardMaterial({
      color: 0x9a7358, roughness: 0.8, metalness: 0.35, flatShading: true,
      emissive: 0x1a0d06, emissiveIntensity: 1,
    });

    const COUNT = 90;
    this.rockMesh = new THREE.InstancedMesh(geo, mat, COUNT);
    this.rockMesh.castShadow = this.rockMesh.receiveShadow = true;
    this.rockMesh.frustumCulled = false;
    this.group.add(this.rockMesh);

    const dummy = new THREE.Object3D();
    let n = 0;
    for (let i = 0; i < COUNT * 4 && n < COUNT; i++) {
      const p = this.forest.findOpenSpot(rng, { minRadius: 8, maxRadius: WORLD_HALF - 12, clearance: 2.4 });
      const hasOre = rng() < 0.35;
      const s = rng.range(1.1, 2.3);

      dummy.position.set(p.x, p.y + s * 0.45, p.z);
      dummy.rotation.set(rng.range(0, 6), rng.range(0, 6), rng.range(0, 6));
      dummy.scale.set(s, s * rng.range(0.6, 0.95), s * rng.range(0.85, 1.2));
      dummy.updateMatrix();
      this.rockMesh.setMatrixAt(n, dummy.matrix);

      // ore veins get a visible seam so you can spot them at range
      if (hasOre) {
        const vein = new THREE.Mesh(new THREE.IcosahedronGeometry(s * 0.34, 0), oreMat);
        vein.position.set(p.x + rng.range(-0.3, 0.3), p.y + s * 0.6, p.z + rng.range(-0.3, 0.3));
        vein.rotation.set(rng.range(0, 6), rng.range(0, 6), 0);
        vein.castShadow = true;
        this.group.add(vein);
      }

      this.nodes.push({
        kind: 'rock',
        x: p.x, z: p.z, y: p.y,
        radius: s + 1.4,
        hp: HARVEST.rock.hits,
        maxHp: HARVEST.rock.hits,
        drops: hasOre ? { stone: [2, 4], ore: [1, 2] } : { stone: [3, 5] },
        instance: n,
        depleted: false,
        respawn: 0,
        shake: 0,
      });
      // rocks block movement
      this.forest.trees.push({ x: p.x, z: p.z, r: s * 0.8, y: p.y, h: s });
      n++;
    }
    this.rockMesh.count = n;
    this.rockMesh.instanceMatrix.needsUpdate = true;
  }

  /* ── berry bushes and mushrooms ─────────────────────────────── */

  _buildForage(rng) {
    // ── bushes: a dark leafy mass with red berries poking out
    const bushGeo = new THREE.IcosahedronGeometry(0.62, 1);
    const bushMat = new THREE.MeshStandardMaterial({
      color: 0x39482c, roughness: 1, flatShading: true,
    });
    applyWind(bushMat, { amount: 0.1, stiffness: 1.8 });
    const berryMat = new THREE.MeshStandardMaterial({
      color: 0x8e1420, roughness: 0.5, emissive: 0x2a0508, emissiveIntensity: 1,
    });

    for (let i = 0; i < 70; i++) {
      const p = this.forest.findOpenSpot(rng, { minRadius: 6, maxRadius: WORLD_HALF - 10, clearance: 1.4 });
      const bush = new THREE.Mesh(bushGeo, bushMat);
      const s = rng.range(0.8, 1.35);
      bush.position.set(p.x, p.y + 0.42 * s, p.z);
      bush.scale.set(s, s * 0.82, s);
      bush.rotation.y = rng.range(0, 6);
      bush.castShadow = bush.receiveShadow = true;
      this.group.add(bush);

      const berries = new THREE.Group();
      for (let b = 0; b < 9; b++) {
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 5), berryMat);
        const a = rng.range(0, 6.28), r = rng.range(0.3, 0.6) * s;
        berry.position.set(Math.cos(a) * r, rng.range(0.25, 0.75) * s, Math.sin(a) * r);
        berries.add(berry);
      }
      berries.position.set(p.x, p.y, p.z);
      this.group.add(berries);

      this.nodes.push({
        kind: 'bush',
        x: p.x, z: p.z, y: p.y,
        radius: 1.7,
        hp: 1, maxHp: 1,
        drops: { berries: [2, 4], fibre: [1, 2] },
        mesh: berries,
        depleted: false,
        respawn: 0,
        respawnTime: 180,
        shake: 0,
      });
    }

    // ── mushrooms: pale clusters at the foot of trees
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xd8cdb4, roughness: 0.85, emissive: 0x151208, emissiveIntensity: 1,
    });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0xb8ae98, roughness: 0.9 });
    for (let i = 0; i < 55; i++) {
      const p = this.forest.findOpenSpot(rng, { minRadius: 6, maxRadius: WORLD_HALF - 10, clearance: 1.0 });
      const cluster = new THREE.Group();
      const n = 2 + Math.floor(rng() * 4);
      for (let m = 0; m < n; m++) {
        const s = rng.range(0.7, 1.3);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.038, 0.16 * s, 6), stemMat);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.085 * s, 8, 6, 0, 6.3, 0, 1.7), capMat);
        const ox = rng.range(-0.3, 0.3), oz = rng.range(-0.3, 0.3);
        stem.position.set(ox, 0.08 * s, oz);
        cap.position.set(ox, 0.16 * s, oz);
        cluster.add(stem, cap);
      }
      cluster.position.set(p.x, p.y, p.z);
      this.group.add(cluster);

      this.nodes.push({
        kind: 'fungus',
        x: p.x, z: p.z, y: p.y,
        radius: 1.5,
        hp: 1, maxHp: 1,
        drops: { mushroom: [1, 3] },
        mesh: cluster,
        depleted: false,
        respawn: 0,
        respawnTime: 240,
        shake: 0,
      });
    }
  }

  /**
   * Loose sticks and flint lying on the ground.
   *
   * These exist to break a deadlock: rock outcrops need a pick, and the pick
   * recipe needs stone, so without free ground stone the player can never
   * craft anything at all. Every survival game solves this the same way —
   * your first ten minutes are spent stooping to pick up sticks and stones.
   */
  _buildGroundLoot(rng) {
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x6a5a44, roughness: 0.96 });
    const flintMat = new THREE.MeshStandardMaterial({
      color: 0x8a8880, roughness: 0.82, flatShading: true,
    });

    // ── deadfall: little piles of sticks
    for (let i = 0; i < 130; i++) {
      const p = this.forest.findOpenSpot(rng, { minRadius: 3, maxRadius: WORLD_HALF - 8, clearance: 0.9 });
      const pile = new THREE.Group();
      const n = 2 + Math.floor(rng() * 3);
      for (let k = 0; k < n; k++) {
        const len = rng.range(0.5, 1.1);
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.045, len, 5), stickMat);
        stick.rotation.set(Math.PI / 2 + rng.range(-0.16, 0.16), rng.range(0, 6.28), 0);
        stick.position.set(rng.range(-0.28, 0.28), 0.05, rng.range(-0.28, 0.28));
        stick.castShadow = true;
        pile.add(stick);
      }
      pile.position.set(p.x, p.y, p.z);
      this.group.add(pile);

      this.nodes.push({
        kind: 'deadfall',
        x: p.x, z: p.z, y: p.y,
        radius: 1.3, hp: 1, maxHp: 1,
        drops: { branch: [2, 4], fibre: [0, 1] },
        mesh: pile, depleted: false, respawn: 0, respawnTime: 300, shake: 0,
      });
    }

    // ── flint: scatterings of loose stone
    for (let i = 0; i < 110; i++) {
      const p = this.forest.findOpenSpot(rng, { minRadius: 3, maxRadius: WORLD_HALF - 8, clearance: 0.9 });
      const cluster = new THREE.Group();
      const n = 2 + Math.floor(rng() * 4);
      for (let k = 0; k < n; k++) {
        const s = rng.range(0.09, 0.19);
        const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), flintMat);
        rock.position.set(rng.range(-0.32, 0.32), s * 0.6, rng.range(-0.32, 0.32));
        rock.rotation.set(rng.range(0, 6), rng.range(0, 6), rng.range(0, 6));
        rock.castShadow = rock.receiveShadow = true;
        cluster.add(rock);
      }
      cluster.position.set(p.x, p.y, p.z);
      this.group.add(cluster);

      this.nodes.push({
        kind: 'flint',
        x: p.x, z: p.z, y: p.y,
        radius: 1.3, hp: 1, maxHp: 1,
        drops: { stone: [2, 3] },
        mesh: cluster, depleted: false, respawn: 0, respawnTime: 300, shake: 0,
      });
    }
  }

  /* ── ponds ──────────────────────────────────────────────────── */

  _buildPonds(rng) {
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1c2a30, roughness: 0.08, metalness: 0.65,
      transparent: true, opacity: 0.88,
    });

    for (let i = 0; i < 5; i++) {
      const p = this.forest.findOpenSpot(rng, { minRadius: 18, maxRadius: WORLD_HALF - 24, clearance: 6 });
      const r = rng.range(4.5, 8.5);

      const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 32), waterMat);
      disc.rotation.x = -Math.PI / 2;
      // sit it slightly below the terrain so the banks read as banks
      disc.position.set(p.x, p.y - 0.35, p.z);
      disc.receiveShadow = true;
      this.group.add(disc);

      // reed fringe
      const reedMat = new THREE.MeshStandardMaterial({ color: 0x5a5c34, roughness: 1, side: THREE.DoubleSide });
      applyWind(reedMat, { amount: 0.34, stiffness: 1.2 });
      for (let n = 0; n < 40; n++) {
        const a = rng.range(0, 6.28);
        const rr = r * rng.range(0.85, 1.15);
        const rx = p.x + Math.cos(a) * rr, rz = p.z + Math.sin(a) * rr;
        const reed = new THREE.Mesh(new THREE.PlaneGeometry(0.06, rng.range(0.7, 1.5)), reedMat);
        reed.position.set(rx, this.terrain.heightAt(rx, rz) + 0.5, rz);
        reed.rotation.y = rng.range(0, 6);
        this.group.add(reed);
      }

      this.nodes.push({
        kind: 'water',
        x: p.x, z: p.z, y: p.y,
        radius: r + 2.5,
        hp: Infinity, maxHp: Infinity,
        drops: { water_dirty: [1, 1] },
        depleted: false,
        respawn: 0,
        shake: 0,
        infinite: true,
      });
    }
  }

  /* ── interaction ────────────────────────────────────────────── */

  /**
   * The node the player is standing near and facing. Returns null if nothing
   * is in reach.
   */
  targetFor(player, maxDist = 3.6) {
    const px = player.position.x, pz = player.position.z;
    const fwd = player.forward();
    let best = null, bestScore = -Infinity;

    for (const node of this.nodes) {
      if (node.depleted) continue;
      const dx = node.x - px, dz = node.z - pz;
      const d = Math.hypot(dx, dz);
      const reach = node.kind === 'water' ? node.radius : maxDist + node.radius * 0.4;
      if (d > reach) continue;

      // prefer what you are actually facing
      const dot = d < 0.001 ? 1 : (dx / d) * fwd.x + (dz / d) * fwd.z;
      if (dot < 0.35 && node.kind !== 'water') continue;

      const score = dot * 2 - d * 0.2;
      if (score > bestScore) { bestScore = score; best = node; }
    }
    return best;
  }

  /**
   * Hit a node once.
   * @returns {{drops:object|null, done:boolean, blocked:string|null}}
   */
  harvest(node, inventory, rng = Math.random) {
    const rule = HARVEST[node.kind];
    if (!rule) return { drops: null, done: false, blocked: null };

    // tool gating
    let mult = 1;
    if (rule.tool) {
      const held = inventory.tool(rule.tool);
      if (!held) {
        if (rule.bareMult <= 0) {
          return { drops: null, done: false, blocked: `NEEDS A ${rule.tool.toUpperCase()}` };
        }
        mult = rule.bareMult;
      }
    }

    node.shake = 1;

    if (node.infinite) {
      return { drops: this._roll(node.drops, rng), done: false, blocked: null };
    }

    node.hp -= mult;
    if (node.hp > 0) return { drops: null, done: false, blocked: null };

    node.depleted = true;
    node.respawn = node.respawnTime ?? 0;
    this._setVisible(node, false);
    return { drops: this._roll(node.drops, rng), done: true, blocked: null };
  }

  _roll(drops, rng) {
    const out = {};
    for (const [id, [lo, hi]] of Object.entries(drops)) {
      const n = lo + Math.floor(rng() * (hi - lo + 1));
      if (n > 0) out[id] = n;
    }
    return out;
  }

  _setVisible(node, visible) {
    if (node.kind === 'tree' && node.tree) {
      // Sink the instance underground rather than rebuilding the whole mesh.
      const m = new THREE.Matrix4();
      this.forest.trunks.getMatrixAt(this.forest.trees.indexOf(node.tree), m);
      if (!node._savedMatrix) node._savedMatrix = m.clone();
      const target = visible ? node._savedMatrix : m.premultiply(
        new THREE.Matrix4().makeTranslation(0, -200, 0)
      );
      this.forest.trunks.setMatrixAt(this.forest.trees.indexOf(node.tree), target);
      this.forest.trunks.instanceMatrix.needsUpdate = true;
      // stop it blocking movement once felled
      node.tree.r = visible ? (node._savedRadius ?? node.tree.r) : 0.001;
      if (visible && node._savedRadius) node.tree.r = node._savedRadius;
      else if (!visible && !node._savedRadius) node._savedRadius = node.tree.r;
    } else if (node.mesh) {
      node.mesh.visible = visible;
    } else if (node.kind === 'rock' && node.instance !== undefined) {
      const m = new THREE.Matrix4();
      this.rockMesh.getMatrixAt(node.instance, m);
      if (!node._savedMatrix) node._savedMatrix = m.clone();
      this.rockMesh.setMatrixAt(
        node.instance,
        visible ? node._savedMatrix : m.premultiply(new THREE.Matrix4().makeTranslation(0, -200, 0))
      );
      this.rockMesh.instanceMatrix.needsUpdate = true;
    }
  }

  update(dt) {
    for (const node of this.nodes) {
      if (node.shake > 0) node.shake = damp(node.shake, 0, 8, dt);
      if (!node.depleted || !node.respawnTime) continue;
      node.respawn -= dt;
      if (node.respawn <= 0) {
        node.depleted = false;
        node.hp = node.maxHp;
        this._setVisible(node, true);
      }
    }
  }

  /** Label + progress for the HUD prompt. */
  describe(node, inventory) {
    const rule = HARVEST[node.kind];
    const needs = rule.tool && !inventory.tool(rule.tool);
    const pct = node.infinite ? 1 : clamp01(node.hp / node.maxHp);
    return { label: rule.label, needs: needs ? rule.tool : null, progress: pct };
  }

  dispose() {
    this.group.traverse((o) => { o.geometry?.dispose?.(); });
    this.group.removeFromParent();
  }
}
