import * as THREE from 'three';

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
}

/**
 * AnimationController manages tile animations including glow pulsing,
 * click-triggered rotations, and hover effects
 */
export class AnimationController {
  private tileStates: Map<number, TileAnimationState> = new Map();
  private glowAttribute: THREE.InstancedBufferAttribute;
  private mesh: THREE.InstancedMesh;

  constructor(
    tileCount: number,
    glowAttribute: THREE.InstancedBufferAttribute,
    mesh: THREE.InstancedMesh
  ) {
    this.glowAttribute = glowAttribute;
    this.mesh = mesh;

    // Initialize state for each tile
    for (let i = 0; i < tileCount; i++) {
      this.tileStates.set(i, {
        isAnimating: false,
        targetGlow: 0.3,
        currentGlow: 0.3,
        rotationProgress: 0,
        rotationAxis: new THREE.Vector3(0, 1, 0),
        initialQuaternion: new THREE.Quaternion(),
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
          const rotationQuaternion = new THREE.Quaternion();
          rotationQuaternion.setFromAxisAngle(state.rotationAxis, angle);

          // Get current instance matrix
          this.mesh.getMatrixAt(index, matrix);
          matrix.decompose(position, quaternion, scale);

          // Combine initial rotation with animation rotation
          const finalQuaternion = state.initialQuaternion
            .clone()
            .multiply(rotationQuaternion);

          // Apply rotation to tile's instance matrix
          matrix.compose(position, finalQuaternion, scale);
          this.mesh.setMatrixAt(index, matrix);
        }
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
   * Set hover glow for a specific tile
   * @param tileIndex Index of the tile
   * @param isHovering Whether the tile is being hovered
   */
  setHoverGlow(tileIndex: number, isHovering: boolean): void {
    const state = this.tileStates.get(tileIndex);
    if (!state || state.isAnimating) return;

    // Set target glow: 0.6 when hovering, 0.3 when not
    state.targetGlow = isHovering ? 0.6 : 0.3;
  }
}
