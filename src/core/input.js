/**
 * Keyboard + pointer-lock mouse input.
 *
 * Mouse deltas accumulate between frames and are drained by the player each
 * update, so a 240Hz mouse on a 60Hz display doesn't lose motion.
 */

const BINDINGS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  sprint: ['ShiftLeft', 'ShiftRight'],
  crouch: ['ControlLeft', 'ControlRight', 'KeyC'],
  light: ['KeyF'],
  use: ['KeyE', 'Space'],
  view: ['KeyV'],
};

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pressed = new Set();   // edge-triggered, cleared each frame
    this.mouse = { dx: 0, dy: 0 };
    this.locked = false;
    this.enabled = false;
    this.wantLock = false;   // the game would like the pointer locked
    this.hadLock = false;    // ...and at some point actually got it
    this.lockFailed = false; // the browser refused; fall back to drag-look

    this._onKeyDown = (e) => {
      if (e.code === 'Escape') return; // handled by the UI layer
      if (!this.enabled) return;
      if (!this.keys.has(e.code)) this.pressed.add(e.code);
      this.keys.add(e.code);
      // Stop space/arrows from scrolling the page behind the canvas
      if (e.code.startsWith('Arrow') || e.code === 'Space' || e.code === 'Tab') e.preventDefault();
    };
    this._onKeyUp = (e) => this.keys.delete(e.code);
    this._onBlur = () => this.keys.clear();

    // Drag-to-look fallback for browsers that refuse pointer lock.
    this._dragging = false;
    this._onDown = () => { if (this.lockFailed) this._dragging = true; };
    this._onUp = () => { this._dragging = false; };

    this._onMove = (e) => {
      if (!this.enabled) return;
      if (this.locked || (this.lockFailed && this._dragging)) {
        this.mouse.dx += e.movementX || 0;
        this.mouse.dy += e.movementY || 0;
      }
    };

    this._onLockChange = () => {
      this.locked = document.pointerLockElement === this.canvas;
      if (this.locked) {
        this.hadLock = true;
        this.lockFailed = false;
      } else if (this.wantLock && this.hadLock) {
        // A lock we genuinely held has been released — the player pressed Esc
        // or tabbed away, so pause. A lock we never got must not pause the
        // game, or a browser that denies pointer lock makes it unplayable.
        this.keys.clear();
        this.onLockLost?.();
      }
    };

    this._onLockError = () => {
      this.lockFailed = true;
      this.onLockFailed?.();
    };

    addEventListener('keydown', this._onKeyDown);
    addEventListener('keyup', this._onKeyUp);
    addEventListener('blur', this._onBlur);
    document.addEventListener('mousemove', this._onMove);
    document.addEventListener('mousedown', this._onDown);
    document.addEventListener('mouseup', this._onUp);
    document.addEventListener('pointerlockchange', this._onLockChange);
    document.addEventListener('pointerlockerror', this._onLockError);
  }

  /** True while any key bound to `action` is held. */
  down(action) {
    const codes = BINDINGS[action];
    if (!codes) return false;
    for (const c of codes) if (this.keys.has(c)) return true;
    return false;
  }

  /** True only on the frame `action` was first pressed. */
  hit(action) {
    const codes = BINDINGS[action];
    if (!codes) return false;
    for (const c of codes) if (this.pressed.has(c)) return true;
    return false;
  }

  /** Drain accumulated mouse motion. */
  takeMouse() {
    const dx = this.mouse.dx, dy = this.mouse.dy;
    this.mouse.dx = 0;
    this.mouse.dy = 0;
    return { dx, dy };
  }

  endFrame() {
    this.pressed.clear();
  }

  /**
   * Request pointer lock. Keyboard input is enabled regardless of whether the
   * lock succeeds — Safari and locked-down browser configs can refuse it, and
   * the game must still be playable when they do.
   */
  async lock() {
    this.enabled = true;
    this.wantLock = true;
    // The menu button that started the run keeps DOM focus otherwise, and then
    // Space and the arrow keys re-trigger it instead of reaching the game.
    document.activeElement?.blur?.();
    if (document.pointerLockElement === this.canvas) return;
    try {
      // unadjustedMovement removes OS pointer acceleration where supported
      const req = this.canvas.requestPointerLock({ unadjustedMovement: true });
      if (req?.then) await req;
    } catch {
      try {
        const req = this.canvas.requestPointerLock();
        if (req?.then) await req;
      } catch {
        this.lockFailed = true;
        this.onLockFailed?.();
      }
    }
  }

  unlock() {
    this.enabled = false;
    this.wantLock = false;
    this.keys.clear();
    this._dragging = false;
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
  }

  dispose() {
    removeEventListener('keydown', this._onKeyDown);
    removeEventListener('keyup', this._onKeyUp);
    removeEventListener('blur', this._onBlur);
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mousedown', this._onDown);
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('pointerlockchange', this._onLockChange);
    document.removeEventListener('pointerlockerror', this._onLockError);
  }
}
