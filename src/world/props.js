/**
 * Landmarks. A forest of identical trees is not navigable and not frightening —
 * you need places. A chapel with no roof, a silo, a run of brick walls, a truck
 * that stopped here a long time ago.
 *
 * Props own segment colliders (walls and fences are line segments with a
 * thickness) which double as line-of-sight blockers, plus a list of *anchors*:
 * flat vertical surfaces where a fragment can be nailed up.
 */

import * as THREE from 'three';
import { WORLD_HALF } from './terrain.js';
import {
  plankTexture, plankNormal, concreteTexture, concreteNormal,
  rustTexture, signTexture,
} from './textures.js';

export class Props {
  constructor(terrain, forest, rng, scene) {
    this.terrain = terrain;
    this.forest = forest;
    this.group = new THREE.Group();
    this.group.name = 'props';
    scene.add(this.group);

    /** @type {{x1:number,z1:number,x2:number,z2:number,r:number,tall:boolean}[]} */
    this.segments = [];
    /** @type {{x:number,z:number,r:number}[]} */
    this.circles = [];
    /** @type {{position:THREE.Vector3, normal:THREE.Vector3, name:string}[]} */
    this.anchors = [];
    /** Named places used for the compass hint and win condition. */
    this.landmarks = [];

    this.mats = {
      plank: new THREE.MeshStandardMaterial({
        map: plankTexture(), normalMap: plankNormal(),
        normalScale: new THREE.Vector2(1.2, 1.2),
        roughness: 0.95, metalness: 0, color: 0xffffff,
      }),
      concrete: new THREE.MeshStandardMaterial({
        map: concreteTexture(), normalMap: concreteNormal(),
        roughness: 0.9, metalness: 0, color: 0xffffff,
      }),
      rust: new THREE.MeshStandardMaterial({
        map: rustTexture(), roughness: 0.82, metalness: 0.35, color: 0xffffff,
      }),
      dark: new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 1 }),
      sign: new THREE.MeshStandardMaterial({ map: signTexture(), roughness: 0.8, side: THREE.DoubleSide }),
    };
    for (const m of Object.values(this.mats)) {
      if (m.map) { m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping; }
    }

    this._populate(rng);
  }

  /* ── placement ──────────────────────────────────────────────── */

  _populate(rng) {
    const spots = [];
    const takeSpot = (minR, maxR, clearance = 12) => {
      for (let i = 0; i < 60; i++) {
        const p = this.forest.findOpenSpot(rng, { minRadius: minR, maxRadius: maxR, clearance: 3 });
        if (spots.every((s) => s.distanceTo(p) > clearance)) { spots.push(p); return p; }
      }
      const p = this.forest.findOpenSpot(rng, { minRadius: minR, maxRadius: maxR, clearance: 3 });
      spots.push(p);
      return p;
    };

    // Big set pieces, spread through the middle band of the map
    this._chapel(takeSpot(38, WORLD_HALF - 44, 46), rng);
    this._silo(takeSpot(38, WORLD_HALF - 44, 46), rng);
    this._brickMaze(takeSpot(30, WORLD_HALF - 46, 44), rng);
    this._brickMaze(takeSpot(30, WORLD_HALF - 46, 44), rng);
    this._truck(takeSpot(26, WORLD_HALF - 40, 30), rng);
    this._depot(takeSpot(26, WORLD_HALF - 40, 30), rng);
    this._graves(takeSpot(26, WORLD_HALF - 40, 30), rng);
    this._well(takeSpot(20, WORLD_HALF - 40, 26), rng);
    this._shed(takeSpot(26, WORLD_HALF - 42, 32), rng);

    // Fence runs — they cut the forest into rooms
    for (let i = 0; i < 7; i++) this._fenceRun(rng);

    // Scattered debris
    for (let i = 0; i < 46; i++) this._rock(rng);
    for (let i = 0; i < 24; i++) this._log(rng);
    for (let i = 0; i < 9; i++) this._sign(rng);

    // Perimeter: a chain-link line the player can see but not pass
    this._perimeter();
  }

  /* ── collider + anchor helpers ──────────────────────────────── */

  _seg(x1, z1, x2, z2, r = 0.5, tall = true) {
    this.segments.push({ x1, z1, x2, z2, r, tall });
  }

  _circle(x, z, r) {
    this.circles.push({ x, z, r });
  }

  /** Register both faces of a wall as fragment mounting points. */
  _wallAnchors(cx, cy, cz, angle, length, name) {
    const nx = Math.cos(angle + Math.PI / 2);
    const nz = Math.sin(angle + Math.PI / 2);
    for (const side of [1, -1]) {
      const off = 0.34 * side;
      this.anchors.push({
        position: new THREE.Vector3(cx + nx * off, cy, cz + nz * off),
        normal: new THREE.Vector3(nx * side, 0, nz * side),
        name,
      });
    }
    void length;
  }

  /**
   * A wall: box mesh + segment collider + anchors. Angle is in radians on the
   * XZ plane; the wall is centred on (x, z) and sits on the terrain.
   */
  _wall(x, z, angle, length, height, thickness, mat, name = 'wall') {
    const base = this.terrain.heightAt(x, z);
    const geo = new THREE.BoxGeometry(length, height, thickness);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, base + height / 2 - 0.35, z);
    mesh.rotation.y = angle;
    mesh.castShadow = mesh.receiveShadow = true;
    this.group.add(mesh);

    const hx = Math.cos(angle) * length * 0.5;
    const hz = -Math.sin(angle) * length * 0.5;
    this._seg(x - hx, z - hz, x + hx, z + hz, thickness * 0.5 + 0.3, height > 2);
    this._wallAnchors(x, base + Math.min(height * 0.55, 1.9), z, -angle, length, name);
    return mesh;
  }

  /* ── set pieces ─────────────────────────────────────────────── */

  _chapel(p, rng) {
    const { x, z } = p;
    const y = this.terrain.heightAt(x, z);
    const rot = rng.range(0, Math.PI * 2);
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    this.landmarks.push({ name: 'THE CHAPEL', position: new THREE.Vector3(x, y, z) });

    const W = 11, D = 15, H = 5.4;
    const c = this.mats.concrete;

    // three walls and a facade with a doorway gap
    this._wall(x + Math.cos(rot) * (D / 2), z - Math.sin(rot) * (D / 2), rot + Math.PI / 2, W, H, 0.6, c, 'chapel');
    this._wall(x - Math.cos(rot) * (D / 2), z + Math.sin(rot) * (D / 2), rot + Math.PI / 2, W * 0.32, H, 0.6, c, 'chapel');
    const sx = Math.cos(rot + Math.PI / 2), sz = -Math.sin(rot + Math.PI / 2);
    this._wall(x + sx * (W / 2), z + sz * (W / 2), rot, D, H, 0.6, c, 'chapel');
    this._wall(x - sx * (W / 2), z - sz * (W / 2), rot, D, H, 0.6, c, 'chapel');

    // collapsed roof beams
    for (let i = 0; i < 7; i++) {
      const t = (i / 6 - 0.5) * D * 0.86;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(W * rng.range(0.7, 1.05), 0.3, 0.3), this.mats.plank);
      beam.position.set(
        x + Math.cos(rot) * t,
        y + H - rng.range(0.2, 1.6),
        z - Math.sin(rot) * t
      );
      beam.rotation.set(rng.range(-0.3, 0.3), rot + Math.PI / 2, rng.range(-0.5, 0.5));
      beam.castShadow = true;
      g.add(beam);
    }

    // a bell tower stump, and a cross that has come loose
    const tower = new THREE.Mesh(new THREE.BoxGeometry(4.2, 9, 4.2), c);
    const tx = x - Math.cos(rot) * (D / 2 + 1.4), tz = z + Math.sin(rot) * (D / 2 + 1.4);
    tower.position.set(tx, this.terrain.heightAt(tx, tz) + 4.2, tz);
    tower.rotation.y = rot;
    tower.castShadow = tower.receiveShadow = true;
    g.add(tower);
    this._circle(tx, tz, 3.0);

    const cross = new THREE.Group();
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.24, 3.2, 0.24), this.mats.plank);
    const h = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.24, 0.24), this.mats.plank);
    h.position.y = 0.85;
    cross.add(v, h);
    cross.position.set(tx + rng.range(-3, 3), this.terrain.heightAt(tx, tz) + 0.9, tz + rng.range(-3, 3));
    cross.rotation.set(rng.range(-0.4, 0.4), rng.range(0, 6), rng.range(0.7, 1.3));
    g.add(cross);

    this.group.add(g);
  }

  _silo(p, rng) {
    const { x, z } = p;
    const y = this.terrain.heightAt(x, z);
    this.landmarks.push({ name: 'THE SILO', position: new THREE.Vector3(x, y, z) });

    const R = 4.6, H = 20;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(R, R * 1.06, H, 22, 1, true),
      new THREE.MeshStandardMaterial({
        map: this.mats.concrete.map, normalMap: this.mats.concrete.normalMap,
        roughness: 0.92, metalness: 0, color: 0xf0ece6, side: THREE.DoubleSide,
      })
    );
    body.position.set(x, y + H / 2 - 0.4, z);
    body.castShadow = body.receiveShadow = true;
    this.group.add(body);
    this._circle(x, z, R + 0.4);

    // rusted ladder up one side
    const ladder = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const rung = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), this.mats.rust);
      rung.position.y = i * 0.78;
      ladder.add(rung);
    }
    for (const s of [-0.45, 0.45]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 18.6, 0.09), this.mats.rust);
      rail.position.set(s, 9.3, 0);
      ladder.add(rail);
    }
    const la = rng.range(0, Math.PI * 2);
    ladder.position.set(x + Math.cos(la) * (R + 0.2), y - 0.3, z + Math.sin(la) * (R + 0.2));
    ladder.rotation.y = -la;
    this.group.add(ladder);

    // anchor on the curved wall (close enough to flat at page scale)
    for (let i = 0; i < 3; i++) {
      const a = la + Math.PI * 0.5 * (i + 1);
      this.anchors.push({
        position: new THREE.Vector3(x + Math.cos(a) * (R + 0.12), y + 1.7, z + Math.sin(a) * (R + 0.12)),
        normal: new THREE.Vector3(Math.cos(a), 0, Math.sin(a)),
        name: 'silo',
      });
    }
  }

  /** The brick-wall landmark: a short maze of freestanding walls. */
  _brickMaze(p, rng) {
    const { x, z } = p;
    this.landmarks.push({ name: 'THE WALLS', position: new THREE.Vector3(x, this.terrain.heightAt(x, z), z) });
    const n = 5 + Math.floor(rng() * 4);
    for (let i = 0; i < n; i++) {
      const ox = rng.range(-13, 13), oz = rng.range(-13, 13);
      const wx = x + ox, wz = z + oz;
      if (Math.abs(wx) > WORLD_HALF - 12 || Math.abs(wz) > WORLD_HALF - 12) continue;
      const angle = rng.chance(0.5) ? 0 : Math.PI / 2;
      this._wall(
        wx, wz,
        angle + rng.range(-0.14, 0.14),
        rng.range(7, 15),
        rng.range(3.2, 5.6),
        0.55,
        this.mats.concrete,
        'walls'
      );
    }
  }

  _truck(p, rng) {
    const { x, z } = p;
    const y = this.terrain.heightAt(x, z);
    this.landmarks.push({ name: 'THE TRUCK', position: new THREE.Vector3(x, y, z) });
    const g = new THREE.Group();
    const rot = rng.range(0, Math.PI * 2);
    g.position.set(x, y, z);
    g.rotation.y = rot;

    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 6.4), this.mats.rust);
    bed.position.y = 1.15;
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 2.2), this.mats.rust);
    cab.position.set(0, 2.35, 1.9);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 0.08), this.mats.dark);
    glass.position.set(0, 2.5, 3.02);
    g.add(bed, cab, glass);

    for (const [wx, wz] of [[-1.35, 2.1], [1.35, 2.1], [-1.35, -2.0], [1.35, -2.0]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.42, 14), this.mats.dark);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, 0.55, wz);
      g.add(w);
    }
    g.traverse((o) => { o.castShadow = o.receiveShadow = true; });
    this.group.add(g);
    this._circle(x, z, 3.4);

    // page taped to the side panel
    const nx = Math.cos(rot), nz = -Math.sin(rot);
    this.anchors.push({
      position: new THREE.Vector3(x + nx * 1.4, y + 1.5, z + nz * 1.4),
      normal: new THREE.Vector3(nx, 0, nz),
      name: 'truck',
    });
  }

  _depot(p, rng) {
    const { x, z } = p;
    this.landmarks.push({ name: 'THE DRUMS', position: new THREE.Vector3(x, this.terrain.heightAt(x, z), z) });
    const drumGeo = new THREE.CylinderGeometry(0.52, 0.52, 1.3, 16);
    for (let i = 0; i < 14; i++) {
      const dx = x + rng.range(-7, 7), dz = z + rng.range(-7, 7);
      const fallen = rng.chance(0.35);
      const d = new THREE.Mesh(drumGeo, this.mats.rust);
      d.position.set(dx, this.terrain.heightAt(dx, dz) + (fallen ? 0.2 : 0.55), dz);
      if (fallen) d.rotation.set(Math.PI / 2, rng.range(0, 6), rng.range(0, 6));
      d.castShadow = d.receiveShadow = true;
      this.group.add(d);
      this._circle(dx, dz, 0.7);
    }
    // a low pallet wall gives one flat anchor
    this._wall(x, z, rng.range(0, Math.PI), 5, 2.4, 0.4, this.mats.plank, 'drums');
  }

  _graves(p, rng) {
    const { x, z } = p;
    this.landmarks.push({ name: 'THE STONES', position: new THREE.Vector3(x, this.terrain.heightAt(x, z), z) });
    for (let i = 0; i < 22; i++) {
      const gx = x + rng.range(-9, 9), gz = z + rng.range(-9, 9);
      const h = rng.range(0.7, 1.5);
      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(rng.range(0.5, 0.9), h, rng.range(0.14, 0.26)),
        this.mats.concrete
      );
      stone.position.set(gx, this.terrain.heightAt(gx, gz) + h / 2 - 0.2, gz);
      stone.rotation.set(rng.range(-0.16, 0.16), rng.range(0, 6), rng.range(-0.14, 0.14));
      stone.castShadow = stone.receiveShadow = true;
      this.group.add(stone);
    }
    this._wall(x, z, rng.range(0, Math.PI), 6.5, 2.2, 0.5, this.mats.concrete, 'stones');
  }

  _well(p) {
    const { x, z } = p;
    const y = this.terrain.heightAt(x, z);
    this.landmarks.push({ name: 'THE WELL', position: new THREE.Vector3(x, y, z) });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 1.2, 18, 1, true), this.mats.concrete);
    ring.position.set(x, y + 0.4, z);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(1.45, 18), this.mats.dark);
    hole.rotation.x = -Math.PI / 2;
    hole.position.set(x, y + 0.94, z);
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.16), this.mats.plank);
      post.position.set(x + s * 1.3, y + 1.3, z);
      this.group.add(post);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(3, 0.18, 0.18), this.mats.plank);
    beam.position.set(x, y + 2.5, z);
    ring.castShadow = ring.receiveShadow = true;
    this.group.add(ring, hole, beam);
    this._circle(x, z, 1.9);
  }

  _shed(p, rng) {
    const { x, z } = p;
    this.landmarks.push({ name: 'THE SHED', position: new THREE.Vector3(x, this.terrain.heightAt(x, z), z) });
    const rot = rng.range(0, Math.PI * 2);
    const W = 6, D = 5, H = 3;
    const sx = Math.cos(rot + Math.PI / 2), sz = -Math.sin(rot + Math.PI / 2);
    this._wall(x + Math.cos(rot) * (D / 2), z - Math.sin(rot) * (D / 2), rot + Math.PI / 2, W, H, 0.35, this.mats.plank, 'shed');
    this._wall(x + sx * (W / 2), z + sz * (W / 2), rot, D, H, 0.35, this.mats.plank, 'shed');
    this._wall(x - sx * (W / 2), z - sz * (W / 2), rot, D, H, 0.35, this.mats.plank, 'shed');
    const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 0.6, 0.2, D + 0.6), this.mats.plank);
    roof.position.set(x, this.terrain.heightAt(x, z) + H - 0.2, z);
    roof.rotation.set(0.08, rot, 0.04);
    roof.castShadow = true;
    this.group.add(roof);
  }

  _fenceRun(rng) {
    const start = this.forest.findOpenSpot(rng, { minRadius: 14, maxRadius: WORLD_HALF - 22, clearance: 2 });
    const dir = rng.range(0, Math.PI * 2);
    const posts = 8 + Math.floor(rng() * 12);
    let px = start.x, pz = start.z;
    let heading = dir;

    for (let i = 0; i < posts; i++) {
      const nx = px + Math.cos(heading) * 3.2;
      const nz = pz + Math.sin(heading) * 3.2;
      if (Math.abs(nx) > WORLD_HALF - 8 || Math.abs(nz) > WORLD_HALF - 8) break;

      const y = this.terrain.heightAt(px, pz);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.9, 0.16), this.mats.plank);
      post.position.set(px, y + 0.8, pz);
      post.rotation.set(rng.range(-0.1, 0.1), heading, rng.range(-0.12, 0.12));
      post.castShadow = true;
      this.group.add(post);

      if (rng.chance(0.78)) {
        for (const ry of [0.6, 1.25]) {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.13, 0.07), this.mats.plank);
          rail.position.set((px + nx) / 2, (y + this.terrain.heightAt(nx, nz)) / 2 + ry, (pz + nz) / 2);
          rail.rotation.y = -heading;
          rail.castShadow = true;
          this.group.add(rail);
        }
        // Low fence: blocks movement but not sight.
        this._seg(px, pz, nx, nz, 0.35, false);
      }

      px = nx; pz = nz;
      heading += rng.range(-0.22, 0.22);
    }
  }

  _rock(rng) {
    const p = this.forest.findOpenSpot(rng, { minRadius: 6, maxRadius: WORLD_HALF - 8, clearance: 1.2 });
    const s = rng.range(0.5, 2.6);
    // One shared material for every rock — a fresh MeshStandardMaterial per
    // rock costs a shader variant and a draw call each, for no visual gain.
    this.mats.rock ??= new THREE.MeshStandardMaterial({
      map: this.mats.concrete.map, normalMap: this.mats.concrete.normalMap,
      roughness: 0.95, color: 0xd8d4cc, flatShading: true,
    });
    const rock = new THREE.Mesh(
      new THREE.IcosahedronGeometry(s, 0),
      this.mats.rock
    );
    rock.position.set(p.x, p.y + s * 0.35, p.z);
    rock.rotation.set(rng.range(0, 6), rng.range(0, 6), rng.range(0, 6));
    rock.scale.set(1, rng.range(0.55, 0.9), rng.range(0.8, 1.3));
    rock.castShadow = rock.receiveShadow = true;
    this.group.add(rock);
    if (s > 1.2) this._circle(p.x, p.z, s * 0.8);
  }

  _log(rng) {
    const p = this.forest.findOpenSpot(rng, { minRadius: 8, maxRadius: WORLD_HALF - 10, clearance: 2 });
    const len = rng.range(3, 8), r = rng.range(0.3, 0.6);
    const log = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.7, r, len, 8), this.mats.plank);
    log.rotation.set(Math.PI / 2 + rng.range(-0.1, 0.1), rng.range(0, 6), 0);
    log.position.set(p.x, p.y + r * 0.8, p.z);
    log.castShadow = log.receiveShadow = true;
    this.group.add(log);
  }

  _sign(rng) {
    const p = this.forest.findOpenSpot(rng, { minRadius: 12, maxRadius: WORLD_HALF - 10, clearance: 1.5 });
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 0.1), this.mats.plank);
    post.position.set(p.x, p.y + 1, p.z);
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), this.mats.sign);
    const a = rng.range(0, Math.PI * 2);
    board.position.set(p.x, p.y + 1.7, p.z);
    board.rotation.set(rng.range(-0.1, 0.1), a, rng.range(-0.08, 0.08));
    post.castShadow = board.castShadow = true;
    this.group.add(post, board);
  }

  /** A chain-link boundary so the edge of the world reads as deliberate. */
  _perimeter() {
    const L = WORLD_HALF - 4;
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2c, roughness: 0.8, metalness: 0.4,
      wireframe: true, transparent: true, opacity: 0.5,
    });
    for (const [ax, az, bx, bz] of [
      [-L, -L, L, -L], [L, -L, L, L], [L, L, -L, L], [-L, L, -L, -L],
    ]) {
      const len = Math.hypot(bx - ax, bz - az);
      const geo = new THREE.PlaneGeometry(len, 4, Math.floor(len / 1.2), 4);
      const mesh = new THREE.Mesh(geo, mat);
      const mx = (ax + bx) / 2, mz = (az + bz) / 2;
      mesh.position.set(mx, this.terrain.heightAt(mx, mz) + 2, mz);
      mesh.rotation.y = -Math.atan2(bz - az, bx - ax);
      this.group.add(mesh);
      this._seg(ax, az, bx, bz, 0.6, false);
    }
  }

  /* ── queries ────────────────────────────────────────────────── */

  /** Push a position out of prop colliders. Mutates `pos`. */
  resolveCollision(pos, radius) {
    for (const c of this.circles) {
      const dx = pos.x - c.x, dz = pos.z - c.z;
      const min = radius + c.r;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        pos.x += (dx / d) * (min - d);
        pos.z += (dz / d) * (min - d);
      }
    }
    for (const s of this.segments) {
      const ex = s.x2 - s.x1, ez = s.z2 - s.z1;
      const len2 = ex * ex + ez * ez;
      if (len2 < 1e-6) continue;
      let t = ((pos.x - s.x1) * ex + (pos.z - s.z1) * ez) / len2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const cx = s.x1 + ex * t, cz = s.z1 + ez * t;
      const dx = pos.x - cx, dz = pos.z - cz;
      const min = radius + s.r;
      const d2 = dx * dx + dz * dz;
      if (d2 < min * min) {
        const d = Math.sqrt(d2) || 1e-4;
        pos.x += (dx / d) * (min - d);
        pos.z += (dz / d) * (min - d);
      }
    }
    return pos;
  }

  /** True if a tall wall stands between the two points. */
  blocksSight(from, to) {
    for (const s of this.segments) {
      if (!s.tall) continue;
      if (segmentsCross(from.x, from.z, to.x, to.z, s.x1, s.z1, s.x2, s.z2)) return true;
    }
    return false;
  }

  dispose() {
    this.group.traverse((o) => {
      o.geometry?.dispose?.();
    });
    for (const m of Object.values(this.mats)) m.dispose();
  }
}

function segmentsCross(ax, ay, bx, by, cx, cy, dx, dy) {
  const d1 = cross(cx, cy, dx, dy, ax, ay);
  const d2 = cross(cx, cy, dx, dy, bx, by);
  const d3 = cross(ax, ay, bx, by, cx, cy);
  const d4 = cross(ax, ay, bx, by, dx, dy);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}

function cross(ax, ay, bx, by, px, py) {
  return (bx - ax) * (py - ay) - (by - ay) * (px - ax);
}
