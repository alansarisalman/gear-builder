import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function Spring({ 
  radius = 0.5,
  coils = 10,
  height = 3,
  wireThickness = 0.1,
  color = '#f59e0b',
  opacity = 1
}) {
  const meshRef = useRef();

  // Generate spring geometry
  const geometry = useMemo(() => {
    const points = [];
    const segments = coils * 20; // 20 points per coil
    const heightPerSegment = height / segments;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * coils * Math.PI * 2;
      const y = i * heightPerSegment - height / 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    // Create tube geometry from the curve
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      segments * 2,
      wireThickness,
      8,
      false
    );
    
    return tubeGeometry;
  }, [radius, coils, height, wireThickness]);

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        color={color}
        metalness={0.7}
        roughness={0.3}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
