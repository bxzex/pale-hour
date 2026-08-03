/** HUD + the whisper line. Pure DOM — cheap, crisp at any resolution. */

const $ = (id) => document.getElementById(id);

import { FRAGMENT_LINES, INTRO } from '../story.js';

export class Hud {
  constructor() {
    this.root = $('hud');
    this.clock = $('hud-clock');
    this.found = $('hud-found');
    this.total = $('hud-total');
    this.battery = $('hud-battery');
    this.stamina = $('hud-stamina');
    this.hint = $('hud-hint');
    this.notesEl = $('hud-notes');
    this.whisperEl = $('whisper');
    this.fragBox = document.querySelector('.frag');
    this.batteryMeter = this.battery.closest('.meter');
    this.staminaMeter = this.stamina.closest('.meter');
    this._whisperTimer = 0;
    this._lastHint = '';
    this.lookFallback = false;
  }

  /** Shown when the browser denied pointer lock and we are drag-looking. */
  setLookFallback(on) {
    this.lookFallback = on;
  }

  show(total) {
    this.total.textContent = total;
    this.found.textContent = '0';
    this.root.classList.add('is-on');
    document.body.classList.add('playing');
  }

  hide() {
    this.root.classList.remove('is-on');
    document.body.classList.remove('playing');
    this.clearWhisper();
  }

  setFound(n) {
    this.found.textContent = n;
    this.fragBox.classList.remove('is-hit');
    // force a reflow so the animation replays on consecutive pickups
    void this.fragBox.offsetWidth;
    this.fragBox.classList.add('is-hit');
  }

  setTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const text = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (this.clock.textContent !== text) this.clock.textContent = text;
  }

  setMeters(battery, stamina) {
    this.battery.style.transform = `scaleX(${battery})`;
    this.stamina.style.transform = `scaleX(${stamina})`;
    this.batteryMeter.classList.toggle('is-low', battery < 0.22);
    this.staminaMeter.classList.toggle('is-low', stamina < 0.2);
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
    this.whisper('Find the eight. Get to the gate. <i>Do not stop to look at it.</i>', 5.5);
  }

  fragmentLine(index) {
    const line = FRAGMENT_LINES[index];
    if (line) this.whisper(line, 5.4);
  }

  setNotes(read, total) {
    this.notesEl.innerHTML = read > 0 ? `NOTES <b>${read}/${total}</b>` : '';
  }

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
