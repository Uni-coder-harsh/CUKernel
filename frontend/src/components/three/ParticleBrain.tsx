// src/components/three/ParticleBrain.tsx
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import type { Points } from 'three'; 
import { BufferGeometry, Float32BufferAttribute } from 'three'; 
import { gsap } from 'gsap'; 

// --- Configuration ---
const NUM_PARTICLES = 400; 
const NETWORK_SCALE = 12; 
const MAX_CONNECT_DISTANCE = 3.0;
const INITIAL_SCATTER_BOUNDS = 40; 
const MOVEMENT_BOUNDS = 15;
const MAX_EDGES = NUM_PARTICLES * (NUM_PARTICLES - 1) / 2;
const MAX_VERTICES = MAX_EDGES * 2; 
const MAX_BUFFER_SIZE = MAX_VERTICES * 3;

interface ParticleProps {
  mouse: React.MutableRefObject<number[]>; 
  onAnimationComplete?: () => void; // Signals completion to the HeroSection
}

const Particles = ({ mouse, onAnimationComplete }: ParticleProps) => {
  const lineGeometryRef = useRef<BufferGeometry>(null!);
  const pointsRef = useRef<Points>(null!); 
  const coreLightRef = useRef<THREE.PointLight>(null!);
  const sparkLightRef = useRef<THREE.PointLight>(null!); 
  const groupRef = useRef<THREE.Group>(null!); 
  
  const { camera } = useThree(); 

  // Generate initial scattered positions and target network positions
  const particlesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const initialPos = new THREE.Vector3(
        (Math.random() - 0.5) * INITIAL_SCATTER_BOUNDS * 2,
        (Math.random() - 0.5) * INITIAL_SCATTER_BOUNDS * 2,
        (Math.random() - 0.5) * INITIAL_SCATTER_BOUNDS * 2
      );

      // Target position for the neural network structure
      const targetPos = new THREE.Vector3(
        (Math.random() - 0.5) * NETWORK_SCALE,
        (Math.random() - 0.5) * NETWORK_SCALE,
        (Math.random() - 0.5) * NETWORK_SCALE
      );

      data.push({
        initialPosition: initialPos,
        targetPosition: targetPos,
        currentPosition: initialPos.clone(),
        velocity: new THREE.Vector3(0, 0, 0),
        color: Math.random() > 0.5 ? new THREE.Color('#00D4FF') : new THREE.Color('#7C3AED'),
      });
    }
    return data;
  }, []);

  const particlePositionArray = useMemo(() => {
    const array = new Float32Array(NUM_PARTICLES * 3);
    particlesData.forEach((p, i) => p.initialPosition.toArray(array, i * 3));
    return array;
  }, [particlesData]);

  const particleColorArray = useMemo(() => {
    const array = new Float32Array(NUM_PARTICLES * 3);
    particlesData.forEach((p, i) => p.color.toArray(array, i * 3));
    return array;
  }, [particlesData]);


  // --- GSAP CINEMATIC ENTRY TIMELINE ---
  useLayoutEffect(() => {
    const tl = gsap.timeline({ 
        delay: 0.5,
        onComplete: () => {
            onAnimationComplete && onAnimationComplete(); // Signal completion
        }
    });
    
    // Initial State Setup
    camera.position.set(0, 0, 80); 
    camera.lookAt(0,0,0);
    if (coreLightRef.current) coreLightRef.current.intensity = 0.0;
    if (sparkLightRef.current) sparkLightRef.current.intensity = 0.0;
    
    // Animate material opacity from 0
    if (pointsRef.current && (pointsRef.current.material as THREE.PointsMaterial)) {
        (pointsRef.current.material as THREE.PointsMaterial).opacity = 0;
    }


    // --- Phase 1: Initial Camera Fly-in & Spark (0s - 3.5s) ---
    tl.to(camera.position, { // Camera flies in to reveal scattered particles
        z: 30, 
        duration: 3.0, 
        ease: "power2.inOut",
    }, 0)

    .to((pointsRef.current.material as THREE.PointsMaterial), { // Particles become visible during fly-in
        opacity: 1,
        duration: 2.0,
        ease: "power2.inOut"
    }, 0.5) 

    .to(sparkLightRef.current, { // Spark light burst
        intensity: 5.0, 
        duration: 0.2, 
        ease: "power3.out"
    }, 2.5) 
    .to(sparkLightRef.current, { 
        intensity: 0.0, 
        duration: 0.8, 
        ease: "power2.in"
    }, 2.7)


    // --- Phase 2: Particles move into Network Formation (3.0s - 5.5s) ---
    particlesData.forEach((p, i) => {
        tl.to(p.currentPosition, {
            x: p.targetPosition.x,
            y: p.targetPosition.y,
            z: p.targetPosition.z,
            duration: 2.0,
            ease: "power3.out",
            delay: 0.5 + (i * 0.005) 
        }, 3.0); // Starts after spark fades
    });


    // --- Phase 3: Final Camera Zoom & Core Light Activation (5.5s - 7.0s) ---
    tl.to(camera.position, { // Final camera stabilization zoom
        z: 18, 
        duration: 1.5, 
        ease: "power3.inOut"
    }, 5.5) 

    .to(coreLightRef.current, { // Main network light comes up (the network is now formed)
        intensity: 2.0, 
        duration: 1.5, 
        ease: "power2.in"
    }, 5.5); 
    
    // The continuous movement logic below provides the ongoing dynamic feel.

    return () => { tl.kill(); };
  }, [camera, particlesData, onAnimationComplete]);


  // 2. Animation Loop (Runs every frame for dynamic updates)
  useFrame(({ clock }) => {
    
    if (
      !pointsRef.current || 
      !lineGeometryRef.current || 
      !lineGeometryRef.current.attributes.position ||
      !pointsRef.current.geometry.attributes.position
    ) {
      return; 
    }
    
    const positions = (pointsRef.current.geometry.attributes.position as Float32BufferAttribute).array;
    const tempLinePositions = new Float32Array(MAX_BUFFER_SIZE); 
    let lineIndex = 0; 
    
    // --- Particle Movement & Update ---
    particlesData.forEach((p, i) => {
      // After formation (time > 5.5s), add subtle random movement within bounds
      if (clock.getElapsedTime() > 5.5) { 
          p.velocity.x += (Math.random() - 0.5) * 0.002;
          p.velocity.y += (Math.random() - 0.5) * 0.002;
          p.velocity.z += (Math.random() - 0.5) * 0.002;

          p.velocity.clampScalar(-0.02, 0.02);

          p.currentPosition.add(p.velocity);

          // Bounce off invisible bounds
          if (Math.abs(p.currentPosition.x) > MOVEMENT_BOUNDS / 2) p.velocity.x *= -1;
          if (Math.abs(p.currentPosition.y) > MOVEMENT_BOUNDS / 2) p.velocity.y *= -1;
          if (Math.abs(p.currentPosition.z) > MOVEMENT_BOUNDS / 2) p.velocity.z *= -1;
      }
      
      // Update position buffers
      positions[i * 3] = p.currentPosition.x;
      positions[i * 3 + 1] = p.currentPosition.y;
      positions[i * 3 + 2] = p.currentPosition.z;
    });

    // --- Line Connection Logic ---
    for (let i = 0; i < NUM_PARTICLES; i++) {
      for (let j = i + 1; j < NUM_PARTICLES; j++) {
        const p1 = particlesData[i].currentPosition;
        const p2 = particlesData[j].currentPosition;
        const distance = p1.distanceTo(p2);

        if (distance < MAX_CONNECT_DISTANCE) {
          if (lineIndex + 6 <= MAX_BUFFER_SIZE) {
            tempLinePositions[lineIndex++] = p1.x;
            tempLinePositions[lineIndex++] = p1.y;
            tempLinePositions[lineIndex++] = p1.z;
            tempLinePositions[lineIndex++] = p2.x;
            tempLinePositions[lineIndex++] = p2.y;
            tempLinePositions[lineIndex++] = p2.z;
          }
        }
      }
    }

    (pointsRef.current.geometry.attributes.position as Float32BufferAttribute).needsUpdate = true;
    
    // --- FINAL STABLE LINE UPDATE LOGIC ---
    const lineAttribute = lineGeometryRef.current.attributes.position as Float32BufferAttribute;
    lineAttribute.set(tempLinePositions.subarray(0, lineIndex), 0); 
    lineAttribute.needsUpdate = true;
    const verticesToDraw = lineIndex / 3;
    lineGeometryRef.current.setDrawRange(0, verticesToDraw); 
    lineGeometryRef.current.computeBoundingSphere();
    
    // Optional: Subtle, continuous rotation of the whole group for ongoing dynamism
    if (groupRef.current) {
        groupRef.current.rotation.y += clock.getDelta() * 0.02;
    }
  });

  // 3. Three.js Objects (JSX) - Render setup
  return (
    <group ref={groupRef}>
      {/* Dynamic Point Light - Main Network Glow */}
      <pointLight 
        ref={coreLightRef} 
        position={[0, 0, 0]} 
        intensity={0.0} 
        color="#00D4FF" 
        distance={25} 
        decay={2} 
      />
       {/* Spark Light - For the initial burst */}
      <pointLight 
        ref={sparkLightRef} 
        position={[2, 0, 5]} 
        intensity={0.0} 
        color="#FFFFFF" 
        distance={10} 
        decay={2} 
      />
      
      {/* 1. The Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositionArray, 3]} 
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColorArray, 3]} 
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.25} 
          sizeAttenuation={true} 
          depthWrite={false} 
          transparent 
          vertexColors={true}
          opacity={0.0} // Start invisible
        />
      </points>

      {/* 2. The Lines */}
      <lineSegments>
        <bufferGeometry attach="geometry" ref={lineGeometryRef} >
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(MAX_BUFFER_SIZE), 3]} 
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#00D4FF" 
          opacity={0.08} 
          transparent 
          depthWrite={false} 
          linewidth={1} 
        />
      </lineSegments>
    </group>
  );
};


// --- 3. The Canvas Wrapper ---
export function ParticleBrainCanvas({ onAnimationComplete }: { onAnimationComplete?: () => void }) {
  const mouse = useRef<number[]>([0, 0]); 

  return (
    <div 
      className="w-full h-full absolute top-0 left-0"
      onPointerMove={e => {
        mouse.current = [
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1,
        ];
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 80], fov: 75 }} 
        flat 
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 15, 30]} /> 
        <ambientLight intensity={0.1} />
        
        <Particles mouse={mouse} onAnimationComplete={onAnimationComplete} />
      </Canvas>
    </div>
  );
}