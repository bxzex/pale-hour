/**
 * Findable notes — the story layer.
 *
 * Unlike fragments, notes are optional, and unlike fragments they are *read*:
 * picking one up opens a full-screen document and pauses the world. That pause
 * is the point. Every note is a decision to stand still in a forest where
 * standing still is how you die, and the game never stops you from reading one
 * at exactly the wrong moment.
 */

import * as THREE from 'three';
import { NOTES } from '../story.js';
import { makeRng, clamp01, damp } from '../core/rng.js';

const PICKUP_RANGE = 2.4;
const LOOK_DOT = 0.84;

/** A folded sheet lying on a surface, curling at one corner. */
function paperTexture(index) {
  const W = 256, H = 320;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const rng = makeRng(4400 + index * 97);

  ctx.fillStyle = '#cdc5ae';
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(${rng.int(110, 175)},${rng.int(96, 155)},${rng.int(70, 120)},${rng.range(0.02, 0.12)})`;
    ctx.fillRect(rng.range(0, W), rng.range(0, H), rng.range(1, 4), rng.range(1, 4));
  }
  // ruled lines and a block of unreadable handwriting
  ctx.strokeStyle = 'rgba(90,105,130,0.22)';
  ctx.lineWidth = 1;
  for (let y = 40; y < H - 20; y += 18) {
    ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(W - 14, y); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(26,22,18,0.72)';
  for (let l = 0; l < 13; l++) {
    const y = 52 + l * 18;
    let x = 22 + rng.range(0, 10);
    const end = W - 20 - rng.range(0, 70);
    ctx.lineWidth = rng.range(1, 1.9);
    ctx.beginPath();
    ctx.moveTo(x, y);
    while (x < end) {
      const step = rng.range(4, 10);
      ctx.quadraticCurveTo(x + step * 0.5, y - rng.range(1, 6), x + step, y - rng.range(0, 2));
      x += step;
    }
    ctx.stroke();
  }
  // damp corner
  const g = ctx.createRadialGradient(W, H, 10, W, H, 190);
  g.addColorStop(0, 'rgba(72,56,32,0.55)');
  g.addColorStop(1, 'rgba(72,56,32,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Notes {
  constructor(terrain, forest, props, buildings, rng, scene) {
    this.terrain = terrain;
    this.group = new THREE.Group();
    this.group.name = 'notes';
    scene.add(this.group);

    /** @type {{mesh:THREE.Mesh, data:object, taken:boolean, position:THREE.Vector3}[]} */
    this.items = [];
    this.read = new Set();

    this._place(forest, props, buildings, rng);
  }

  _place(forest, props, buildings, rng) {
    // Prefer to put notes inside buildings — they are the only interiors, and
    // a note is a reason to walk into a room with one door.
    const interiorSpots = [];
    for (const room of buildings.rooms) {
      const cos = Math.cos(room.angle), sin = Math.sin(room.angle);
      for (let i = 0; i < 3; i++) {
        const lx = rng.range(-room.w / 2 + 1.0, room.w / 2 - 1.0);
        const lz = rng.range(-room.d / 2 + 1.0, room.d / 2 - 1.0);
        interiorSpots.push({
          position: new THREE.Vector3(
            room.x + lx * cos + lz * sin,
            room.y + 0.9,
            room.z - lx * sin + lz * cos
          ),
          kind: room.name === 'THE FARMHOUSE' ? 'farmhouse' : 'cabin',
        });
      }
    }
    // shuffle
    for (let i = interiorSpots.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [interiorSpots[i], interiorSpots[j]] = [interiorSpots[j], interiorSpots[i]];
    }

    const used = [];
    for (const data of NOTES) {
      let spot = null;

      // try to honour the note's preferred location
      const idx = interiorSpots.findIndex(
        (s) => s.kind === data.place && used.every((u) => u.distanceTo(s.position) > 2.2)
      );
      if (idx >= 0) spot = interiorSpots.splice(idx, 1)[0].position;

      if (!spot && interiorSpots.length) spot = interiorSpots.pop().position;

      if (!spot) {
        // fall back to a stump or the open forest floor
        const p = forest.findOpenSpot(rng, { minRadius: 12, maxRadius: 100, clearance: 1.6 });
        spot = p.clone().setY(p.y + 0.06);
      }

      used.push(spot.clone());
      this.items.push(this._build(data, spot, rng));
    }
  }

  _build(data, position, rng) {
    const index = NOTES.indexOf(data);
    const geo = new THREE.PlaneGeometry(0.3, 0.38, 3, 3);
    // let the sheet buckle so it catches the torch unevenly
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, Math.sin(pos.getX(i) * 9) * 0.012 + Math.cos(pos.getY(i) * 7) * 0.008);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: paperTexture(index),
      roughness: 0.92,
      side: THREE.DoubleSide,
      emissive: 0x14110c,
      emissiveIntensity: 1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.rotation.set(-Math.PI / 2 + rng.range(-0.06, 0.06), rng.range(0, Math.PI * 2), 0);
    mesh.renderOrder = 2;
    this.group.add(mesh);

    return { mesh, data, position: position.clone(), taken: false, pulse: rng() * 6.28 };
  }

  /** The note the player is close enough and centred enough to pick up. */
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
      best = item; bestD = d;
    }
    return best;
  }

  take(item) {
    if (!item || item.taken) return null;
    item.taken = true;
    item.mesh.visible = false;
    this.read.add(item.data.id);
    return item.data;
  }

  update(dt, player) {
    const eye = player.eyePosition();
    for (const item of this.items) {
      if (item.taken) continue;
      item.pulse += dt * 1.4;
      const d = eye.distanceTo(item.position);
      const far = clamp01((d - 3) / 14);
      const target = 0.4 + far * 1.5 + Math.sin(item.pulse) * 0.08;
      const mat = item.mesh.material;
      mat.emissiveIntensity = damp(mat.emissiveIntensity, player.lightOn ? target : target * 0.3, 6, dt);
    }
  }

  get count() { return this.read.size; }
  get total() { return this.items.length; }

  dispose() {
    for (const item of this.items) {
      item.mesh.geometry.dispose();
      item.mesh.material.map?.dispose();
      item.mesh.material.dispose();
    }
    this.group.removeFromParent();
  }
}
