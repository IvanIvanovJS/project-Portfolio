import * as THREE from 'three';
import { AnimationController } from './AnimationController';

/**
 * InteractionHandler manages mouse and touch interactions with the 3D tiles
 * using raycasting to detect intersections and trigger animations
 */
export class InteractionHandler {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private mesh: THREE.InstancedMesh;
  private canvas: HTMLCanvasElement;
  private animationController: AnimationController;
  private hoveredTileIndex: number | null = null;

  constructor(
    camera: THREE.Camera,
    mesh: THREE.InstancedMesh,
    canvas: HTMLCanvasElement,
    animationController: AnimationController
  ) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.mesh = mesh;
    this.canvas = canvas;
    this.animationController = animationController;

    this.setupEventListeners();
  }

  /**
   * Set up event listeners for mouse and touch events
   */
  private setupEventListeners(): void {
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('click', this.onClick);
    this.canvas.addEventListener('touchstart', this.onTouchStart);
  }

  /**
   * Handle mouse move events for hover detection
   */
  private onMouseMove = (event: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();

    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.updateHover();
  };

  /**
   * Update hover state using raycasting
   */
  private updateHover(): void {
    // Set raycaster from camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with the instanced mesh
    const intersects = this.raycaster.intersectObject(this.mesh);

    if (intersects.length > 0) {
      // Extract instanceId from the first intersection
      const instanceId = intersects[0].instanceId;

      if (instanceId !== undefined && instanceId !== this.hoveredTileIndex) {
        // Clear previous hover state
        if (this.hoveredTileIndex !== null) {
          this.animationController.setHoverGlow(this.hoveredTileIndex, false);
        }

        // Set new hover state
        this.hoveredTileIndex = instanceId;
        this.animationController.setHoverGlow(instanceId, true);

        // Update cursor to pointer
        this.canvas.style.cursor = 'pointer';
      }
    } else {
      // No intersection - clear hover state
      if (this.hoveredTileIndex !== null) {
        this.animationController.setHoverGlow(this.hoveredTileIndex, false);
        this.hoveredTileIndex = null;
      }

      // Reset cursor to default
      this.canvas.style.cursor = 'default';
    }
  }

  /**
   * Handle click events to trigger tile animations
   */
  private onClick = (): void => {
    // Only trigger animation if a tile is currently hovered
    if (this.hoveredTileIndex !== null) {
      this.animationController.triggerClickAnimation(this.hoveredTileIndex);
    }
  };

  /**
   * Handle touch events for mobile support
   */
  private onTouchStart = (event: TouchEvent): void => {
    // Handle single-touch only (ignore multi-touch gestures)
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();

      // Convert touch coordinates to normalized device coordinates
      this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      // Use raycaster to detect tile intersection
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.mesh);

      // Trigger click animation for touched tile
      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        this.animationController.triggerClickAnimation(
          intersects[0].instanceId
        );
      }
    }
  };

  /**
   * Clean up event listeners to prevent memory leaks
   */
  dispose(): void {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);

    // Clear hover state
    if (this.hoveredTileIndex !== null) {
      this.animationController.setHoverGlow(this.hoveredTileIndex, false);
      this.hoveredTileIndex = null;
    }

    // Reset cursor
    this.canvas.style.cursor = 'default';
  }
}
