import * as THREE from 'three';

/**
 * Configuration interface for explosion animation timing and parameters
 */
export interface ExplosionConfig {
  contractionDuration: number; // Duration of contraction phase in seconds
  explosionDuration: number; // Duration of explosion phase in seconds
  returnDuration: number; // Duration of return phase in seconds
  contractionScale: number; // Scale factor for contraction (0.5 = 50% radius)
  minExplosionVelocity: number; // Minimum velocity for explosion in units/s
  maxExplosionVelocity: number; // Maximum velocity for explosion in units/s
  minRotationSpeed: number; // Minimum rotation speed in rad/s
  maxRotationSpeed: number; // Maximum rotation speed in rad/s
}

/**
 * Enum representing the current phase of the explosion animation
 */
export enum ExplosionPhase {
  IDLE = 'idle',
  CONTRACTING = 'contracting',
  EXPLODING = 'exploding',
  RETURNING = 'returning',
}

/**
 * Interface for per-tile animation state data
 */
export interface TileExplosionState {
  originalPosition: THREE.Vector3; // Original position on sphere
  originalRotation: THREE.Quaternion; // Original rotation
  currentPosition: THREE.Vector3; // Current animated position
  currentRotation: THREE.Quaternion; // Current animated rotation
  explosionDirection: THREE.Vector3; // Random direction for explosion
  explosionVelocity: number; // Speed of explosion for this tile
  rotationAxis: THREE.Vector3; // Random axis for rotation during explosion
  rotationSpeed: number; // Angular velocity in rad/s
}

/**
 * ExplosionAnimator manages the multi-phase explosion animation for the tile sphere
 */
export class ExplosionAnimator {
  private phase: ExplosionPhase;
  private phaseProgress: number;
  private config: ExplosionConfig;
  private tileStates: TileExplosionState[];
  private originalRadius: number;

  // Temporary objects for calculations (reused to avoid allocations)
  private tempVec3: THREE.Vector3;
  private tempQuat: THREE.Quaternion;

  /**
   * Creates a new ExplosionAnimator
   * @param tileCount Number of tiles in the sphere
   * @param originalPositions Array of original tile positions
   * @param originalRotations Array of original tile rotations
   * @param originalRadius Radius of the sphere
   */
  constructor(
    tileCount: number,
    originalPositions: THREE.Vector3[],
    originalRotations: THREE.Quaternion[],
    originalRadius: number
  ) {
    this.phase = ExplosionPhase.IDLE;
    this.phaseProgress = 0;
    this.originalRadius = originalRadius;

    // Default configuration
    this.config = {
      contractionDuration: 0.8,
      explosionDuration: 0.6,
      returnDuration: 1.2,
      contractionScale: 0.5,
      minExplosionVelocity: 8,
      maxExplosionVelocity: 15,
      minRotationSpeed: 2,
      maxRotationSpeed: 5,
    };

    // Initialize temporary objects for reuse
    this.tempVec3 = new THREE.Vector3();
    this.tempQuat = new THREE.Quaternion();

    // Initialize tile states
    this.tileStates = [];
    for (let i = 0; i < tileCount; i++) {
      this.tileStates.push({
        originalPosition: originalPositions[i].clone(),
        originalRotation: originalRotations[i].clone(),
        currentPosition: originalPositions[i].clone(),
        currentRotation: originalRotations[i].clone(),
        explosionDirection: new THREE.Vector3(),
        explosionVelocity: 0,
        rotationAxis: new THREE.Vector3(),
        rotationSpeed: 0,
      });
    }
  }

  /**
   * Easing function for contraction phase (accelerating)
   * @param t Progress value from 0 to 1
   * @returns Eased value
   */
  private easeIn(t: number): number {
    return t * t;
  }

  /**
   * Easing function for return phase (decelerating)
   * @param t Progress value from 0 to 1
   * @returns Eased value
   */
  private easeOut(t: number): number {
    return 1 - (1 - t) * (1 - t);
  }

