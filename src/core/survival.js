/**
 * Survival state: health, hunger, thirst, warmth, stamina.
 *
 * Design rules, borrowed from the games that get this right:
 *
 *  1. Meters do not kill you. They drain *health*, and health is what kills.
 *     A player at zero hunger has minutes to fix it, not instant death — the
 *     failure state is a spiral you can still escape, which is what makes it
 *     tense rather than unfair (The Long Dark's core insight).
 *  2. Thirst is faster than hunger, which is faster than starving. Real
 *     priority ordering means the player has to triage.
 *  3. Warmth is the one the world attacks. Night and rain drain it, fire and
 *     shelter restore it, so the day/night cycle has teeth.
 *  4. Everything is per-second and tuned in one table, so the whole difficulty
 *     of the survival layer is one object you can read at a glance.
 */

import { clamp, clamp01 } from './rng.js';

export const RATES = {
  // per second, at 1.0 multiplier
  hunger: 1 / 900,      // ~15 min from full to empty
  thirst: 1 / 540,      // ~9 min — always the first thing to bite
  warmthNight: 1 / 300, // exposed at night: ~5 min to freezing
  warmthDay: -1 / 240,  // daylight actively rewarms you

  // health drain per second while a meter is empty
  starving: 1.6 / 100,
  dehydrated: 2.6 / 100,
  freezing: 3.4 / 100,

  // health regen per second when everything is satisfied
  regen: 0.9 / 100,

  staminaDrain: 0.24,
  staminaRegenMoving: 0.11,
  staminaRegenStill: 0.2,
};

export class Survival {
  constructor() {
    this.reset();
  }

  reset() {
    this.health = 1;
    this.hunger = 1;
    this.thirst = 1;
    this.warmth = 1;
    this.stamina = 1;
    this.nearFire = false;
    this.sheltered = false;
    this.dead = false;
    this.causeOfDeath = null;
    this._hurtPulse = 0;
    this._warned = new Set();
  }

  /**
   * @param {number} dt
   * @param {object} ctx
   * @param {number} ctx.daylight 0..1
   * @param {boolean} ctx.sprinting
   * @param {boolean} ctx.moving
   * @param {boolean} ctx.nearFire
   * @param {boolean} ctx.sheltered
   * @returns {string[]} warnings raised this frame, for the HUD to surface
   */
  update(dt, ctx) {
    if (this.dead) return [];
    const warnings = [];

    // ── consumption
    this.hunger = clamp01(this.hunger - RATES.hunger * dt);
    this.thirst = clamp01(this.thirst - RATES.thirst * dt);

    // ── warmth: the world's lever. Fire beats everything, then shelter,
    //    then daylight; deep night with none of them is the killer.
    let warmthDelta;
    if (ctx.nearFire) {
      warmthDelta = 1 / 90;                       // fire rewarms fast
    } else if (ctx.sheltered) {
      warmthDelta = -RATES.warmthNight * 0.25 + ctx.daylight * (1 / 300);
    } else {
      warmthDelta = ctx.daylight > 0.35
        ? -RATES.warmthDay * ctx.daylight
        : -RATES.warmthNight * (1 - ctx.daylight);
    }
    // Sprinting keeps you warm; standing still in the cold does not.
    if (ctx.sprinting) warmthDelta += 1 / 900;
    this.warmth = clamp01(this.warmth + warmthDelta * dt);

    this.nearFire = ctx.nearFire;
    this.sheltered = ctx.sheltered;

    // ── stamina
    if (ctx.sprinting) {
      this.stamina = clamp01(this.stamina - RATES.staminaDrain * dt);
    } else {
      const rate = ctx.moving ? RATES.staminaRegenMoving : RATES.staminaRegenStill;
      // You cannot get your breath back while starving or freezing.
      const penalty = (this.hunger < 0.15 ? 0.5 : 1) * (this.warmth < 0.2 ? 0.5 : 1);
      this.stamina = clamp01(this.stamina + rate * penalty * dt);
    }

    // ── health: only empty meters hurt you
    let drain = 0;
    if (this.hunger <= 0) drain += RATES.starving;
    if (this.thirst <= 0) drain += RATES.dehydrated;
    if (this.warmth <= 0) drain += RATES.freezing;

    if (drain > 0) {
      this.health = clamp01(this.health - drain * dt);
      this._hurtPulse = Math.min(1, this._hurtPulse + drain * dt * 6);
    } else if (this.hunger > 0.3 && this.thirst > 0.3 && this.warmth > 0.3) {
      this.health = clamp01(this.health + RATES.regen * dt);
    }
    this._hurtPulse = Math.max(0, this._hurtPulse - dt * 0.8);

    // ── warnings, each fired once per crossing
    warnings.push(...this._threshold('thirst', this.thirst, 0.25, 'THIRSTY — find water'));
    warnings.push(...this._threshold('hunger', this.hunger, 0.25, 'HUNGRY — find food'));
    warnings.push(...this._threshold('warmth', this.warmth, 0.3, 'COLD — get to a fire'));
    warnings.push(...this._threshold('health', this.health, 0.35, 'INJURED — you are dying'));

    if (this.health <= 0 && !this.dead) {
      this.dead = true;
      this.causeOfDeath =
        this.warmth <= 0 ? 'exposure'
          : this.thirst <= 0 ? 'thirst'
            : this.hunger <= 0 ? 'starvation'
              : 'injury';
    }

    return warnings;
  }

  /** Fire a message the first time a meter drops below `at`, rearm above it. */
  _threshold(key, value, at, message) {
    const was = this._warned.has(key);
    if (value < at && !was) {
      this._warned.add(key);
      return [message];
    }
    if (value > at + 0.15 && was) this._warned.delete(key);
    return [];
  }

  eat(amount) { this.hunger = clamp01(this.hunger + amount); }
  drink(amount) { this.thirst = clamp01(this.thirst + amount); }
  heal(amount) { this.health = clamp01(this.health + amount); }
  warm(amount) { this.warmth = clamp01(this.warmth + amount); }
  hurt(amount, cause = 'injury') {
    this.health = clamp01(this.health - amount);
    this._hurtPulse = Math.min(1, this._hurtPulse + amount * 3);
    if (this.health <= 0 && !this.dead) {
      this.dead = true;
      this.causeOfDeath = cause;
    }
  }

  /** 0..1 red-flash intensity for the post pass. */
  get hurtPulse() { return clamp(this._hurtPulse, 0, 1); }

  /** The meter closest to failing, for the HUD to highlight. */
  get mostUrgent() {
    const entries = [
      ['THIRST', this.thirst],
      ['HUNGER', this.hunger],
      ['WARMTH', this.warmth],
    ].sort((a, b) => a[1] - b[1]);
    return entries[0][1] < 0.35 ? entries[0][0] : null;
  }
}
