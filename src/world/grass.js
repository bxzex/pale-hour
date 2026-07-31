/**
 * Ground cover: grass tufts and drifting motes.
 *
 * Grass is the single biggest "this world is alive" upgrade available, because
 * it is the only thing that moves continuously in the player's peripheral
 * vision. It is one InstancedMesh of a three-blade tuft, wind-animated on the
 * GPU, distributed by the same seeded RNG as everything else.
 */

import * as THREE from 'three';
import { WORLD_HALF } from './terrain.js';
import { applyWind } from './wind.js';
import { makeRng } from '../core/rng.js';

/** A tuft of three tapered blades, fanned out and curved. */
function bladeGeometry() {
  const geos = [];
  for (let b = 0; b < 3; b++) {
    const SEG = 4;
    const pos = [];
    const uv = [];
    const idx = [];
    const lean = (b - 1) * 0.42;
    const height = 1 - Math.abs(b - 1) * 0.22;
    const width = 0.045;

    for (let s = 0; s <= SEG; s++) {
      const t = s / SEG;
      const y = t * height;
      // taper to a point, and curve over as it rises
      const w = width * (1 - t * 0.92);
      const x = lean * t * t * 0.55;
      const z = Math.sin(t * 1.4) * 0.06 * lean;
      pos.push(x - w, y, z, x + w, y, z);
      uv.push(0, t, 1, t);
      if (s < SEG) {
        const i = s * 2;
        idx.push(i, i + 1, i + 2, i + 1, i + 3, i + 2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.rotateY((b - 1) * 0.7);
    g.computeVertexNormals();
    geos.push(g);
  }

  // manual merge (avoids pulling in BufferGeometryUtils for three shapes)
  const position = [], uvs = [], normal = [], index = [];
  let offset = 0;
  for (const g of geos) {
    position.push(...g.attributes.position.array);
    uvs.push(...g.attributes.uv.array);
    normal.push(...g.attributes.normal.array);
    for (const i of g.index.array) index.push(i + offset);
    offset += g.attributes.position.count;
    g.dispose();
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
  merged.setIndex(index);
  return merged;
}

/** Vertical gradient: dark and damp at the root, dry and pale at the tip. */
function grassTexture() {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 64, 0, 0);
  g.addColorStop(0, '#2b3520');
  g.addColorStop(0.45, '#4c5c33');
  g.addColorStop(0.82, '#77803f');
  g.addColorStop(1, '#9aa055');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Grass {
  constructor(terrain, forest, seed, scene, count = 26000) {
    this.terrain = terrain;
    const rng = makeRng(seed ^ 0x9ea55);

    const geo = bladeGeometry();
    const mat = new THREE.MeshStandardMaterial({
      map: grassTexture(),
      roughness: 0.92,
      metalness: 0,
      side: THREE.DoubleSide,
      vertexColors: true,
    });
    applyWind(mat, { amount: 0.3, stiffness: 1.5 });

    this.mesh = new THREE.InstancedMesh(geo, mat, count);
    this.mesh.frustumCulled = false;
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;   // grass shadows cost a lot and read as noise
    this.mesh.name = 'grass';

    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    let n = 0;

    for (let i = 0; i < count * 3 && n < count; i++) {
      const x = rng.range(-WORLD_HALF + 2, WORLD_HALF - 2);
      const z = rng.range(-WORLD_HALF + 2, WORLD_HALF - 2);
      if (this.terrain.slopeAt(x, z) > 0.5) continue;

      // Clumping: grass grows in patches, not an even lawn.
      const clump = Math.sin(x * 0.13) * Math.cos(z * 0.11) * 0.5 + 0.5;
      if (rng() > 0.28 + clump * 0.72) continue;

      const h = rng.range(0.28, 0.82) * (0.7 + clump * 0.6);
      dummy.position.set(x, this.terrain.heightAt(x, z) - 0.06, z);
      dummy.rotation.set(0, rng.range(0, Math.PI * 2), 0);
      dummy.scale.set(rng.range(0.8, 1.3), h, rng.range(0.8, 1.3));
      dummy.updateMatrix();
      this.mesh.setMatrixAt(n, dummy.matrix);

      // Colour variation keeps a big field from reading as one flat sheet.
      const dry = rng();
      col.setRGB(0.7 + dry * 0.5, 0.85 + dry * 0.35, 0.55 + dry * 0.3);
      this.mesh.setColorAt(n, col);
      n++;
    }

    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    scene.add(this.mesh);

    this._buildMotes(rng, scene);
  }

  /**
   * Dust and insects caught in the torch beam. Additive points that drift
   * upward and reset — cheap, and they make still air look occupied.
   */
  _buildMotes(rng, scene) {
    const COUNT = 700;
    const pos = new Float32Array(COUNT * 3);
    const speed = new Float32Array(COUNT);
    this._moteHome = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const x = rng.range(-WORLD_HALF, WORLD_HALF);
      const z = rng.range(-WORLD_HALF, WORLD_HALF);
      const y = this.terrain.heightAt(x, z) + rng.range(0.3, 3.4);
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      speed[i] = rng.range(0.06, 0.28);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aSpeed;
        uniform float uTime;
        varying float vFade;
        void main() {
          vec3 p = position;
          // rise and loop over a 4 m column, wandering sideways as they go
          float life = fract(uTime * aSpeed * 0.25 + aSpeed * 13.0);
          p.y += life * 4.0;
          p.x += sin(uTime * 0.5 + aSpeed * 30.0) * 0.5;
          p.z += cos(uTime * 0.43 + aSpeed * 21.0) * 0.5;
          vFade = sin(life * 3.14159);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          // only visible up close — they are lit by your torch, not the moon
          vFade *= smoothstep(26.0, 4.0, -mv.z);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = 2.6 * (34.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vFade;
        void main() {
          float r = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.0, r) * vFade * 0.5;
          gl_FragColor = vec4(vec3(1.0, 0.94, 0.82), a);
        }
      `,
    });

    this.motes = new THREE.Points(geo, mat);
    this.motes.frustumCulled = false;
    this.motes.name = 'motes';
    this.moteMat = mat;
    scene.add(this.motes);
  }

  update(dt, time) {
    this.moteMat.uniforms.uTime.value = time;
    void dt;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh.removeFromParent();
    this.motes.geometry.dispose();
    this.motes.material.dispose();
    this.motes.removeFromParent();
  }
}
