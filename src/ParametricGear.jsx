import { useMemo } from 'react'
import * as THREE from 'three'

function ParametricGear({ teeth = 20, module = 2, thickness = 10, boreRadius = 5, position = [3, 0, 0] }) {
  
  const geometry = useMemo(() => {
    // Convert mm to meters and scale up for visibility
    const scale = 0.01 // Makes it visible size
    const m = module * scale
    const t = thickness * scale
    const bore = boreRadius * scale
    
    // Gear formulas
    const pitchRadius = (teeth * m) / 2
    const outerRadius = pitchRadius + m
    const rootRadius = pitchRadius - 1.25 * m
    
    // Create gear profile
    const shape = new THREE.Shape()
    
    const segments = teeth * 8 // Points per tooth
    
    // Draw outer gear profile
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const toothPhase = (i % 8) / 8 // 8 segments per tooth
      
      let radius
      if (toothPhase < 0.25) {
        // Root to outer
        radius = THREE.MathUtils.lerp(rootRadius, outerRadius, toothPhase / 0.25)
      } else if (toothPhase < 0.5) {
        // Outer (tip of tooth)
        radius = outerRadius
      } else if (toothPhase < 0.75) {
        // Outer to root
        radius = THREE.MathUtils.lerp(outerRadius, rootRadius, (toothPhase - 0.5) / 0.25)
      } else {
        // Root (valley between teeth)
        radius = rootRadius
      }
      
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    }
    
    // Add bore hole
    if (bore > 0) {
      const holePath = new THREE.Path()
      const holeSegments = 32
      
      for (let i = 0; i <= holeSegments; i++) {
        const angle = (i / holeSegments) * Math.PI * 2
        const x = Math.cos(angle) * bore
        const y = Math.sin(angle) * bore
        
        if (i === 0) {
          holePath.moveTo(x, y)
        } else {
          holePath.lineTo(x, y)
        }
      }
      
      shape.holes.push(holePath)
    }
    
    // Extrude to create 3D gear
    const extrudeSettings = {
      depth: t,
      bevelEnabled: false
    }
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    
    // Center the gear
    geometry.translate(0, 0, -t / 2)
    geometry.rotateX(Math.PI / 2)
    
    return geometry
    
  }, [teeth, module, thickness, boreRadius])
  
  return (
    <mesh geometry={geometry} position={position}>
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}

export default ParametricGear