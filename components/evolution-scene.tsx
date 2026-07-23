"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { EvolutionStage } from "@/lib/evolution-data";

const GAP = 6.2;
const SPREAD = 7.5;
const DEPTH = 3.4;

/** 计算每个阶段在 3D 空间中的坐标：一条向下蜿蜒的长河 */
export function stagePositions(count: number): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    const x = Math.sin(i * 0.62) * SPREAD;
    const y = -i * GAP;
    const z = Math.cos(i * 0.92) * DEPTH;
    return new THREE.Vector3(x, y, z);
  });
}

type FlowProps = {
  curve: THREE.CatmullRomCurve3;
  accent: string;
};

/** 沿曲线流动的光点，表现『时间之流』 */
function FlowParticles({ curve, accent }: FlowProps) {
  const COUNT = 90;
  const pointsRef = useRef<THREE.Points>(null);
  const offsets = useMemo(() => Array.from({ length: COUNT }, (_, i) => i / COUNT), []);
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * 0.04) % 1;
    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    for (let i = 0; i < COUNT; i += 1) {
      const t = (offsets[i] + tRef.current) % 1;
      const p = curve.getPoint(t);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }
    const attr = geom.getAttribute("position") as THREE.BufferAttribute;
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.32}
        color={accent}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

type NodeProps = {
  stage: EvolutionStage;
  position: THREE.Vector3;
  accent: string;
  state: "past" | "current" | "future";
  onSelect: () => void;
};

function StageNode({ stage, position, accent, state, onSelect }: NodeProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const isCurrent = state === "current";

  useFrame((frameState) => {
    const t = frameState.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6;
      const pulse = isCurrent ? 1 + Math.sin(t * 2.4) * 0.08 : 1;
      ringRef.current.scale.setScalar(pulse);
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.x = t * 0.22;
    }
  });

  const size = isCurrent ? 1.35 : 1;
  const opacity = state === "future" ? 0.55 : 1;

  return (
    <group position={position}>
      <mesh
        ref={coreRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <icosahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={isCurrent ? 0.9 : 0.32}
          metalness={0.35}
          roughness={0.2}
          transparent
          opacity={opacity}
          flatShading
        />
      </mesh>

      {/* 光晕外壳 */}
      <mesh scale={size * 1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={isCurrent ? 0.14 : 0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 选中光环 */}
      {isCurrent && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3, 0.045, 12, 64]} />
          <meshBasicMaterial color={accent} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      <Html
        center
        distanceFactor={20}
        position={[0, size + 1.6, 0]}
        className={`evo-node-label${isCurrent ? " evo-node-label--current" : ""}`}
      >
        <span className="evo-node-index" style={{ color: accent }}>
          {stage.index}
        </span>
        <span className="evo-node-title">{stage.title}</span>
      </Html>
    </group>
  );
}

type CameraRigProps = {
  target: THREE.Vector3;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

function CameraRig({ target, controlsRef }: CameraRigProps) {
  const { camera } = useThree();
  const desiredTarget = useRef(target.clone());
  desiredTarget.current.copy(target);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.lerp(desiredTarget.current, 0.07);
    const desiredCam = new THREE.Vector3(
      desiredTarget.current.x * 0.35,
      desiredTarget.current.y + 3.4,
      desiredTarget.current.z + 19
    );
    camera.position.lerp(desiredCam, 0.06);
    controls.update();
  });

  return null;
}

type SceneProps = {
  stages: EvolutionStage[];
  selectedIndex: number;
  accent: string;
  onSelect: (index: number) => void;
};

function EvolutionWorld({ stages, selectedIndex, accent, onSelect }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const positions = useMemo(() => stagePositions(stages.length), [stages.length]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(positions, false, "catmullrom", 0.4), [positions]);
  const linePoints = useMemo(() => curve.getPoints(240), [curve]);
  const target = positions[selectedIndex] ?? positions[0] ?? new THREE.Vector3();

  return (
    <>
      <color attach="background" args={["#05090f"]} />
      <fog attach="fog" args={["#05090f", 24, 62]} />
      <ambientLight intensity={1.1} />
      <pointLight position={[10, 8, 16]} intensity={40} color={accent} />
      <pointLight position={[-14, -20, 6]} intensity={26} color="#8ec5ff" />
      <hemisphereLight args={["#9fd8ff", "#0a1420", 0.4]} />

      <Stars radius={90} depth={60} count={2600} factor={3.4} saturation={0} fade speed={0.6} />

      {/* 河道：外发光 + 内芯 */}
      <Line points={linePoints} color={accent} lineWidth={5} transparent opacity={0.12} />
      <Line points={linePoints} color={accent} lineWidth={1.4} transparent opacity={0.6} />

      <FlowParticles curve={curve} accent={accent} />

      {stages.map((stage, i) => (
        <StageNode
          key={stage.id}
          stage={stage}
          position={positions[i]}
          accent={accent}
          state={i === selectedIndex ? "current" : i < selectedIndex ? "past" : "future"}
          onSelect={() => onSelect(i)}
        />
      ))}

      <CameraRig target={target} controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={10}
        maxDistance={34}
        enableRotate
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.82}
      />
    </>
  );
}

export function EvolutionScene(props: SceneProps) {
  return (
    <div className="evo-canvas-wrap">
      <Canvas camera={{ position: [0, 4, 20], fov: 46 }} dpr={[1, 1.9]}>
        <EvolutionWorld {...props} />
      </Canvas>
    </div>
  );
}
