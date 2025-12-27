import { OrbitControls, Grid, Environment, ContactShadows } from '@react-three/drei';
import Starfield from './Starfield';

export default function Scene({ children }) {
  return (
    <>
      {/* Starfield Background */}
      <Starfield count={3000} />

      {/* Camera Controls */}
      <OrbitControls 
        makeDefault
        minDistance={5}
        maxDistance={50}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />

      {/* Lighting Setup */}
      {/* Main light - simulates sun */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light - softer, from opposite side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />

      {/* Ambient light - overall scene brightness */}
      <ambientLight intensity={0.4} />

      {/* Hemisphere light - simulates sky/ground bounce */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#444444"
        intensity={0.5}
      />

      {/* Environment map for reflections */}
      <Environment preset="city" />

      {/* Ground Grid */}
      <Grid
        renderOrder={-1}
        position={[0, -2, 0]}
        infiniteGrid
        cellSize={0.5}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#6366f1"
        cellColor="#94a3b8"
        fadeDistance={50}
        fadeStrength={1}
      />

      {/* Contact Shadows (subtle shadows under objects) */}
      <ContactShadows
        position={[0, -1.99, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
      />

      {/* Ground Plane (invisible, receives shadows) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Children (your parts) */}
      {children}
    </>
  );
}
