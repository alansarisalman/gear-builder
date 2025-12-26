import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'
import ParametricGear from './ParametricGear'

function Cylinder({ radius, height, segments, meshRef }) {
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(radius, radius, height, segments)
  }, [radius, height, segments])

  return (
    <mesh ref={meshRef} geometry={geometry} position={[-3, 0, 0]}>
      <meshStandardMaterial color="#10b981" />
    </mesh>
  )
}

function App() {
  // Cylinder state
  const [radius, setRadius] = useState(1)
  const [height, setHeight] = useState(2)
  const [segments, setSegments] = useState(32)
  const [scale, setScale] = useState(10)
  
  // Gear state
  const [teeth, setTeeth] = useState(20)
  const [module, setModule] = useState(2)
  const [gearThickness, setGearThickness] = useState(10)
  const [boreRadius, setBoreRadius] = useState(5)
  
  const [isExporting, setIsExporting] = useState(false)
  const meshRef = useRef()

  const exportSTL = () => {
    setIsExporting(true)
    
    try {
      const mesh = meshRef.current
      
      if (!mesh) {
        alert('Mesh not ready yet. Please wait a moment and try again.')
        setIsExporting(false)
        return
      }

      const exportMesh = mesh.clone()
      exportMesh.scale.set(scale, scale, scale)
      exportMesh.updateMatrix()
      exportMesh.geometry.applyMatrix4(exportMesh.matrix)

      const exporter = new STLExporter()
      const stlBinary = exporter.parse(exportMesh, { binary: true })
      
      const blob = new Blob([stlBinary], { type: 'application/octet-stream' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `cylinder_${radius*scale}mm_x_${height*scale}mm.stl`
      link.click()
      
      URL.revokeObjectURL(link.href)
      setIsExporting(false)
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed! Check console for details.')
      setIsExporting(false)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <Canvas camera={{ position: [8, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Cylinder on the left */}
        <Cylinder radius={radius} height={height} segments={segments} meshRef={meshRef} />
        
        {/* Gear on the right */}
        <ParametricGear 
          teeth={teeth} 
          module={module} 
          thickness={gearThickness} 
          boreRadius={boreRadius}
          position={[3, 0, 0]}
        />
        
        <OrbitControls />
        <gridHelper args={[10, 10]} />
      </Canvas>

      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        minWidth: '280px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#000',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
          🔧 Firnas
        </h2>

        {/* Cylinder Controls */}
        <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#059669' }}>
          Cylinder
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Radius: {radius.toFixed(2)} units ({(radius * scale).toFixed(1)}mm)
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Height: {height.toFixed(2)} units ({(height * scale).toFixed(1)}mm)
          </label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        {/* Gear Controls */}
        <h3 style={{ fontSize: '16px', marginTop: '30px', marginBottom: '15px', color: '#3b82f6' }}>
          Gear
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Teeth: {teeth}
          </label>
          <input
            type="range"
            min="8"
            max="60"
            step="1"
            value={teeth}
            onChange={(e) => setTeeth(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Module: {module.toFixed(1)}mm
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={module}
            onChange={(e) => setModule(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Size of gear teeth
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Thickness: {gearThickness}mm
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={gearThickness}
            onChange={(e) => setGearThickness(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Bore Radius: {boreRadius}mm
          </label>
          <input
            type="range"
            min="2"
            max="15"
            step="0.5"
            value={boreRadius}
            onChange={(e) => setBoreRadius(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Center hole for shaft
          </small>
        </div>

        <button
          onClick={exportSTL}
          disabled={isExporting}
          style={{
            width: '100%',
            padding: '12px',
            background: isExporting ? '#94a3b8' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            marginTop: '10px',
            transition: 'background 0.2s'
          }}
        >
          {isExporting ? '⏳ Exporting...' : '🖨️ Download Cylinder STL'}
        </button>
      </div>
    </div>
  )
}

export default App