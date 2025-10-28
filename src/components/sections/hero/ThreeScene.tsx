import React, { Suspense, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeSceneProps {
  theme: 'light' | 'dark';
  isVisible: boolean;
}

// Technology data with icons (using text for now, can be replaced with actual icons)
const technologies = [
  { name: 'React', icon: '⚛️', color: '#61DAFB' },
  { name: 'Vue', icon: '🟢', color: '#4FC08D' },
  { name: 'Angular', icon: '🅰️', color: '#DD0031' },
  { name: 'Svelte', icon: '🔥', color: '#FF3E00' },
  { name: 'Next.js', icon: '▲', color: '#000000' },
  { name: 'Nuxt', icon: '💚', color: '#00DC82' },
  { name: 'TypeScript', icon: 'TS', color: '#3178C6' },
  { name: 'JavaScript', icon: 'JS', color: '#F7DF1E' },
  { name: 'HTML5', icon: '🌐', color: '#E34F26' },
  { name: 'CSS3', icon: '🎨', color: '#1572B6' },
  { name: 'Sass', icon: '💄', color: '#CC6699' },
  { name: 'Tailwind', icon: '🌊', color: '#06B6D4' },
  { name: 'Node.js', icon: '🟩', color: '#339933' },
  { name: 'Express', icon: '🚀', color: '#000000' },
  { name: 'GraphQL', icon: '📊', color: '#E10098' },
  { name: 'REST', icon: '🔗', color: '#FF6B6B' },
  { name: 'MongoDB', icon: '🍃', color: '#47A248' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791' },
  { name: 'Redis', icon: '🔴', color: '#DC382D' },
  { name: 'Docker', icon: '🐳', color: '#2496ED' },
  { name: 'AWS', icon: '☁️', color: '#FF9900' },
  { name: 'Vercel', icon: '▲', color: '#000000' },
  { name: 'Git', icon: '📝', color: '#F05032' },
  { name: 'Webpack', icon: '📦', color: '#8DD6F9' },
  { name: 'Vite', icon: '⚡', color: '#646CFF' },
  { name: 'Jest', icon: '🃏', color: '#C21325' },
  { name: 'Cypress', icon: '🌲', color: '#17202C' },
  { name: 'Figma', icon: '🎯', color: '#F24E1E' },
  { name: 'Three.js', icon: '🎲', color: '#000000' },
  { name: 'WebGL', icon: '✨', color: '#990000' },
];

// Individual technology tile component
function TechTile({
  position,
  tech,
  theme,
}: {
  position: [number, number, number];
  tech: (typeof technologies)[0];
  theme: 'light' | 'dark';
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(tech.color),
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      reflectivity: 0.9,
    });
  }, [tech.color]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} material={glassMaterial}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
      </mesh>
      <Text
        position={[position[0], position[1], position[2] + 0.06]}
        fontSize={0.3}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
        anchorX="center"
        anchorY="middle"
      >
        {tech.icon}
      </Text>
    </Float>
  );
}

// Main sphere component
function TechSphere({
  theme,
  mousePosition,
}: {
  theme: 'light' | 'dark';
  mousePosition: { x: number; y: number };
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation
      const baseRotationY = state.clock.elapsedTime * 0.1;
      const baseRotationX = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;

      // Mouse influence
      const mouseInfluenceX = mousePosition.x * 0.3;
      const mouseInfluenceY = mousePosition.y * 0.3;

      groupRef.current.rotation.y = baseRotationY + mouseInfluenceX;
      groupRef.current.rotation.x = baseRotationX + mouseInfluenceY;

      // Floating animation
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  // Generate positions for tiles on a sphere surface
  const tilePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const radius = 4;
    const count = Math.min(technologies.length, 30);

    // Use fibonacci sphere algorithm for even distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;

      positions.push([x, y * radius, z]);
    }

    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {tilePositions.map((position, index) => (
        <TechTile
          key={technologies[index].name}
          position={position}
          tech={technologies[index]}
          theme={theme}
        />
      ))}
    </group>
  );
}

// Enhanced particle system component
function ParticleSystem({
  theme,
  mousePosition,
}: {
  theme: 'light' | 'dark';
  mousePosition: { x: number; y: number };
}) {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate deterministic particle positions
  const originalPositions = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    // Use a deterministic seeded random for consistent positions
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (seededRandom(i * 3) - 0.5) * 25;
      positions[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 25;
      positions[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 25;
    }
    return positions;
  }, []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = originalPositions.slice();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [originalPositions]);

  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: theme === 'dark' ? '#baffe9' : '#ff8800',
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
  }, [theme]);

  useFrame((state) => {
    if (particlesRef.current && originalPositions) {
      // Base rotation
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;

      // Mouse influence on particles
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const mouseInfluence = 2;

      for (let i = 0; i < positions.length; i += 3) {
        const originalX = originalPositions[i];
        const originalY = originalPositions[i + 1];

        positions[i] = originalX + mousePosition.x * mouseInfluence;
        positions[i + 1] = originalY + mousePosition.y * mouseInfluence;

        // Add wave motion
        positions[i + 2] =
          originalPositions[i + 2] +
          Math.sin(state.clock.elapsedTime + i * 0.01) * 0.5;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points
      ref={particlesRef}
      geometry={particleGeometry}
      material={particleMaterial}
    />
  );
}

// Error boundary fallback
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Mouse movement tracking
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      setMousePosition({ x, y });
    },
    []
  );

  // Only render on client side to avoid hydration errors
  React.useEffect(() => {
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
        cursor: 'grab',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
    >
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Loading 3D Scene...
          </div>
        }
      >
        <Canvas
          camera={{
            position: [0, 0, 10],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          {/* Content wrapper */}
          <group>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
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
                <TechSphere theme={theme} mousePosition={mousePosition} />
                <ParticleSystem theme={theme} mousePosition={mousePosition} />
              </>
            )}

            {/* Controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </group>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ThreeScene;
