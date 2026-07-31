/**
 * First-person player. Camera-as-body: there is no visible avatar, only a
 * height, a radius, a breath meter and a torch that is running out.
 */

import * as THREE from 'three';
import { clamp, clamp01, damp } from '../core/rng.js';

const EYE_STAND = 1.68;
const EYE_CROUCH = 1.02;
const RADIUS = 0.42;

/**
 * How far from the origin the player may walk. Anything the player must be
 * able to reach — notably the exit gate in game.js — has to sit inside this.
 */
export const PLAYER_BOUND = 118;

const SPEED_WALK = 3.15;
const SPEED_SPRINT = 5.75;
const SPEED_CROUCH = 1.45;

// Torch brightness, in candela (three.js physical light units).
const TORCH_CORE = 460;
const TORCH_SPILL = 120;
const TORCH_HELD = 7;

export class Player {
  constructor(camera, terrain, forest, props, settings, scene) {
    this.camera = camera;
    this.scene = scene;
    this.terrain = terrain;
    this.forest = forest;
    this.props = props;
    this.settings = settings;

    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;

    this.eye = EYE_STAND;
    this.crouching = false;
    this.sprinting = false;
    this.stamina = 1;
    this.battery = 1;
    this.lightOn = true;

    this.walkDistance = 0;
    this._stepAt = 0;
    this.speed = 0;
    this.bob = 0;
    this._shake = 0;
    this._lightFlicker = 1;
    this._roll = 0;
    this._camPos = new THREE.Vector3();

    /** @type {(intensity:number, running:boolean)=>void} */
    this.onFootstep = null;

    this._buildLights();
  }

  _buildLights() {
    // Main torch cone. Two lights: a tight hot core and a wide spill, which
    // reads much more like a real cheap flashlight than a single cone.
    //
    // Intensities are in candela — three.js has used physical light units since
    // r155, so punctual lights need roughly 4π times the old pre-r155 numbers.
    // See TORCH_CORE / TORCH_SPILL below if you are retuning the look.
    this.torch = new THREE.SpotLight(0xffeccc, TORCH_CORE, 62, THREE.MathUtils.degToRad(21), 0.55, 1.6);
    this.torchWide = new THREE.SpotLight(0xffe4c0, TORCH_SPILL, 30, THREE.MathUtils.degToRad(46), 0.9, 1.5);
    this.torch.castShadow = true;
    this.torch.shadow.mapSize.set(1024, 1024);
    this.torch.shadow.camera.near = 0.4;
    this.torch.shadow.camera.far = 60;
    this.torch.shadow.bias = -0.0016;
    this.torch.shadow.normalBias = 0.03;

    // The torch hangs off a rig at the player's head rather than off the
    // camera, so in third person the beam still comes out of the body instead
    // of out of a point floating behind it.
    this.rig = new THREE.Object3D();
    this.rig.rotation.order = 'YXZ';
    this.scene.add(this.rig);

    this.torch.position.set(0.16, -0.14, 0.1);
    this.torchWide.position.copy(this.torch.position);
    this.torch.target.position.set(0.16, -0.14, -1);
    this.torchWide.target.position.copy(this.torch.target.position);
    this.rig.add(this.torch, this.torch.target, this.torchWide, this.torchWide.target);

    // A whisper of bounce so you are never rendering pure black pixels.
    this.held = new THREE.PointLight(0xffd9a8, TORCH_HELD, 5, 2);
    this.held.position.set(0.2, -0.3, 0);
    this.rig.add(this.held);

  }

  spawn(x, z, yaw = 0) {
    this.position.set(x, this.terrain.heightAt(x, z), z);
    this.yaw = yaw;
    this.pitch = 0;
    this.stamina = 1;
    this.battery = 1;
    this.lightOn = true;
    this.velocity.set(0, 0, 0);
    this.walkDistance = 0;
    this._applyCamera(0);
  }

  /** Where the eyes are, in world space. Used for line-of-sight tests. */
  eyePosition(out = new THREE.Vector3()) {
    return out.set(this.position.x, this.position.y + this.eye, this.position.z);
  }

  forward(out = new THREE.Vector3()) {
    return out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }

  /** Nudge the camera — used by the entity's proximity and by pickups. */
  addShake(amount) {
    this._shake = Math.min(1.4, this._shake + amount);
  }

  update(dt, input, difficulty) {
    this._look(input);
    this._move(dt, input);
    this._torch(dt, input, difficulty);
    this._applyCamera(dt);
  }

  _look(input) {
    const { dx, dy } = input.takeMouse();
    const s = this.settings.sensitivity * 0.0021;
    this.yaw -= dx * s;
    this.pitch -= dy * s * (this.settings.invertY ? -1 : 1);
    const lim = Math.PI / 2 - 0.03;
    this.pitch = clamp(this.pitch, -lim, lim);
    // keep yaw bounded so it never loses float precision on long runs
    if (this.yaw > Math.PI) this.yaw -= Math.PI * 2;
    if (this.yaw < -Math.PI) this.yaw += Math.PI * 2;
  }

