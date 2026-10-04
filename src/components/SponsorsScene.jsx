import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';

// Trimmed-down rendering for phones / reduced-motion devices.
const isLowPower = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

// Click-and-drag rotation. The canvas is pointer-events:none so it can't block
// the page, so we track drags on the window.
function useDragRotation() {
  const drag = useRef({ rotX: 0, rotY: 0, dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const onDown = (e) => {
      drag.current.dragging = true;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;
      document.body.style.userSelect = 'none';
    };
    const onMove = (e) => {
      const d = drag.current;
      if (!d.dragging) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.rotY += dx * 0.006;
      d.rotX += dy * 0.0035;
    };
    const onUp = () => {
      drag.current.dragging = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.body.style.userSelect = '';
    };
  }, []);

  return drag;
}

// Root group: at idle the globe spins in place; drag revolves the whole thing.
function Stage({ children }) {
  const ref = useRef(null);
  const drag = useDragRotation();

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const d = drag.current;
    g.rotation.y = d.rotY;
    g.rotation.x = d.rotX;
  });

  return <group ref={ref}>{children}</group>;
}

// A ring is a fixed orbit plane; the planets on it revolve along the ring while
// each spins on its own axis (like moons/planets on an orbit).
function GlobeRing({ radius, tilt, color, opacity, tube, speed, count = 4, shapeSize = 0.42 }) {
  const shapes = useRef(null);
  // One shared geometry for every planet on this ring (cheaper than per-mesh).
  const planetGeo = useMemo(() => new THREE.IcosahedronGeometry(shapeSize, 1), [shapeSize]);

  useFrame((state) => {
    const g = shapes.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const orbit = t * speed; // revolution speed along the ring
    g.children.forEach((child, i) => {
      const a = orbit + (i / count) * Math.PI * 2;
      // Revolve: sit exactly on the ring (torus lies in the XY plane).
      child.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      // Rotate: spin about the planet's own axis.
      child.rotation.y = t * 1.3 + i * 1.7;
    });
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, tube, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
      <group ref={shapes}>
        {Array.from({ length: count }).map((_, i) => (
          <mesh key={i} geometry={planetGeo}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.9} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// The line-structure globe: a lighter wireframe shell, a pulse halo and rings
// that act as orbits for same-coloured planets.
function Globe({ radius = 8.5 }) {
  const ref = useRef(null);
  const halo = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // Only the globe spins on its own axis; the rings stay fixed as orbits.
    if (ref.current) ref.current.rotation.y -= delta * 0.06;
    if (halo.current) halo.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.05);
  });

  return (
    <group>
      {/* Globe body — triangular geodesic wireframe. */}
      <group ref={ref}>
        <mesh>
          <icosahedronGeometry args={[radius, 3]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.6} toneMapped={false} />
        </mesh>

        {/* Pulsing atmosphere. */}
        <mesh ref={halo} scale={1.1}>
          <sphereGeometry args={[radius, 24, 24]} />
          <meshBasicMaterial
            color="#3f7bff"
            transparent
            opacity={0.09}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Rings: fixed orbit planes, planets revolve + spin (colour-matched). */}
      <group>
        <GlobeRing
          radius={radius * 1.18}
          tilt={[Math.PI / 2, 0.18, 0.06]}
          color="#9fc0ff"
          opacity={0.7}
          tube={0.022}
          speed={0.5}
          count={4}
          shapeSize={0.62}
        />
        <GlobeRing
          radius={radius * 1.32}
          tilt={[Math.PI / 2.45, 0.72, -0.22]}
          color="#ff6b86"
          opacity={0.58}
          tube={0.02}
          speed={0.38}
          count={5}
          shapeSize={0.52}
        />
        <GlobeRing
          radius={radius * 1.46}
          tilt={[Math.PI / 1.75, -0.52, 0.36]}
          color="#7fe9ff"
          opacity={0.5}
          tube={0.018}
          speed={0.3}
          count={6}
          shapeSize={0.44}
        />
      </group>
    </group>
  );
}

function Shapes() {
  return (
    <>
      <Globe radius={8.5} />
      <Sparkles count={isLowPower() ? 35 : 60} scale={[50, 30, 30]} size={2.2} speed={0.3} opacity={0.7} color="#9fc4ff" />
    </>
  );
}

// A distant spiral galaxy band + nebula haze for a galactic backdrop.
function Galaxy() {
  const ref = useRef(null);

  const geometry = useMemo(() => {
    const count = isLowPower() ? 1400 : 2200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();
    const arms = 4;
    const radius = 95;

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.6) * radius;
      const branch = ((i % arms) / arms) * Math.PI * 2;
      const angle = branch + r * 0.045 + (Math.random() - 0.5) * 0.4;
      const spread = (Math.random() - 0.5) * (3 + r * 0.09);
      positions[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = spread;
      positions[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 4;

      const t = r / radius;
      c.setHSL(0.62 - t * 0.18, 0.5, 0.62 + Math.random() * 0.28);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref} geometry={geometry} position={[0, 0, -70]} rotation={[0.42, 0, 0.28]}>
      <pointsMaterial
        size={0.3}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SponsorsScene() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      dpr={isLowPower() ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 19], fov: 58 }}
      gl={{ antialias: !isLowPower(), alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.5 }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Galaxy />
        <Stage>
          <Shapes />
        </Stage>
        <Stars radius={320} depth={200} count={isLowPower() ? 1400 : 2600} factor={6} saturation={0} fade speed={0.5} />
        <Stars radius={150} depth={90} count={isLowPower() ? 500 : 1100} factor={4} saturation={0} fade speed={0.8} />
      </Suspense>
    </Canvas>
  );
}
