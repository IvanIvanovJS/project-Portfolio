import * as THREE from 'three';
import { ExplosionAnimator } from './ExplosionAnimator';

/**
 * Interface defining the animation state for each tile
 */
interface TileAnimationState {
  isAnimating: boolean;
  targetGlow: number;
  currentGlow: number;
  rotationProgress: number;
  rotationAxis: THREE.Vector3;
  initialQuaternion: THREE.Quaternion;
  targetScale: number;
  currentScale: number;
}

/**
 * AnimationController manages tile animations including glow pulsing,
 * click-triggered rotations, hover effects, and explosion animations
 */
export class AnimationController {
  private tileStates: Map<number, TileAnimationState> = new Map();
  private glowAttribute: THREE.InstancedBufferAttribute;
  private mesh: THREE.InstancedMesh;
  private explosionAnimator: ExplosionAnimator;
  private isExplosionActive: boolean = false;

  constructor(
    tileCount: number,
    glowAttribute: THREE.InstancedBufferAttribute,
    mesh: THREE.InstancedMesh,
    originalPositions: THREE.Vector3[],
    originalRotations: THREE.Quaternion[],
    sphereRadius: number
  ) {
    this.glowAttribute = glowAttribute;
    this.mesh = mesh;

    // Initialize ExplosionAnimator with tile data
    this.explosionAnimator = new ExplosionAnimator(
      tileCount,
      originalPositions,
      originalRotations,
      sphereRadius
    );

    // Initialize state for each tile
    for (let i = 0; i < tileCount; i++) {
      this.tileStates.set(i, {
        isAnimating: false,
        targetGlow: 0.3,
        currentGlow: 0.3,
        rotationProgress: 0,
        rotationAxis: new THREE.Vector3(0, 1, 0),
        initialQuaternion: new THREE.Quaternion(),
        targetScale: 1.0,
        currentScale: 1.0,
      });
    }
  }

