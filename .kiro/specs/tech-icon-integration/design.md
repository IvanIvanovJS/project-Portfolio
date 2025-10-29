# Design Document: Technology Icon Integration

## Overview

This design document outlines the technical approach for integrating technology icons into the existing Three.js Rubik's Cube sphere in the hero section. The solution consists of four main components: an automated icon pipeline (Node.js scripts), a texture atlas system, enhanced Three.js rendering with per-tile materials, and an interaction system using raycasting. The design maintains the existing glassmorphism aesthetic while adding rich visual feedback and interactivity.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Icon Pipeline (Build Time)               │
├─────────────────────────────────────────────────────────────┤
│  1. Icon Fetcher → 2. SVG to PNG Converter → 3. Atlas Gen   │
│     (Node.js)          (Sharp/ImageMagick)      (Spritesmith)│
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  public/textures/
                  ├── icons.v1.png
                  └── icons.v1.json
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Three.js Scene (Runtime)                      │
├─────────────────────────────────────────────────────────────┤
│  ThreeScene.tsx                                              │
│  ├── TextureLoader → Load atlas + JSON                      │
│  ├── TileManager → Assign icons to tiles                    │
│  ├── MaterialManager → Create per-tile materials            │
│  ├── AnimationController → Handle glow + rotation           │
│  └── InteractionHandler → Raycasting + click events         │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **Build Time**: Scripts run during development to generate texture atlas
2. **Load Time**: Three.js scene loads atlas and initializes tile materials
3. **Runtime**: Animation loop updates glow effects and handles interactions
4. **User Interaction**: Raycaster detects clicks/hovers and triggers animations

## Components and Interfaces

### 1. Icon Pipeline Scripts

#### 1.1 Icon Fetcher (`scripts/fetchIcons.js`)

**Purpose**: Download SVG icons from Simple Icons API

**Technology List** (30+ icons):

```javascript
const technologies = [
  'react',
  'vue-dot-js',
  'angular',
  'svelte',
  'nextdotjs',
  'typescript',
  'javascript',
  'html5',
  'css3',
  'sass',
  'tailwindcss',
  'bootstrap',
  'materialui',
  'chakraui',
  'webpack',
  'vite',
  'rollup',
  'babel',
  'eslint',
  'prettier',
  'jest',
  'vitest',
  'cypress',
  'playwright',
  'git',
  'github',
  'gitlab',
  'docker',
  'kubernetes',
  'nodejs',
  'npm',
  'yarn',
  'pnpm',
  'figma',
  'storybook',
];
```

**Implementation**:

