import { useRef } from 'react';

/**
 * Bolt - Threaded fastener with head
 */
export default function Bolt({ 
  headDiameter = 1,
  headHeight = 0.4,
  shaftDiameter = 0.6,
  shaftLength = 3,
  color = '#94a3b8',
  opacity = 1
}) {
  const meshRef = useRef();

  return (
    <group ref={meshRef}>
      {/* Bolt head (hexagonal approximation) */}
      <mesh position={[0, shaftLength / 2 + headHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[headDiameter / 2, headDiameter / 2, headHeight, 6]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.2}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
      
      {/* Bolt shaft */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[shaftDiameter / 2, shaftDiameter / 2, shaftLength, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.2}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
