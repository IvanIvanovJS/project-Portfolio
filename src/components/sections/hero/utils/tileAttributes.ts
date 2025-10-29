import * as THREE from 'three';
import type { LoadedAtlas } from './textureLoader';

/**
 * Interface for tile attribute arrays
 */
export interface TileAttributes {
  uvOffset: Float32Array;
  uvScale: Float32Array;
  glowIntensity: Float32Array;
  animationPhase: Float32Array;
}

/**
 * Sets up per-instance attributes for tiles including UV coordinates,
 * glow intensity, and animation phase
 *
 * @param mesh - The instanced mesh to apply attributes to
 * @param atlas - The loaded texture atlas with metadata
 * @param tileCount - Total number of tiles in the mesh
 * @returns TileAttributes object containing all attribute arrays
 */
export function setupTileAttributes(
  mesh: THREE.InstancedMesh,
  atlas: LoadedAtlas,
  tileCount: number
): TileAttributes {
  // Create Float32Arrays for all per-instance attributes
  const uvOffset = new Float32Array(tileCount * 2); // 2 floats per tile (x, y)
  const uvScale = new Float32Array(tileCount * 2); // 2 floats per tile (width, height)
  const glowIntensity = new Float32Array(tileCount); // 1 float per tile
  const animationPhase = new Float32Array(tileCount); // 1 float per tile

  const iconNames = atlas.iconNames;
  const iconCount = iconNames.length;
  const atlasSize = atlas.metadata.meta.size;

  // Distribute icons across all tiles
  for (let i = 0; i < tileCount; i++) {
    // Cycle through available icons using modulo operator
    // This ensures even distribution when tile count exceeds icon count
    const iconIndex = i % iconCount;
    const iconName = iconNames[iconIndex];
    const frame = atlas.metadata.frames[iconName];

    // Calculate UV coordinates from atlas frame data
    // UV coordinates are normalized (0-1) based on atlas size
    uvOffset[i * 2] = frame.x / atlasSize; // U offset
    uvOffset[i * 2 + 1] = frame.y / atlasSize; // V offset
    uvScale[i * 2] = frame.w / atlasSize; // U scale (width)
    uvScale[i * 2 + 1] = frame.h / atlasSize; // V scale (height)

    // Initialize glow intensity to 0.3 for subtle idle glow
    glowIntensity[i] = 0.3;

    // Randomize animation phase (0 to 2π) for staggered pulsing effect
    animationPhase[i] = Math.random() * Math.PI * 2;
  }

  // Create InstancedBufferAttribute for each attribute array
  const uvOffsetAttr = new THREE.InstancedBufferAttribute(uvOffset, 2);
  const uvScaleAttr = new THREE.InstancedBufferAttribute(uvScale, 2);
  const glowIntensityAttr = new THREE.InstancedBufferAttribute(
    glowIntensity,
    1
  );
  const animationPhaseAttr = new THREE.InstancedBufferAttribute(
    animationPhase,
    1
  );

  // Attach attributes to mesh geometry
  mesh.geometry.setAttribute('uvOffset', uvOffsetAttr);
  mesh.geometry.setAttribute('uvScale', uvScaleAttr);
  mesh.geometry.setAttribute('glowIntensity', glowIntensityAttr);
  mesh.geometry.setAttribute('animationPhase', animationPhaseAttr);

  console.log(
    `✓ Tile attributes initialized: ${tileCount} tiles with ${iconCount} unique icons`
  );

  return {
    uvOffset,
    uvScale,
    glowIntensity,
    animationPhase,
  };
}