  /**
   * Generates a random direction vector uniformly distributed on a sphere
   * @returns Normalized direction vector
   */
  private randomDirection(): THREE.Vector3 {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    return new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );
  }

  /**
   * Generates a random value within a specified range
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random value between min and max
   */
  private randomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Checks if the animation is currently active
   * @returns True if animation is not in IDLE phase
   */
  public isAnimating(): boolean {
    return this.phase !== ExplosionPhase.IDLE;
  }

  /**
   * Gets the current animation phase
   * @returns Current ExplosionPhase
   */
  public getCurrentPhase(): ExplosionPhase {
    return this.phase;
  }

  /**
   * Gets the current position of a specific tile
   * @param index Tile index
   * @returns Current position vector
   */
  public getTilePosition(index: number): THREE.Vector3 {
    if (index < 0 || index >= this.tileStates.length) {
      console.warn(`Invalid tile index: ${index}`);
      return new THREE.Vector3();
    }
    return this.tileStates[index].currentPosition;
  }

  /**
   * Gets the current rotation of a specific tile
   * @param index Tile index
   * @returns Current rotation quaternion
   */
  public getTileRotation(index: number): THREE.Quaternion {
    if (index < 0 || index >= this.tileStates.length) {
      console.warn(`Invalid tile index: ${index}`);
      return new THREE.Quaternion();
    }
    return this.tileStates[index].currentRotation;
  }

  /**
   * Calculates the glow intensity based on current phase and progress
   * @returns Glow intensity value from 0.0 to 1.0
   */
  public getGlowIntensity(): number {
    switch (this.phase) {
      case ExplosionPhase.CONTRACTING:
        return this.phaseProgress; // 0.0 → 1.0
      case ExplosionPhase.EXPLODING:
        return 1.0; // Maximum glow
      case ExplosionPhase.RETURNING:
        return 1.0 - this.phaseProgress; // 1.0 → 0.0
      default:
        return 0.0;
    }
  }

  /**
   * Starts the explosion animation sequence
   */
  public startExplosion(): void {
    this.phase = ExplosionPhase.CONTRACTING;
    this.phaseProgress = 0;

    // Generate random explosion parameters for each tile
    for (const state of this.tileStates) {
      state.explosionDirection = this.randomDirection();
      state.explosionVelocity = this.randomInRange(
        this.config.minExplosionVelocity,
        this.config.maxExplosionVelocity
      );
      state.rotationAxis = this.randomDirection();
      state.rotationSpeed = this.randomInRange(
        this.config.minRotationSpeed,
        this.config.maxRotationSpeed
      );
      // Store current position as starting point
      state.currentPosition.copy(state.originalPosition);
    }
  }

  /**
   * Updates the animation state
   * @param deltaTime Time elapsed since last update in seconds
   */
  public update(deltaTime: number): void {
    if (this.phase === ExplosionPhase.IDLE) {
      return;
    }

    // Update phase progress based on current phase duration
    let phaseDuration: number;
    switch (this.phase) {
      case ExplosionPhase.CONTRACTING:
        phaseDuration = this.config.contractionDuration;
        break;
      case ExplosionPhase.EXPLODING:
        phaseDuration = this.config.explosionDuration;
        break;
      case ExplosionPhase.RETURNING:
        phaseDuration = this.config.returnDuration;
        break;
      default:
        return;
    }

    this.phaseProgress += deltaTime / phaseDuration;

    // Handle phase transitions
    if (this.phaseProgress >= 1.0) {
      this.phaseProgress = 1.0;
      this.transitionToNextPhase();
    }

    // Update tile states based on current phase
    this.updatePhase(deltaTime);
  }

  /**
   * Transitions to the next phase in the animation sequence
   */
  private transitionToNextPhase(): void {
    switch (this.phase) {
      case ExplosionPhase.CONTRACTING:
        this.phase = ExplosionPhase.EXPLODING;
        this.phaseProgress = 0;
        break;
      case ExplosionPhase.EXPLODING:
        this.phase = ExplosionPhase.RETURNING;
        this.phaseProgress = 0;
        break;
      case ExplosionPhase.RETURNING:
        this.phase = ExplosionPhase.IDLE;
        this.phaseProgress = 0;
        break;
    }
  }

  /**
   * Updates tile positions and rotations based on current phase
   * @param deltaTime Time elapsed since last update in seconds
   */
  private updatePhase(deltaTime: number): void {
    switch (this.phase) {
      case ExplosionPhase.CONTRACTING:
        this.updateContractionPhase();
        break;
      case ExplosionPhase.EXPLODING:
        this.updateExplosionPhase(deltaTime);
        break;
      case ExplosionPhase.RETURNING:
        this.updateReturnPhase();
        break;
    }
  }

  /**
   * Updates tile positions during contraction phase
   */
  private updateContractionPhase(): void {
    const easedProgress = this.easeIn(this.phaseProgress);
    const currentRadius =
      this.originalRadius *
      (1.0 - easedProgress * this.config.contractionScale);

    for (const state of this.tileStates) {
      // Maintain sphere shape at reduced radius
      this.tempVec3.copy(state.originalPosition).normalize();
      state.currentPosition.copy(this.tempVec3).multiplyScalar(currentRadius);
    }
  }

  /**
   * Updates tile positions during explosion phase
   * @param deltaTime Time elapsed since last update in seconds
   */
  private updateExplosionPhase(deltaTime: number): void {
    for (const state of this.tileStates) {
      // Update position with linear motion
      this.tempVec3
        .copy(state.explosionDirection)
        .multiplyScalar(state.explosionVelocity * deltaTime);
      state.currentPosition.add(this.tempVec3);

      // Apply random rotation
      this.tempQuat.setFromAxisAngle(
        state.rotationAxis,
        state.rotationSpeed * deltaTime
      );
      state.currentRotation.multiply(this.tempQuat);
    }
  }

  /**
   * Updates tile positions during return phase
   */
  private updateReturnPhase(): void {
    const easedProgress = this.easeOut(this.phaseProgress);

    for (const state of this.tileStates) {
      // Interpolate position back to original
      state.currentPosition.lerp(state.originalPosition, easedProgress * 0.1);

      // Interpolate rotation back to original
      state.currentRotation.slerp(state.originalRotation, easedProgress * 0.1);
    }
  }
}
