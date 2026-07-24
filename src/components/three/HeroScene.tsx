import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { colors } from '@/lib/theme';

const { primary, secondary, accent } = colors;

function TorusKnot() {
  const ref = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;

    mouse.current.x += (pointer.x * 0.5 - mouse.current.x) * 0.05;
    mouse.current.y += (-pointer.y * 0.5 - mouse.current.y) * 0.05;

    ref.current.rotation.x = mouse.current.y * 0.5 + Math.sin(clock.elapsedTime * 0.3) * 0.2;
    ref.current.rotation.y = mouse.current.x * 0.5 + Math.sin(clock.elapsedTime * 0.2) * 0.3;
  });


  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.1, 0.35, 64, 8]} />
      <meshPhysicalMaterial
        color={primary}
        emissive={primary}
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.2}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

function OrbitingShapes() {
  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[2.8, 1.2, -1]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial color={secondary} emissive={secondary} emissiveIntensity={0.15} metalness={0.4} roughness={0.3} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-2.5, -1.5, -1.5]}>
          <octahedronGeometry args={[0.45]} />
          <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.15} metalness={0.3} roughness={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

function Particles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={secondary} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  const { invalidate } = useThree();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById('hero');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        invalidate();
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <>
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-4, -3, -5]} intensity={0.2} color={primary} />

      <TorusKnot />
      <OrbitingShapes />
      <Particles />

      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.8} intensity={0.3} />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
