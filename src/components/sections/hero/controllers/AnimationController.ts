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

  // Pre-allocated temporary objects for performance (reused to avoid allocations)
  private tempMatrix: THREE.Matrix4;
  private tempPosition: THREE.Vector3;
  private tempQuaternion: THREE.Quaternion;
  private tempScale: THREE.Vector3;
  private tempRotationQuat: THREE.Quaternion;

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

    // Pre-allocate temporary objects for reuse in update loops
    this.tempMatrix = new THREE.Matrix4();
    this.tempPosition = new THREE.Vector3();
    this.tempQuaternion = new THREE.Quaternion();
    this.tempScale = new THREE.Vector3();
    this.tempRotationQuat = new THREE.Quaternion();

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
    // Check if explosion is active at start of update
    if (this.isExplosionActive) {
      // Update explosion animation
      this.explosionAnimator.update(deltaTime);

      // Get glow intensity from explosionAnimator and update all tiles
      const explosionGlow = this.explosionAnimator.getGlowIntensity();

      // Batch update all tiles in a single loop
      this.tileStates.forEach((state, index) => {
        // Update glow attribute
        this.glowAttribute.setX(index, explosionGlow);

        // Get positions and rotations from explosionAnimator
        const explosionPosition = this.explosionAnimator.getTilePosition(index);
        const explosionRotation = this.explosionAnimator.getTileRotation(index);

        // Update instance matrices with explosion positions and rotations
        this.mesh.getMatrixAt(index, this.tempMatrix);
        this.tempMatrix.decompose(
          this.tempPosition,
          this.tempQuaternion,
          this.tempScale
        );

        // Apply explosion position and rotation
        this.tempMatrix.compose(
          explosionPosition,
          explosionRotation,
          this.tempScale
        );
        this.mesh.setMatrixAt(index, this.tempMatrix);
      });

      // Check if explosion animation has completed
      if (!this.explosionAnimator.isAnimating()) {
        // Reset isExplosionActive flag
        this.isExplosionActive = false;
        // Resume normal animations (glow pulsing, floating) will happen in next frame
      }

      // Mark instanceMatrix as needsUpdate once after all updates
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
          this.tempRotationQuat.setFromAxisAngle(state.rotationAxis, angle);

          // Get current instance matrix
          this.mesh.getMatrixAt(index, this.tempMatrix);
          this.tempMatrix.decompose(
            this.tempPosition,
            this.tempQuaternion,
            this.tempScale
          );

          // Combine initial rotation with animation rotation (reuse tempQuaternion)
          this.tempQuaternion
            .copy(state.initialQuaternion)
            .multiply(this.tempRotationQuat);

          // Apply rotation without scale changes
          this.tempMatrix.compose(
            this.tempPosition,
            this.tempQuaternion,
            this.tempScale
          );
          this.mesh.setMatrixAt(index, this.tempMatrix);
        }
      }
    });

    // Mark attributes as needing update once after all updates
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

    // Store initial quaternion for rotation animation (reuse temp objects)
    this.mesh.getMatrixAt(tileIndex, this.tempMatrix);
    this.tempMatrix.decompose(
      this.tempPosition,
      this.tempQuaternion,
      this.tempScale
    );
    state.initialQuaternion.copy(this.tempQuaternion);
  }

  /**
   * Set hover glow for a specific tile
   * @param tileIndex Index of the tile
   * @param isHovering Whether the tile is being hovered
   */
  setHoverGlow(tileIndex: number, isHovering: boolean): void {
    // Skip hover effects if explosion is active
    if (this.isExplosionActive) return;

    const state = this.tileStates.get(tileIndex);
    if (!state || state.isAnimating) return;

    if (isHovering) {
      // Set target glow when hovering
      state.targetGlow = 0.3;
    }
    // Don't change targetGlow when not hovering - let the pulsing animation handle it
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
