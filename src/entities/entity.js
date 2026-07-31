/**
 * THE PALE HOUR.
 *
 * Design rules, in priority order:
 *
 *  1. It never moves while you are watching it. Freezing is far worse than
 *     charging — the player becomes the one who has to break the stalemate.
 *  2. It only ever appears where you could plausibly have missed it. Every
 *     reposition requires line of sight *from* the target spot, and a minimum
 *     distance, so it never pops into existence in your face.
 *  3. Looking at it costs you. Static is the real health bar, and it drains
 *     slowly, so a glance is survivable and a stare is not.
 *  4. It gets bolder with every fragment, not stronger. Same rules, less rope.
 */

import * as THREE from 'three';
import { paleTexture } from '../world/textures.js';
import { clamp01, damp, smoothstep } from '../core/rng.js';
import { WORLD_HALF } from '../world/terrain.js';

const HEIGHT = 2.72;

/**
 * Two kinds of thing in the forest.
 *
 * WATCHER is the original: it freezes while observed and kills you with static.
 * STALKER does not care whether you are looking — it walks at you, constantly,
 * and only contact matters. It is slower than a sprint on purpose, so it is
 * always escapable and always exhausting.
 */
export const ARCHETYPE = { WATCHER: 'watcher', STALKER: 'stalker' };

export const STATE = {
  DORMANT: 'dormant',
  LURK: 'lurk',
  STALK: 'stalk',
  CHARGE: 'charge',
};

export class Entity {
  constructor(terrain, forest, props, difficulty, rng, scene, options = {}) {
    this.archetype = options.archetype ?? ARCHETYPE.WATCHER;
    this.activateAt = options.activateAt ?? 0;   // fragments needed before it wakes
    this.chaseSpeed = options.chaseSpeed ?? 3.4;
    this.scale = options.scale ?? 1;
    this.terrain = terrain;
    this.forest = forest;
    this.props = props;
    this.difficulty = difficulty;
    this.rng = rng;

    this.position = new THREE.Vector3(0, 0, 0);
    this.state = STATE.DORMANT;
    this.static = 0;          // 0..1 — fills while observed, kills at 1
    this.observed = false;
    this.observedTime = 0;
    this.unobservedTime = 0;
    this.proximity = 0;       // 0..1 dread, drives audio + post fx
    this.fragments = 0;
    this.timer = difficulty.teleportBase;
    this.chargeTime = 0;
    this.visibleNow = false;

    /** @type {(kind:string, data?:object)=>void} */
    this.onEvent = null;

    this.group = new THREE.Group();
    this.group.name = 'entity';
    this.group.visible = false;
    scene.add(this.group);
    this._buildBody();

    this._tmpA = new THREE.Vector3();
    this._tmpB = new THREE.Vector3();
  }

  /* ══════════════════════════════════════════════════════════════
     MODEL — built from primitives, no mesh files
     ══════════════════════════════════════════════════════════════ */

