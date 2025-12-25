import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function RotatingCube() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [5, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App