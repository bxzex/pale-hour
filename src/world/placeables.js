/**
 * Things the player builds: campfires and lean-to shelters.
 *
 * The campfire is the centre of gravity of the whole survival loop — it is
 * warmth, light, a cooking station, and the only place night is survivable.
 * It also burns fuel, so it is a thing you have to keep feeding, which is what
 * turns "I made a fire" into "I need more wood before dark".
 */

import * as THREE from 'three';
import { clamp01, damp } from '../core/rng.js';

export const FIRE_RADIUS = 5.5;      // metres within which you count as warm
export const SHELTER_RADIUS = 3.4;

export class Placeables {
  constructor(terrain, scene) {
    this.terrain = terrain;
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'placeables';
    scene.add(this.group);

    /** @type {object[]} */
    this.items = [];
    this._t = 0;

    this.mats = {
      log: new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.95 }),
      stone: new THREE.MeshStandardMaterial({ color: 0x6f6c66, roughness: 0.95, flatShading: true }),
      ember: new THREE.MeshStandardMaterial({
        color: 0x2a0f04, emissive: 0xff5510, emissiveIntensity: 2, roughness: 1,
      }),
      thatch: new THREE.MeshStandardMaterial({ color: 0x5c5334, roughness: 1, side: THREE.DoubleSide }),
    };
  }

  /* ── campfire ───────────────────────────────────────────────── */

  placeFire(x, z) {
    const y = this.terrain.heightAt(x, z);
    const g = new THREE.Group();
    g.position.set(x, y, z);

    // ring of stones
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 0), this.mats.stone);
      s.position.set(Math.cos(a) * 0.62, 0.08, Math.sin(a) * 0.62);
      s.rotation.set(a, a * 1.7, 0);
      s.scale.setScalar(0.8 + Math.random() * 0.5);
      s.castShadow = s.receiveShadow = true;
      g.add(s);
    }
    // crossed logs
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI;
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.9, 6), this.mats.log);
      log.position.set(0, 0.18, 0);
      log.rotation.set(Math.PI / 2.6, a, 0);
      log.castShadow = true;
      g.add(log);
    }

    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), this.mats.ember.clone());
    ember.position.y = 0.2;
    g.add(ember);

    // Flame: stacked additive cones that scale and jitter. Cheap, and reads
    // far better than a particle system at this scale.
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff7a1e, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const flames = [];
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.22 - i * 0.05, 0.7 - i * 0.16, 7), flameMat.clone());
      f.material.color.setHex([0xff5a10, 0xff9c2a, 0xffd88a][i]);
      f.position.y = 0.42 + i * 0.1;
      g.add(f);
      flames.push(f);
    }

    const light = new THREE.PointLight(0xff8a30, 0, 24, 2);
    light.position.y = 0.7;
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
    g.add(light);

    this.group.add(g);

    const fire = {
      kind: 'campfire',
      group: g, light, ember, flames,
      x, y, z,
      fuel: 1,            // 0..1, burns down over ~6 minutes
      burnRate: 1 / 360,
      lit: true,
    };
    this.items.push(fire);
    return fire;
  }

  /* ── shelter ────────────────────────────────────────────────── */

  placeShelter(x, z, angle = 0) {
    const y = this.terrain.heightAt(x, z);
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = angle;

    // A-frame: two leaning walls of thatch on a pole frame
    for (const s of [-1, 1]) {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.4), this.mats.thatch);
      panel.position.set(s * 0.72, 0.95, 0);
      panel.rotation.set(0, Math.PI / 2, s * 0.62);
      panel.castShadow = panel.receiveShadow = true;
      g.add(panel);
    }
    const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.1, 6), this.mats.log);
    ridge.rotation.z = Math.PI / 2;
    ridge.position.y = 1.85;
    g.add(ridge);
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 1.9, 6), this.mats.log);
      post.position.set(0, 0.95, s * 1.45);
      g.add(post);
    }
    // a bed of branches to sleep on
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 2.4), this.mats.thatch);
    bed.position.y = 0.08;
    bed.receiveShadow = true;
    g.add(bed);

    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    this.group.add(g);

    const shelter = { kind: 'shelter', group: g, x, y, z };
    this.items.push(shelter);
    return shelter;
  }

  /* ── queries ────────────────────────────────────────────────── */

  /** The lit fire warming this position, if any. */
  fireAt(x, z) {
    for (const it of this.items) {
      if (it.kind !== 'campfire' || !it.lit) continue;
      if (Math.hypot(it.x - x, it.z - z) < FIRE_RADIUS) return it;
    }
    return null;
  }

  shelterAt(x, z) {
    for (const it of this.items) {
      if (it.kind !== 'shelter') continue;
      if (Math.hypot(it.x - x, it.z - z) < SHELTER_RADIUS) return it;
    }
    return null;
  }

  /** Anything close enough to interact with (refuel a fire, sleep in a shelter). */
  targetFor(player, maxDist = 3.0) {
    let best = null, bestD = maxDist;
    for (const it of this.items) {
      const d = Math.hypot(it.x - player.position.x, it.z - player.position.z);
      if (d < bestD) { bestD = d; best = it; }
    }
    return best;
  }

  refuel(fire, amount = 0.45) {
    fire.fuel = clamp01(fire.fuel + amount);
    fire.lit = true;
  }

  update(dt) {
    this._t += dt;
    for (const it of this.items) {
      if (it.kind !== 'campfire') continue;

      if (it.lit) {
        it.fuel = clamp01(it.fuel - it.burnRate * dt);
        if (it.fuel <= 0) it.lit = false;
      }

      // Flicker: two incommensurate sines plus noise, so it never loops.
      const t = this._t;
      const flick = 0.78 + Math.sin(t * 9.1) * 0.09 + Math.sin(t * 21.7) * 0.06 + Math.random() * 0.07;
      const strength = it.lit ? (0.35 + it.fuel * 0.65) * flick : 0;

      it.light.intensity = damp(it.light.intensity, strength * 34, 12, dt);
      it.light.distance = 12 + it.fuel * 16;
      it.ember.material.emissiveIntensity = damp(
        it.ember.material.emissiveIntensity, it.lit ? 1.4 + it.fuel * 2.4 : 0.15, 6, dt
      );

      it.flames.forEach((f, i) => {
        const s = strength * (0.7 + Math.sin(t * (7 + i * 3.3) + i) * 0.22);
        f.scale.set(0.7 + s * 0.5, Math.max(0.05, s * 1.25), 0.7 + s * 0.5);
        f.rotation.y = t * (0.7 + i * 0.4);
        f.position.x = Math.sin(t * (5 + i * 2)) * 0.03;
        f.material.opacity = it.lit ? 0.35 + s * 0.4 : 0;
      });
    }
  }

  dispose() {
    this.group.traverse((o) => { o.geometry?.dispose?.(); });
    for (const m of Object.values(this.mats)) m.dispose();
    this.group.removeFromParent();
    this.items = [];
  }
}