  _move(dt, input) {
    let ix = 0, iz = 0;
    if (input.down('forward')) iz -= 1;
    if (input.down('back')) iz += 1;
    if (input.down('left')) ix -= 1;
    if (input.down('right')) ix += 1;

    const moving = ix !== 0 || iz !== 0;
    if (moving) {
      const len = Math.hypot(ix, iz);
      ix /= len; iz /= len;
    }

    this.crouching = input.down('crouch');
    const wantSprint = input.down('sprint') && moving && !this.crouching && iz < 0.1;
    this.sprinting = wantSprint && this.stamina > 0.02;

    // Breath: sprinting burns it fast, standing still refills it fastest.
    if (this.sprinting) {
      this.stamina = clamp01(this.stamina - dt * 0.24);
    } else {
      const rate = moving ? 0.11 : 0.2;
      this.stamina = clamp01(this.stamina + dt * rate);
    }

    let target = this.crouching ? SPEED_CROUCH : this.sprinting ? SPEED_SPRINT : SPEED_WALK;
    if (iz > 0) target *= 0.72;             // backpedalling is slower
    if (this.stamina < 0.14 && !this.crouching) target *= 0.72 + this.stamina; // winded

    // World-space desired velocity, built from the same basis as forward():
    //   forward = (-sin(yaw), 0, -cos(yaw))    right = (cos(yaw), 0, -sin(yaw))
    // iz is -1 for W, so the forward term carries iz's sign directly.
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    const wx = (ix * cos + iz * sin) * target;
    const wz = (-ix * sin + iz * cos) * target;

    const accel = moving ? 13 : 17;
    this.velocity.x = damp(this.velocity.x, wx, accel, dt);
    this.velocity.z = damp(this.velocity.z, wz, accel, dt);

    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;

    this.forest.resolveCollision(this.position, RADIUS);
    this.props.resolveCollision(this.position, RADIUS);

    const bound = PLAYER_BOUND;
    this.position.x = clamp(this.position.x, -bound, bound);
    this.position.z = clamp(this.position.z, -bound, bound);

    // stick to the ground
    this.position.y = damp(this.position.y, this.terrain.heightAt(this.position.x, this.position.z), 16, dt);

    this.speed = Math.hypot(this.velocity.x, this.velocity.z);
    this.walkDistance += this.speed * dt;

    // footsteps by distance travelled, not by time — no moonwalk audio
    const stride = this.crouching ? 1.35 : this.sprinting ? 1.85 : 1.55;
    if (this.speed > 0.4 && this.walkDistance - this._stepAt > stride) {
      this._stepAt = this.walkDistance;
      this.onFootstep?.(this.crouching ? 0.32 : this.sprinting ? 1 : 0.62, this.sprinting);
    }

    this.eye = damp(this.eye, this.crouching ? EYE_CROUCH : EYE_STAND, 11, dt);
  }

  _torch(dt, input, difficulty) {
    if (input.hit('light')) {
      const was = this.lightOn;
      this.lightOn = !this.lightOn && this.battery > 0.001;
      // Fires even when a dead battery refuses to light: you still hear the
      // switch, which is how you learn the battery is gone.
      if (was !== this.lightOn || !this.lightOn) this.onLightToggle?.(this.lightOn);
    }

    if (this.lightOn && this.battery > 0) {
      this.battery = clamp01(this.battery - dt * difficulty.batteryDrain);
      if (this.battery <= 0) this.lightOn = false;
    }

    // Dying batteries stutter; a healthy torch only breathes.
    const low = 1 - clamp01(this.battery / 0.28);
    const t = performance.now() * 0.001;
    let flicker = 1 + Math.sin(t * 7.3) * 0.018 + Math.sin(t * 23.7) * 0.01;
    if (low > 0) {
      const stutter = Math.sin(t * 31) * Math.sin(t * 13.7) * Math.sin(t * 5.1);
      flicker *= 1 - low * 0.55 + stutter * low * 0.5;
      if (Math.random() < low * dt * 6) flicker *= 0.12; // dropout
    }
    this._lightFlicker = damp(this._lightFlicker, Math.max(0.05, flicker), 22, dt);

    const on = this.lightOn ? 1 : 0;
    const charge = 0.35 + this.battery * 0.65;
    this.torch.intensity = damp(this.torch.intensity, on * TORCH_CORE * charge * this._lightFlicker, 18, dt);
    this.torchWide.intensity = damp(this.torchWide.intensity, on * TORCH_SPILL * charge * this._lightFlicker, 18, dt);
    this.held.intensity = damp(this.held.intensity, on * TORCH_HELD * charge, 12, dt);
    this.torch.distance = 40 + this.battery * 24;
  }

  _applyCamera(dt) {
    // head bob scales with speed; crouching halves it
    const bobRate = this.sprinting ? 11.5 : 8.4;
    this.bob += this.speed * dt * bobRate * 0.34;
    const amp = (this.crouching ? 0.4 : 1) * Math.min(1, this.speed / SPEED_WALK);
    const useShake = this.settings.shake ? 1 : 0.25;

    const bobY = Math.sin(this.bob * 2) * 0.045 * amp * useShake;
    const bobX = Math.cos(this.bob) * 0.035 * amp * useShake;
    this._roll = damp(this._roll, -this.velocity.x * 0.004 * Math.cos(this.yaw) + Math.sin(this.bob) * 0.006 * amp, 8, dt);

    this._shake = Math.max(0, this._shake - dt * 2.2);
    const sh = this._shake * this._shake * useShake;
    const sx = (Math.random() - 0.5) * sh * 0.09;
    const sy = (Math.random() - 0.5) * sh * 0.09;

    // ── the eye: where the player actually looks from, in every mode
    this._camPos.set(
      this.position.x + bobX * Math.cos(this.yaw),
      this.position.y + this.eye + bobY,
      this.position.z - bobX * Math.sin(this.yaw)
    );

    // The torch rig always sits at the eye and aims along the look direction,
    // independent of where the camera ends up.
    this.rig.position.copy(this._camPos);
    this.rig.rotation.set(this.pitch, this.yaw, 0);

    this.camera.position.copy(this._camPos);

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.set(this.pitch + sy, this.yaw + sx, this._roll);

  }

  get radius() { return RADIUS; }
}
