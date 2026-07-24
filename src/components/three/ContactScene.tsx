import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { colors } from '@/lib/theme';

const { primary, secondary } = colors;

function ContactRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current || !particlesRef.current) return;
    ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.15;
    ringRef.current.rotation.y += 0.003;
    particlesRef.current.rotation.y += 0.0005;
  });

  const positions = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  return (
    <>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.04, 24, 48]} />
        <meshPhysicalMaterial color={primary} emissive={primary} emissiveIntensity={0.2} metalness={0.5} roughness={0.2} />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.015} color={secondary} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
      </points>
    </>
  );
}

function Scene() {
  const { invalidate } = useThree();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById('contact');
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
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <ContactRing />
    </>
  );
}

export default function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
