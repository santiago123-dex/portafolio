import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { colors } from '@/lib/theme';

const { primary, secondary, accent } = colors;

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;

    mouseRef.current.x += (pointer.x * 0.5 - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (-pointer.y * 0.5 - mouseRef.current.y) * 0.05;

    groupRef.current.rotation.x = mouseRef.current.y * 0.3;
    groupRef.current.rotation.y = mouseRef.current.x * 0.3;

    groupRef.current.children.forEach((child) => {
      child.rotation.x += 0.003;
      child.rotation.y += 0.007;
    });
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshPhysicalMaterial
            color={primary}
            emissive={primary}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-2.5, 1.5, -1.5]}>
          <octahedronGeometry args={[0.8]} />
          <meshPhysicalMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={0.15}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[2.5, -1, -1]}>
          <torusGeometry args={[0.6, 0.2, 16, 32]} />
          <meshPhysicalMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={0.15}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.4}>
        <mesh position={[-1.8, -2, -2.5]}>
          <tetrahedronGeometry args={[0.7]} />
          <meshPhysicalMaterial
            color={primary}
            emissive={primary}
            emissiveIntensity={0.1}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[2.2, 2, -2]}>
          <torusKnotGeometry args={[0.5, 0.15, 64, 8]} />
          <meshPhysicalMaterial
            color={secondary}
            emissive={secondary}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color={primary} />
      <pointLight position={[5, -5, 5]} intensity={0.3} color={secondary} />

      <FloatingShapes />

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={0.4} />
      </EffectComposer>
    </Canvas>
  );
}
