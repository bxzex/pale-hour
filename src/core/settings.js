/** Player settings + difficulty tuning, persisted to localStorage. */

const KEY = 'pale-hour/settings/v1';

export const DEFAULTS = {
  volume: 0.7,
  sensitivity: 1.0,
  fov: 75,
  grain: 1.0,
  renderScale: 1.0,
  shake: true,
  invertY: false,
  seed: '',
  difficulty: 'dread',
};

/**
 * Difficulty controls how the entity behaves, not how much damage you take —
 * there is no health bar, only how much rope you get.
 */
export const DIFFICULTIES = {
  wander: {
    name: 'WANDER',
    index: '01',
    desc: 'It exists, but it is patient. For learning the forest and reading every note.',
    bars: 1,
    fragments: 8,
    baseDistance: 46,      // how far away it likes to spawn
    minDistance: 22,       // how close it dares get
    stalkSpeed: 0.55,      // m/s of creep while unseen
    teleportBase: 11.0,    // seconds between repositions at 0 fragments
    teleportPerFrag: 0.62, // seconds shaved off per fragment taken
    staticGain: 0.20,      // static/sec while it is in view
    staticDecay: 0.42,
    batteryDrain: 0.010,
    killDistance: 3.2,
  },
  dread: {
    name: 'DREAD',
    index: '02',
    desc: 'The intended tape. It closes distance, punishes long looks, and learns your route.',
    bars: 2,
    fragments: 8,
    baseDistance: 38,
    minDistance: 15,
    stalkSpeed: 0.95,
    teleportBase: 8.5,
    teleportPerFrag: 0.72,
    staticGain: 0.30,
    staticDecay: 0.30,
    batteryDrain: 0.016,
    killDistance: 3.6,
  },
  static: {
    name: 'STATIC',
    index: '03',
    desc: 'It is rarely more than a treeline away. Sprint, and it hears where you went.',
    bars: 3,
    fragments: 8,
    baseDistance: 30,
    minDistance: 11,
    stalkSpeed: 1.5,
    teleportBase: 6.2,
    teleportPerFrag: 0.62,
    staticGain: 0.42,
    staticDecay: 0.22,
    batteryDrain: 0.022,
    killDistance: 4.0,
  },
  paleHour: {
    name: 'PALE HOUR',
    index: '04',
    desc: 'No mercy pass, no safe darkness, no second look. Most runs end before the third fragment.',
    bars: 4,
    fragments: 8,
    baseDistance: 24,
    minDistance: 8,
    stalkSpeed: 2.15,
    teleportBase: 4.6,
    teleportPerFrag: 0.44,
    staticGain: 0.58,
    staticDecay: 0.15,
    batteryDrain: 0.030,
    killDistance: 4.4,
  },
};

export function loadSettings() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    saved = {};
  }
  return { ...DEFAULTS, ...saved };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* private browsing — settings just won't persist */
  }
}

export function difficultyOf(settings) {
  return DIFFICULTIES[settings.difficulty] ?? DIFFICULTIES.dread;
}
