import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { loadIconAtlas, type LoadedAtlas } from './utils/textureLoader';
import { setupTileAttributes } from './utils/tileAttributes';
import { TileMaterial } from './materials/TileMaterial';
import { AnimationController } from './controllers/AnimationController';
import { InteractionHandler } from './controllers/InteractionHandler';

interface ThreeSceneProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
}

// Rubik's Cube style sphere
function RubikSphere({ theme }: { theme: 'light' | 'dark' }) {
  const groupRef = useRef<THREE.Group>(null);
  const tilesRef = useRef<THREE.InstancedMesh>(null);
  const [atlas, setAtlas] = useState<LoadedAtlas | null>(null);
  const animationControllerRef = useRef<AnimationController | null>(null);
  const interactionHandlerRef = useRef<InteractionHandler | null>(null);
  const wasExplosionActive = useRef<boolean>(false);
  const normalAnimationBlend = useRef<number>(1);
  const { gl, camera } = useThree();

  // Detect prefers-reduced-motion media query
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Create material when atlas is available
  const tileMaterial = useMemo(() => {
    if (!atlas) return null;

    const material = new TileMaterial(atlas.texture, atlas.metadata.meta.size);
    material.updateThemeColor(theme === 'dark');

    return material;
  }, [atlas, theme]);

  // Generate cube grid positions and sphere positions
  const { cubePositions, spherePositions, rotations, sphereRadius } =
    useMemo(() => {
      const cubePos: THREE.Vector3[] = [];
      const spherePos: THREE.Vector3[] = [];
      const rots: THREE.Quaternion[] = [];

      const gridSize = 3; // 3x3 grid per face
      const tileSize = 0.45; // Increased from 0.3 to 0.45 (50% larger)
      const gap = 0.05;
      const cubeSize = (gridSize * (tileSize + gap)) / 2;
      const sphereRadius = 2.5;

      // Generate tiles for all 6 faces of the cube
      const faces = [
        {
          normal: new THREE.Vector3(0, 0, 1),
          right: new THREE.Vector3(1, 0, 0),
          up: new THREE.Vector3(0, 1, 0),
        }, // Front
        {
          normal: new THREE.Vector3(0, 0, -1),
          right: new THREE.Vector3(-1, 0, 0),
          up: new THREE.Vector3(0, 1, 0),
        }, // Back
        {
          normal: new THREE.Vector3(1, 0, 0),
          right: new THREE.Vector3(0, 0, -1),
          up: new THREE.Vector3(0, 1, 0),
        }, // Right
        {
          normal: new THREE.Vector3(-1, 0, 0),
          right: new THREE.Vector3(0, 0, 1),
          up: new THREE.Vector3(0, 1, 0),
        }, // Left
        {
          normal: new THREE.Vector3(0, 1, 0),
          right: new THREE.Vector3(1, 0, 0),
          up: new THREE.Vector3(0, 0, -1),
        }, // Top
        {
          normal: new THREE.Vector3(0, -1, 0),
          right: new THREE.Vector3(1, 0, 0),
          up: new THREE.Vector3(0, 0, 1),
        }, // Bottom
      ];

      faces.forEach((face) => {
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            // Cube position
            const x = (i - (gridSize - 1) / 2) * (tileSize + gap);
            const y = (j - (gridSize - 1) / 2) * (tileSize + gap);

            const cubePosition = new THREE.Vector3()
              .addScaledVector(face.right, x)
              .addScaledVector(face.up, y)
              .addScaledVector(face.normal, cubeSize);

            cubePos.push(cubePosition);

            // Sphere position (project cube position onto sphere)
            const spherePosition = cubePosition
              .clone()
              .normalize()
              .multiplyScalar(sphereRadius);
            spherePos.push(spherePosition);

            // Rotation to face outward
            const quaternion = new THREE.Quaternion();
            const matrix = new THREE.Matrix4();
            matrix.lookAt(spherePosition, new THREE.Vector3(0, 0, 0), face.up);
            quaternion.setFromRotationMatrix(matrix);
            rots.push(quaternion);
          }
        }
      });

      return {
        cubePositions: cubePos,
        spherePositions: spherePos,
        rotations: rots,
        sphereRadius: sphereRadius,
      };
    }, []);

  const tileCount = cubePositions.length;

  // Animation state
  const animationProgress = useRef(0);
  const targetProgress = useRef(1); // 0 = cube, 1 = sphere

  // Load atlas on component mount (Subtask 10.1)
  useEffect(() => {
    loadIconAtlas()
      .then((loadedAtlas) => {
        if (loadedAtlas) {
          setAtlas(loadedAtlas);
        }
      })
      .catch(() => {
        // Fallback: render without icons (existing material will be used)
      });
  }, []);

  // Setup materials and attributes when atlas loads (Subtasks 10.2, 10.3, 10.4, 10.5)
  useEffect(() => {
    if (!atlas || !tilesRef.current) return;

    try {
      // Subtask 10.3: Set up tile attributes FIRST (before changing material)
      setupTileAttributes(tilesRef.current, atlas, tileCount);

      // Subtask 10.4: Initialize animation controller
      const geometry = tilesRef.current.geometry;
      const glowAttribute = geometry.getAttribute(
        'glowIntensity'
      ) as THREE.InstancedBufferAttribute;

      if (!glowAttribute) {
        return;
      }

      animationControllerRef.current = new AnimationController(
        tileCount,
        glowAttribute,
        tilesRef.current,
        spherePositions,
        rotations,
        sphereRadius,
        reducedMotion
      );

      // Subtask 10.5: Initialize interaction handler
      const canvas = gl.domElement;
      interactionHandlerRef.current = new InteractionHandler(
        camera,
        tilesRef.current,
        canvas,
        animationControllerRef.current
      );
    } catch {
      // Silent error handling
    }

    // Cleanup function
    return () => {
      if (interactionHandlerRef.current) {
        interactionHandlerRef.current.dispose();
        interactionHandlerRef.current = null;
      }
    };
  }, [
    atlas,
    theme,
    tileCount,
    gl.domElement,
    camera,
    spherePositions,
    rotations,
    sphereRadius,
    reducedMotion,
  ]);

  // Update material theme color when theme changes
  useEffect(() => {
    if (!tilesRef.current || !atlas) return;

    const material = tilesRef.current.material as TileMaterial;
    if (material && material.updateThemeColor) {
      material.updateThemeColor(theme === 'dark');
    }
  }, [theme, atlas]);

  useFrame((state, delta) => {
    if (!tilesRef.current || !groupRef.current) return;

    // Subtask 10.6: Update animation controller
    if (animationControllerRef.current) {
      animationControllerRef.current.update(delta, state.clock.elapsedTime);
    }

    // Update material uniforms (uTime, uThemeColor) each frame
    if (atlas && tilesRef.current.material) {
      const material = tilesRef.current.material as TileMaterial;
      if (material.updateTime) {
        material.updateTime(state.clock.elapsedTime);
      }
    }

    // Skip normal sphere animation if explosion is active
    const isExplosionActive =
      animationControllerRef.current?.isExplosionAnimationActive() || false;

    // Detect when explosion just finished
    if (wasExplosionActive.current && !isExplosionActive) {
      // Explosion just finished, reset blend to 0 for smooth fade-in
      normalAnimationBlend.current = 0;
    }
    wasExplosionActive.current = isExplosionActive;

    if (!isExplosionActive) {
      // Smoothly blend normal animation back in after explosion
      normalAnimationBlend.current = Math.min(
        1,
        normalAnimationBlend.current + delta * 1
      );

      // Smooth animation progress
      animationProgress.current +=
        (targetProgress.current - animationProgress.current) * 0.02;

      // Update each tile position and rotation
      const tempMatrix = new THREE.Matrix4();
      const tempPosition = new THREE.Vector3();
      const tempQuaternion = new THREE.Quaternion();
      const tempScale = new THREE.Vector3(1, 1, 1);

      for (let i = 0; i < tileCount; i++) {
        // Lerp between cube and sphere positions
        tempPosition.lerpVectors(
          cubePositions[i],
          spherePositions[i],
          animationProgress.current
        );

        // Add some floating animation (blended)
        const floatOffset =
          Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) *
          0.05 *
          normalAnimationBlend.current;
        tempPosition.y += floatOffset;

        // Set rotation
        tempQuaternion.copy(rotations[i]);

        // Add gentle rotation (blended)
        const rotationOffset = new THREE.Quaternion();
        rotationOffset.setFromEuler(
          new THREE.Euler(
            Math.sin(state.clock.elapsedTime * 0.3 + i * 0.05) *
              0.1 *
              normalAnimationBlend.current,
            Math.sin(state.clock.elapsedTime * 0.2 + i * 0.07) *
              0.1 *
              normalAnimationBlend.current,
            0
          )
        );
        tempQuaternion.multiply(rotationOffset);

        tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
        tilesRef.current.setMatrixAt(i, tempMatrix);
      }

      tilesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Rotate entire group slowly
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  // Don't render until atlas and material are ready
  if (!atlas || !tileMaterial) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <instancedMesh ref={tilesRef} args={[undefined, undefined, tileCount]}>
        <boxGeometry args={[0.42, 0.42, 0.075]} />
        <primitive object={tileMaterial} attach="material" />
      </instancedMesh>
    </group>
  );
}

