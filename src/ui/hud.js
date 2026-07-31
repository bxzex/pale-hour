/** HUD + the whisper line. Pure DOM — cheap, crisp at any resolution. */

const $ = (id) => document.getElementById(id);

const OPENING = [
  'You were told not to come back after dark.',
  'Eight pages. Then the road out.',
];

/** One line fires the first time each fragment is taken. */
const ON_FRAGMENT = [
  'One. The trees look further apart than they did.',
  'Two. Something moved that was not the wind.',
  'Three. Your torch is warm now.',
  'Four. It is not hiding any more. It is <i>waiting</i>.',
  'Five. Stop looking behind you. Stop it.',
  'Six. You can hear the tape running out.',
  'Seven. Do not look up.',
  'Eight. Get to the treeline. <i>Run.</i>',
];

export class Hud {
  constructor() {
    this.root = $('hud');
    this.clock = $('hud-clock');
    this.found = $('hud-found');
    this.total = $('hud-total');
    this.battery = $('hud-battery');
    this.stamina = $('hud-stamina');
    this.hint = $('hud-hint');
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
    this.whisper(OPENING[0], 4.5);
    this._whisperQueue = setTimeout(() => this.whisper(OPENING[1], 4.5), 5200);
  }

  fragmentLine(index) {
    const line = ON_FRAGMENT[index];
    if (line) this.whisper(line, 4.6);
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
