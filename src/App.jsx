import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, useMemo } from 'react'
import * as THREE from 'three'

function Cylinder({ radius, height, segments }) {
  // Generate cylinder mesh based on parameters
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(radius, radius, height, segments)
  }, [radius, height, segments])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}

function App() {
  const [radius, setRadius] = useState(1)
  const [height, setHeight] = useState(2)
  const [segments, setSegments] = useState(32)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Cylinder radius={radius} height={height} segments={segments} />
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
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
          🔧 Parametric Cylinder
        </h2>

        {/* Radius Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Radius: {radius.toFixed(2)} units
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
            Height: {height.toFixed(2)} units
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
        fontSize: '13px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Volume:</strong> {(Math.PI * radius * radius * height).toFixed(2)} units³
        </div>
        <div>
          <strong>Surface Area:</strong> {(2 * Math.PI * radius * (radius + height)).toFixed(2)} units²
        </div>
      </div>
    </div>
  )
}

export default App