// Particle system
function Particles({ theme }: { theme: 'light' | 'dark' }) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const particleCount = 300;
    const pos = new Float32Array(particleCount * 3);

    // Use deterministic seeded random
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (seededRandom(i * 3) - 0.5) * 20;
      pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 20;
      pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color={theme === 'dark' ? '#baffe9' : '#305cde'}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Error fallback
function ErrorFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1rem',
        fontFamily: 'var(--font-family-primary)',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
      <div>3D Scene Unavailable</div>
      <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
        WebGL not supported or disabled
      </div>
    </div>
  );
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ theme, isVisible }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Only render on client side to avoid hydration errors
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for WebGL support
  const hasWebGL = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }, []);

  // Show loading state during SSR and initial mount
  if (!isMounted) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#171717',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        Loading 3D Scene...
      </div>
    );
  }

  if (!hasWebGL) {
    return <ErrorFallback />;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#171717',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 7],
          fov: isMobile ? 55 : 52,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          color={theme === 'dark' ? '#baffe9' : '#305cde'}
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.5}
          color={theme === 'dark' ? '#9f7aea' : '#805ad5'}
        />

        {/* Main content */}
        {isVisible && (
          <>
            <RubikSphere theme={theme} />
            <Particles theme={theme} />
          </>
        )}

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
