/**
 * Screen flow: boot → menu → (options / difficulty / howto / credits) → play,
 * plus pause and the two endings. One screen is visible at a time; the game
 * only runs when none of them are.
 */

import { DIFFICULTIES, saveSettings } from '../core/settings.js';

const $ = (id) => document.getElementById(id);

const BOOT_LINES = [
  'PALE HOUR — ANALOG RECOVERY UNIT',
  'reading tape ................ ok',
  'compiling forest ............ ok',
  'painting bark, soil, paper .. ok',
  'synthesising wind ........... ok',
  'locating subject ............ <b>found</b>',
  'locating <b>second</b> subject ..... <b>found</b>',
];

export class Menu {
  /**
   * @param {object} settings
   * @param {object} handlers
   * @param {(diff:string)=>void} handlers.onPlay
   * @param {()=>void} handlers.onResume
   * @param {()=>void} handlers.onQuit
   * @param {()=>void} handlers.onRetry
   * @param {(key:string, value:any)=>void} handlers.onSettingChange
   * @param {(kind:string)=>void} handlers.onSound
   */
  constructor(settings, handlers) {
    this.settings = settings;
    this.h = handlers;

    this.screens = {
      boot: $('boot'),
      menu: $('menu'),
      options: $('options'),
      difficulty: $('difficulty'),
      howto: $('howto'),
      credits: $('credits'),
      pause: $('pause'),
      over: $('over'),
    };
    this.current = 'boot';
    this.returnTo = 'menu';

    this._wireNav();
    this._wireOptions();
    this._buildDifficulty();
    this._wireKeys();
    this._runBoot();
  }

  /* ── screen plumbing ────────────────────────────────────────── */

  get inMenus() {
    return this.current !== null;
  }

  show(name) {
    for (const [key, el] of Object.entries(this.screens)) {
      el.hidden = key !== name;
    }
    this.current = name;
    if (name === 'menu' || name === 'pause') this._focusFirst(this.screens[name]);
  }

  hideAll() {
    for (const el of Object.values(this.screens)) el.hidden = true;
    this.current = null;
  }

