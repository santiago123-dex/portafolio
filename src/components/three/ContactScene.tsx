import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { colors } from '@/lib/theme';

const { primary, secondary } = colors;

function ContactRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current || !particlesRef.current) return;

    ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.2;
    ringRef.current.rotation.y += 0.005;

    particlesRef.current.rotation.y += 0.001;
  });

  const positions = useMemo(() => {
    const count = 200;
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
        <torusGeometry args={[1.2, 0.05, 32, 64]} />
        <meshPhysicalMaterial color={primary} emissive={primary} emissiveIntensity={0.3} metalness={0.5} roughness={0.2} />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color={secondary} transparent opacity={0.6} sizeAttenuation />
      </points>
    </>
  );
}

export default function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color={primary} />

      <ContactRing />
    </Canvas>
  );
}
