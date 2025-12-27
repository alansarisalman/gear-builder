import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function Plate({ 
  width = 3,
  length = 3,
  thickness = 0.2,
  color = '#ef4444',
  opacity = 1
}) {
  const meshRef = useRef();

  // Generate simple plate geometry (no holes)
  const geometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(width, thickness, length);
    return geometry;
  }, [width, length, thickness]);

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        color={color}
        metalness={0.6}
        roughness={0.2}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