```javascript
const https = require('https');
const fs = require('fs');
const path = require('path');

async function fetchIcon(name) {
  const url = `https://cdn.simpleicons.org/${name}`;
  const outputPath = path.join(__dirname, '../assets/icons/svg', `${name}.svg`);

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(outputPath);
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(name);
          });
        } else {
          reject(new Error(`Failed to fetch ${name}: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}
```

**Error Handling**:

- Retry failed downloads up to 3 times with exponential backoff
- Log all errors to `icon-fetch.log`
- Continue processing remaining icons on individual failures

#### 1.2 SVG to PNG Converter (`scripts/convertIcons.js`)

**Purpose**: Convert SVG files to PNG format with consistent dimensions

**Dependencies**: `sharp` (Node.js image processing library)

**Implementation**:

```javascript
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function convertSvgToPng(svgPath, pngPath) {
  await sharp(svgPath)
    .resize(128, 128, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(pngPath);
}
```

**Configuration**:

- Output size: 128×128 pixels
- Transparent background
- PNG compression level: 9 (maximum)
- Maintain aspect ratio with padding

#### 1.3 Atlas Generator (`scripts/generateAtlas.js`)

**Purpose**: Combine PNG icons into a single texture atlas

**Dependencies**: `spritesmith` or custom canvas-based solution

**Implementation**:

```javascript
const Spritesmith = require('spritesmith');
const fs = require('fs').promises;

async function generateAtlas(iconPaths) {
  return new Promise((resolve, reject) => {
    Spritesmith.run(
      {
        src: iconPaths,
        padding: 2,
        algorithm: 'binary-tree',
        algorithmOpts: { sort: true },
      },
      (err, result) => {
        if (err) return reject(err);

        // Ensure power-of-two dimensions
        const size = Math.pow(
          2,
          Math.ceil(
            Math.log2(
              Math.max(result.properties.width, result.properties.height)
            )
          )
        );

        resolve({
          image: result.image,
          coordinates: result.coordinates,
          size,
        });
      }
    );
  });
}
```

**Output Format** (`icons.v1.json`):

```json
{
  "meta": {
    "version": "1.0",
    "size": 1024,
    "iconSize": 128,
    "padding": 2,
    "count": 36
  },
  "frames": {
    "react": { "x": 0, "y": 0, "w": 128, "h": 128 },
    "vue-dot-js": { "x": 130, "y": 0, "w": 128, "h": 128 },
    "angular": { "x": 260, "y": 0, "w": 128, "h": 128 }
  }
}
```

### 2. Three.js Integration

#### 2.1 Texture Loading System

**File**: `src/components/sections/hero/utils/textureLoader.ts`

**Interface**:

```typescript
interface IconFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface AtlasMetadata {
  meta: {
    version: string;
    size: number;
    iconSize: number;
    padding: number;
    count: number;
  };
  frames: Record<string, IconFrame>;
}

interface LoadedAtlas {
  texture: THREE.Texture;
  metadata: AtlasMetadata;
  iconNames: string[];
}

async function loadIconAtlas(): Promise<LoadedAtlas> {
  const textureLoader = new THREE.TextureLoader();

  // Load texture
  const texture = await textureLoader.loadAsync('/textures/icons.v1.png');
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 16;

  // Load metadata
  const response = await fetch('/textures/icons.v1.json');
  const metadata: AtlasMetadata = await response.json();

  return {
    texture,
    metadata,
    iconNames: Object.keys(metadata.frames),
  };
}
```

#### 2.2 Tile Material System

**Challenge**: InstancedMesh shares a single material, but we need different UV offsets per tile

**Solution**: Use custom shader with per-instance attributes

**File**: `src/components/sections/hero/materials/TileMaterial.ts`

**Implementation**:

```typescript
class TileMaterial extends THREE.ShaderMaterial {
  constructor(atlasTexture: THREE.Texture, atlasSize: number) {
    super({
      uniforms: {
        uAtlasTexture: { value: atlasTexture },
        uAtlasSize: { value: atlasSize },
        uTime: { value: 0 },
        uThemeColor: { value: new THREE.Color(0xbaffe9) },
      },
      vertexShader: `
        attribute vec2 uvOffset;
        attribute vec2 uvScale;
        attribute float glowIntensity;
        attribute float animationPhase;
        
        varying vec2 vUv;
        varying float vGlow;
        
        void main() {
          vUv = uv * uvScale + uvOffset;
          vGlow = glowIntensity;
          
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uAtlasTexture;
        uniform vec3 uThemeColor;
        
        varying vec2 vUv;
        varying float vGlow;
        
        void main() {
          vec4 iconColor = texture2D(uAtlasTexture, vUv);
          
          // Glassmorphism base
          vec3 glassColor = mix(vec3(1.0), iconColor.rgb, 0.7);
          
          // Add glow
          vec3 glowColor = uThemeColor * vGlow;
          vec3 finalColor = glassColor + glowColor;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }
}
```

**Per-Instance Attributes**:

```typescript
interface TileAttributes {
  uvOffset: Float32Array; // 2 floats per tile
  uvScale: Float32Array; // 2 floats per tile
  glowIntensity: Float32Array; // 1 float per tile
  animationPhase: Float32Array; // 1 float per tile
}

function setupTileAttributes(
  mesh: THREE.InstancedMesh,
  atlas: LoadedAtlas,
  tileCount: number
): TileAttributes {
  const uvOffset = new Float32Array(tileCount * 2);
  const uvScale = new Float32Array(tileCount * 2);
  const glowIntensity = new Float32Array(tileCount);
  const animationPhase = new Float32Array(tileCount);

  const iconNames = atlas.iconNames;
  const atlasSize = atlas.metadata.meta.size;

  for (let i = 0; i < tileCount; i++) {
    // Assign icon (cycle through available icons)
    const iconName = iconNames[i % iconNames.length];
    const frame = atlas.metadata.frames[iconName];

    // Calculate UV coordinates
    uvOffset[i * 2] = frame.x / atlasSize;
    uvOffset[i * 2 + 1] = frame.y / atlasSize;
    uvScale[i * 2] = frame.w / atlasSize;
    uvScale[i * 2 + 1] = frame.h / atlasSize;

    // Initialize glow
    glowIntensity[i] = 0.3;
    animationPhase[i] = Math.random() * Math.PI * 2;
  }

  // Set attributes on mesh
  mesh.geometry.setAttribute(
    'uvOffset',
    new THREE.InstancedBufferAttribute(uvOffset, 2)
  );
  mesh.geometry.setAttribute(
    'uvScale',
    new THREE.InstancedBufferAttribute(uvScale, 2)
  );
  mesh.geometry.setAttribute(
    'glowIntensity',
    new THREE.InstancedBufferAttribute(glowIntensity, 1)
  );
  mesh.geometry.setAttribute(
    'animationPhase',
    new THREE.InstancedBufferAttribute(animationPhase, 1)
  );

  return { uvOffset, uvScale, glowIntensity, animationPhase };
}
```

#### 2.3 Animation Controller

**File**: `src/components/sections/hero/controllers/AnimationController.ts`

**Responsibilities**:

- Update glow intensity with pulsing animation
- Handle click-triggered rotation animations
- Manage animation state per tile

**Implementation**:

```typescript
interface TileAnimationState {
  isAnimating: boolean;
  targetGlow: number;
  currentGlow: number;
  rotationProgress: number;
  rotationAxis: THREE.Vector3;
  initialQuaternion: THREE.Quaternion;
}

class AnimationController {
  private tileStates: Map<number, TileAnimationState> = new Map();
  private glowAttribute: THREE.InstancedBufferAttribute;

  constructor(
    tileCount: number,
    glowAttribute: THREE.InstancedBufferAttribute
  ) {
    this.glowAttribute = glowAttribute;

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

  update(deltaTime: number, elapsedTime: number) {
    this.tileStates.forEach((state, index) => {
      // Pulse animation
      if (!state.isAnimating) {
        const phase = elapsedTime * 0.5 + index * 0.1;
        state.targetGlow = 0.3 + Math.sin(phase) * 0.1;
      }

      // Smooth glow transition
      state.currentGlow += (state.targetGlow - state.currentGlow) * 0.1;
      this.glowAttribute.setX(index, state.currentGlow);

      // Click animation
      if (state.isAnimating) {
        state.rotationProgress += deltaTime * 0.67; // 1.5 second duration

        if (state.rotationProgress >= 1.0) {
          state.isAnimating = false;
          state.rotationProgress = 0;
          state.targetGlow = 0.3;
        }
      }
    });

    this.glowAttribute.needsUpdate = true;
  }

  triggerClickAnimation(tileIndex: number) {
    const state = this.tileStates.get(tileIndex);
    if (!state || state.isAnimating) return;

    state.isAnimating = true;
    state.targetGlow = 1.0;
    state.rotationProgress = 0;
  }

  setHoverGlow(tileIndex: number, isHovering: boolean) {
    const state = this.tileStates.get(tileIndex);
    if (!state || state.isAnimating) return;

    state.targetGlow = isHovering ? 0.6 : 0.3;
  }
}
```

#### 2.4 Interaction Handler

**File**: `src/components/sections/hero/controllers/InteractionHandler.ts`

**Responsibilities**:

- Raycasting for mouse/touch detection
- Click and hover event handling
- Cursor style management

**Implementation**:

```typescript
class InteractionHandler {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private mesh: THREE.InstancedMesh;
  private canvas: HTMLCanvasElement;
  private hoveredTileIndex: number | null = null;

  constructor(
    camera: THREE.Camera,
    mesh: THREE.InstancedMesh,
    canvas: HTMLCanvasElement,
    private animationController: AnimationController
  ) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.mesh = mesh;
    this.canvas = canvas;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('click', this.onClick);
    this.canvas.addEventListener('touchstart', this.onTouchStart);
  }

  private onMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.updateHover();
  };

  private updateHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.mesh);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;

      if (instanceId !== undefined && instanceId !== this.hoveredTileIndex) {
        // Clear previous hover
        if (this.hoveredTileIndex !== null) {
          this.animationController.setHoverGlow(this.hoveredTileIndex, false);
        }

        // Set new hover
        this.hoveredTileIndex = instanceId;
        this.animationController.setHoverGlow(instanceId, true);
        this.canvas.style.cursor = 'pointer';
      }
    } else {
      // Clear hover
      if (this.hoveredTileIndex !== null) {
        this.animationController.setHoverGlow(this.hoveredTileIndex, false);
        this.hoveredTileIndex = null;
      }
      this.canvas.style.cursor = 'default';
    }
  }

  private onClick = (event: MouseEvent) => {
    if (this.hoveredTileIndex !== null) {
      this.animationController.triggerClickAnimation(this.hoveredTileIndex);
    }
  };

  private onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.mesh);

      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        this.animationController.triggerClickAnimation(
          intersects[0].instanceId
        );
      }
    }
  };

  dispose() {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
  }
}
```

### 3. Modified RubikSphere Component

**File**: `src/components/sections/hero/ThreeScene.tsx` (updated)

**Key Changes**:

```typescript
function RubikSphere({ theme }: { theme: 'light' | 'dark' }) {
  const groupRef = useRef<THREE.Group>(null);
  const tilesRef = useRef<THREE.InstancedMesh>(null);
  const [atlas, setAtlas] = useState<LoadedAtlas | null>(null);
  const animationControllerRef = useRef<AnimationController | null>(null);
  const interactionHandlerRef = useRef<InteractionHandler | null>(null);

  // Load atlas on mount
  useEffect(() => {
    loadIconAtlas()
      .then(setAtlas)
      .catch(err => {
        console.error('Failed to load icon atlas:', err);
        // Fallback: render without icons
      });
  }, []);

  // Setup materials and attributes when atlas loads
  useEffect(() => {
    if (!atlas || !tilesRef.current) return;

    // Create custom material
    const material = new TileMaterial(atlas.texture, atlas.metadata.meta.size);
    tilesRef.current.material = material;

    // Setup per-instance attributes
    const attributes = setupTileAttributes(tilesRef.current, atlas, tileCount);

    // Initialize controllers
    animationControllerRef.current = new AnimationController(
      tileCount,
      tilesRef.current.geometry.getAttribute('glowIntensity') as THREE.InstancedBufferAttribute
    );

    // Setup interaction (get canvas from parent)
    const canvas = tilesRef.current.parent?.parent?.parent as any;
    if (canvas?.gl?.domElement) {
      interactionHandlerRef.current = new InteractionHandler(
        canvas.camera,
        tilesRef.current,
        canvas.gl.domElement,
        animationControllerRef.current
      );
    }
  }, [atlas]);

  // Animation loop
  useFrame((state) => {
    if (!tilesRef.current || !groupRef.current) return;

    // Update animation controller
    if (animationControllerRef.current) {
      animationControllerRef.current.update(
        state.clock.getDelta(),
        state.clock.elapsedTime
      );
    }

    // Existing sphere rotation and tile positioning code...
  });

  // Cleanup
  useEffect(() => {
    return () => {
      interactionHandlerRef.current?.dispose();
    };
  }, []);

  return (
    <group ref={groupRef}>
      <instancedMesh ref={tilesRef} args={[undefined, undefined, tileCount]}>
        <boxGeometry args={[0.28, 0.28, 0.05]} />
        {/* Material will be replaced when atlas loads */}
        <meshPhysicalMaterial
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.3}
        />
      </instancedMesh>
    </group>
  );
}
```

## Data Models

### Icon Metadata

```typescript
interface IconMetadata {
  name: string;
  displayName: string;
  category: 'framework' | 'language' | 'tool' | 'platform';
  color: string; // Hex color from Simple Icons
}
```

### Tile State

```typescript
interface TileState {
  index: number;
  iconName: string;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  glowIntensity: number;
  isHovered: boolean;
  isAnimating: boolean;
}
```

## Error Handling

### Build-Time Errors

1. **Icon fetch failure**: Log error, continue with remaining icons
2. **SVG conversion failure**: Skip icon, log warning
3. **Atlas generation failure**: Abort build, display error message

### Runtime Errors

1. **Atlas load failure**: Render tiles with solid glassmorphism material (existing behavior)
2. **WebGL context loss**: Display fallback UI
3. **Performance degradation**: Reduce glow effect complexity, disable animations

### Fallback Strategy

```typescript
function renderFallbackTiles() {
  return (
    <instancedMesh ref={tilesRef} args={[undefined, undefined, tileCount]}>
      <boxGeometry args={[0.28, 0.28, 0.05]} />
      <meshPhysicalMaterial
        transparent
        opacity={0.9}
        roughness={0.2}
        metalness={0.3}
        transmission={0.6}
        thickness={0.3}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </instancedMesh>
  );
}
```

## Testing Strategy

### Unit Tests

1. **Icon Pipeline**:
   - Test icon fetching with mock HTTP responses
   - Test SVG to PNG conversion with sample files
   - Test atlas generation with various icon counts

2. **Texture Loading**:
   - Test atlas loading with valid/invalid paths
   - Test JSON parsing with malformed data
   - Test texture configuration

3. **Animation Controller**:
   - Test glow intensity calculations
   - Test animation state transitions
   - Test timing and easing functions

### Integration Tests

1. **Three.js Scene**:
   - Test material creation with loaded atlas
   - Test attribute setup for various tile counts
   - Test interaction handler initialization

2. **User Interactions**:
   - Test raycasting with simulated mouse events
   - Test click animations
   - Test hover state transitions

### Performance Tests

1. **Frame Rate**: Measure FPS with various device profiles
2. **Memory Usage**: Monitor texture memory and geometry buffers
3. **Load Time**: Measure atlas loading and initialization time

### Accessibility Tests

1. **Keyboard Navigation**: Test tab focus and Enter/Space activation
2. **Reduced Motion**: Test with prefers-reduced-motion enabled
3. **Screen Readers**: Verify ARIA labels and descriptions

## Performance Considerations

### Optimization Techniques

1. **Texture Atlas**: Single texture reduces draw calls from 54 to 1
2. **Instanced Rendering**: Efficient rendering of multiple tiles
3. **Custom Shaders**: GPU-accelerated glow effects
4. **Lazy Loading**: Load atlas only when hero section is visible
5. **Mipmap Generation**: Smooth texture scaling at different distances

### Mobile Optimizations

1. Reduce atlas size to 512×512 on mobile devices
2. Disable glow pulsing animation on low-end devices
3. Use lower anisotropic filtering (4x instead of 16x)
4. Reduce raycasting frequency (every 3rd frame)

### Memory Management

- Atlas texture: ~1-4 MB (depending on size and compression)
- Per-tile attributes: ~1 KB per tile × 54 tiles = ~54 KB
- Total overhead: ~5 MB maximum

## Deployment Considerations

### Build Process

1. Add icon pipeline scripts to `package.json`:

   ```json
   {
     "scripts": {
       "icons:fetch": "node scripts/fetchIcons.js",
       "icons:convert": "node scripts/convertIcons.js",
       "icons:atlas": "node scripts/generateAtlas.js",
       "icons:build": "npm run icons:fetch && npm run icons:convert && npm run icons:atlas",
       "prebuild": "npm run icons:build"
     }
   }
   ```

2. Ensure `public/textures/` is included in build output

### Cache Strategy

- Use versioned filenames (`icons.v1.png`) for cache-busting
- Set long cache headers for texture files (1 year)
- Update version number when icon set changes

### CDN Considerations

- Serve texture atlas from CDN for faster loading
- Use WebP format where supported (with PNG fallback)
- Implement progressive loading for large atlases

## Accessibility Features

### Keyboard Navigation

```typescript
// Add keyboard event listeners
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Cycle through tiles
      focusNextTile();
    } else if (event.key === 'Enter' || event.key === ' ') {
      // Activate focused tile
      if (focusedTileIndex !== null) {
        animationController.triggerClickAnimation(focusedTileIndex);
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### ARIA Labels

```tsx
<Canvas
  aria-label="Interactive 3D sphere displaying technology icons"
  role="img"
  tabIndex={0}
>
  {/* Scene content */}
</Canvas>
```

### Reduced Motion Support

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable rotation animations
  // Keep static icon display
  // Disable glow pulsing
}
```

## Future Enhancements

1. **Dynamic Icon Loading**: Load icons on-demand based on user interaction
2. **Icon Tooltips**: Display technology name on hover
3. **Category Filtering**: Filter visible icons by category
4. **Custom Icon Upload**: Allow users to add custom icons
5. **Animation Presets**: Different animation styles (wave, ripple, cascade)
6. **Performance Monitoring**: Real-time FPS display and automatic quality adjustment
