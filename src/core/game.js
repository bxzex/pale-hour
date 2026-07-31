/**
 * Game orchestration: builds a world from a seed, runs the loop, owns the
 * state machine, and decides when a run ends.
 *
 * Run structure — collect all eight fragments, then reach the gate. The gate is
 * dead and unlit until the eighth page, which turns the last stretch of the run
 * into a chase with a known destination instead of an endless search.
 */

import * as THREE from 'three';
import { Terrain, WORLD_HALF } from '../world/terrain.js';
import { Forest } from '../world/forest.js';
import { Props } from '../world/props.js';
import { Fragments } from '../entities/fragments.js';
import { Entity, STATE } from '../entities/entity.js';
import { Player } from '../entities/player.js';
import { PostFX } from '../render/postfx.js';
import { makeRng, hashSeed, clamp01, damp, lerp } from './rng.js';
import { difficultyOf } from './settings.js';
import { rustTexture } from '../world/textures.js';
import { Sky } from '../world/sky.js';
import { Grass } from '../world/grass.js';
import { windUniforms } from '../world/wind.js';

/** Ambient light levels at zero fragments; both dim as the run progresses. */
const MOON_BASE = 1.5;
const SKY_BASE = 2.1;

export const PHASE = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDING: 'ending',
  OVER: 'over',
};

export class Game {
  constructor({ canvas, settings, input, audio, hud, onEnd }) {
    this.canvas = canvas;
    this.settings = settings;
    this.input = input;
    this.audio = audio;
    this.hud = hud;
    this.onEnd = onEnd;

    this.phase = PHASE.IDLE;
    this.elapsed = 0;
    this.seedText = '';

    this._initRenderer();
    this._initScene();

    this._clock = new THREE.Clock();
    this._tmp = new THREE.Vector3();
    this._loop = this._loop.bind(this);
    this._onResize = this._onResize.bind(this);
    addEventListener('resize', this._onResize);
    requestAnimationFrame(this._loop);
  }

