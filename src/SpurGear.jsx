import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

export default function SpurGear({ 
  teeth = 20,
  module = 1,
  thickness = 0.5,
  boreRadius = 0.2,
  pressureAngle = 20,
  color = '#10b981',
  opacity = 1
}) {
  const meshRef = useRef();

  // Generate gear geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Calculate gear dimensions
    let effectiveModule = module;
    const pitchRadius = (effectiveModule * teeth) / 2;
    
    // Auto-adjust module if bore radius is too large
    const minPitchRadius = boreRadius * 1.5; // Bore should be at most 2/3 of pitch radius
    if (pitchRadius < minPitchRadius) {
      effectiveModule = (minPitchRadius * 2) / teeth;
    }
    
    const adjustedPitchRadius = (effectiveModule * teeth) / 2;
    const baseRadius = adjustedPitchRadius * Math.cos((pressureAngle * Math.PI) / 180);
    const outerRadius = adjustedPitchRadius + effectiveModule;
    const rootRadius = adjustedPitchRadius - 1.25 * effectiveModule;
    
    const toothAngle = (2 * Math.PI) / teeth;
    const toothWidth = (Math.PI * module) / 2;
    
    // Draw gear profile
    for (let i = 0; i < teeth; i++) {
      const angle = i * toothAngle;
      
      // Root
      const rootAngle1 = angle - toothWidth / (2 * rootRadius);
      const rootAngle2 = angle + toothWidth / (2 * rootRadius);
      
      if (i === 0) {
        shape.moveTo(
          rootRadius * Math.cos(rootAngle1),
          rootRadius * Math.sin(rootAngle1)
        );
      }
      
      // Tooth profile (simplified)
      shape.lineTo(
        rootRadius * Math.cos(rootAngle1),
        rootRadius * Math.sin(rootAngle1)
      );
      
      shape.lineTo(
        outerRadius * Math.cos(angle - toothWidth / (2 * outerRadius)),
        outerRadius * Math.sin(angle - toothWidth / (2 * outerRadius))
      );
      
      shape.lineTo(
        outerRadius * Math.cos(angle + toothWidth / (2 * outerRadius)),
        outerRadius * Math.sin(angle + toothWidth / (2 * outerRadius))
      );
      
      shape.lineTo(
        rootRadius * Math.cos(rootAngle2),
        rootRadius * Math.sin(rootAngle2)
      );
    }
    
    shape.closePath();
    
    // Add bore hole
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
    
    // Extrude settings
    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    
    return geometry;
  }, [teeth, module, thickness, boreRadius, pressureAngle]);

  // Export to STL function
  const exportSTL = () => {
    if (!meshRef.current) return;

    const exporter = new STLExporter();
    const stlString = exporter.parse(meshRef.current);
    const blob = new Blob([stlString], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gear_t${teeth}_m${module}_th${thickness}.stl`;
    link.click();
  };

  // Attach export function to the mesh
  if (meshRef.current) {
    meshRef.current.exportSTL = exportSTL;
  }

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      castShadow 
      receiveShadow
    >
      <meshStandardMaterial 
        color={color}
        metalness={0.5}
        roughness={0.3}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}
