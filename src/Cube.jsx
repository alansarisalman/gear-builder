import { useRef } from 'react';

export default function Cube({ 
  width = 2, 
  height = 2, 
  depth = 2,
  color = '#3b82f6',
  opacity = 1
}) {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
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
