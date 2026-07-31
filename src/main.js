/**
 * PALE HOUR — entry point.
 * Wires settings, input, audio, HUD, menus and the game loop together.
 */

import { loadSettings, saveSettings } from './core/settings.js';
import { Input } from './core/input.js';
import { AudioEngine } from './audio/audio.js';
import { Hud } from './ui/hud.js';
import { Menu } from './ui/menu.js';
import { Game } from './core/game.js';

const canvas = document.getElementById('scene');
const settings = loadSettings();

// Pointer lock and WASD are not meaningfully playable on touch-only devices;
// say so plainly rather than shipping a broken control scheme.
const touchOnly = matchMedia('(hover: none) and (pointer: coarse)').matches;
if (touchOnly) {
  document.getElementById('boot').hidden = true;
  document.getElementById('rotate').hidden = false;
} else {
  boot();
}

function boot() {
  const input = new Input(canvas);
  const audio = new AudioEngine(settings);
  const hud = new Hud();

  const game = new Game({
    canvas,
    settings,
    input,
    audio,
    hud,
    onEnd: (outcome, stats) => menu.showEnd(outcome, stats),
  });

  const menu = new Menu(settings, {
    onBootDone: () => audio.init(),

    onPlay: async () => {
      await audio.init();
      game.start();
    },

    onResume: () => game.resume(),

    onQuit: () => {
      game.quit();
      menu.show('menu');
    },

    onRetry: async () => {
      await audio.init();
      game.start();
    },

    onPauseRequest: () => game.pause(),

    onSettingChange: (key, value) => {
      game.applySetting(key, value);
      saveSettings(settings);
    },

    onSound: (kind) => audio.ui(kind),
  });

  // Pointer-lock loss (alt-tab, Esc from the browser) drops straight to pause.
  game.onPaused = () => menu.showPause(game.stats);

  // Clicking the canvas while paused is the fastest way back in; clicking it
  // mid-run re-acquires a pointer lock the browser dropped.
  canvas.addEventListener('click', () => {
    if (menu.current === 'pause') {
      menu.hideAll();
      game.resume();
    } else if (menu.current === null && !input.locked && !input.lockFailed) {
      input.lock();
    }
  });

  // If the browser refuses pointer lock outright, say so and switch to
  // click-and-drag looking rather than silently shipping half a control scheme.
  input.onLockFailed = () => {
    hud.setLookFallback(true);
    document.body.classList.remove('playing');
  };

  // Losing the tab should never leave the drone playing to an empty room.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) game.pause();
  });

  if (import.meta.env?.DEV) {
    window.paleHour = { game, menu, settings, audio, input };
  }
}
