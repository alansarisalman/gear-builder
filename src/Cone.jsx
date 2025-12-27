import { useRef } from 'react';

export default function Cone({ 
  radius = 1, 
  height = 2,
  segments = 32,
  color = '#3b82f6',
  opacity = 1
}) {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <coneGeometry args={[radius, height, segments]} />
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
