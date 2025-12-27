import { useRef } from 'react';

/**
 * Beam/Strut - Structural element
 */
export default function Beam({ 
  width = 0.5,
  height = 0.5,
  length = 5,
  color = '#3b82f6',
  opacity = 1
}) {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
      <boxGeometry args={[length, width, height]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3}
        roughness={0.4}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
