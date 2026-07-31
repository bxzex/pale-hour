/**
 * One wind, shared by everything that should bend in it.
 *
 * `applyWind` patches an existing MeshStandardMaterial via onBeforeCompile so
 * grass, undergrowth and canopies all sway to the same gusts without needing
 * custom materials — they keep full lighting, shadows and fog.
 */

import * as THREE from 'three';

/** Shared uniforms. Update `uWindTime.value` once per frame. */
export const windUniforms = {
  uWindTime: { value: 0 },
  uWindStrength: { value: 1 },
};

/**
 * @param {THREE.Material} material
 * @param {object} opts
 * @param {number} opts.amount   how far the tips travel, in metres
 * @param {number} opts.stiffness  higher = only the very top moves
 */
export function applyWind(material, { amount = 0.22, stiffness = 1.4 } = {}) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = windUniforms.uWindTime;
    shader.uniforms.uWindStrength = windUniforms.uWindStrength;
    shader.uniforms.uWindAmount = { value: amount };
    shader.uniforms.uWindStiff = { value: stiffness };

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `
        #include <common>
        uniform float uWindTime;
        uniform float uWindStrength;
        uniform float uWindAmount;
        uniform float uWindStiff;
        `
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `
        #include <begin_vertex>
        {
          // World position of this instance, so neighbouring plants are out of
          // phase with each other instead of swaying as one rigid sheet.
          #ifdef USE_INSTANCING
            vec3 instOrigin = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 instOrigin = vec3(modelMatrix[3][0], modelMatrix[3][1], modelMatrix[3][2]);
          #endif

          // Only the parts above the root move, and the tips move most.
          float h = max(transformed.y, 0.0);
          float bend = pow(h, uWindStiff) * uWindAmount * uWindStrength;

          float t = uWindTime;
          float seed = instOrigin.x * 0.37 + instOrigin.z * 0.53;

          // A slow gust front travelling across the map, plus fast flutter.
          float gust = 0.55 + 0.45 * sin(t * 0.31 + instOrigin.x * 0.045 + instOrigin.z * 0.031);
          float flutter = sin(t * 2.1 + seed) * 0.7 + sin(t * 4.7 + seed * 1.9) * 0.3;

          transformed.x += bend * gust * flutter;
          transformed.z += bend * gust * flutter * 0.45;
          // Bending shortens the plant slightly — keeps it from stretching.
          transformed.y -= bend * abs(flutter) * 0.16;
        }
        `
      );
  };
  // Force a recompile if the material was already used.
  material.needsUpdate = true;
  material.customProgramCacheKey = () => `wind-${amount}-${stiffness}`;
  return material;
}
