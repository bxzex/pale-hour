/**
 * Enterable buildings: log cabins and a two-room farmhouse.
 *
 * The key difference from the walls in props.js is that these have *gaps* —
 * doorways and windows are real holes in both the geometry and the collision,
 * so you walk through them. A wall with a doorway is built as two flanking
 * pieces plus a lintel, and its collider is split to match.
 *
 * Interiors matter: once you are inside, the walls block line of sight, which
 * means a cabin is genuinely a place to break the entity's gaze — and also a
 * box with one exit, which is a much worse idea than it sounds.
 */

import * as THREE from 'three';
import { plankTexture, plankNormal, concreteTexture, concreteNormal } from './textures.js';

export class Buildings {
  /**
   * @param {import('./terrain.js').Terrain} terrain
   * @param {import('./forest.js').Forest} forest
   * @param {import('./props.js').Props} props  colliders and anchors are registered here
   */
  constructor(terrain, forest, props, rng, scene) {
    this.terrain = terrain;
    this.forest = forest;
    this.props = props;
    this.group = new THREE.Group();
    this.group.name = 'buildings';
    scene.add(this.group);

    /** Interior volumes, used to tell whether the player is indoors. */
    this.rooms = [];
    /** Places worth naming on the HUD. */
    this.places = [];

    const wood = plankTexture().clone();
    wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
    wood.repeat.set(2, 1);
    wood.needsUpdate = true;

    this.mats = {
      log: new THREE.MeshStandardMaterial({
        map: wood, normalMap: plankNormal(), roughness: 0.94, metalness: 0, color: 0xffffff,
      }),
      plank: new THREE.MeshStandardMaterial({
        map: plankTexture(), normalMap: plankNormal(), roughness: 0.95, color: 0xd9d2c4,
      }),
      floor: new THREE.MeshStandardMaterial({
        map: plankTexture(), normalMap: plankNormal(), roughness: 0.9, color: 0xb8ac97,
      }),
      stone: new THREE.MeshStandardMaterial({
        map: concreteTexture(), normalMap: concreteNormal(), roughness: 0.95, color: 0xf0ece4,
      }),
      dark: new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 1 }),
      cloth: new THREE.MeshStandardMaterial({ color: 0x6a5f4c, roughness: 1 }),
    };

    this._populate(rng);
  }

  _populate(rng) {
    const placed = [];
    const spot = (minR, maxR, apart) => {
      for (let i = 0; i < 80; i++) {
        const p = this.forest.findOpenSpot(rng, { minRadius: minR, maxRadius: maxR, clearance: 7 });
        if (placed.every((q) => q.distanceTo(p) > apart)) { placed.push(p); return p; }
      }
      const p = this.forest.findOpenSpot(rng, { minRadius: minR, maxRadius: maxR, clearance: 7 });
      placed.push(p);
      return p;
    };

    this._farmhouse(spot(30, 96, 50), rng);
    for (let i = 0; i < 4; i++) this._cabin(spot(22, 104, 34), rng);
  }

  /* ── wall primitives with real openings ─────────────────────── */

  /**
   * A wall running along the local X axis, centred on (x, z), with optional
   * rectangular openings. Each opening is [centreOffset, width, sillHeight,
   * headHeight] — a doorway is simply an opening whose sill is the floor.
   */
  _wall(x, y, z, angle, length, height, thickness, mat, openings = []) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = angle;

    // Sort openings and walk left to right, emitting the solid spans between.
    const sorted = [...openings].sort((a, b) => a[0] - b[0]);
    const half = length / 2;
    let cursor = -half;
    const solids = [];

    for (const [centre, width] of sorted) {
      const left = centre - width / 2;
      if (left > cursor) solids.push([cursor, left]);
      cursor = Math.max(cursor, centre + width / 2);
    }
    if (cursor < half) solids.push([cursor, half]);

    for (const [a, b] of solids) {
      const w = b - a;
      if (w < 0.02) continue;
      const piece = new THREE.Mesh(new THREE.BoxGeometry(w, height, thickness), mat);
      piece.position.set((a + b) / 2, height / 2, 0);
      piece.castShadow = piece.receiveShadow = true;
      g.add(piece);
    }

    // Fill above and below each opening: lintels, and sills for windows.
    for (const [centre, width, sill = 0, head = height] of sorted) {
      if (head < height) {
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(width, height - head, thickness), mat);
        lintel.position.set(centre, head + (height - head) / 2, 0);
        lintel.castShadow = lintel.receiveShadow = true;
        g.add(lintel);
      }
      if (sill > 0) {
        const under = new THREE.Mesh(new THREE.BoxGeometry(width, sill, thickness), mat);
        under.position.set(centre, sill / 2, 0);
        under.castShadow = under.receiveShadow = true;
        g.add(under);
      }
    }

    this.group.add(g);

    // ── colliders: one segment per solid span, in world space
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const toWorld = (lx) => [x + lx * cos, z - lx * sin];
    for (const [a, b] of solids) {
      if (b - a < 0.02) continue;
      const [ax, az] = toWorld(a);
      const [bx, bz] = toWorld(b);
      this.props.segments.push({ x1: ax, z1: az, x2: bx, z2: bz, r: thickness * 0.5 + 0.3, tall: true });
    }
    // A window you cannot climb through still blocks movement, but its span is
    // already covered by the sill piece below it — so only doorways stay open.
    for (const [centre, width, sill = 0] of sorted) {
      if (sill <= 0.05) continue;
      const [ax, az] = toWorld(centre - width / 2);
      const [bx, bz] = toWorld(centre + width / 2);
      this.props.segments.push({ x1: ax, z1: az, x2: bx, z2: bz, r: thickness * 0.5 + 0.3, tall: false });
    }

    return g;
  }

  /** Register an interior wall face as somewhere a fragment can be nailed. */
  _anchor(x, y, z, nx, nz, name) {
    this.props.anchors.push({
      position: new THREE.Vector3(x, y, z),
      normal: new THREE.Vector3(nx, 0, nz),
      name,
    });
  }

  _floor(x, y, z, angle, w, d, mat) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), mat);
    f.position.set(x, y - 0.08, z);
    f.rotation.y = angle;
    f.receiveShadow = true;
    this.group.add(f);
    return f;
  }

  /** Pitched roof from two slabs. */
  _roof(x, y, z, angle, w, d, rise, mat) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = angle;
    const slope = Math.atan2(rise, d / 2);
    const len = Math.hypot(rise, d / 2);
    for (const s of [-1, 1]) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.7, 0.16, len * 2 + 0.2), mat);
      slab.position.set(0, rise / 2, (s * d) / 4);
      slab.rotation.x = -s * slope;
      slab.scale.z = 0.5;
      slab.castShadow = slab.receiveShadow = true;
      g.add(slab);
    }
    // gable ends
    for (const s of [-1, 1]) {
      const gable = new THREE.Mesh(new THREE.BoxGeometry(0.16, rise, d * 0.9), mat);
      gable.position.set((s * w) / 2, rise / 2, 0);
      gable.castShadow = true;
      g.add(gable);
    }
    this.group.add(g);
    return g;
  }

  /* ── the buildings ──────────────────────────────────────────── */

  /**
   * A one-room log cabin: door on the front, two windows, a stove, a bunk and
   * a table. Small enough to read at a glance and to feel trapped inside.
   */
  _cabin(p, rng) {
    const { x, z } = p;
    const y = this.terrain.heightAt(x, z);
    const rot = rng.range(0, Math.PI * 2);
    const W = 7.4, D = 6.2, H = 2.9;
    const t = 0.3;

    this.places.push({ name: 'A CABIN', position: new THREE.Vector3(x, y, z) });
    this.rooms.push({ x, z, angle: rot, w: W, d: D, y, name: 'A CABIN' });

    const cos = Math.cos(rot), sin = Math.sin(rot);
    // Local → world for the four wall centres
    const front = [x + (D / 2) * sin, z + (D / 2) * cos];
    const back = [x - (D / 2) * sin, z - (D / 2) * cos];
    const left = [x - (W / 2) * cos, z + (W / 2) * sin];
    const right = [x + (W / 2) * cos, z - (W / 2) * sin];

    this._floor(x, y, z, rot, W, D, this.mats.floor);

    // front wall with a doorway, offset from centre so the interior is not symmetric
    const doorAt = rng.range(-1.3, 1.3);
    this._wall(front[0], y, front[1], rot, W, H, t, this.mats.log, [[doorAt, 1.15, 0, 2.15]]);
    // back wall with a window
    this._wall(back[0], y, back[1], rot, W, H, t, this.mats.log, [[rng.range(-1.6, 1.6), 1.2, 1.0, 2.1]]);
    // sides, one with a window
    this._wall(left[0], y, left[1], rot + Math.PI / 2, D, H, t, this.mats.log, [[0.4, 1.1, 1.0, 2.1]]);
    this._wall(right[0], y, right[1], rot + Math.PI / 2, D, H, t, this.mats.log, []);

    this._roof(x, y + H, z, rot, W, D, 1.5, this.mats.plank);

    // ── porch
    const porch = new THREE.Group();
    porch.position.set(front[0] + sin * 0.9, y, front[1] + cos * 0.9);
    porch.rotation.y = rot;
    const deck = new THREE.Mesh(new THREE.BoxGeometry(W * 0.8, 0.14, 1.8), this.mats.plank);
    deck.position.y = 0.05;
    deck.receiveShadow = true;
    porch.add(deck);
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.4, 0.14), this.mats.plank);
      post.position.set(s * W * 0.34, 1.2, 0.7);
      post.castShadow = true;
      porch.add(post);
    }
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(W * 0.85, 0.12, 2.1), this.mats.plank);
    canopy.position.set(0, 2.4, 0.3);
    canopy.castShadow = true;
    porch.add(canopy);
    this.group.add(porch);

    // ── interior: a stove, a bunk, a table, a shelf
    const put = (mesh, lx, ly, lz, ry = 0) => {
      mesh.position.set(x + lx * cos + lz * sin, y + ly, z - lx * sin + lz * cos);
      mesh.rotation.y = rot + ry;
      mesh.castShadow = mesh.receiveShadow = true;
      this.group.add(mesh);
      return mesh;
    };

    const stove = put(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.7), this.mats.dark), -W / 2 + 0.8, 0.55, -D / 2 + 0.7);
    const flue = put(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.4, 8), this.mats.dark), -W / 2 + 0.8, 2.1, -D / 2 + 0.7);
    void stove; void flue;
    this.props.circles.push({ x: stove.position.x, z: stove.position.z, r: 0.65 });

    const bunkFrame = put(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.42, 2.1), this.mats.plank), W / 2 - 0.8, 0.21, 0.4);
    const mattress = put(new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.18, 1.95), this.mats.cloth), W / 2 - 0.8, 0.5, 0.4);
    void mattress;
    this.props.circles.push({ x: bunkFrame.position.x, z: bunkFrame.position.z, r: 1.0 });

    const table = put(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.09, 0.85), this.mats.plank), 0, 0.78, 1.2);
    for (const [lx, lz] of [[-0.65, -0.32], [0.65, -0.32], [-0.65, 0.32], [0.65, 0.32]]) {
      put(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.78, 0.09), this.mats.plank), lx, 0.39, 1.2 + lz);
    }
    this.props.circles.push({ x: table.position.x, z: table.position.z, r: 0.85 });

    for (let i = 0; i < 2; i++) {
      put(new THREE.Mesh(new THREE.BoxGeometry(W - 1.4, 0.07, 0.32), this.mats.plank), 0, 1.5 + i * 0.5, -D / 2 + 0.24);
    }

    // A dead lantern on the table, and fragments can hang on the back wall.
    const lantern = put(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.26, 8), this.mats.dark), 0.3, 0.95, 1.2);
    void lantern;

    this._anchor(
      x - sin * (D / 2 - 0.22), y + 1.65, z - cos * (D / 2 - 0.22),
      sin, cos, 'a cabin'
    );
    this._anchor(
      x + cos * (W / 2 - 0.22) * -1, y + 1.6, z - sin * (W / 2 - 0.22) * -1,
      cos, -sin, 'a cabin'
    );
  }

  /**
   * A two-room farmhouse with an internal dividing wall and its own doorway.
   * Bigger, darker, and the only building where you can lose sight of the door.
   */
  _farmhouse(p, rng) {
    const { x, z } = p;
    const y = this.terrain.heightAt(x, z);
    const rot = rng.range(0, Math.PI * 2);
    const W = 12.5, D = 9.5, H = 3.4;
    const t = 0.34;

    this.places.push({ name: 'THE FARMHOUSE', position: new THREE.Vector3(x, y, z) });
    this.rooms.push({ x, z, angle: rot, w: W, d: D, y, name: 'THE FARMHOUSE' });

    const cos = Math.cos(rot), sin = Math.sin(rot);
    const front = [x + (D / 2) * sin, z + (D / 2) * cos];
    const back = [x - (D / 2) * sin, z - (D / 2) * cos];
    const left = [x - (W / 2) * cos, z + (W / 2) * sin];
    const right = [x + (W / 2) * cos, z - (W / 2) * sin];

    this._floor(x, y, z, rot, W, D, this.mats.floor);

    this._wall(front[0], y, front[1], rot, W, H, t, this.mats.stone, [
      [-3.2, 1.3, 0, 2.3],            // front door
      [1.6, 1.4, 1.05, 2.4],          // window
      [4.4, 1.4, 1.05, 2.4],
    ]);
    this._wall(back[0], y, back[1], rot, W, H, t, this.mats.stone, [
      [-4.0, 1.2, 0, 2.2],            // back door — the second way out
      [1.0, 1.4, 1.05, 2.4],
    ]);
    this._wall(left[0], y, left[1], rot + Math.PI / 2, D, H, t, this.mats.stone, [[-1.4, 1.3, 1.05, 2.4]]);
    this._wall(right[0], y, right[1], rot + Math.PI / 2, D, H, t, this.mats.stone, [[1.8, 1.3, 1.05, 2.4]]);

    // internal divider, offset so the two rooms are different sizes
    const divideAt = 1.6;
    this._wall(
      x + divideAt * cos, y, z - divideAt * sin,
      rot + Math.PI / 2, D, H, 0.26, this.mats.plank,
      [[-2.2, 1.1, 0, 2.2]]
    );

    this._roof(x, y + H, z, rot, W, D, 2.2, this.mats.plank);

    const put = (mesh, lx, ly, lz, ry = 0) => {
      mesh.position.set(x + lx * cos + lz * sin, y + ly, z - lx * sin + lz * cos);
      mesh.rotation.y = rot + ry;
      mesh.castShadow = mesh.receiveShadow = true;
      this.group.add(mesh);
      return mesh;
    };

    // hearth
    const hearth = put(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 0.8), this.mats.stone), -W / 2 + 1.4, 0.75, -D / 2 + 0.6);
    put(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.5), this.mats.dark), -W / 2 + 1.4, 0.45, -D / 2 + 0.95);
    this.props.circles.push({ x: hearth.position.x, z: hearth.position.z, r: 1.3 });

    // long table and benches
    const table = put(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.11, 1.1), this.mats.plank), -3.0, 0.82, 1.4);
    for (const lx of [-4.4, -1.6]) {
      for (const lz of [0.95, 1.85]) {
        put(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.82, 0.11), this.mats.plank), lx, 0.41, lz);
      }
    }
    for (const lz of [0.55, 2.25]) {
      put(new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.09, 0.34), this.mats.plank), -3.0, 0.46, lz);
    }
    this.props.circles.push({ x: table.position.x, z: table.position.z, r: 1.7 });

    // shelving and a wardrobe in the far room
    for (let i = 0; i < 3; i++) {
      put(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.36), this.mats.plank), 4.4, 0.9 + i * 0.62, -D / 2 + 0.3);
    }
    const wardrobe = put(new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.65), this.mats.plank), 5.2, 1.1, 2.6);
    this.props.circles.push({ x: wardrobe.position.x, z: wardrobe.position.z, r: 0.9 });

    // fragments hang inside, on both sides of the divider
    this._anchor(x + (divideAt - 0.2) * cos, y + 1.7, z - (divideAt - 0.2) * sin, cos, -sin, 'the farmhouse');
    this._anchor(x + (divideAt + 0.2) * cos, y + 1.7, z - (divideAt + 0.2) * sin, -cos, sin, 'the farmhouse');
    this._anchor(x - sin * (D / 2 - 0.24), y + 1.8, z - cos * (D / 2 - 0.24), sin, cos, 'the farmhouse');
  }

  /**
   * Which building the player is standing in, if any. Used to tell the entity
   * that walls are between you, and to name the place on the HUD.
   */
  roomAt(x, z) {
    for (const r of this.rooms) {
      const dx = x - r.x, dz = z - r.z;
      const cos = Math.cos(-r.angle), sin = Math.sin(-r.angle);
      const lx = dx * cos - dz * sin;
      const lz = dx * sin + dz * cos;
      if (Math.abs(lx) < r.w / 2 && Math.abs(lz) < r.d / 2) return r;
    }
    return null;
  }

  dispose() {
    this.group.traverse((o) => o.geometry?.dispose?.());
    for (const m of Object.values(this.mats)) m.dispose();
    this.group.removeFromParent();
  }
}
