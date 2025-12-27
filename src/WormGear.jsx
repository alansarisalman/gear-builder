import { useRef } from 'react';

/**
 * Worm Gear - Spiral gear for large reduction ratios
 * TODO: Implement proper worm thread geometry
 */
export default function WormGear({ 
  length = 4,
  radius = 0.5,
  threads = 5,
  boreRadius = 0.2,
  color = '#3b82f6',
  opacity = 1
}) {
  const meshRef = useRef();

  return (
    <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Main cylinder body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, length, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6}
          roughness={0.3}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      
      {/* Center bore */}
      {boreRadius > 0 && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[boreRadius, boreRadius, length * 1.1, 16]} />
          <meshStandardMaterial 
            color="#1e293b"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}
