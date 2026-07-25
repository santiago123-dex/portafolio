import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { colors } from '@/lib/theme';

const { primary } = colors;

const W = 30;
const D = 30;
const COUNT = W * D;

function WaveField() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    let i = 0;
    for (let x = 0; x < W; x++) {
      for (let z = 0; z < D; z++) {
        pos[i * 3] = (x / W - 0.5) * 7;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (z / D - 0.5) * 7;
        i++;
      }
    }
    return pos;
  }, []);

  useFrame(({ pointer, clock }) => {
    if (!ref.current) return;

    mouse.current.x += (pointer.x * 0.2 - mouse.current.x) * 0.02;
    mouse.current.y += (-pointer.y * 0.2 - mouse.current.y) * 0.02;

    ref.current.rotation.x = mouse.current.y * 0.1;
    ref.current.rotation.y = mouse.current.x * 0.1;

    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime * 0.4;
    for (let i = 0; i < COUNT; i++) {
      const px = pos[i * 3];
      const pz = pos[i * 3 + 2];
      const dist = Math.sqrt(px * px + pz * pz);
      pos[i * 3 + 1] = Math.sin(px * 1.2 + t) * 0.15 + Math.cos(pz * 1.2 + t * 0.8) * 0.15 + Math.sin(dist * 2 - t * 0.5) * 0.1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={primary}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
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
      <ambientLight intensity={0.5} />
      <WaveField />
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.15} />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
