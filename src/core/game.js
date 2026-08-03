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
import { Entity, STATE, ARCHETYPE } from '../entities/entity.js';
import { Player } from '../entities/player.js';
import { PostFX } from '../render/postfx.js';
import { makeRng, hashSeed, clamp01, damp, lerp } from './rng.js';
import { difficultyOf } from './settings.js';
import { FIRST_NOTE_HINT } from '../story.js';
import { rustTexture } from '../world/textures.js';
import { Sky } from '../world/sky.js';
import { DayNight, DAY_LENGTH } from '../world/daynight.js';
import { Resources } from '../world/resources.js';
import { Placeables, FIRE_RADIUS } from '../world/placeables.js';
import { Survival } from './survival.js';
import { Inventory, ITEMS } from './items.js';
import { Pack } from '../ui/pack.js';
import { Grass } from '../world/grass.js';
import { windUniforms } from '../world/wind.js';
import { Buildings } from '../world/buildings.js';
import { Notes } from '../entities/notes.js';

export const PHASE = {
  READING: 'reading',
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
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  _initScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(this.settings.fov, innerWidth / innerHeight, 0.08, 400);
    this.scene.add(this.camera);

    // Lighting, fog and sky background are all owned by the day/night cycle.
    this.daynight = new DayNight(this.scene, 0.30);
    this.fog = this.daynight.fog;

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
    this.resources = new Resources(this.terrain, this.forest, seed, this.scene);
    this.placeables = new Placeables(this.terrain, this.scene);
    this.props = new Props(this.terrain, this.forest, rng, this.scene);
    // Buildings register their colliders and anchors into props, so they must
    // exist before fragments choose where to hang.
    this.buildings = new Buildings(this.terrain, this.forest, this.props, rng, this.scene);
    this.fragments = new Fragments(
      this.terrain, this.forest, this.props, rng, this.scene, this.difficulty.fragments
    );

    this.notes = new Notes(this.terrain, this.forest, this.props, this.buildings, rng, this.scene);

    this.player = new Player(this.camera, this.terrain, this.forest, this.props, this.settings, this.scene);
    this.player.onFootstep = (i, running) => this.audio.footstep(i, running);
    this.player.onLightToggle = (on) => this.audio.flashlight(on);

    this._buildHorde(rng);

    this.survival = new Survival();
    this.inventory = new Inventory(20);
    this._crafted = 0;
    this.pack = new Pack(this.inventory, {
      onCraft: (recipe) => {
        if (this.inventory.craft(recipe)) {
          this._crafted++;
          this.audio.ui('select');
          this.hud.toast(`CRAFTED ${ITEMS[Object.keys(recipe.out)[0]].name}`);
          this.pack.render();
        }
      },
      onUse: (id) => this.consume(id),
      nearFire: () => Boolean(
        this.placeables?.fireAt(this.player.position.x, this.player.position.z)
      ),
    });
    this.daynight.t = 0.30;      // start mid-morning: one full day to prepare
    this.daynight.day = 1;
    this.daysSurvived = 0;

    this._buildExit(rng);

    const start = this.forest.findOpenSpot(rng, { minRadius: 0, maxRadius: 6, clearance: 2.6 });
    this.player.spawn(start.x, start.z, rng() * Math.PI * 2);
  }

  /**
   * The horde. One or two watchers that freeze under your gaze, plus a set of
   * stalkers that wake one at a time as you collect and simply walk at you.
   *
   * `this.entity` stays pointing at the primary watcher — the HUD, the death
   * stare and the fragment escalation all still read from it.
   */
  _buildHorde(rng) {
    const d = this.difficulty;
    this.entities = [];

    for (let i = 0; i < (d.watchers ?? 1); i++) {
      const e = new Entity(this.terrain, this.forest, this.props, d, rng, this.scene, {
        archetype: ARCHETYPE.WATCHER,
        activateAt: i === 0 ? 0 : 3,
        scale: 1 + i * 0.06,
      });
      this.entities.push(e);
    }

    for (let i = 0; i < (d.stalkers ?? 0); i++) {
      const e = new Entity(this.terrain, this.forest, this.props, d, rng, this.scene, {
        archetype: ARCHETYPE.STALKER,
        // Chasers wake one at a time, so the run escalates instead of
        // dumping four of them on you at once.
        activateAt: (d.stalkerFrom ?? 2) + i * 2,
        chaseSpeed: (d.chaseSpeed ?? 3.3) * (0.9 + rng() * 0.25),
        scale: 0.94 + rng() * 0.2,
      });
      this.entities.push(e);
    }

    for (const e of this.entities) e.onEvent = (kind, data) => this._onEntityEvent(kind, data, e);
    this.entity = this.entities[0];
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
    // Nothing is awake at the start: threats are a night event now.
    for (const e of this.entities) { e.state = STATE.DORMANT; e.group.visible = false; }
    this._threatTimer = 240;
    this.survival.reset();
    this.inventory.clear();
    this.postfx.setFade(1);
    this.postfx.fadeTo(0);
    this.hud.show();
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
    this.pack?.close();
    this.input.unlock();
    this.hud.hide();
    this.audio.suspend();
    this.onPaused?.();
  }

  resume() {
    if (this.phase !== PHASE.PAUSED) return;
    this.phase = PHASE.PLAYING;
    this.audio.resume();
    this.hud.show();
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

  /** @param {string} outcome 'caught' | 'consumed' | 'exposure' | 'thirst' | 'starvation' | 'injury' */
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

  /**
   * Open a note. The world stops while you read — but the run clock does not,
   * and neither does the sense that you have just chosen to stand still in a
   * forest where standing still is how people here died.
   */
  _readNote(item) {
    const data = this.notes.take(item);
    if (!data) return;

    this.phase = PHASE.READING;
    this.input.unlock();
    this.audio.pickup();
    this.postfx.glitch(0.3);

    if (this.notes.count === 1) this.hud.whisper(FIRST_NOTE_HINT, 5);
    this.hud.setNotes(this.notes.count, this.notes.total);
    this.hud.showNote(data, this.notes.count, this.notes.total);
  }

  closeNote() {
    if (this.phase !== PHASE.READING) return;
    this.hud.hideNote();
    this.phase = PHASE.PLAYING;
    this.input.lock();
    this._clock.getDelta();
  }

  /** Snap the camera onto it. Nobody survives the reverse shot. */
  _deathStare() {
    const e = this._killer ?? this.entity;
    const target = new THREE.Vector3(e.position.x, e.position.y + 2.3, e.position.z);
    const from = this.player.eyePosition();
    this.player.yaw = Math.atan2(-(target.x - from.x), -(target.z - from.z));
    this.player.pitch = Math.atan2(target.y - from.y, Math.hypot(target.x - from.x, target.z - from.z));
    this.player.addShake(1.4);
    this._staring = true;
  }

  get stats() {
    return {
      days: this.daynight?.day ?? 1,
      time: formatTime(this.elapsed),
      seed: this.seedText,
      crafted: this._crafted ?? 0,
      cause: this.survival?.causeOfDeath ?? null,
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
    for (const e of this.entities) {
      if (e.state === STATE.DORMANT) {
        if (n >= e.activateAt) {
          e.begin(this.player);
          if (e.archetype === ARCHETYPE.STALKER) {
            this.audio.creature(0.85);
            this.postfx.glitch(1.1);
            this.hud.whisper('<i>Something else just started moving.</i>', 4);
          }
        }
      } else {
        e.onFragmentTaken(n, this.player);
      }
    }

    // The world tightens with every page: fog closes, moon dims.
    const t = n / this.difficulty.fragments;
    this._fogTarget = lerp(0.020, 0.050, t);
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
    } else if (this.phase === PHASE.READING) {
      // The forest keeps breathing behind the page, but nothing moves.
      this._worldTime = (this._worldTime ?? 0) + dt;
      windUniforms.uWindTime.value = this._worldTime;
      this.skyDome.update(dt, this.camera);
      this.grass.update(dt, this._worldTime);
      this.postfx.update(dt, { staticLevel: this._hordeStatic ?? 0, proximity: this._hordeProximity ?? 0 });
    } else if (this.phase === PHASE.ENDING) {
      this._stepEnding(dt);
    } else {
      // menus: keep the lens alive so the background is never a frozen frame
      this.postfx.update(dt, { staticLevel: 0.02, proximity: 0 });
    }

    this.audio.update(dt, {
      playing: this.phase === PHASE.PLAYING || this.phase === PHASE.ENDING || this.phase === PHASE.READING,
      staticLevel: this._hordeStatic ?? 0,
      proximity: this._hordeProximity ?? 0,
      observed: this.entities?.some((e) => e.observed) ?? false,
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

    // ── time of day drives everything else
    const newDay = this.daynight.update(dt);
    if (newDay) this._onNewDay();

    this.skyDome.update(dt, this.camera);
    this.skyDome.setStarOpacity?.(this.daynight.state.stars);
    this.grass.update(dt, this._worldTime);
    this.resources.update(dt);
    this.placeables.update(dt);

    this.player.update(dt, this.input, this.difficulty);

    // ── pack and placement
    if (this.input.hit('pack')) {
      this.pack.toggle();
      this.audio.ui('select');
    }
    if (this.input.hit('place')) this._placeHeld();

    // ── interaction
    if (this.input.hit('use')) this._interact();

    // ── survival meters
    const fire = this.placeables.fireAt(this.player.position.x, this.player.position.z);
    const shelter = this.placeables.shelterAt(this.player.position.x, this.player.position.z)
      || this.buildings.roomAt(this.player.position.x, this.player.position.z);

    const warnings = this.survival.update(dt, {
      daylight: this.daynight.daylight,
      sprinting: this.player.sprinting,
      moving: this.player.speed > 0.4,
      nearFire: Boolean(fire),
      sheltered: Boolean(shelter),
    });
    for (const w of warnings) this.hud.toast(w, true);

    // The player's own stamina is now owned by Survival, not Player.
    this.player.stamina = this.survival.stamina;

    if (this.survival.dead) {
      this.end(this.survival.causeOfDeath);
      return;
    }

    // ── the horde: rare, and only at night
    this._updateThreat(dt);

    this._updateAtmosphere(dt);
    this._updateHud(fire, shelter);
  }

  /** Fires when the clock rolls past midnight. */
  _onNewDay() {
    this.daysSurvived = this.daynight.day - 1;
    this.hud.toast(`DAY ${this.daynight.day} — you are still here`, false);
    this.audio.escalate(Math.min(8, this.daysSurvived + 2));
  }

  /**
   * Horror is now a rare night event rather than the core loop. A stalker is
   * eligible only in deep night, only away from a lit fire, and only after a
   * cooldown — so most nights are about cold and dark, and the ones that are
   * not are memorable.
   */
  _updateThreat(dt) {
    this._threatTimer = (this._threatTimer ?? 90) - dt;
    const deepNight = this.daynight.isDeepNight;
    const safe = Boolean(this.placeables.fireAt(this.player.position.x, this.player.position.z));

    // wake something
    if (deepNight && !safe && this._threatTimer <= 0) {
      const sleeping = this.entities.filter((e) => e.state === STATE.DORMANT);
      if (sleeping.length) {
        const e = sleeping[Math.floor(Math.random() * sleeping.length)];
        e.begin(this.player);
        this.audio.creature(0.9);
        this.postfx.glitch(1.2);
        this.hud.toast('SOMETHING IS AWAKE', true);
        this.hud.whisper('<i>Something out past the trees has noticed the dark too.</i>', 5);
      }
      this._threatTimer = 150 + Math.random() * 180;
    }

    // send them back to sleep at dawn, or when you reach a fire
    if (!deepNight || safe) {
      for (const e of this.entities) {
        if (e.state !== STATE.DORMANT
            && e.position.distanceTo(this.player.position) > 34) {
          e.state = STATE.DORMANT;
          e.group.visible = false;
        }
      }
    }

    let result = 'alive';
    let worstStatic = 0, worstProx = 0;
    for (const e of this.entities) {
      if (e.state === STATE.DORMANT) continue;
      e.group.visible = true;
      const r = e.update(dt, this.player, this.camera);
      if (r !== 'alive') { result = r; this._killer = e; }
      if (e.static > worstStatic) worstStatic = e.static;
      if (e.proximity > worstProx) worstProx = e.proximity;
    }
    this._hordeStatic = worstStatic;
    this._hordeProximity = worstProx;
    this._chaseNear = this.entities.some(
      (e) => e.state !== STATE.DORMANT
        && e.position.distanceTo(this.player.position) < 16
    );

    if (result !== 'alive') {
      this.hud.flashDamage();
      this.end(result === 'consumed' ? 'consumed' : 'caught');
    }
  }

  /* ── interaction: harvest, place, refuel ────────────────────── */

  _interact() {
    const p = this.player;

    // a placeable in hand, aimed at open ground, takes priority
    const node = this.resources.targetFor(p);
    const built = this.placeables.targetFor(p);

    if (built && !node) {
      if (built.kind === 'campfire') {
        if (this.inventory.count('wood') > 0 || this.inventory.count('branch') > 0) {
          const used = this.inventory.count('wood') > 0 ? 'wood' : 'branch';
          this.inventory.remove(used, 1);
          this.placeables.refuel(built, used === 'wood' ? 0.45 : 0.2);
          this.hud.toast(`FED THE FIRE (-1 ${ITEMS[used].name})`);
          this.audio.footstep(0.4, false);
        } else {
          this.hud.toast('NO FUEL TO BURN', true);
        }
        return;
      }
      if (built.kind === 'shelter') { this._sleep(); return; }
    }

    if (node) { this._harvest(node); return; }
  }

  _harvest(node) {
    const { drops, done, blocked } = this.resources.harvest(node, this.inventory);
    if (blocked) {
      this.hud.toast(blocked, true);
      return;
    }
    this.audio.footstep(0.85, false);
    this.player.addShake(0.12);

    if (!drops) return;
    const parts = [];
    for (const [id, n] of Object.entries(drops)) {
      const added = this.inventory.add(id, n);
      if (added > 0) parts.push(`+${added} ${ITEMS[id].name}`);
      else parts.push('PACK FULL');
    }
    if (parts.length) this.hud.toast(parts.join('  '));
    this.pack?.render();
    if (done) this.postfx.glitch(0.15);
  }

  /** Q places the first placeable in the pack — fire before shelter. */
  _placeHeld() {
    for (const id of ['campfire', 'shelter']) {
      if (this.inventory.count(id) > 0) { this.placeItem(id); return; }
    }
    this.hud.toast('NOTHING TO PLACE — CRAFT A CAMPFIRE', true);
  }

  /** Place a craftable from the inventory at the player's feet. */
  placeItem(id) {
    const def = ITEMS[id];
    if (!def?.place || this.inventory.count(id) < 1) return false;
    const f = this.player.forward();
    const x = this.player.position.x + f.x * 2.0;
    const z = this.player.position.z + f.z * 2.0;

    if (def.place === 'campfire') this.placeables.placeFire(x, z);
    else this.placeables.placeShelter(x, z, this.player.yaw);

    this.inventory.remove(id, 1);
    this.hud.toast(`PLACED ${def.name}`);
    this.pack?.render();
    return true;
  }

  /** Sleep in a shelter: skip to dawn at the cost of hunger and thirst. */
  _sleep() {
    if (!this.daynight.isNight) {
      this.hud.toast('NOT TIRED YET — SLEEP AFTER DARK', true);
      return;
    }
    const hours = this.daynight.hoursToDawn;
    const seconds = (hours / 24) * DAY_LENGTH;
    this.daynight.t = 0.26;
    this.daynight.day += this.daynight.t < 0.26 ? 1 : 0;
    this.survival.hunger = Math.max(0, this.survival.hunger - seconds * (1 / 900));
    this.survival.thirst = Math.max(0, this.survival.thirst - seconds * (1 / 540));
    this.survival.stamina = 1;
    this.survival.heal(0.25);
    this.daynight.apply();
    this.postfx.setFade(1);
    this.postfx.fadeTo(0);
    this.hud.toast('SLEPT UNTIL DAWN');
    this._onNewDay();
  }

  consume(id) {
    const def = ITEMS[id];
    if (!def || def.tag !== 'food' || this.inventory.count(id) < 1) return;
    this.inventory.remove(id, 1);
    if (def.food) this.survival.eat(def.food);
    if (def.thirst) this.survival.drink(def.thirst);
    if (def.health) def.health > 0 ? this.survival.heal(def.health) : this.survival.hurt(-def.health);
    this.hud.toast(`ATE ${def.name}`);
    this.pack?.render();
  }

  _stepEnding(dt) {
    // Keep the world simulating so the death shot has motion in it.
    this.player._applyCamera(dt);
    const killer = this._killer ?? this.entity;
    if (this._staring && killer) {
      killer._face(this.player, dt);
      killer._animate(dt, 3);
      killer.static = Math.min(1, killer.static + dt * 0.8);
    }
    this.postfx.update(dt, {
      staticLevel: Math.min(1, (killer?.static ?? 0) + 0.35),
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
    const squeeze = this._hordeStatic * 0.03 + this._hordeProximity * 0.012;
    this.fog.density = Math.max(this.fog.density, (this._fogTarget ?? 0.020) + squeeze);

    this.postfx.update(dt, {
      staticLevel: this._hordeStatic,
      proximity: this._hordeProximity,
      daylight: this.daynight.daylight,
    });

    if (this._hordeProximity > 0.55) this.player.addShake(dt * this._hordeProximity * 0.9);
  }

  _updateHud(fire, shelter) {
    const dn = this.daynight;
    this.hud.setClock(dn.day, dn.clockText, dn.state.name);
    this.hud.setVitals(this.survival);

    // held tool + status
    const axe = this.inventory.tool('axe') ? 'AXE' : null;
    const pick = this.inventory.tool('pick') ? 'PICK' : null;
    const tools = [axe, pick].filter(Boolean).join(' · ');
    const status = fire ? '<b>BY THE FIRE</b>' : shelter ? '<b>SHELTERED</b>' : '';
    this.hud.setHeld([tools && `CARRYING ${tools}`, status].filter(Boolean).join('  —  '));

    // ── the centre prompt
    const node = this.resources.targetFor(this.player);
    const built = this.placeables.targetFor(this.player);

    if (node) {
      const d = this.resources.describe(node, this.inventory);
      this.hud.setPrompt({
        label: d.label,
        key: d.needs ? `NEEDS A ${d.needs.toUpperCase()}` : '<b>[E]</b> HARVEST',
        progress: d.progress,
        blocked: Boolean(d.needs),
      });
    } else if (built?.kind === 'campfire') {
      this.hud.setPrompt({
        label: built.lit ? `CAMPFIRE — FUEL ${Math.round(built.fuel * 100)}%` : 'CAMPFIRE — OUT',
        key: '<b>[E]</b> ADD FUEL',
        progress: built.fuel,
        blocked: false,
      });
    } else if (built?.kind === 'shelter') {
      this.hud.setPrompt({
        label: 'LEAN-TO',
        key: dn.isNight ? '<b>[E]</b> SLEEP UNTIL DAWN' : 'SLEEP AFTER DARK',
        progress: 1,
        blocked: !dn.isNight,
      });
    } else {
      this.hud.setPrompt(null);
    }

    // ── the hint line: whatever is most urgent
    let hint = '';
    if (this.hud.lookFallback) {
      hint = 'POINTER LOCK BLOCKED — <b>CLICK AND DRAG</b> TO LOOK';
    } else if (this._chaseNear) {
      hint = '<b>RUN</b>';
    } else if (this.survival.mostUrgent) {
      hint = `${this.survival.mostUrgent} CRITICAL`;
    } else if (dn.isNight && !fire) {
      hint = `DARK — ${dn.hoursToDawn.toFixed(1)}H TO DAWN`;
    } else if (this.inventory.used === 0) {
      hint = '<b>[E]</b> AT TREES AND ROCKS · <b>[TAB]</b> FOR PACK';
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
    // Fog and lighting live on the day/night cycle now and survive a rebuild;
    // resetting them here would fight the clock.

    for (const e of this.entities ?? []) e.dispose?.();
    for (const part of [this.fragments, this.notes, this.props, this.forest, this.grass, this.skyDome, this.buildings, this.resources, this.placeables]) part?.dispose?.();
    if (this.terrain) { this.scene.remove(this.terrain.mesh); this.terrain.dispose(); }
    for (const name of ['forest', 'props', 'fragments', 'entity', 'buildings']) {
      const obj = this.scene.getObjectByName(name);
      if (obj) this.scene.remove(obj);
    }
    if (this.exit) this.scene.remove(this.exit.group);
    if (this.player) {
      this.player.rig?.removeFromParent();
    }
    for (const name of ['sky', 'grass', 'motes', 'resources', 'placeables']) {
      const obj = this.scene.getObjectByName(name);
      if (obj) this.scene.remove(obj);
    }
    this.terrain = this.forest = this.props = this.fragments = this.entity = this.player = null;
    this.grass = this.skyDome = this.buildings = this.notes = this._killer = null;
    this.resources = this.placeables = null;
    this.entities = [];
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
