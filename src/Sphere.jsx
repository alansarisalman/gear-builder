import { useRef } from 'react';

export default function Sphere({ 
  radius = 1, 
  segments = 32,
  color = '#3b82f6',
  opacity = 1
}) {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[radius, segments, segments]} />
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
