"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Home } from "lucide-react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Node } from "@/lib/types";
import { buildLayout } from "@/lib/graph";
import { useAtlasStore } from "@/lib/use-atlas-store";

type SceneProps = {
  root: Node;
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onWheel: (delta: number) => void;
};

type GraphViewProps = {
  root: Node;
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  controlsRef: RefObject<OrbitControlsImpl | null>;
};

function GraphView({ root, selectedId, onSelect, onBack, controlsRef }: GraphViewProps) {
  const zoom = useAtlasStore((state) => state.zoom);
  const { camera } = useThree();
  const layout = useMemo(() => buildLayout(root, useAtlasStore.getState().mode, selectedId), [root, selectedId]);
  const nodesById = layout.positionMap;
  const selected = nodesById.get(selectedId) ?? layout.positionMap.get(layout.anchor.id) ?? layout.positioned[0];
  const focusPath = new Set(selected?.path ?? []);
  const defaultTarget = useMemo(() => new THREE.Vector3(0, -10, 0), []);

  useEffect(() => {
    const target = controlsRef.current?.target ?? defaultTarget;
    camera.position.set(target.x, target.y + 10 / zoom, target.z + 28 / zoom);
    camera.lookAt(target);
  }, [camera, controlsRef, defaultTarget, zoom]);

  useFrame(() => {
    const target = controlsRef.current?.target ?? defaultTarget;
    camera.position.lerp(new THREE.Vector3(target.x, target.y + 10 / zoom, target.z + 28 / zoom), 0.08);
    camera.lookAt(target);
  });

  return (
    <>
      <color attach="background" args={["#071018"]} />
      <fog attach="fog" args={["#071018", 18, 55]} />
      <ambientLight intensity={1.7} />
      <pointLight position={[8, 14, 12]} intensity={20} color="#4de0c9" />
      <pointLight position={[-12, -8, -5]} intensity={14} color="#ffb347" />
      <pointLight position={[0, 0, 20]} intensity={10} color="#8ec5ff" />
      <group>
        {layout.edges.map((edge, index) => {
          const from = nodesById.get(edge.from);
          const to = nodesById.get(edge.to);
          if (!from || !to || !from.visible || !to.visible) return null;
          const inFocus = focusPath.has(from.id) && focusPath.has(to.id);
          const color = edge.kind === "cross" ? "rgba(255, 179, 71, 0.8)" : "rgba(142, 197, 255, 0.55)";
          const opacity = edge.kind === "cross" ? (inFocus ? 0.24 : 0.1) : (inFocus ? 0.78 : 0.28);
          return (
            <Line
              key={`${edge.from}-${edge.to}-${index}`}
              points={[from.position, to.position]}
              color={color}
              lineWidth={edge.kind === "cross" ? 1.0 : 1.2}
              transparent
              opacity={opacity}
            />
          );
        })}

        {layout.positioned.map((node) => {
          if (!node.visible) return null;
          const isSelected = node.id === selectedId;
          const isAncestor = selected.path.includes(node.id);
          const intensity = isSelected ? 1 : isAncestor ? 0.92 : 0.65;
          return (
            <group key={node.id} position={node.position}>
              <mesh
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(node.id);
                }}
                onContextMenu={(event) => {
                  event.stopPropagation();
                  onBack();
                }}
              >
                <sphereGeometry args={[node.size, 32, 32]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={0.15 + (isSelected ? 0.38 : 0)}
                  metalness={0.15}
                  roughness={0.25}
                  transparent
                  opacity={intensity}
                />
              </mesh>
              {(isSelected || isAncestor || node.depth <= 1) && (
                <Html center distanceFactor={16} className="node-label">
                  {node.title}
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
}

export function KnowledgeScene({ root, selectedId, onSelect, onBack, onWheel }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const nudge = (dx: number, dy: number) => {
    if (!controlsRef.current) return;
    controlsRef.current.target.x += dx;
    controlsRef.current.target.y += dy;
    controlsRef.current.update?.();
  };

  const resetView = () => {
    if (!controlsRef.current) return;
    controlsRef.current.target.set(0, -10, 0);
    controlsRef.current.update?.();
  };

  return (
    <div
      className="canvas-wrap"
      onWheelCapture={(event) => {
        event.preventDefault();
        onWheel(event.deltaY > 0 ? -0.08 : 0.08);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <Canvas camera={{ position: [0, 0, 22], fov: 44 }} dpr={[1, 1.8]}>
        <GraphView root={root} selectedId={selectedId} onSelect={onSelect} onBack={onBack} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom={false}
          enableRotate={false}
          screenSpacePanning
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />
      </Canvas>
      <div className="pan-pad" aria-label="平移控制">
        <button className="icon-button" onClick={() => nudge(0, 2.2)} title="上移">
          <ArrowUp size={15} />
        </button>
        <div className="pan-row">
          <button className="icon-button" onClick={() => nudge(-2.2, 0)} title="左移">
            <ArrowLeft size={15} />
          </button>
          <button className="icon-button" onClick={resetView} title="重置视图">
            <Home size={15} />
          </button>
          <button className="icon-button" onClick={() => nudge(2.2, 0)} title="右移">
            <ArrowRight size={15} />
          </button>
        </div>
        <button className="icon-button" onClick={() => nudge(0, -2.2)} title="下移">
          <ArrowDown size={15} />
        </button>
      </div>
    </div>
  );
}