  _focusFirst(root) {
    const first = root.querySelector('.mbtn');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), 30);
  }

  /* ── boot ───────────────────────────────────────────────────── */

  async _runBoot() {
    const log = $('boot-log');
    const fill = $('boot-fill');
    const go = $('boot-go');

    for (let i = 0; i < BOOT_LINES.length; i++) {
      log.innerHTML += (i ? '\n' : '') + BOOT_LINES[i];
      fill.style.width = `${((i + 1) / BOOT_LINES.length) * 92}%`;
      await sleep(i < 2 ? 210 : 130 + Math.random() * 190);
    }
    fill.style.width = '100%';
    go.hidden = false;
    go.addEventListener('click', () => {
      this.h.onBootDone?.();
      this.show('menu');
    });
    go.focus({ preventScroll: true });
  }

  /* ── nav ────────────────────────────────────────────────────── */

  _wireNav() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      this.h.onSound?.('select');

      switch (act) {
        case 'play':
          this.hideAll();
          this.h.onPlay(this.settings.difficulty);
          break;
        case 'options':
          this.returnTo = this.current;
          this._syncOptions();
          this.show('options');
          break;
        case 'difficulty':
          this.returnTo = this.current;
          this.show('difficulty');
          break;
        case 'howto':
          this.returnTo = this.current;
          this.show('howto');
          break;
        case 'credits':
          this.returnTo = this.current;
          this.show('credits');
          break;
        case 'back':
          this.show(this.returnTo || 'menu');
          break;
        case 'resume':
          this.hideAll();
          this.h.onResume();
          break;
        case 'quit':
          this.show('menu');
          this.h.onQuit();
          break;
        case 'retry':
          this.hideAll();
          this.h.onRetry();
          break;
      }
    });

    // hover blips
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest('.mbtn, .dcard')) this.h.onSound?.('move');
    });
  }

  _wireKeys() {
    addEventListener('keydown', (e) => {
      if (e.code !== 'Escape') return;
      e.preventDefault();
      if (this.current === null) {
        this.h.onPauseRequest?.();
      } else if (this.current === 'pause') {
        this.hideAll();
        this.h.onResume();
      } else if (['options', 'difficulty', 'howto', 'credits'].includes(this.current)) {
        this.show(this.returnTo || 'menu');
      }
    });

    // keyboard nav on the main menu
    addEventListener('keydown', (e) => {
      if (this.current !== 'menu' && this.current !== 'pause') return;
      const btns = [...this.screens[this.current].querySelectorAll('.mbtn')];
      if (!btns.length) return;
      const i = btns.indexOf(document.activeElement);
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        e.preventDefault();
        const next = (i + (e.code === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
        btns[next < 0 ? btns.length - 1 : next].focus();
        this.h.onSound?.('move');
      }
    });
  }

  /* ── difficulty ─────────────────────────────────────────────── */

  _buildDifficulty() {
    const host = $('diff-cards');
    host.innerHTML = '';
    this.diffCards = {};

    for (const [key, d] of Object.entries(DIFFICULTIES)) {
      const card = document.createElement('button');
      card.className = 'dcard';
      card.type = 'button';
      card.innerHTML = `
        <div class="dcard__n">${d.index}</div>
        <div class="dcard__t">${d.name}</div>
        <div class="dcard__d">${d.desc}</div>
        <div class="dcard__bars">${
          [1, 2, 3, 4].map((n) => `<i class="${n <= d.bars ? 'on' : ''}"></i>`).join('')
        }</div>`;
      card.addEventListener('click', () => {
        this.settings.difficulty = key;
        saveSettings(this.settings);
        this._syncDifficulty();
        this.h.onSound?.('select');
      });
      host.appendChild(card);
      this.diffCards[key] = card;
    }
    this._syncDifficulty();
  }

  _syncDifficulty() {
    for (const [key, card] of Object.entries(this.diffCards)) {
      card.classList.toggle('is-on', key === this.settings.difficulty);
    }
    $('menu-diff').textContent = DIFFICULTIES[this.settings.difficulty]?.name ?? '—';
  }

  /* ── options ────────────────────────────────────────────────── */

  _wireOptions() {
    /** @type {[string, string, (v:number)=>number, (v:number)=>string][]} */
    const sliders = [
      ['volume', 'opt-volume', (v) => v / 100, (v) => `${Math.round(v * 100)}`],
      ['sensitivity', 'opt-sens', (v) => v / 100, (v) => `${Math.round(v * 100)}`],
      ['fov', 'opt-fov', (v) => v, (v) => `${Math.round(v)}`],
      ['grain', 'opt-grain', (v) => v / 100, (v) => `${Math.round(v * 100)}`],
      ['renderScale', 'opt-scale', (v) => v / 100, (v) => `${Math.round(v * 100)}`],
    ];

    this._sliders = sliders;
    for (const [key, id, toValue, fmt] of sliders) {
      const el = $(id);
      const out = $(`${id}-out`);
      el.addEventListener('input', () => {
        const value = toValue(Number(el.value));
        this.settings[key] = value;
        out.textContent = fmt(value);
        saveSettings(this.settings);
        this.h.onSettingChange?.(key, value);
      });
    }

    for (const [key, id] of [['shake', 'opt-shake'], ['invertY', 'opt-inverty']]) {
      const el = $(id);
      el.addEventListener('change', () => {
        this.settings[key] = el.checked;
        saveSettings(this.settings);
        this.h.onSettingChange?.(key, el.checked);
        this.h.onSound?.('select');
      });
    }

    const seed = $('opt-seed');
    seed.addEventListener('change', () => {
      this.settings.seed = seed.value.trim();
      saveSettings(this.settings);
    });

    this._syncOptions();
  }

  _syncOptions() {
    const s = this.settings;
    const set = (id, value, text) => {
      $(id).value = value;
      const out = $(`${id}-out`);
      if (out) out.textContent = text;
    };
    set('opt-volume', Math.round(s.volume * 100), `${Math.round(s.volume * 100)}`);
    set('opt-sens', Math.round(s.sensitivity * 100), `${Math.round(s.sensitivity * 100)}`);
    set('opt-fov', Math.round(s.fov), `${Math.round(s.fov)}`);
    set('opt-grain', Math.round(s.grain * 100), `${Math.round(s.grain * 100)}`);
    set('opt-scale', Math.round(s.renderScale * 100), `${Math.round(s.renderScale * 100)}`);
    $('opt-shake').checked = Boolean(s.shake);
    $('opt-inverty').checked = Boolean(s.invertY);
    $('opt-seed').value = s.seed ?? '';
  }

  /* ── in-game screens ────────────────────────────────────────── */

  showPause({ found, total, time }) {
    $('pause-found').textContent = found;
    $('pause-total').textContent = total;
    $('pause-time').textContent = time;
    this.show('pause');
  }

  /**
   * @param {'caught'|'consumed'|'escaped'} outcome
   */
  showEnd(outcome, { found, total, time, seed }) {
    const box = document.querySelector('.overbox');
    const copy = {
      caught: {
        tag: 'SIGNAL LOST',
        title: 'CAUGHT',
        sub: 'It closed the distance while you were deciding what to do. There was no sound at the end, which is the part nobody believes.',
      },
      consumed: {
        tag: 'TAPE CORRUPTED',
        title: 'UNMADE',
        sub: 'You looked too long. The static took the picture first and the rest of you after.',
      },
      escaped: {
        tag: 'RECOVERED FOOTAGE',
        title: 'OUT',
        sub: 'Eight pages, and the treeline let you through. The tape keeps running for four more minutes after you stop being on it.',
      },
    }[outcome];

    box.classList.toggle('overbox--win', outcome === 'escaped');
    $('over-tag').textContent = copy.tag;
    $('over-title').textContent = copy.title;
    $('over-sub').textContent = copy.sub;
    $('over-stats').innerHTML =
      `<div>FRAGMENTS <b>${found}/${total}</b></div>` +
      `<div>TIME <b>${time}</b></div>` +
      `<div>SEED <b>${seed}</b></div>`;
    this.show('over');
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
