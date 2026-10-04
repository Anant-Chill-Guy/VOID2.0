import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

// Devices that can't afford the full scene (phones / reduced-motion / small
// screens) render a trimmed-down version.
const isLowPower = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

// A realistic black hole held at a fixed diagonal angle, spinning on its own
// axis, with a strong blurry gravitational-lensing halo. The galaxy, nebula and
// starfields all drift to keep the space background alive.

const DISK = 7;
const SPHERE = DISK * 0.8;
const TILT = 0.44; // open ellipse, major axis horizontal
const FIXED = [0 , -1.25 , 0]; // no roll — the disk sits purely horizontal by default

// Click-and-drag revolve (window-level, since the canvas is pointer-events:none).
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
      d.rotX += dy * 0.004;
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

function useDiskTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const inner = size * 0.07;
    const outer = size * 0.5;

    const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.04, 'rgba(255,255,245,1)');
    grad.addColorStop(0.1, 'rgba(255,224,160,0.95)');
    grad.addColorStop(0.22, 'rgba(255,170,92,0.72)');
    grad.addColorStop(0.45, 'rgba(255,120,70,0.38)');
    grad.addColorStop(0.72, 'rgba(150,86,220,0.16)');
    grad.addColorStop(1, 'rgba(50,26,110,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fill();

    for (let ring = 0; ring < 4; ring++) {
      const rr = inner + (outer - inner) * (0.12 + ring * 0.2);
      ctx.strokeStyle = `rgba(255,224,180,${0.14 - ring * 0.03})`;
      ctx.lineWidth = 2 + ring * 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function useGlowTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const c = size / 2;
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, 'rgba(255,210,150,0.3)');
    grad.addColorStop(0.26, 'rgba(200,130,240,0.15)');
    grad.addColorStop(0.5, 'rgba(90,50,180,0.06)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

// Blurry Einstein-ring halo — bright just outside the horizon, fading outward.
function useLensingTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const c = size / 2;
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, 'rgba(255,244,220,0)');
    grad.addColorStop(0.32, 'rgba(255,240,205,0)');
    grad.addColorStop(0.39, 'rgba(255,236,196,0.85)');
    grad.addColorStop(0.46, 'rgba(255,182,120,0.42)');
    grad.addColorStop(0.62, 'rgba(170,120,240,0.16)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function useStreakTexture() {
  return useMemo(() => {
    const w = 128;
    const h = 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.translate(w / 2, h / 2);
    ctx.scale(w / h, 1);
    const R = h / 2;
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    grad.addColorStop(0, 'rgba(255,232,196,0.95)');
    grad.addColorStop(0.35, 'rgba(255,160,90,0.5)');
    grad.addColorStop(0.7, 'rgba(150,90,220,0.18)');
    grad.addColorStop(1, 'rgba(80,40,160,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function useNebulaTexture(rgb) {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const c = size / 2;
    const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
    grad.addColorStop(0, `rgba(${rgb},0.5)`);
    grad.addColorStop(0.45, `rgba(${rgb},0.16)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [rgb]);
}

function PullStreaks() {
  const texture = useStreakTexture();

  const streaks = useMemo(
    () =>
      Array.from({ length: isLowPower() ? 6 : 10 }, () => ({
        angle: Math.random() * Math.PI * 2,
        length: DISK * (1.5 + Math.random() * 2),
        width: DISK * (0.4 + Math.random() * 0.6),
        opacity: 0.2 + Math.random() * 0.26,
      })),
    [],
  );

  return streaks.map((s, i) => (
    <group key={i} rotation={[0, s.angle, 0]}>
      <mesh position={[0, 0, DISK * 0.95 + s.length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[s.width, s.length]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={s.opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  ));
}

function BlackHole() {
  const spin = useRef(null);
  const texture = useDiskTexture();
  const glowTexture = useGlowTexture();
  const lensingTexture = useLensingTexture();

  const diskGeometry = useMemo(() => {
    const count = isLowPower() ? 1600 : 3400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const hot = new THREE.Color('#fff3d6');
    const mid = new THREE.Color('#ff9a3c');
    const cold = new THREE.Color('#6a4bd6');
    const c = new THREE.Color();
    const inner = DISK * 1.05;
    const outer = DISK * 3.6;

    for (let i = 0; i < count; i++) {
      const r = inner + Math.pow(Math.random(), 0.7) * (outer - inner);
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * (0.2 + r * 0.06);
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(a) * r;

      const t = (r - inner) / (outer - inner);
      c.copy(hot).lerp(mid, Math.min(1, t * 2)).lerp(cold, Math.max(0, t * 2 - 1));
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
    if (spin.current) spin.current.rotation.y += delta * 0.15;
  });

  return (
    <group rotation={FIXED}>
      {/* Blurry lensing halos hugging the horizon (always face the camera). */}
      <Billboard>
        <mesh>
          <planeGeometry args={[SPHERE * 5, SPHERE * 5]} />
          <meshBasicMaterial
            map={lensingTexture}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      <Billboard>
        <mesh>
          <planeGeometry args={[SPHERE * 8.2, SPHERE * 8.2]} />
          <meshBasicMaterial
            map={lensingTexture}
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      <group rotation={[TILT, 0, 0]}>
        <group ref={spin}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[DISK * 7.2, DISK * 7.2]} />
            <meshBasicMaterial
              map={glowTexture}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[DISK * 7, DISK * 7]} />
            <meshBasicMaterial
              map={texture}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>

          <PullStreaks />

          <points geometry={diskGeometry}>
            <pointsMaterial
              size={0.075}
              sizeAttenuation
              vertexColors
              transparent
              opacity={0.9}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[SPHERE * 1.1, 0.09, 12, 160]} />
          <meshBasicMaterial color="#fff4dc" toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[SPHERE * 1.34, 0.045, 12, 160]} />
          <meshBasicMaterial
            color="#ffab5e"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[SPHERE, 40, 40]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
}

// A spiral galaxy band that drifts visibly.
function Galaxy() {
  const ref = useRef(null);

  const geometry = useMemo(() => {
    const count = isLowPower() ? 1400 : 2400;
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
    if (ref.current) ref.current.rotation.y += delta * 0.035;
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

function Nebula() {
  const ref = useRef(null);
  const purple = useNebulaTexture('96,60,190');
  const blue = useNebulaTexture('40,96,200');

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.006;
  });

  return (
    <group ref={ref}>
      <mesh position={[-18, 10, -36]}>
        <planeGeometry args={[130, 90]} />
        <meshBasicMaterial
          map={purple}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[20, -12, -44]}>
        <planeGeometry args={[140, 100]} />
        <meshBasicMaterial
          map={blue}
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Gentle whole-scene drift so the space never feels still.
function Drift({ children }) {
  const ref = useRef(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return <group ref={ref}>{children}</group>;
}

// Drag-to-revolve the black hole; it still spins on its axis underneath.
function Rig({ children }) {
  const ref = useRef(null);
  const drag = useDragRotation();

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = drag.current.rotY;
    g.rotation.x = drag.current.rotX;
  });

  return <group ref={ref}>{children}</group>;
}

export default function EventsScene() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      dpr={isLowPower() ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 19], fov: 55 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.5 }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <color attach="background" args={['#01020a']} />

      <Suspense fallback={null}>
        <Drift>
          <Galaxy />
          <Nebula />
        </Drift>

        <Rig>
          <BlackHole />
        </Rig>

        <Stars radius={300} depth={170} count={isLowPower() ? 1800 : 3200} factor={4} saturation={0} fade speed={1.4} />
      </Suspense>

      {/* Bloom is the heaviest pass — skip it on phones/reduced-motion. */}
      {!isLowPower() && (
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom
            intensity={1.45}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.8}
          />
          <Vignette offset={0.22} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
