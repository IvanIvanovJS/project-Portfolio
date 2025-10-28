import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeSceneProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
}

// Rubik's Cube style sphere
function RubikSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const tilesRef = useRef<THREE.InstancedMesh>(null);

  // Generate cube grid positions and sphere positions
  const { cubePositions, spherePositions, rotations } = useMemo(() => {
    const cubePos: THREE.Vector3[] = [];
    const spherePos: THREE.Vector3[] = [];
    const rots: THREE.Quaternion[] = [];

    const gridSize = 3; // 3x3 grid per face
    const tileSize = 0.3;
    const gap = 0.05;
    const cubeSize = (gridSize * (tileSize + gap)) / 2;
    const sphereRadius = 3;

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
    };
  }, []);

  const tileCount = cubePositions.length;

  // Animation state
  const animationProgress = useRef(0);
  const targetProgress = useRef(1); // 0 = cube, 1 = sphere

  useFrame((state) => {
    if (!tilesRef.current || !groupRef.current) return;

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

      // Add some floating animation
      const floatOffset =
        Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.05;
      tempPosition.y += floatOffset;

      // Set rotation
      tempQuaternion.copy(rotations[i]);

      // Add gentle rotation
      const rotationOffset = new THREE.Quaternion();
      rotationOffset.setFromEuler(
        new THREE.Euler(
          Math.sin(state.clock.elapsedTime * 0.3 + i * 0.05) * 0.1,
          Math.sin(state.clock.elapsedTime * 0.2 + i * 0.07) * 0.1,
          0
        )
      );
      tempQuaternion.multiply(rotationOffset);

      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      tilesRef.current.setMatrixAt(i, tempMatrix);
    }

    tilesRef.current.instanceMatrix.needsUpdate = true;

    // Rotate entire group slowly
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <group ref={groupRef}>
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
    </group>
  );
}

// Particle system
function Particles({ theme }: { theme: 'light' | 'dark' }) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const particleCount = 200;
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
        color={theme === 'dark' ? '#baffe9' : '#ff8800'}
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

  // Only render on client side to avoid hydration errors
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
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
          position: [0, 0, 8],
          fov: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          color={theme === 'dark' ? '#baffe9' : '#ff8800'}
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.5}
          color={theme === 'dark' ? '#9f7aea' : '#805ad5'}
        />

        {/* Main content */}
        {isVisible && (
          <>
            <RubikSphere />
            <Particles theme={theme} />
          </>
        )}

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
