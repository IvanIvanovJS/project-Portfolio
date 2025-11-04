# Design Document

## Overview

Експлозия анимацията е сложна многофазна интерактивна функционалност, която трансформира съществуващата 3D сфера в динамично визуално преживяване. Дизайнът разширява текущата архитектура на `AnimationController` и `InteractionHandler`, добавяйки нова система за управление на състоянието на анимацията с четири отделни фази.

Анимацията използва физически базирани принципи (свиване → напрежение → експлозия → връщане) за създаване на интуитивно и визуално впечатляващо взаимодействие.

## Architecture

### High-Level Flow

```
User Click → InteractionHandler → AnimationController → ExplosionAnimator
                                                              ↓
                                    ┌─────────────────────────┴─────────────────────────┐
                                    ↓                                                     ↓
                            Phase Manager                                         Tile State Manager
                                    ↓                                                     ↓
                    ┌───────────────┼───────────────┐                          Per-Tile Animation Data
                    ↓               ↓               ↓                                     ↓
            Contraction Phase   Explosion Phase   Return Phase                    Update Loop (60 FPS)
                    ↓               ↓               ↓                                     ↓
            Radius Reduction   Random Dispersion   Smooth Return              Render Updated Positions
```

### Component Responsibilities

1. **ExplosionAnimator** (New)
   - Управлява цялата експлозия анимация
   - Координира фазите на анимацията
   - Съхранява оригиналните позиции и ротации на плочките
   - Изчислява нови позиции базирани на текущата фаза

2. **AnimationController** (Extended)
   - Интегрира ExplosionAnimator
   - Управлява glow интензитета
   - Координира между нормални анимации и експлозия
   - Блокира други анимации по време на експлозия

3. **InteractionHandler** (Extended)
   - Детектира кликове на плочки
   - Стартира експлозия анимация
   - Деактивира hover ефекти по време на експлозия

4. **ThreeScene** (Modified)
   - Предава оригинални позиции към AnimationController
   - Позволява override на позиции по време на експлозия

## Components and Interfaces

### ExplosionAnimator Class

```typescript
interface ExplosionConfig {
  contractionDuration: number; // 0.8s
  explosionDuration: number; // 0.6s
  returnDuration: number; // 1.2s
  contractionScale: number; // 0.5 (50% radius)
  minExplosionVelocity: number; // 8 units/s
  maxExplosionVelocity: number; // 15 units/s
  minRotationSpeed: number; // 2 rad/s
  maxRotationSpeed: number; // 5 rad/s
}

enum ExplosionPhase {
  IDLE = 'idle',
  CONTRACTING = 'contracting',
  EXPLODING = 'exploding',
  RETURNING = 'returning',
}

interface TileExplosionState {
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Quaternion;
  currentPosition: THREE.Vector3;
  currentRotation: THREE.Quaternion;
  explosionDirection: THREE.Vector3;
  explosionVelocity: number;
  rotationAxis: THREE.Vector3;
  rotationSpeed: number;
}

class ExplosionAnimator {
  private phase: ExplosionPhase;
  private phaseProgress: number;
  private config: ExplosionConfig;
  private tileStates: TileExplosionState[];
  private originalRadius: number;

  constructor(
    tileCount: number,
    originalPositions: THREE.Vector3[],
    originalRotations: THREE.Quaternion[],
    originalRadius: number
  );

  startExplosion(): void;
  update(deltaTime: number): void;
  isAnimating(): boolean;
  getCurrentPhase(): ExplosionPhase;
  getTilePosition(index: number): THREE.Vector3;
  getTileRotation(index: number): THREE.Quaternion;
  getGlowIntensity(): number;
}
```

### Animation Phase Details

#### Phase 1: Contraction (0.8s)

- **Easing**: Ease-in (accelerating)
- **Radius**: 100% → 50%
- **Glow**: 0.0 → 1.0
- **Formula**: `currentRadius = originalRadius * (1.0 - progress * 0.5)`

#### Phase 2: Explosion (0.6s)

- **Easing**: Linear (constant velocity)
- **Position**: Sphere → Random directions
- **Rotation**: Random axis rotation
- **Glow**: 1.0 (maintained)
- **Formula**: `position += direction * velocity * deltaTime`

#### Phase 3: Return (1.2s)

- **Easing**: Ease-out (decelerating)
- **Position**: Dispersed → Original sphere
- **Rotation**: Random → Original
- **Glow**: 1.0 → 0.0
- **Formula**: `lerp(currentPos, originalPos, easedProgress)`

## Data Models

### Tile Animation State

```typescript
interface TileExplosionState {
  // Original state (stored at animation start)
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Quaternion;

  // Current animated state
  currentPosition: THREE.Vector3;
  currentRotation: THREE.Quaternion;

  // Explosion parameters (randomized per tile)
  explosionDirection: THREE.Vector3; // Normalized direction vector
  explosionVelocity: number; // Speed in units/second
  rotationAxis: THREE.Vector3; // Random rotation axis
  rotationSpeed: number; // Angular velocity in rad/s
}
```

### Global Animation State

```typescript
interface ExplosionState {
  isActive: boolean;
  currentPhase: ExplosionPhase;
  phaseProgress: number; // 0.0 to 1.0
  phaseStartTime: number;
  totalElapsedTime: number;
}
```

## Error Handling

### Animation Interruption

- **Problem**: User clicks during active animation
- **Solution**: Ignore clicks when `isAnimating()` returns true
- **Implementation**: Check in `InteractionHandler.onClick()`

### Performance Degradation

- **Problem**: Low FPS on weak devices
- **Solution**: Use delta time for frame-independent animation
- **Fallback**: Reduce particle count if FPS < 30

