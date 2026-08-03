/** HUD + the whisper line. Pure DOM — cheap, crisp at any resolution. */

const $ = (id) => document.getElementById(id);

import { FRAGMENT_LINES, INTRO } from '../story.js';

export class Hud {
  constructor() {
    this.root = $('hud');
    this.clock = $('hud-clock');
    this.dayEl = $('hud-day');
    this.todEl = $('hud-tod');
    this.phaseEl = $('hud-phase');
    this.heldEl = $('hud-held');
    this.promptEl = $('hud-prompt');
    this.promptLabel = $('prompt-label');
    this.promptFill = $('prompt-fill');
    this.promptKey = $('prompt-key');
    this.toastsEl = $('toasts');
    this.vitals = {};
    for (const k of ['health', 'hunger', 'thirst', 'warmth', 'stamina']) {
      this.vitals[k] = { fill: $(`v-${k}`), row: document.querySelector(`.vital[data-v="${k}"]`) };
    }
    this.hint = $('hud-hint');
    this.notesEl = $('hud-notes');
    this.whisperEl = $('whisper');
    this._whisperTimer = 0;
    this._lastHint = '';
    this.lookFallback = false;
  }

  /** Shown when the browser denied pointer lock and we are drag-looking. */
  setLookFallback(on) {
    this.lookFallback = on;
  }

  show() {
    this.root.classList.add('is-on');
    document.body.classList.add('playing');
  }

  hide() {
    this.root.classList.remove('is-on');
    document.body.classList.remove('playing');
    this.clearWhisper();
  }

  setClock(day, timeText, phaseName) {
    this.dayEl.textContent = `DAY ${day}`;
    this.todEl.textContent = timeText;
    this.phaseEl.textContent = phaseName;
  }

  /** @param {object} sv a Survival instance */
  setVitals(sv) {
    const set = (k, v) => {
      const row = this.vitals[k];
      row.fill.style.transform = `scaleX(${Math.max(0, Math.min(1, v))})`;
      row.row.classList.toggle('is-low', v < 0.25);
    };
    set('health', sv.health);
    set('hunger', sv.hunger);
    set('thirst', sv.thirst);
    set('warmth', sv.warmth);
    set('stamina', sv.stamina);
  }

  setHeld(text) {
    this.heldEl.innerHTML = text || '';
  }

  /**
   * The centre-screen interaction prompt.
   * @param {null|{label:string, key:string, progress:number, blocked:boolean}} p
   */
  setPrompt(p) {
    if (!p) { this.promptEl.classList.remove('is-on'); return; }
    this.promptEl.classList.add('is-on');
    this.promptEl.classList.toggle('is-blocked', Boolean(p.blocked));
    this.promptLabel.textContent = p.label;
    this.promptKey.innerHTML = p.key;
    this.promptFill.style.transform = `scaleX(${p.progress ?? 1})`;
  }

  /** Transient centre-bottom message. Warnings are red and stay longer. */
  toast(text, warn = false) {
    const el = document.createElement('div');
    el.className = `toast ${warn ? 'toast--warn' : ''}`;
    el.innerHTML = text;
    this.toastsEl.appendChild(el);
    setTimeout(() => el.remove(), 2600);
    // never let a spam of pickups grow without bound
    while (this.toastsEl.children.length > 5) this.toastsEl.firstChild.remove();
  }

  setHint(html) {
    if (html === this._lastHint) return;
    this._lastHint = html;
    this.hint.innerHTML = html || '';
    this.hint.classList.toggle('is-on', Boolean(html));
  }

  whisper(html, seconds = 5) {
    this.whisperEl.innerHTML = html;
    this.whisperEl.classList.add('is-on');
    clearTimeout(this._whisperTimer);
    this._whisperTimer = setTimeout(() => this.whisperEl.classList.remove('is-on'), seconds * 1000);
  }

  clearWhisper() {
    clearTimeout(this._whisperTimer);
    this.whisperEl.classList.remove('is-on');
  }

  opening() {
    this.whisper('Wood, water, fire — in that order, and before dark.', 6);
  }

  fragmentLine(index) {
    const line = FRAGMENT_LINES[index];
    if (line) this.whisper(line, 5.4);
  }

  setNotes() { /* notes counter retired with the fragment HUD */ }

  /* ── the note reader ──────────────────────────────────────── */

  /** Opens the document overlay. Returns nothing; the game pauses the world. */
  showNote(note, read, total) {
    $('reader-title').textContent = note.title;
    $('reader-body').innerHTML = note.body.map((para) => `<p>${para}</p>`).join('');
    $('reader-count').textContent = `NOTE ${read} OF ${total}`;
    $('reader').hidden = false;
  }

  hideNote() {
    $('reader').hidden = true;
  }

  get readerOpen() {
    return !$('reader').hidden;
  }

  /* ── intro cards ──────────────────────────────────────────── */

  /** Steps through the intro, resolving when the player has read it all. */
  playIntro() {
    return new Promise((resolve) => {
      const screen = $('intro');
      const kicker = $('intro-kicker');
      const body = $('intro-body');
      const next = $('intro-next');
      const dots = $('intro-dots');
      let i = 0;

      dots.innerHTML = INTRO.map(() => '<i></i>').join('');
      screen.hidden = false;

      const render = () => {
        const card = INTRO[i];
        kicker.textContent = card.kicker;
        body.innerHTML = card.body;
        [...dots.children].forEach((d, n) => d.classList.toggle('on', n <= i));
        next.textContent = i === INTRO.length - 1 ? 'GO IN ▸' : 'CONTINUE ▸';
        // replay the entrance animation on each card
        body.style.animation = 'none';
        void body.offsetWidth;
        body.style.animation = 'menuin 0.45s ease-out both';
      };

      const advance = () => {
        i++;
        if (i >= INTRO.length) {
          screen.hidden = true;
          next.removeEventListener('click', advance);
          removeEventListener('keydown', onKey);
          resolve();
        } else {
          render();
        }
      };
      const onKey = (e) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
          e.preventDefault();
          advance();
        }
      };

      next.addEventListener('click', advance);
      addEventListener('keydown', onKey);
      render();
      next.focus({ preventScroll: true });
    });
  }

  flashDamage() {
    this.root.classList.remove('flash-red');
    void this.root.offsetWidth;
    this.root.classList.add('flash-red');
  }

  dispose() {
    clearTimeout(this._whisperTimer);
    clearTimeout(this._whisperQueue);
  }
}