  /* ══════════════════════════════════════════════════════════════
     SETUP
     ══════════════════════════════════════════════════════════════ */

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,       // the VHS pass makes AA pointless; grain hides edges
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070a);
    this.fog = new THREE.FogExp2(0x0b1016, 0.020);
    this.scene.fog = this.fog;

    this.camera = new THREE.PerspectiveCamera(this.settings.fov, innerWidth / innerHeight, 0.08, 400);
    this.scene.add(this.camera);

    // Moonlight: barely there. Two sources so silhouettes still read as 3D.
    // Directional and hemisphere lights are not affected by the physical-units
    // change that punctual lights are, so these stay small numbers.
    this.moon = new THREE.DirectionalLight(0x6d84a8, MOON_BASE);
    this.moon.position.set(-60, 90, 40);
    this.scene.add(this.moon);

    this.skyLight = new THREE.HemisphereLight(0x2c3a52, 0x0a0b09, SKY_BASE);
    this.scene.add(this.skyLight);

    this.postfx = new PostFX(this.renderer, this.scene, this.camera, this.settings);
    this._onResize();
  }

  /* ══════════════════════════════════════════════════════════════
     WORLD BUILD / TEARDOWN
     ══════════════════════════════════════════════════════════════ */

  build(seedText) {
    this.dispose(false);

    this.seedText = seedText || String(Math.floor(Math.random() * 0xffffff)).padStart(6, '0');
    const seed = hashSeed(this.seedText);
    const rng = makeRng(seed);
    this.difficulty = difficultyOf(this.settings);

    this.terrain = new Terrain(seed);
    this.scene.add(this.terrain.mesh);

    this.skyDome = new Sky(seed, this.scene);
    this.forest = new Forest(this.terrain, rng, this.scene);
    this.grass = new Grass(this.terrain, this.forest, seed, this.scene);
    this.props = new Props(this.terrain, this.forest, rng, this.scene);
    this.fragments = new Fragments(
      this.terrain, this.forest, this.props, rng, this.scene, this.difficulty.fragments
    );

    this.player = new Player(this.camera, this.terrain, this.forest, this.props, this.settings, this.scene);
    this.player.onFootstep = (i, running) => this.audio.footstep(i, running);
    this.player.onLightToggle = (on) => this.audio.flashlight(on);
    this.player.onViewChange = (name) => {
      this.audio.ui('select');
      this.hud.whisper(`VIEW — ${name}`, 1.6);
    };

    this.entity = new Entity(this.terrain, this.forest, this.props, this.difficulty, rng, this.scene);
    this.entity.onEvent = (kind, data) => this._onEntityEvent(kind, data);

    this._buildExit(rng);

    const start = this.forest.findOpenSpot(rng, { minRadius: 0, maxRadius: 6, clearance: 2.6 });
    this.player.spawn(start.x, start.z, rng() * Math.PI * 2);
  }

  /** The way out: a gate in the perimeter fence, dead until the eighth page. */
  _buildExit(rng) {
    const side = Math.floor(rng() * 4);
    const along = rng.range(-0.55, 0.55) * (WORLD_HALF - 20);
    // Must sit inside PLAYER_BOUND (see player.js) or the gate is unreachable
    // and the run can never be won.
    const edge = WORLD_HALF - 18;
    const pos = [
      new THREE.Vector3(along, 0, -edge),
      new THREE.Vector3(edge, 0, along),
      new THREE.Vector3(along, 0, edge),
      new THREE.Vector3(-edge, 0, along),
    ][side];
    pos.y = this.terrain.heightAt(pos.x, pos.z);

    const g = new THREE.Group();
    g.position.copy(pos);
    g.rotation.y = (side * Math.PI) / 2;

    const mat = new THREE.MeshStandardMaterial({
      map: rustTexture(), roughness: 0.8, metalness: 0.4, color: 0x8a8680,
    });
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.34, 5.4, 0.34), mat);
      post.position.set(s * 2.4, 2.5, 0);
      post.castShadow = true;
      g.add(post);
    }
    const arch = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.3, 0.3), mat);
    arch.position.y = 5.05;
    g.add(arch);

    // two lamps that only come on when the count is complete
    this.exitLamps = [];
    for (const s of [-1, 1]) {
      const lamp = new THREE.PointLight(0xff3a1c, 0, 26, 2);
      lamp.position.set(s * 2.4, 4.6, 0);
      g.add(lamp);
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a0f0b, emissive: 0xff2a10, emissiveIntensity: 0 })
      );
      bulb.position.copy(lamp.position);
      g.add(bulb);
      this.exitLamps.push({ lamp, bulb });
    }

    // a beam of light straight up, visible over the canopy once it is live
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xff2a12, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 3.4, 90, 12, 1, true), beamMat);
    beam.position.y = 45;
    g.add(beam);
    this.exitBeam = beam;

    this.scene.add(g);
    this.exit = { group: g, position: pos.clone(), live: false };
  }

  /* ══════════════════════════════════════════════════════════════
     FLOW
     ══════════════════════════════════════════════════════════════ */

  start() {
    this.build(this.settings.seed);
    this.elapsed = 0;
    this.phase = PHASE.PLAYING;
    this.entity.begin(this.player);
    this.postfx.setFade(1);
    this.postfx.fadeTo(0);
    this.hud.show(this.difficulty.fragments);
    this.hud.opening();
    this.input.lock();
    this.input.onLockLost = () => {
      if (this.phase === PHASE.PLAYING) this.pause();
    };
    this._clock.getDelta();
  }

  pause() {
    if (this.phase !== PHASE.PLAYING) return;
    this.phase = PHASE.PAUSED;
    this.input.unlock();
    this.hud.hide();
    this.audio.suspend();
    this.onPaused?.();
  }

  resume() {
    if (this.phase !== PHASE.PAUSED) return;
    this.phase = PHASE.PLAYING;
    this.audio.resume();
    this.hud.show(this.difficulty.fragments);
    this.hud.setFound(this.fragments.found);
    this.input.lock();
    this._clock.getDelta();
  }

  quit() {
    this.phase = PHASE.IDLE;
    this.input.unlock();
    this.hud.hide();
    this.postfx.setFade(1);
    this.dispose(false);
  }

  /** @param {'caught'|'consumed'|'escaped'} outcome */
  end(outcome) {
    if (this.phase === PHASE.ENDING || this.phase === PHASE.OVER) return;
    this.phase = PHASE.ENDING;
    this.input.unlock();
    this.hud.hide();

    if (outcome === 'escaped') {
      this.audio.victory();
      this.postfx.fadeTo(1);
    } else {
      this.audio.death();
      this.postfx.damage(1);
      this.postfx.glitch(1.5);
      // Hold on the entity's face for a beat before cutting to black.
      if (outcome === 'caught') this._deathStare();
      setTimeout(() => this.postfx.fadeTo(1), 900);
    }

    setTimeout(() => {
      this.phase = PHASE.OVER;
      this.onEnd?.(outcome, this.stats);
    }, outcome === 'escaped' ? 2600 : 2300);
  }

  /** Snap the camera onto it. Nobody survives the reverse shot. */
  _deathStare() {
    const e = this.entity;
    const target = new THREE.Vector3(e.position.x, e.position.y + 2.3, e.position.z);
    const from = this.player.eyePosition();
    this.player.yaw = Math.atan2(-(target.x - from.x), -(target.z - from.z));
    this.player.pitch = Math.atan2(target.y - from.y, Math.hypot(target.x - from.x, target.z - from.z));
    this.player.addShake(1.4);
    this._staring = true;
  }

  get stats() {
    return {
      found: this.fragments?.found ?? 0,
      total: this.difficulty?.fragments ?? 8,
      time: formatTime(this.elapsed),
      seed: this.seedText,
    };
  }

  /* ══════════════════════════════════════════════════════════════
     EVENTS
     ══════════════════════════════════════════════════════════════ */

  _onEntityEvent(kind, data) {
    switch (kind) {
      case 'reposition':
        // Only sting the player if it landed close — distant moves stay unheard.
        if (data && data.distance < 34) {
          this.audio.staticBurst(0.55);
          this.postfx.glitch(0.4);
        }
        break;
      case 'charge':
        this.audio.scream();
        this.postfx.glitch(1.2);
        this.player.addShake(0.8);
        this.hud.whisper('<i>It stopped pretending.</i>', 2.6);
        break;
      case 'retreat':
        this.audio.staticBurst(0.8);
        this.postfx.glitch(0.7);
        break;
      case 'escalate':
        this.audio.escalate(data.count);
        this.postfx.glitch(0.9);
        break;
    }
  }

  _tryPickup() {
    const { item } = this.fragments.targetFor(this.player);
    if (!item) return;
    this.fragments.take(item);
    const n = this.fragments.found;

    this.audio.pickup();
    this.postfx.glitch(0.8);
    this.player.addShake(0.35);
    this.hud.setFound(n);
    this.hud.fragmentLine(n - 1);
    this.entity.onFragmentTaken(n, this.player);

    // The world tightens with every page: fog closes, moon dims.
    const t = n / this.difficulty.fragments;
    this._fogTarget = lerp(0.020, 0.050, t);
    this.moon.intensity = lerp(MOON_BASE, MOON_BASE * 0.34, t);
    this.skyLight.intensity = lerp(SKY_BASE, SKY_BASE * 0.36, t);
    this.skyDome.setDim(t);

    if (n >= this.difficulty.fragments) this._openExit();
  }

  _openExit() {
    this.exit.live = true;
    this.audio.escalate(this.difficulty.fragments + 2);
    this.hud.whisper('The gate is awake. <i>Go.</i>', 6);
  }

  /* ══════════════════════════════════════════════════════════════
     LOOP
     ══════════════════════════════════════════════════════════════ */

  _loop() {
    requestAnimationFrame(this._loop);
    const dt = Math.min(0.05, this._clock.getDelta());

    if (this.phase === PHASE.PLAYING) {
      this._step(dt);
    } else if (this.phase === PHASE.ENDING) {
      this._stepEnding(dt);
    } else {
      // menus: keep the lens alive so the background is never a frozen frame
      this.postfx.update(dt, { staticLevel: 0.02, proximity: 0 });
    }

    this.audio.update(dt, {
      playing: this.phase === PHASE.PLAYING || this.phase === PHASE.ENDING,
      staticLevel: this.entity?.static ?? 0,
      proximity: this.entity?.proximity ?? 0,
      observed: this.entity?.observed ?? false,
      speed: this.player?.speed ?? 0,
      stamina: this.player?.stamina ?? 1,
      sprinting: this.player?.sprinting ?? false,
    });

    this.postfx.render();
    this.input.endFrame();
  }

  _step(dt) {
    this.elapsed += dt;
    this._worldTime = (this._worldTime ?? 0) + dt;
    windUniforms.uWindTime.value = this._worldTime;
    this.skyDome.update(dt, this.camera);
    this.grass.update(dt, this._worldTime);

    this.player.update(dt, this.input, this.difficulty);

    if (this.input.hit('use')) this._tryPickup();

    this.fragments.update(dt, this.player);
    const result = this.entity.update(dt, this.player, this.camera);

    this._updateExit(dt);
    this._updateAtmosphere(dt);
    this._updateHud();

    if (result !== 'alive') {
      this.hud.flashDamage();
      this.end(result);
      return;
    }

    if (this.exit.live && this.player.position.distanceTo(this.exit.position) < 5.2) {
      this.end('escaped');
    }
  }

  _stepEnding(dt) {
    // Keep the world simulating so the death shot has motion in it.
    this.player._applyCamera(dt);
    if (this._staring && this.entity) {
      this.entity._face(this.player, dt);
      this.entity._animate(dt, 3);
      this.entity.static = Math.min(1, this.entity.static + dt * 0.8);
    }
    this.postfx.update(dt, {
      staticLevel: Math.min(1, (this.entity?.static ?? 0) + 0.35),
      proximity: 1,
    });
  }

  _updateExit(dt) {
    const live = this.exit.live;
    for (const { lamp, bulb } of this.exitLamps) {
      const flicker = live ? 0.75 + Math.random() * 0.5 : 0;
      lamp.intensity = damp(lamp.intensity, 220 * flicker, 6, dt);
      bulb.material.emissiveIntensity = damp(bulb.material.emissiveIntensity, 3 * flicker, 6, dt);
    }
    this.exitBeam.material.opacity = damp(this.exitBeam.material.opacity, live ? 0.05 : 0, 3, dt);
  }

  _updateAtmosphere(dt) {
    if (this._fogTarget) {
      this.fog.density = damp(this.fog.density, this._fogTarget, 0.7, dt);
    }
    // Fog thickens further while it is looking at you — the world narrows.
    const squeeze = this.entity.static * 0.03 + this.entity.proximity * 0.012;
    this.fog.density = Math.max(this.fog.density, (this._fogTarget ?? 0.020) + squeeze);

    this.postfx.update(dt, {
      staticLevel: this.entity.static,
      proximity: this.entity.proximity,
    });

    if (this.entity.proximity > 0.55) this.player.addShake(dt * this.entity.proximity * 0.9);
  }

  _updateHud() {
    this.hud.setTime(this.elapsed);
    this.hud.setMeters(this.player.battery, this.player.stamina);

    // Contextual hint line, highest priority first.
    const { item, distance } = this.fragments.targetFor(this.player);
    let hint = '';

    if (item) {
      hint = `<b>[E]</b> TAKE FRAGMENT`;
      void distance;
    } else if (this.hud.lookFallback) {
      hint = 'POINTER LOCK BLOCKED — <b>CLICK AND DRAG</b> TO LOOK';
    } else if (this.exit.live) {
      const d = this.player.position.distanceTo(this.exit.position);
      hint = `THE GATE — ${Math.round(d)}M ${this._bearingTo(this.exit.position)}`;
    } else if (this.player.battery < 0.2) {
      hint = 'BATTERY FAILING — <b>[F]</b> TO SAVE IT';
    } else if (this.entity.state === STATE.CHARGE) {
      hint = '<b>RUN</b>';
    } else if (this.fragments.found === 0 && this.elapsed < 30) {
      hint = 'SWEEP YOUR LIGHT ACROSS THE TREES';
    }
    this.hud.setHint(hint);
  }

  /** Coarse compass arrow relative to where the player is facing. */
  _bearingTo(target) {
    const to = this._tmp.set(target.x - this.player.position.x, 0, target.z - this.player.position.z);
    const angle = Math.atan2(to.x, to.z);
    let rel = angle - (this.player.yaw + Math.PI);
    while (rel > Math.PI) rel -= Math.PI * 2;
    while (rel < -Math.PI) rel += Math.PI * 2;
    const deg = (rel * 180) / Math.PI;
    if (Math.abs(deg) < 25) return '▲ AHEAD';
    if (Math.abs(deg) > 155) return '▼ BEHIND';
    return deg < 0 ? '◀ LEFT' : '▶ RIGHT';
  }

  /* ══════════════════════════════════════════════════════════════
     PLUMBING
     ══════════════════════════════════════════════════════════════ */

  applySetting(key, value) {
    switch (key) {
      case 'fov':
        this.camera.fov = value;
        this.camera.updateProjectionMatrix();
        break;
      case 'volume':
        this.audio.setVolume(value);
        break;
      case 'renderScale':
        this._onResize();
        break;
    }
  }

  _onResize() {
    const scale = clamp01(this.settings.renderScale || 1);
    const w = Math.max(320, Math.floor(innerWidth * scale));
    const h = Math.max(240, Math.floor(innerHeight * scale));

    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(Math.min(devicePixelRatio, scale < 0.9 ? 1 : 2));
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.postfx?.setSize(w, h);
  }

  dispose(full = true) {
    this._staring = false;
    this._fogTarget = 0.020;
    this.fog.density = 0.020;
    this.moon.intensity = MOON_BASE;
    this.skyLight.intensity = SKY_BASE;

    for (const part of [this.fragments, this.entity, this.props, this.forest, this.grass, this.skyDome]) part?.dispose?.();
    if (this.terrain) { this.scene.remove(this.terrain.mesh); this.terrain.dispose(); }
    for (const name of ['forest', 'props', 'fragments', 'entity']) {
      const obj = this.scene.getObjectByName(name);
      if (obj) this.scene.remove(obj);
    }
    if (this.exit) this.scene.remove(this.exit.group);
    if (this.player) {
      this.player.rig?.removeFromParent();
      this.player.body?.removeFromParent();
    }
    for (const name of ['sky', 'grass', 'motes']) {
      const obj = this.scene.getObjectByName(name);
      if (obj) this.scene.remove(obj);
    }
    this.terrain = this.forest = this.props = this.fragments = this.entity = this.player = null;
    this.grass = this.skyDome = null;
    this.exit = null;

    if (full) {
      removeEventListener('resize', this._onResize);
      this.postfx.dispose();
      this.renderer.dispose();
    }
  }
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