### Memory Management

- **Problem**: Frequent allocations during animation
- **Solution**: Pre-allocate all Vector3/Quaternion objects
- **Implementation**: Reuse objects in update loop

### Edge Cases

1. **Component unmount during animation**
   - Store cleanup flag
   - Check before each update
   - Cancel animation gracefully

2. **Theme change during animation**
   - Continue animation with new theme color
   - Update glow color smoothly

3. **Window resize during animation**
   - Continue animation (positions are in world space)
   - Camera adjustment handled by Three.js

## Testing Strategy

### Unit Tests

1. **ExplosionAnimator Tests**

   ```typescript
   describe('ExplosionAnimator', () => {
     test('initializes with correct tile count');
     test('transitions through phases in correct order');
     test('calculates contraction radius correctly');
     test('generates random explosion directions');
     test('returns to original positions after completion');
     test('maintains glow intensity per phase');
   });
   ```

2. **Phase Transition Tests**

   ```typescript
   describe('Phase Transitions', () => {
     test('contraction completes after 0.8s');
     test('explosion completes after 0.6s');
     test('return completes after 1.2s');
     test('total animation duration is 2.6s');
   });
   ```

3. **Easing Function Tests**
   ```typescript
   describe('Easing Functions', () => {
     test('ease-in accelerates smoothly');
     test('ease-out decelerates smoothly');
     test('values stay within 0-1 range');
   });
   ```

### Integration Tests

1. **AnimationController Integration**

   ```typescript
   describe('AnimationController with Explosion', () => {
     test('blocks normal animations during explosion');
     test('resumes normal animations after explosion');
     test('updates glow attribute correctly');
   });
   ```

2. **InteractionHandler Integration**
   ```typescript
   describe('InteractionHandler with Explosion', () => {
     test('triggers explosion on tile click');
     test('ignores clicks during active explosion');
     test('disables hover during explosion');
     test('re-enables hover after explosion');
   });
   ```

### Visual/Manual Tests

1. **Animation Smoothness**
   - Verify 60 FPS on desktop
   - Verify 30+ FPS on mobile
   - Check for stuttering or jank

2. **Visual Correctness**
   - Contraction appears smooth and centered
   - Explosion disperses in all directions
   - Return animation is smooth and natural
   - Glow intensity changes are visible

3. **Interaction**
   - Click response is immediate
   - Multiple clicks are properly ignored
   - Hover works before and after animation

### Performance Tests

1. **Frame Rate Monitoring**

   ```typescript
   describe('Performance', () => {
     test('maintains 60 FPS during animation');
     test('no memory leaks after 100 animations');
     test('garbage collection pauses < 16ms');
   });
   ```

2. **Memory Profiling**
   - Monitor heap size during animation
   - Check for object retention
   - Verify cleanup after animation

## Implementation Notes

### Easing Functions

```typescript
// Ease-in (accelerating) - for contraction
function easeIn(t: number): number {
  return t * t;
}

// Ease-out (decelerating) - for return
function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
```

### Random Direction Generation

```typescript
// Generate uniformly distributed random direction on sphere
function randomDirection(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi)
  );
}
```

### Position Update Strategy

```typescript
// During explosion phase
position.add(direction.clone().multiplyScalar(velocity * deltaTime));

// During return phase
position.lerp(originalPosition, easeOut(phaseProgress));
```

### Glow Intensity Calculation

```typescript
function calculateGlowIntensity(
  phase: ExplosionPhase,
  progress: number
): number {
  switch (phase) {
    case ExplosionPhase.CONTRACTING:
      return progress; // 0.0 → 1.0
    case ExplosionPhase.EXPLODING:
      return 1.0; // Maximum
    case ExplosionPhase.RETURNING:
      return 1.0 - progress; // 1.0 → 0.0
    default:
      return 0.0;
  }
}
```

## Performance Optimization

### Object Pooling

- Pre-allocate Vector3 and Quaternion objects
- Reuse temporary objects in update loop
- Avoid `new` keyword during animation

### Batch Updates

- Update all tile positions in single loop
- Mark instanceMatrix as needsUpdate once per frame
- Minimize attribute updates

### Conditional Rendering

- Skip hover raycasting during explosion
- Disable OrbitControls auto-rotate during explosion
- Reduce particle updates during explosion

### Memory Management

```typescript
// Good: Reuse objects
const tempVec = new THREE.Vector3();
for (let i = 0; i < count; i++) {
  tempVec.copy(positions[i]).add(offset);
  mesh.setMatrixAt(i, matrix);
}

// Bad: Create new objects
for (let i = 0; i < count; i++) {
  const vec = positions[i].clone().add(offset); // Allocates memory
  mesh.setMatrixAt(i, matrix);
}
```

## Accessibility Considerations

### Reduced Motion

```typescript
// Respect prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  config.contractionDuration = 0.2;
  config.explosionDuration = 0.2;
  config.returnDuration = 0.3;
}
```

### Visual Feedback

- Ensure glow is visible for users with color blindness
- Maintain sufficient contrast during all phases
- Provide alternative feedback (scale change) alongside glow

### Keyboard Support

- Allow triggering explosion via keyboard (Space/Enter)
- Focus management during animation
- Screen reader announcements (optional)

## Browser Compatibility

### WebGL Support

- Requires WebGL 1.0 minimum
- Fallback: Show static sphere without explosion
- Graceful degradation on unsupported browsers

### Performance Targets

- **Desktop**: 60 FPS (Chrome, Firefox, Safari, Edge)
- **Mobile**: 30+ FPS (iOS Safari, Chrome Android)
- **Tablet**: 45+ FPS

### Testing Matrix

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+
