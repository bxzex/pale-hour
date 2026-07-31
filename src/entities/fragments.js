/**
 * The eight fragments. Each is a sheet of paper nailed to a wall, a trunk or a
 * post. They are lit only by your torch, so finding them is a lighting puzzle:
 * sweep the beam across the treeline and watch for a rectangle of white.
 */

import * as THREE from 'three';
import { fragmentTexture } from '../world/textures.js';
import { clamp01, damp } from '../core/rng.js';
import { WORLD_HALF } from '../world/terrain.js';

const PAGE_W = 0.42;
const PAGE_H = 0.56;
const PICKUP_RANGE = 2.6;
const LOOK_DOT = 0.86;      // how centred it must be to pick up

export class Fragments {
  constructor(terrain, forest, props, rng, scene, count = 8) {
    this.terrain = terrain;
    this.forest = forest;
    this.count = count;
    this.found = 0;
    this.group = new THREE.Group();
    this.group.name = 'fragments';
    scene.add(this.group);

    /** @type {{mesh:THREE.Mesh, position:THREE.Vector3, taken:boolean, index:number, place:string}[]} */
    this.items = [];

    this._place(props, rng);
  }

  _place(props, rng) {
    const used = [];
    const farEnough = (p) => used.every((u) => u.distanceTo(p) > 34);

    // Prefer prop anchors (walls read best), fall back to trees.
    const anchors = props.anchors.slice();
    for (let i = anchors.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
    }

    for (let i = 0; i < this.count; i++) {
      let spot = null;

      // try an unused wall anchor that is far from the others
      while (anchors.length && !spot) {
        const a = anchors.pop();
        if (farEnough(a.position)) {
          spot = { position: a.position.clone(), normal: a.normal.clone(), place: a.name };
        }
      }

      // otherwise nail it to a tree
      for (let t = 0; t < 200 && !spot; t++) {
        const p = this.forest.findOpenSpot(rng, { minRadius: 20, maxRadius: WORLD_HALF - 22, clearance: 1.6 });
        const tree = this.forest.nearestTree(p.x, p.z, 10);
        if (!tree) continue;
        const a = rng() * Math.PI * 2;
        const pos = new THREE.Vector3(
          tree.x + Math.cos(a) * (tree.r + 0.06),
          tree.y + 1.55,
          tree.z + Math.sin(a) * (tree.r + 0.06)
        );
        if (!farEnough(pos)) continue;
        spot = { position: pos, normal: new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), place: 'the trees' };
      }

      if (!spot) {
        const p = this.forest.findOpenSpot(rng, { minRadius: 14, maxRadius: WORLD_HALF - 20, clearance: 2 });
        spot = { position: p.clone().setY(p.y + 1.4), normal: new THREE.Vector3(0, 0, 1), place: 'the ground' };
      }

      used.push(spot.position.clone());
      this.items.push(this._build(i, spot));
    }
  }

  _build(index, spot) {
    const geo = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 3, 4);
    // give the paper a slight curl so it catches the torch unevenly
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) / PAGE_W;
      pos.setZ(i, Math.pow(Math.abs(u) * 2, 2.2) * 0.028);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: fragmentTexture(index),
      roughness: 0.88,
      metalness: 0,
      side: THREE.DoubleSide,
      // The faint self-glow is a readability affordance: without it, pages are
      // invisible until the beam is dead on them, which stops being scary and
      // starts being tedious.
      emissive: 0x1a1712,
      emissiveIntensity: 1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(spot.position);
    mesh.lookAt(spot.position.clone().add(spot.normal));
    mesh.rotateZ((Math.random() - 0.5) * 0.16);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = 2;
    this.group.add(mesh);

    // a bent nail through the top
    const nail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.07, 5),
      new THREE.MeshStandardMaterial({ color: 0x3a342c, metalness: 0.6, roughness: 0.5 })
    );
    nail.position.copy(spot.position).addScaledVector(spot.normal, 0.035).add(new THREE.Vector3(0, PAGE_H * 0.42, 0));
    nail.rotation.x = Math.PI / 2;
    nail.lookAt(nail.position.clone().add(spot.normal));
    this.group.add(nail);

    return {
      mesh, nail, index,
      position: spot.position.clone(),
      normal: spot.normal.clone(),
      place: spot.place,
      taken: false,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  /**
   * @returns {{item:object|null, distance:number}} the fragment the player is
   *   close enough and centred enough to take.
   */
  targetFor(player) {
    const eye = player.eyePosition();
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(player.camera.quaternion);
    let best = null, bestD = Infinity;

    for (const item of this.items) {
      if (item.taken) continue;
      const d = eye.distanceTo(item.position);
      if (d > PICKUP_RANGE || d > bestD) continue;
      const to = item.position.clone().sub(eye).normalize();
      if (to.dot(fwd) < LOOK_DOT) continue;
      best = item;
      bestD = d;
    }
    return { item: best, distance: bestD };
  }

  take(item) {
    if (!item || item.taken) return false;
    item.taken = true;
    item.mesh.visible = false;
    item.nail.visible = false;
    this.found++;
    return true;
  }

  /** Gentle breathing on the emissive so pages read at the edge of the beam. */
  update(dt, player) {
    const eye = player.eyePosition();
    for (const item of this.items) {
      if (item.taken) continue;
      item.pulse += dt * 1.6;
      const d = eye.distanceTo(item.position);
      // fade the cheat-glow in with distance so close-up pages look natural
      const far = clamp01((d - 4) / 22);
      const target = 0.55 + far * 2.6 + Math.sin(item.pulse) * 0.12;
      const mat = item.mesh.material;
      mat.emissiveIntensity = damp(mat.emissiveIntensity, player.lightOn ? target : target * 0.25, 6, dt);
    }
  }

  get remaining() { return this.count - this.found; }

  dispose() {
    for (const item of this.items) {
      item.mesh.geometry.dispose();
      item.mesh.material.dispose();
      item.nail.geometry.dispose();
      item.nail.material.dispose();
    }
  }
}
