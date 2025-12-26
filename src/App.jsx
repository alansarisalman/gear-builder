import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter'

function Cylinder({ radius, height, segments, meshRef }) {
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(radius, radius, height, segments)
  }, [radius, height, segments])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}

function App() {
  const [radius, setRadius] = useState(1)
  const [height, setHeight] = useState(2)
  const [segments, setSegments] = useState(32)
  const [isExporting, setIsExporting] = useState(false)
  const [scale, setScale] = useState(10) // Export scale multiplier
  
  // Create ref to pass to Cylinder
  const meshRef = useRef()

  // STL Export Function
  const exportSTL = () => {
    setIsExporting(true)
    
    try {
      const mesh = meshRef.current
      
      if (!mesh) {
        alert('Mesh not ready yet. Please wait a moment and try again.')
        setIsExporting(false)
        return
      }

      // Clone the mesh so we don't affect the display
      const exportMesh = mesh.clone()
      
      // Scale up for 3D printing (convert to mm)
      exportMesh.scale.set(scale, scale, scale)
      exportMesh.updateMatrix()
      exportMesh.geometry.applyMatrix4(exportMesh.matrix)

      // Create STL exporter
      const exporter = new STLExporter()
      
      // Export as binary STL (smaller file size)
      const stlBinary = exporter.parse(exportMesh, { binary: true })
      
      // Create blob and download
      const blob = new Blob([stlBinary], { type: 'application/octet-stream' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `cylinder_${radius*scale}mm_x_${height*scale}mm.stl`
      link.click()
      
      // Cleanup
      URL.revokeObjectURL(link.href)
      setIsExporting(false)
      
      console.log(`✅ Exported: Radius ${radius*scale}mm, Height ${height*scale}mm`)
      
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed! Check console for details.')
      setIsExporting(false)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Cylinder radius={radius} height={height} segments={segments} meshRef={meshRef} />
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
        color: '#000'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
          🔧 Firnas
        </h2>

        {/* Radius Slider */}
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

        {/* Height Slider */}
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

        {/* Segments Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Segments: {segments}
          </label>
          <input
            type="range"
            min="6"
            max="64"
            step="2"
            value={segments}
            onChange={(e) => setSegments(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Lower = blocky, Higher = smooth
          </small>
        </div>

        {/* Scale Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Export Scale: 1 unit = {scale}mm
          </label>
          <select 
            value={scale} 
            onChange={(e) => setScale(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              cursor: 'pointer'
            }}
          >
            <option value="1">1mm (tiny)</option>
            <option value="10">10mm (small)</option>
            <option value="100">100mm (large)</option>
          </select>
          <small style={{ color: '#666', fontSize: '12px' }}>
            Adjust if parts are too big/small in slicer
          </small>
        </div>

        {/* Export Button */}
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
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isExporting) e.target.style.background = '#059669'
          }}
          onMouseLeave={(e) => {
            if (!isExporting) e.target.style.background = '#10b981'
          }}
        >
          {isExporting ? '⏳ Exporting...' : '🖨️ Download STL'}
        </button>

        {/* Info */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#0369a1'
        }}>
          💡 Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Stats Panel */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#000'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
          📐 Dimensions (for 3D printing)
        </div>
        <div style={{ marginBottom: '6px' }}>
          <strong>Diameter:</strong> {(radius * 2 * scale).toFixed(1)}mm
        </div>
        <div style={{ marginBottom: '6px' }}>
          <strong>Height:</strong> {(height * scale).toFixed(1)}mm
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong>Volume:</strong> {(Math.PI * radius * radius * height * scale * scale * scale / 1000).toFixed(2)} cm³
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
          <strong>Filament estimate:</strong> ~{(Math.PI * radius * radius * height * scale * scale * scale / 1000 * 1.2).toFixed(2)}g
        </div>
      </div>
    </div>
  )
}

export default App