  _buildBody() {
    const skin = new THREE.MeshStandardMaterial({
      map: paleTexture(),
      color: 0xcfc8ba,
      roughness: 0.82,
      metalness: 0,
      // Faint self-illumination: it must be legible as a silhouette even with
      // the torch off, otherwise the scariest moments are invisible ones.
      emissive: 0x070708,
      emissiveIntensity: 1,
    });
    const cloth = new THREE.MeshStandardMaterial({
      // Not pure black: at these light levels a true black shroud disappears
      // entirely and the pale parts read as disconnected floating shapes.
      color: 0x191920,
      roughness: 0.98,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    this.skin = skin;
    this.cloth = cloth;

    const S = HEIGHT / 2.72;

    // ── head: an elongated egg with no features at all
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 22), skin);
    head.scale.set(1, 1.5, 0.92);
    head.position.y = 2.5 * S;
    this.head = head;

    // ── neck, too long by a hand's width
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.085, 0.36, 10), skin);
    neck.position.y = 2.2 * S;

    // ── torso: narrow, tapering up, wrapped in cloth
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.26, 0.98, 12), cloth);
    torso.position.y = 1.62 * S;

    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.13, 0.24), cloth);
    shoulders.position.y = 2.04 * S;

    // ── shroud: a ragged skirt of cloth, hem torn by hand
    const shroudGeo = new THREE.ConeGeometry(0.52, 1.5, 22, 4, true);
    const sp = shroudGeo.attributes.position;
    for (let i = 0; i < sp.count; i++) {
      const y = sp.getY(i);
      if (y < -0.5) {
        const tear = 1 + (Math.sin(i * 2.7) * 0.5 + Math.sin(i * 7.1) * 0.5) * 0.28;
        sp.setX(i, sp.getX(i) * tear);
        sp.setZ(i, sp.getZ(i) * tear);
        sp.setY(i, y + Math.sin(i * 4.3) * 0.16);
      }
    }
    shroudGeo.computeVertexNormals();
    const shroud = new THREE.Mesh(shroudGeo, cloth);
    shroud.position.y = 1.42 * S;
    this.shroud = shroud;

    // ── arms: pale, thin, hanging well past where they should stop
    this.arms = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.062, 0.72, 8), skin);
      upper.position.y = -0.36;
      const elbow = new THREE.Group();
      elbow.position.y = -0.72;
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.78, 8), skin);
      lower.position.y = -0.39;
      const hand = new THREE.Group();
      hand.position.y = -0.78;
      // fingers: five long tapers, splayed
      for (let f = 0; f < 5; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.019, 0.3, 5), skin);
        finger.position.set((f - 2) * 0.028, -0.15, 0);
        finger.rotation.z = (f - 2) * 0.16;
        hand.add(finger);
      }
      elbow.add(lower, hand);
      arm.add(upper, elbow);
      arm.position.set(side * 0.3, 2.0 * S, 0);
      arm.userData.side = side;
      arm.userData.elbow = elbow;
      this.arms.push(arm);
      this.group.add(arm);
    }

    // ── legs
    this.legs = [];
    for (const side of [-1, 1]) {
      const leg = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.075, 0.78, 8), cloth);
      thigh.position.y = -0.39;
      const knee = new THREE.Group();
      knee.position.y = -0.78;
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.058, 0.74, 8), cloth);
      shin.position.y = -0.37;
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.05, 0.26), cloth);
      foot.position.set(0, -0.76, 0.06);
      knee.add(shin, foot);
      leg.add(thigh, knee);
      leg.position.set(side * 0.11, 1.16 * S, 0);
      leg.userData.side = side;
      leg.userData.knee = knee;
      this.legs.push(leg);
      this.group.add(leg);
    }

    this.group.add(head, neck, torso, shoulders, shroud);

    if (this.archetype === ARCHETYPE.STALKER) {
      // Squat, wide and bent forward — reads as a runner even standing still.
      this.group.scale.set(1.18 * this.scale, 0.74 * this.scale, 1.18 * this.scale);
      shoulders.scale.set(1.45, 1.6, 1.5);
      head.scale.set(1.15, 1.05, 1.05);
      this.skin.color.setHex(0xb9a892);
    } else {
      this.group.scale.setScalar(this.scale);
    }
    this.group.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; }
    });

    // A cold rim light bound to the body, so it separates from black trees.
    this.rim = new THREE.PointLight(0x9fb2c4, 0, 9, 2);
    this.rim.position.y = 2.3 * S;
    this.group.add(this.rim);

    this._anim = 0;
  }

  /* ══════════════════════════════════════════════════════════════
     LIFECYCLE
     ══════════════════════════════════════════════════════════════ */

  begin(player) {
    this.state = STATE.LURK;
    this.static = 0;
    this.fragments = 0;
    this.timer = this.difficulty.teleportBase * 1.4; // grace period on spawn
    this.group.visible = true;
    this._reposition(player, this.difficulty.baseDistance * 1.5);
  }

  /** Called when a fragment is taken: it gets bolder, and it lets you know. */
  onFragmentTaken(count, player) {
    this.fragments = count;
    this.timer = Math.min(this.timer, 1.4);
    this.onEvent?.('escalate', { count });
    // Every second fragment, it announces itself from a distance.
    if (count % 2 === 0) this._reposition(player, this.difficulty.baseDistance * 0.72);
  }

  get teleportInterval() {
    const d = this.difficulty;
    return Math.max(2.2, d.teleportBase - d.teleportPerFrag * this.fragments);
  }

  /* ══════════════════════════════════════════════════════════════
     UPDATE
     ══════════════════════════════════════════════════════════════ */

  /** @returns {'alive'|'caught'|'consumed'} */
  update(dt, player, camera) {
    if (this.state === STATE.DORMANT) return 'alive';

    const d = this.difficulty;
    const eye = player.eyePosition(this._tmpA);
    const chest = this._tmpB.set(this.position.x, this.position.y + 1.9, this.position.z);
    const dist = eye.distanceTo(chest);

    this._updateObservation(dt, player, camera, eye, chest, dist);

    // ── static: watchers only. A stalker is a physical problem, not a
    // psychological one, so staring at it costs you nothing.
    if (this.archetype === ARCHETYPE.STALKER) {
      this.static = clamp01(this.static - dt * d.staticDecay);
    } else if (this.observed) {
      // closer + longer look = faster fill; a flick of the eyes is cheap
      const near = 1 - smoothstep(6, 48, dist);
      const ramp = smoothstep(0, 0.45, this.observedTime);
      this.static = clamp01(this.static + dt * d.staticGain * (0.55 + near) * ramp);
    } else {
      this.static = clamp01(this.static - dt * d.staticDecay);
    }

    // ── dread: proximity pressure, felt through audio and the lens
    const prox = (1 - smoothstep(4, 34, dist)) * (this.archetype === ARCHETYPE.STALKER ? 1 : (this.observed ? 1 : 0.55));
    this.proximity = damp(this.proximity, Math.max(prox, this.static * 0.8), 3.5, dt);

    // ── movement
    switch (this.state) {
      case STATE.LURK:
      case STATE.STALK:
        this._stalk(dt, player, dist);
        break;
      case STATE.CHARGE:
        this._charge(dt, player);
        break;
    }

    this._face(player, dt);
    this._animate(dt, dist);

    // ── outcomes
    if (this.static >= 1) return 'consumed';
    if (this.archetype === ARCHETYPE.STALKER) {
      if (dist < d.killDistance * 0.75) return 'caught';
    } else if (dist < d.killDistance && (this.observed || this.state === STATE.CHARGE)) {
      return 'caught';
    }
    return 'alive';
  }

  _updateObservation(dt, player, camera, eye, chest, dist) {
    // In frustum?
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const to = chest.clone().sub(eye);
    const flatDist = Math.max(0.001, to.length());
    to.divideScalar(flatDist);
    const fov = THREE.MathUtils.degToRad(camera.fov) * 0.5;
    const inView = to.dot(fwd) > Math.cos(fov * camera.aspect * 0.82);

    // Occluded?
    const clear = inView
      && this.forest.hasLineOfSight(eye, chest)
      && !this.props.blocksSight(eye, chest);

    // Can you actually see it? Beyond the torch's reach in the dark, it is a
    // shape at best — that still counts, but only close in.
    const lit = player.lightOn && to.dot(fwd) > Math.cos(fov * 0.5) && dist < player.torch.distance;
    const perceptible = clear && (lit || dist < 26);

    this.visibleNow = clear;
    this.observed = perceptible;

    if (perceptible) {
      this.observedTime += dt;
      this.unobservedTime = 0;
    } else {
      this.unobservedTime += dt;
      this.observedTime = Math.max(0, this.observedTime - dt * 2);
    }
  }

  _stalk(dt, player, dist) {
    const d = this.difficulty;

    // A stalker ignores rule 1 entirely: it just keeps coming.
    if (this.archetype === ARCHETYPE.STALKER) {
      this._pursue(dt, player, this.chaseSpeed * (1 + this.fragments * 0.06));
      // It repositions only if it has completely lost you, so it never
      // teleports into your face mid-chase.
      this.timer -= dt;
      if (this.timer <= 0 && dist > 60) {
        this.timer = this.teleportInterval * 2;
        this._reposition(player, d.baseDistance);
      }
      return;
    }

    // Rule 1: watched means frozen.
    if (this.observed) {
      this.timer -= dt * 0.25; // it still gets impatient, just slower
      // Staring it down at knife range makes it commit.
      if (dist < d.minDistance * 0.8 && this.observedTime > 1.6) {
        this._enterCharge();
      }
      return;
    }

    this.timer -= dt;
    this.state = STATE.STALK;

    // Creep toward the player, keeping to cover.
    if (dist > d.minDistance) {
      this._pursue(dt, player, d.stalkSpeed * (1 + this.fragments * 0.14));
    }

    if (this.timer <= 0) {
      this.timer = this.teleportInterval * (0.8 + this.rng() * 0.45);
      // Late in the run, repositioning sometimes means committing instead.
      const aggression = this.fragments / this.difficulty.fragments;
      if (this.rng() < aggression * 0.34 && dist < d.baseDistance) {
        this._enterCharge();
      } else {
        this._reposition(player);
      }
    }
  }

  /** Walk toward the player at `speed`, sliding along whatever it hits. */
  _pursue(dt, player, speed) {
    const dir = new THREE.Vector3(
      player.position.x - this.position.x, 0, player.position.z - this.position.z
    );
    if (dir.lengthSq() < 1e-6) return;
    dir.normalize();
    const next = this.position.clone().addScaledVector(dir, speed * dt);
    this.forest.resolveCollision(next, 0.6);
    this.props.resolveCollision(next, 0.6);
    this.position.x = next.x;
    this.position.z = next.z;
    this.position.y = this.terrain.heightAt(this.position.x, this.position.z);
  }

  _enterCharge() {
    if (this.state === STATE.CHARGE) return;
    this.state = STATE.CHARGE;
    this.chargeTime = 0;
    this.onEvent?.('charge');
  }

  _charge(dt, player) {
    this.chargeTime += dt;
    const speed = 6.4 + this.fragments * 0.5;
    const dir = new THREE.Vector3(
      player.position.x - this.position.x, 0, player.position.z - this.position.z
    ).normalize();
    const next = this.position.clone().addScaledVector(dir, speed * dt);
    this.forest.resolveCollision(next, 0.5);
    this.props.resolveCollision(next, 0.5);
    this.position.x = next.x;
    this.position.z = next.z;
    this.position.y = this.terrain.heightAt(this.position.x, this.position.z);

    // A charge that fails is a charge that gives you a breather — otherwise
    // there is no counterplay at all.
    if (this.chargeTime > 4.2) {
      this.state = STATE.LURK;
      this.timer = this.teleportInterval;
      this._reposition(player, this.difficulty.baseDistance);
      this.onEvent?.('retreat');
    }
  }

  /**
   * Move somewhere plausible: visible from the player's position (so it reads
   * as "it was already there"), no closer than the difficulty's floor, and
   * never inside a tree.
   */
  _reposition(player, preferredDistance = this.difficulty.baseDistance) {
    const d = this.difficulty;
    const minD = Math.max(d.minDistance, 9);
    let best = null, bestScore = -Infinity;

    for (let i = 0; i < 42; i++) {
      const ang = this.rng() * Math.PI * 2;
      const r = minD + this.rng() * Math.max(4, preferredDistance - minD) * 1.5;
      const x = player.position.x + Math.cos(ang) * r;
      const z = player.position.z + Math.sin(ang) * r;
      if (Math.abs(x) > WORLD_HALF - 8 || Math.abs(z) > WORLD_HALF - 8) continue;
      if (this.terrain.slopeAt(x, z) > 0.45) continue;

      const y = this.terrain.heightAt(x, z);
      const cand = new THREE.Vector3(x, y, z);
      const spot = cand.clone().setY(y + 1.9);
      const eye = player.eyePosition();

      // Not inside geometry
      const probe = cand.clone();
      this.forest.resolveCollision(probe, 0.8);
      this.props.resolveCollision(probe, 0.8);
      if (probe.distanceToSquared(cand) > 0.04) continue;

      const sees = this.forest.hasLineOfSight(eye, spot) && !this.props.blocksSight(eye, spot);
      const dist = eye.distanceTo(spot);

      // Behind the player is best: you turn around, and it is simply there.
      const toEnt = spot.clone().sub(eye).setY(0).normalize();
      const fwd = player.forward();
      const behind = -toEnt.dot(fwd); // 1 = directly behind

      let score = 0;
      score += sees ? 2.5 : 0;
      score += behind * 2.2;
      score -= Math.abs(dist - preferredDistance) * 0.07;
      score += this.rng() * 0.9;

      if (score > bestScore) { bestScore = score; best = cand; }
    }

    if (best) {
      this.position.copy(best);
      this.onEvent?.('reposition', { distance: best.distanceTo(player.position) });
    }
    if (this.state === STATE.CHARGE) this.state = STATE.LURK;
  }

  _face(player, dt) {
    // Always turned toward you. Always.
    const target = Math.atan2(
      player.position.x - this.position.x,
      player.position.z - this.position.z
    );
    let cur = this.group.rotation.y;
    let diff = target - cur;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    // Snaps instantly when you cannot see it; turns visibly when you can.
    this.group.rotation.y = cur + diff * (this.observed ? Math.min(1, dt * 4.5) : 1);
    this.group.position.set(this.position.x, this.position.y, this.position.z);
  }

  _animate(dt, dist) {
    this._anim += dt;
    const t = this._anim;
    const charging = this.state === STATE.CHARGE;

    // idle: an almost-imperceptible sway, plus a shoulder rise like breathing
    const sway = Math.sin(t * 0.7) * 0.022 + Math.sin(t * 1.9) * 0.008;
    this.group.rotation.z = sway * (charging ? 3 : 1);
    this.head.rotation.z = Math.sin(t * 0.53) * 0.05;
    this.shroud.rotation.y = Math.sin(t * 0.4) * 0.06;

    // arms: hang and drift; on a charge they come up
    for (const arm of this.arms) {
      const s = arm.userData.side;
      if (charging) {
        const p = Math.min(1, this.chargeTime * 3);
        arm.rotation.x = damp(arm.rotation.x, -2.1 * p, 9, dt);
        arm.rotation.z = damp(arm.rotation.z, s * 0.5 * p, 9, dt);
        arm.userData.elbow.rotation.x = damp(arm.userData.elbow.rotation.x, -0.7 * p, 9, dt);
      } else {
        arm.rotation.x = damp(arm.rotation.x, Math.sin(t * 0.6 + s) * 0.05, 4, dt);
        arm.rotation.z = damp(arm.rotation.z, s * (0.06 + Math.sin(t * 0.45) * 0.03), 4, dt);
        arm.userData.elbow.rotation.x = damp(arm.userData.elbow.rotation.x, -0.08, 4, dt);
      }
    }

    // legs: only stride while charging — its stalk is a glide, deliberately
    const moving = charging || (this.archetype === ARCHETYPE.STALKER && this.state !== STATE.DORMANT);
    const stride = moving ? Math.sin(t * (charging ? 9 : 6.2)) : 0;
    this.legs.forEach((leg, i) => {
      const phase = i === 0 ? stride : -stride;
      leg.rotation.x = damp(leg.rotation.x, phase * 0.7, 12, dt);
      leg.userData.knee.rotation.x = damp(leg.userData.knee.rotation.x, -Math.max(0, phase) * 0.8, 12, dt);
    });

    // rim light: brighter the closer it is, so it looms out of the dark
    // (candela — see the note on physical light units in player.js)
    const want = (1 - clamp01(dist / 30)) * (charging ? 44 : 22);
    this.rim.intensity = damp(this.rim.intensity, want, 4, dt);
    this.skin.emissiveIntensity = damp(this.skin.emissiveIntensity, charging ? 3.2 : 1, 4, dt);
  }

  dispose() {
    this.group.traverse((o) => o.geometry?.dispose?.());
    this.skin.dispose();
    this.cloth.dispose();
    // Must leave the scene explicitly: with a horde, name-based cleanup would
    // only ever remove the first one and the rest would pile up between runs.
    this.group.removeFromParent();
  }
}
