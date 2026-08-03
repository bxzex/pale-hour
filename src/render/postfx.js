/**
 * The lens. Everything you see passes through a camcorder that was already old
 * when it was left here: barrel distortion, chroma bleed, tape noise, tracking
 * error, and a static storm that rises with the entity's attention.
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { staticTexture } from '../world/textures.js';
import { clamp01, damp } from '../core/rng.js';

const VhsShader = {
  uniforms: {
    tDiffuse: { value: null },
    tStatic: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uGrain: { value: 1.0 },       // user-scaled grain/scanline strength
    uStatic: { value: 0.0 },      // entity static, 0..1
    uGlitch: { value: 0.0 },      // momentary tape tear, 0..1
    uDamage: { value: 0.0 },      // red bloom on being hurt/caught
    uVignette: { value: 1.0 },
    uFade: { value: 0.0 },        // 1 = black, used for transitions
    uPulse: { value: 0.0 },       // low-frequency breathing warp
    uDaylight: { value: 0.0 },    // 1 = full sun: the tape artefacts back off
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform sampler2D tStatic;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uGrain;
    uniform float uStatic;
    uniform float uGlitch;
    uniform float uDamage;
    uniform float uVignette;
    uniform float uFade;
    uniform float uPulse;
    uniform float uDaylight;

    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(443.897, 441.423));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    // barrel distortion — the cheap plastic lens
    vec2 barrel(vec2 uv, float k) {
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);
      return 0.5 + c * (1.0 + k * r2);
    }

    void main() {
      float t = uTime;
      float storm = uStatic;

      // ── tracking error: horizontal bands that slip sideways
      float band = floor(vUv.y * 96.0);
      float slipNoise = hash(vec2(band, floor(t * 11.0)));
      float slip = step(0.972 - storm * 0.32 - uGlitch * 0.5, slipNoise);
      float slipAmt = slip * (0.006 + storm * 0.03 + uGlitch * 0.09)
                    * (slipNoise - 0.5) * 2.0;

      // ── whole-frame roll when it is very close
      float roll = uGlitch * 0.02 * sin(t * 61.0);

      vec2 uv = vUv;
      uv.x += slipAmt + roll;
      uv.y += uPulse * 0.0035 * sin(vUv.x * 9.0 + t * 1.7);
      uv = barrel(uv, 0.055 + storm * 0.09 + uPulse * 0.01);

      // ── chromatic aberration, stronger toward the corners
      vec2 fromCenter = uv - 0.5;
      float edge = dot(fromCenter, fromCenter);
      float ca = (0.0016 + edge * 0.012) * (1.0 + storm * 5.0 + uGlitch * 6.0) * (1.0 - uDaylight * 0.7);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + fromCenter * ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - fromCenter * ca).b;

      // ── ghosting: a faint delayed copy, offset like a bad tape head
      vec3 ghost = texture2D(tDiffuse, uv + vec2(0.004 + storm * 0.02, 0.0)).rgb;
      col = mix(col, max(col, ghost * 0.55), (0.35 + storm * 0.3) * (1.0 - uDaylight * 0.8));

      // ── tape noise
      vec2 grainUv = uv * uResolution / 256.0 + vec2(fract(t * 7.3), fract(t * 5.1));
      float noise = texture2D(tStatic, grainUv).r;
      col += (noise - 0.5) * (0.055 + storm * 0.06) * uGrain * (1.0 - uDaylight * 0.6);

      // ── static storm: hard white/black speckle that eats the image
      if (storm > 0.001) {
        float sp = hash(uv * uResolution * 0.7 + fract(t * 37.0) * 91.0);
        float bursts = step(1.0 - storm * 0.55, sp);
        col = mix(col, vec3(sp), bursts * storm * 0.95);
        // dropout lines
        float dl = step(0.995 - storm * 0.02, hash(vec2(floor(uv.y * 220.0), floor(t * 24.0))));
        col = mix(col, vec3(0.02), dl * storm);
      }

      // ── scanlines + interlace shimmer
      float scan = sin(uv.y * uResolution.y * 1.5708) * 0.5 + 0.5;
      col *= 1.0 - scan * 0.11 * uGrain * (1.0 - uDaylight * 0.75);
      float inter = step(0.5, fract(uv.y * uResolution.y * 0.5 + t * 12.0));
      col *= 1.0 - inter * 0.025 * uGrain;

      // ── vignette
      float vig = 1.0 - smoothstep(0.28 + uDaylight * 0.25, 0.85 + uDaylight * 0.3, length(fromCenter) * 1.32);
      col *= mix(1.0, vig, uVignette * (0.85 + storm * 0.15));

      // ── colour grade: cold, desaturated, crushed blacks, slight green tape cast
      float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(luma), col, mix(0.72, 1.06, uDaylight));
      // night is cold and green-cast; day is neutral and slightly warm
      col *= mix(vec3(0.94, 1.0, 1.02), vec3(1.04, 1.0, 0.95), uDaylight);
      col = max(vec3(0.0), col - 0.012 * (1.0 - uDaylight));
      col = pow(col, vec3(mix(1.06, 0.94, uDaylight)));

      // ── damage / caught: the frame floods red from the edges inward
      col = mix(col, vec3(0.52, 0.03, 0.02), uDamage * smoothstep(0.1, 0.95, length(fromCenter) * 1.5));
      col += vec3(0.22, 0.0, 0.0) * uDamage * 0.5;

      // ── edges of frame are never quite clean
      float border = smoothstep(0.0, 0.006, uv.x) * smoothstep(0.0, 0.006, uv.y)
                   * smoothstep(0.0, 0.006, 1.0 - uv.x) * smoothstep(0.0, 0.006, 1.0 - uv.y);
      col *= border;

      col *= 1.0 - uFade;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class PostFX {
  constructor(renderer, scene, camera, settings) {
    this.renderer = renderer;
    this.settings = settings;

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    // A restrained bloom: just enough that the torch reads as a light source
    // in fog rather than a painted cone.
    const size = renderer.getSize(new THREE.Vector2());
    // Threshold sits high and strength low on purpose: bloom is here to say
    // "that is a light source", not to smear the torch across the frame.
    this.bloom = new UnrealBloomPass(size, 0.12, 0.5, 0.95);
    this.composer.addPass(this.bloom);

    this.vhs = new ShaderPass(VhsShader);
    this.vhs.uniforms.tStatic.value = staticTexture();
    this.vhs.renderToScreen = true;
    this.composer.addPass(this.vhs);

    this._glitch = 0;
    this._damage = 0;
    this._fade = 0;
    this._fadeTarget = 0;
  }

  /** Fire a one-off tape tear — used on reposition, pickup and jump scares. */
  glitch(amount = 1) {
    this._glitch = Math.min(1.5, this._glitch + amount);
  }

  damage(amount = 1) {
    this._damage = Math.min(1, this._damage + amount);
  }

  fadeTo(value) {
    this._fadeTarget = value;
  }

  setFade(value) {
    this._fade = this._fadeTarget = value;
  }

  update(dt, { staticLevel = 0, proximity = 0, daylight = 0 } = {}) {
    const u = this.vhs.uniforms;
    u.uTime.value += dt;
    u.uGrain.value = this.settings.grain;
    u.uStatic.value = clamp01(staticLevel);
    u.uPulse.value = proximity;
    u.uDaylight.value = clamp01(daylight);

    this._glitch = Math.max(0, this._glitch - dt * 3.4);
    this._damage = Math.max(0, this._damage - dt * 1.5);
    this._fade = damp(this._fade, this._fadeTarget, 4.5, dt);

    u.uGlitch.value = this._glitch;
    u.uDamage.value = this._damage;
    u.uFade.value = this._fade;

    // bloom breathes with dread — the world gets soft and wrong up close
    this.bloom.strength = 0.12 + proximity * 0.14 + staticLevel * 0.1;
  }

  setSize(width, height) {
    this.composer.setSize(width, height);
    this.bloom.setSize(width, height);
    this.vhs.uniforms.uResolution.value.set(width, height);
  }

  render() {
    this.composer.render();
  }

  dispose() {
    this.composer.dispose?.();
  }
}
