/**
 * The ground. A displaced grid whose height function is shared with everything
 * that needs to sit on it (player, trees, props, the entity), so nothing ever
 * floats or sinks.
 */

import * as THREE from 'three';
import { fbm } from '../core/rng.js';
import { groundTexture, groundNormal } from './textures.js';

export const WORLD_SIZE = 260;      // playfield is a square this many metres wide
export const WORLD_HALF = WORLD_SIZE / 2;

export class Terrain {
  constructor(seed) {
    this.seed = seed;
    const segments = 168;

    const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, this.heightAt(x, z));
    }
    geo.computeVertexNormals();

    const map = groundTexture();
    const nrm = groundNormal();
    map.repeat.set(34, 34);
    nrm.repeat.set(34, 34);

    this.mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        map,
        normalMap: nrm,
        normalScale: new THREE.Vector2(1.3, 1.3),
        roughness: 0.94,
        metalness: 0,
        color: 0xffffff,
      })
    );
    this.mesh.receiveShadow = true;
    this.mesh.name = 'terrain';
  }

  /**
   * Analytic ground height. Gentle rolling hills with a shallow basin near the
   * middle so the treeline always sits slightly above you.
   */
  heightAt(x, z) {
    const s = this.seed;
    let h = 0;
    h += fbm(x * 0.0075, z * 0.0075, s, 4) * 7.5;
    h += fbm(x * 0.028, z * 0.028, s + 991, 3) * 1.7;
    h += fbm(x * 0.11, z * 0.11, s + 7717, 2) * 0.32;

    // Sink the middle a little: you start low, everything looms.
    const d = Math.hypot(x, z) / WORLD_HALF;
    h -= (1 - Math.min(1, d)) * 1.9;

    // Raise a lip at the border so the world reads as bounded, not cut off.
    const edge = Math.max(Math.abs(x), Math.abs(z)) / WORLD_HALF;
    if (edge > 0.82) h += Math.pow((edge - 0.82) / 0.18, 2) * 9;

    return h;
  }

  /** Surface normal by finite difference — used to tilt props to the slope. */
  normalAt(x, z, out = new THREE.Vector3()) {
    const e = 0.6;
    const hL = this.heightAt(x - e, z), hR = this.heightAt(x + e, z);
    const hD = this.heightAt(x, z - e), hU = this.heightAt(x, z + e);
    return out.set(hL - hR, 2 * e, hD - hU).normalize();
  }

  /** Slope steepness in [0,1]; generators avoid placing things on cliffs. */
  slopeAt(x, z) {
    const n = this.normalAt(x, z);
    return 1 - n.y;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