  /**
   * Update all tile animations
   * @param deltaTime Time since last frame in seconds
   * @param elapsedTime Total elapsed time in seconds
   */
  update(deltaTime: number, elapsedTime: number): void {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    // Check if explosion is active at start of update
    if (this.isExplosionActive) {
      // Update explosion animation
      this.explosionAnimator.update(deltaTime);

      // Get glow intensity from explosionAnimator and update all tiles
      const explosionGlow = this.explosionAnimator.getGlowIntensity();
      this.tileStates.forEach((state, index) => {
        this.glowAttribute.setX(index, explosionGlow);
      });

      // Override tile positions and rotations during explosion
      this.tileStates.forEach((state, index) => {
        // Get positions and rotations from explosionAnimator
        const explosionPosition = this.explosionAnimator.getTilePosition(index);
        const explosionRotation = this.explosionAnimator.getTileRotation(index);

        // Update instance matrices with explosion positions and rotations
        this.mesh.getMatrixAt(index, matrix);
        matrix.decompose(position, quaternion, scale);

        // Apply explosion position and rotation
        matrix.compose(explosionPosition, explosionRotation, scale);
        this.mesh.setMatrixAt(index, matrix);
      });

      // Check if explosion animation has completed
      if (!this.explosionAnimator.isAnimating()) {
        // Reset isExplosionActive flag
        this.isExplosionActive = false;
        // Resume normal animations (glow pulsing, floating) will happen in next frame
      }

      // Mark instanceMatrix as needsUpdate
      this.mesh.instanceMatrix.needsUpdate = true;
      this.glowAttribute.needsUpdate = true;
      return; // Skip normal animations when explosion is active
    }

    // Normal animations (only when explosion is not active)
    this.tileStates.forEach((state, index) => {
      // Glow pulsing animation (when not animating from click)
      if (!state.isAnimating) {
        // Staggered sine wave for wave effect across tiles
        const phase = elapsedTime * 0.5 + index * 0.1;
        state.targetGlow = 0.3 + Math.sin(phase) * 0.1;
      }

      // Smooth glow transition using interpolation
      state.currentGlow += (state.targetGlow - state.currentGlow) * 0.1;
      this.glowAttribute.setX(index, state.currentGlow);

      // Smooth scale transition using interpolation
      state.currentScale += (state.targetScale - state.currentScale) * 0.1;

      // Click animation (rotation)
      if (state.isAnimating) {
        // Update rotation progress (0 to 1 over 1.5 seconds)
        state.rotationProgress += deltaTime * (1 / 1.5);

        if (state.rotationProgress >= 1.0) {
          // Animation complete
          state.isAnimating = false;
          state.rotationProgress = 0;
          state.targetGlow = 0.3;
        } else {
          // Calculate rotation quaternion for 360-degree Y-axis rotation
          const angle = state.rotationProgress * Math.PI * 2;
          const rotationQuaternion = new THREE.Quaternion();
          rotationQuaternion.setFromAxisAngle(state.rotationAxis, angle);

          // Get current instance matrix
          this.mesh.getMatrixAt(index, matrix);
          matrix.decompose(position, quaternion, scale);

          // Combine initial rotation with animation rotation
          const finalQuaternion = state.initialQuaternion
            .clone()
            .multiply(rotationQuaternion);

          // Apply rotation and scale to tile's instance matrix
          const scaledScale = scale.clone().multiplyScalar(state.currentScale);
          matrix.compose(position, finalQuaternion, scaledScale);
          this.mesh.setMatrixAt(index, matrix);
        }
      } else {
        // Apply scale transformation for non-animating tiles (hover effect)
        this.mesh.getMatrixAt(index, matrix);
        matrix.decompose(position, quaternion, scale);

        // Apply current scale to the tile
        const scaledScale = scale.clone().multiplyScalar(state.currentScale);
        matrix.compose(position, quaternion, scaledScale);
        this.mesh.setMatrixAt(index, matrix);
      }
    });

    // Mark attributes as needing update
    this.glowAttribute.needsUpdate = true;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /**
   * Trigger click animation for a specific tile
   * @param tileIndex Index of the tile to animate
   */
  triggerClickAnimation(tileIndex: number): void {
    const state = this.tileStates.get(tileIndex);
    if (!state || state.isAnimating) return;

    // Set animation flag to prevent multiple simultaneous animations
    state.isAnimating = true;
    state.targetGlow = 1.0; // Maximum intensity
    state.rotationProgress = 0;

    // Store initial quaternion for rotation animation
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    this.mesh.getMatrixAt(tileIndex, matrix);
    matrix.decompose(position, quaternion, scale);
    state.initialQuaternion.copy(quaternion);
  }

  /**
   * Set hover glow and scale for a specific tile
   * @param tileIndex Index of the tile
   * @param isHovering Whether the tile is being hovered
   */
  setHoverGlow(tileIndex: number, isHovering: boolean): void {
    // Skip hover effects if explosion is active
    if (this.isExplosionActive) return;

    const state = this.tileStates.get(tileIndex);
    if (!state || state.isAnimating) return;

    if (isHovering) {
      // Set target glow to 0.3 and scale to 1.1 when hovering
      state.targetGlow = 0.3;
      state.targetScale = 1.1;
    } else {
      // When not hovering, return scale to 1.0
      // Don't set targetGlow - let the pulsing animation handle it
      state.targetScale = 1.0;
    }
  }

  /**
   * Trigger explosion animation for the entire sphere
   */
  triggerExplosion(): void {
    // Check if explosion is already active, return early if true
    if (this.isExplosionActive) return;

    // Set isExplosionActive flag to true
    this.isExplosionActive = true;

    // Call explosionAnimator.startExplosion()
    this.explosionAnimator.startExplosion();
  }

  /**
   * Check if explosion animation is currently active
   * @returns true if explosion is active, false otherwise
   */
  isExplosionAnimationActive(): boolean {
    return this.isExplosionActive;
  }
}
