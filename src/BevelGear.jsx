import { useRef } from 'react';

/**
 * Bevel Gear - Conical gear for transmitting motion between intersecting shafts
 * TODO: Implement proper bevel gear tooth geometry
 */
export default function BevelGear({ 
  teeth = 20,
  module = 0.3,
  coneAngle = 45,
  thickness = 0.5,
  boreRadius = 0.3,
  color = '#3b82f6',
  opacity = 1
}) {
  const meshRef = useRef();
  
  // Simplified cone shape as placeholder
  const radius = (module * teeth) / 2;

  return (
    <group ref={meshRef}>
      {/* Main cone body */}
      <mesh castShadow receiveShadow rotation={[0, 0, 0]}>
        <coneGeometry args={[radius, thickness * 2, teeth]} />
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
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[boreRadius, boreRadius, thickness * 2.1, 16]} />
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
