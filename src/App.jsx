import { useState, useRef } from 'react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
import { TransformControls } from '@react-three/drei';
import Scene from './Scene';
import Cylinder from './Cylinder';
import Cube from './Cube';
import Sphere from './Sphere';
import Cone from './Cone';
import SpurGear from './SpurGear';
import BevelGear from './BevelGear';
import WormGear from './WormGear';
import Bolt from './Bolt';
import Beam from './Beam';
import Plate from './Plate';
import Spring from './Spring';
import Dimensions from './Dimensions';
import './App.css';

function App() {
  // App mode
  const [mode, setMode] = useState('create'); // 'create' | 'simulate' | 'print'
  
  // Generated parts in the scene
  const [generatedParts, setGeneratedParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState(null);
  
  // Transform controls
  const [transformMode, setTransformMode] = useState('translate'); // 'translate' | 'rotate' | 'scale'
  
  // Boolean operations
  const [showBooleanMenu, setShowBooleanMenu] = useState(false);
  const [booleanOperation, setBooleanOperation] = useState('subtract'); // 'subtract' | 'union' | 'intersect'
  const [booleanPartA, setBooleanPartA] = useState(null);
  const [booleanPartB, setBooleanPartB] = useState(null);
  
  // Grouping
  const [groups, setGroups] = useState([]); // Array of {id, name, partIds: []}
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedPartIds, setSelectedPartIds] = useState([]); // For multi-select
  
  // Cylinder parameters
  const [cylinderRadius, setCylinderRadius] = useState(1);
  const [cylinderHeight, setCylinderHeight] = useState(2);
  
  // Cube parameters
  const [cubeWidth, setCubeWidth] = useState(2);
  const [cubeHeight, setCubeHeight] = useState(2);
  const [cubeDepth, setCubeDepth] = useState(2);
  
  // Sphere parameters
  const [sphereRadius, setSphereRadius] = useState(1);
  
  // Cone parameters
  const [coneRadius, setConeRadius] = useState(1);
  const [coneHeight, setConeHeight] = useState(2);
  
  // Gear parameters (FIXED SCALE)
  const [teeth, setTeeth] = useState(20);
  const [gearModule, setGearModule] = useState(0.3);
  const [thickness, setThickness] = useState(0.5);
  const [boreRadius, setBoreRadius] = useState(0.3);
  
  // Bevel Gear parameters
  const [bevelTeeth, setBevelTeeth] = useState(20);
  const [bevelModule, setBevelModule] = useState(0.3);
  const [bevelConeAngle, setBevelConeAngle] = useState(45);
  const [bevelThickness, setBevelThickness] = useState(0.5);
  const [bevelBoreRadius, setBevelBoreRadius] = useState(0.3);
  
  // Worm Gear parameters
  const [wormLength, setWormLength] = useState(4);
  const [wormRadius, setWormRadius] = useState(0.5);
  const [wormThreads, setWormThreads] = useState(5);
  const [wormBoreRadius, setWormBoreRadius] = useState(0.2);
  
  // Bolt parameters
  const [boltHeadDiameter, setBoltHeadDiameter] = useState(1);
  const [boltHeadHeight, setBoltHeadHeight] = useState(0.4);
  const [boltShaftDiameter, setBoltShaftDiameter] = useState(0.6);
  const [boltShaftLength, setBoltShaftLength] = useState(3);
  
  // Beam parameters
  const [beamWidth, setBeamWidth] = useState(0.5);
  const [beamHeight, setBeamHeight] = useState(0.5);
  const [beamLength, setBeamLength] = useState(5);
  
  // Plate parameters
  const [plateWidth, setPlateWidth] = useState(3);
  const [plateLength, setPlateLength] = useState(3);
  const [plateThickness, setPlateThickness] = useState(0.2);
  
  // Spring parameters
  const [springRadius, setSpringRadius] = useState(0.5);
  const [springCoils, setSpringCoils] = useState(10);
  const [springHeight, setSpringHeight] = useState(3);
  const [wireThickness, setWireThickness] = useState(0.1);
  
  // Active part selection (for preview)
  const [activePart, setActivePart] = useState('cylinder');
  const [partCategory, setPartCategory] = useState('primitives'); // 'primitives' | 'mechanical'
  
  // Color selection
  const [partColor, setPartColor] = useState('#3b82f6');
  
  // UI state
  const [showPartLibrary, setShowPartLibrary] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  
  // Refs
  const sceneRef = useRef();
  const selectedMeshRef = useRef();

  // Generate a new part and add it to the scene
  const handleGeneratePart = () => {
    // Count existing parts of this type to generate number
    const sameTypeParts = generatedParts.filter(p => p.type === activePart);
    const partNumber = sameTypeParts.length + 1;
    
    const newPart = {
      id: Date.now(),
      type: activePart,
      number: partNumber,
      name: `${activePart} ${partNumber}`,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: partColor,
      // Store parameters based on type
      params: activePart === 'cylinder' ? {
        radius: cylinderRadius,
        height: cylinderHeight
      } : activePart === 'cube' ? {
        width: cubeWidth,
        height: cubeHeight,
        depth: cubeDepth
      } : activePart === 'sphere' ? {
        radius: sphereRadius
      } : activePart === 'cone' ? {
        radius: coneRadius,
        height: coneHeight
      } : activePart === 'gear' ? {
        teeth,
        module: gearModule,
        thickness,
        boreRadius
      } : activePart === 'bevel-gear' ? {
        teeth: bevelTeeth,
        module: bevelModule,
        coneAngle: bevelConeAngle,
        thickness: bevelThickness,
        boreRadius: bevelBoreRadius
      } : activePart === 'worm-gear' ? {
        length: wormLength,
        radius: wormRadius,
        threads: wormThreads,
        boreRadius: wormBoreRadius
      } : activePart === 'bolt' ? {
        headDiameter: boltHeadDiameter,
        headHeight: boltHeadHeight,
        shaftDiameter: boltShaftDiameter,
        shaftLength: boltShaftLength
      } : activePart === 'beam' ? {
        width: beamWidth,
        height: beamHeight,
        length: beamLength
      } : activePart === 'plate' ? {
        width: plateWidth,
        length: plateLength,
        thickness: plateThickness
      } : { // spring
        radius: springRadius,
        coils: springCoils,
        height: springHeight,
        wireThickness
      }
    };
    
    setGeneratedParts([...generatedParts, newPart]);
    setSelectedPartId(newPart.id);
    setShowPartLibrary(false); // Close library after generating
    
    // Debug logging
    console.log('Generated part:', newPart);
    console.log('Total parts:', generatedParts.length + 1);
    
    // Show notification
    showNotification(`✅ ${newPart.name} generated!`);
  };

  // Select part
  const handleSelectPart = (partId) => {
    // If in Boolean mode and first part already selected, perform operation
    if (booleanPartA && partId !== booleanPartA) {
      setBooleanPartB(partId);
      performBooleanOperation(booleanPartA, partId, booleanOperation);
      // Reset Boolean mode
      setBooleanPartA(null);
      setBooleanPartB(null);
      setShowBooleanMenu(false);
      return;
    }
    
    if (multiSelectMode) {
      // Multi-select mode: toggle part in selection
      setSelectedPartIds(prev => 
        prev.includes(partId) 
          ? prev.filter(id => id !== partId)
          : [...prev, partId]
      );
    } else {
      // Single select
      setSelectedPartId(partId);
    }
  };

  // Perform Boolean operation
  const performBooleanOperation = (partAId, partBId, operation) => {
    const partA = generatedParts.find(p => p.id === partAId);
    const partB = generatedParts.find(p => p.id === partBId);
    
    if (!partA || !partB) return;
    
    // TODO: Install three-csg-ts library
    // Run: npm install three-csg-ts
    // Then uncomment the CSG code below
    
    showNotification(`⚠️ Boolean ${operation} - Install three-csg-ts to enable`);
    console.log(`Boolean ${operation}:`, partA.name, operation, partB.name);
    console.log('To enable: npm install three-csg-ts');
    
    /* BOOLEAN OPERATION CODE (uncomment after installing three-csg-ts):
    
    try {
      // Import library
      import('three-csg-ts').then(({ Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION }) => {
        
        // Get meshes from scene
        if (!sceneRef.current) return;
        
        let meshA = null;
        let meshB = null;
        
        sceneRef.current.traverse((child) => {
          if (child.isMesh && child.parent?.name === `part-${partAId}`) meshA = child;
          if (child.isMesh && child.parent?.name === `part-${partBId}`) meshB = child;
        });
        
        if (!meshA || !meshB) {
          showNotification('⚠️ Could not find part meshes');
          return;
        }
        
        // Create brushes
        const brushA = new Brush(meshA.geometry);
        const brushB = new Brush(meshB.geometry);
        brushA.updateMatrixWorld();
        brushB.updateMatrixWorld();
        
        // Perform CSG
        const evaluator = new Evaluator();
        const op = operation === 'subtract' ? SUBTRACTION : operation === 'union' ? ADDITION : INTERSECTION;
        const resultBrush = evaluator.evaluate(brushA, brushB, op);
        
        // Create new part
        const newPart = {
          id: Date.now(),
          type: 'boolean-result',
          number: 1,
          name: `${operation} result`,
          position: [...partA.position],
          rotation: [...partA.rotation],
          scale: [1, 1, 1],
          color: partA.color,
          params: { geometry: resultBrush.geometry, isCSGResult: true }
        };
        
        // Replace parts with result
        setGeneratedParts(parts => [
          ...parts.filter(p => p.id !== partAId && p.id !== partBId),
          newPart
        ]);
        
        showNotification(`✅ Boolean ${operation} complete!`);
      });
    } catch (error) {
      showNotification(`❌ ${error.message}`);
    }
    */
  };

  // Create group from selected parts
  const handleCreateGroup = () => {
    if (selectedPartIds.length < 2) {
      showNotification('⚠️ Select at least 2 parts to group');
      return;
    }
    
    const newGroup = {
      id: Date.now(),
      name: `Group ${groups.length + 1}`,
      partIds: [...selectedPartIds],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    };
    
    setGroups([...groups, newGroup]);
    setSelectedPartIds([]);
    setMultiSelectMode(false);
    showNotification(`✅ Group created with ${newGroup.partIds.length} parts`);
  };

  // Ungroup
  const handleUngroup = (groupId) => {
    setGroups(groups.filter(g => g.id !== groupId));
    setSelectedGroup(null);
    showNotification('🔓 Group ungrouped');
  };

  // Delete selected part
  const handleDeletePart = () => {
    if (selectedPartId) {
      setGeneratedParts(generatedParts.filter(p => p.id !== selectedPartId));
      setSelectedPartId(null);
      setShowBooleanMenu(false);
      showNotification('🗑️ Part deleted');
    }
  };
  
  // Update part transform
  const handleUpdatePart = (partId, updates) => {
    setGeneratedParts(parts => 
      parts.map(p => p.id === partId ? { ...p, ...updates } : p)
    );
  };

  // Show notification
  const showNotification = (message) => {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  };

  // Export all parts as STL (Print mode)
  const handleExportAllSTL = () => {
    if (generatedParts.length === 0) {
      alert('No parts to export! Generate some parts first.');
      return;
    }

    generatedParts.forEach((part, index) => {
      // Find mesh in scene
      if (!sceneRef.current) return;
      
      const meshes = [];
      sceneRef.current.traverse((child) => {
        if (child.isMesh) {
          meshes.push(child);
        }
      });

      if (meshes[index]) {
        try {
          const exporter = new STLExporter();
          const stlString = exporter.parse(meshes[index]);
          const blob = new Blob([stlString], { type: 'text/plain' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          
          const filename = `${part.type}_${part.id}.stl`;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          
          console.log('Exported:', filename);
        } catch (error) {
          console.error('Export failed for part:', part, error);
        }
      }
    });
    
    alert(`Exported ${generatedParts.length} part(s) as STL!`);
  };

  return (
    <div className="app">
      {/* Header with Centered Mode Tabs */}
      <header className="header">
        <div className="logo">
          <div>
            <h1>⚙️ Firnas</h1>
            <span className="tagline">Gamifying your parametric design</span>
          </div>
          
          {/* Dimensions Toggle */}
          <label className="dimensions-toggle">
            <input
              type="checkbox"
              checked={showDimensions}
              onChange={(e) => setShowDimensions(e.target.checked)}
            />
            <span className="toggle-label">📏 Dimensions</span>
          </label>
        </div>
        
        {/* Mode Selector - CENTERED */}
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'create' ? 'active' : ''}`}
            onClick={() => setMode('create')}
          >
            🔧 Create
          </button>
          <button 
            className={`mode-btn ${mode === 'simulate' ? 'active' : ''} disabled`}
            onClick={() => setMode('simulate')}
            disabled
          >
            ⚡ Simulate
          </button>
          <button 
            className={`mode-btn ${mode === 'print' ? 'active' : ''}`}
            onClick={() => setMode('print')}
          >
            🖨️ Print
          </button>
        </div>
        
        {/* Spacer to balance layout */}
        <div style={{ width: '200px' }}></div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Hierarchy Panel (Left Side) */}
        {mode === 'create' && (
          <aside className="hierarchy-panel">
            <h3>Scene Hierarchy</h3>
            <div className="hierarchy-list">
              {generatedParts.length === 0 ? (
                <p className="empty-hierarchy">No parts yet</p>
              ) : (
                generatedParts.map(part => (
                  <div
                    key={part.id}
                    className={`hierarchy-item ${selectedPartId === part.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPart(part.id)}
                  >
                    <span className="hierarchy-icon">
                      {part.type === 'cylinder' ? '🔵' :
                       part.type === 'gear' ? '⚙️' :
                       part.type === 'plate' ? '🔲' : '🌀'}
                    </span>
                    <span className="hierarchy-name">{part.name}</span>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
        
        {/* 3D Canvas */}
        {/* 3D Canvas */}
        <div className="canvas-container">
          <Canvas
            shadows
            camera={{ position: [5, 5, 5], fov: 50 }}
            gl={{ antialias: true }}
          >
            <Scene>
              <group ref={sceneRef}>
                {/* PREVIEW PART - Only show when part library is open */}
                {mode === 'create' && showPartLibrary && (
                  <group opacity={0.7}>
                    {activePart === 'cylinder' && (
                      <Cylinder
                        radius={cylinderRadius}
                        height={cylinderHeight}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'cube' && (
                      <Cube
                        width={cubeWidth}
                        height={cubeHeight}
                        depth={cubeDepth}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'sphere' && (
                      <Sphere
                        radius={sphereRadius}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'cone' && (
                      <Cone
                        radius={coneRadius}
                        height={coneHeight}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'gear' && (
                      <SpurGear
                        teeth={teeth}
                        module={gearModule}
                        thickness={thickness}
                        boreRadius={boreRadius}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'bevel-gear' && (
                      <BevelGear
                        teeth={bevelTeeth}
                        module={bevelModule}
                        coneAngle={bevelConeAngle}
                        thickness={bevelThickness}
                        boreRadius={bevelBoreRadius}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'worm-gear' && (
                      <WormGear
                        length={wormLength}
                        radius={wormRadius}
                        threads={wormThreads}
                        boreRadius={wormBoreRadius}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'bolt' && (
                      <Bolt
                        headDiameter={boltHeadDiameter}
                        headHeight={boltHeadHeight}
                        shaftDiameter={boltShaftDiameter}
                        shaftLength={boltShaftLength}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'beam' && (
                      <Beam
                        width={beamWidth}
                        height={beamHeight}
                        length={beamLength}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'plate' && (
                      <Plate
                        width={plateWidth}
                        length={plateLength}
                        thickness={plateThickness}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                    {activePart === 'spring' && (
                      <Spring
                        radius={springRadius}
                        coils={springCoils}
                        height={springHeight}
                        wireThickness={wireThickness}
                        color={partColor}
                        opacity={0.5}
                      />
                    )}
                  </group>
                )}
                
                {/* GENERATED PARTS (solid, selectable) */}
                {generatedParts.map((part, index) => {
                  const PartComponent = part.type === 'cylinder' ? Cylinder :
                                       part.type === 'cube' ? Cube :
                                       part.type === 'sphere' ? Sphere :
                                       part.type === 'cone' ? Cone :
                                       part.type === 'gear' ? SpurGear :
                                       part.type === 'bevel-gear' ? BevelGear :
                                       part.type === 'worm-gear' ? WormGear :
                                       part.type === 'bolt' ? Bolt :
                                       part.type === 'beam' ? Beam :
                                       part.type === 'plate' ? Plate : 
                                       part.type === 'boolean-result' ? null : Spring;
                  
                  const isSelected = part.id === selectedPartId;
                  const isInMultiSelect = selectedPartIds.includes(part.id);
                  
                  return (
                    <group 
                      key={part.id}
                      position={part.position}
                      rotation={part.rotation}
                      scale={part.scale}
                      name={`part-${part.id}`}
                    >
                      <group
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPart(part.id);
                        }}
                      >
                        {/* Render CSG result or regular part */}
                        {part.type === 'boolean-result' ? (
                          <mesh castShadow receiveShadow>
                            <primitive object={part.params.geometry} attach="geometry" />
                            <meshStandardMaterial 
                              color={isSelected ? '#fbbf24' : isInMultiSelect ? '#a78bfa' : part.color}
                              metalness={0.3}
                              roughness={0.4}
                            />
                          </mesh>
                        ) : (
                          <PartComponent 
                            {...part.params} 
                            color={isSelected ? '#fbbf24' : isInMultiSelect ? '#a78bfa' : part.color}
                          />
                        )}
                        
                        {/* Dimensions (if enabled) - skip for boolean results */}
                        {showDimensions && part.type !== 'boolean-result' && (
                          <Dimensions 
                            type={part.type}
                            params={part.params}
                            scale={part.scale}
                          />
                        )}
                      </group>
                    </group>
                  );
                })}
                
                {/* Transform Controls - Separate component that finds and attaches to selected part */}
                {selectedPartId && !multiSelectMode && (() => {
                  const selectedPart = generatedParts.find(p => p.id === selectedPartId);
                  if (!selectedPart) return null;
                  
                  return (
                    <TransformControls
                      object={sceneRef.current?.getObjectByName(`part-${selectedPartId}`)}
                      mode={transformMode}
                      onMouseUp={(e) => {
                        const obj = e?.target?.object;
                        if (obj) {
                          handleUpdatePart(selectedPartId, {
                            position: [obj.position.x, obj.position.y, obj.position.z],
                            rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
                            scale: [obj.scale.x, obj.scale.y, obj.scale.z]
                          });
                        }
                      }}
                    />
                  );
                })()}
              </group>
            </Scene>
          </Canvas>
          
          {/* Transform Mode Toolbar */}
          {selectedPartId && mode === 'create' && (
            <div className="transform-toolbar">
              <button
                className={`transform-btn ${transformMode === 'translate' ? 'active' : ''}`}
                onClick={() => setTransformMode('translate')}
                title="Move (G)"
              >
                ↔️ Move
              </button>
              <button
                className={`transform-btn ${transformMode === 'rotate' ? 'active' : ''}`}
                onClick={() => setTransformMode('rotate')}
                title="Rotate (R)"
              >
                🔄 Rotate
              </button>
              <button
                className={`transform-btn ${transformMode === 'scale' ? 'active' : ''}`}
                onClick={() => setTransformMode('scale')}
                title="Scale (S)"
              >
                ⤢ Scale
              </button>
              <div className="toolbar-divider"></div>
              <button
                className={`transform-btn ${showBooleanMenu ? 'active' : ''}`}
                onClick={() => setShowBooleanMenu(!showBooleanMenu)}
                title="Boolean Operations"
              >
                ✂️ Boolean
              </button>
              <button
                className="transform-btn delete-btn"
                onClick={handleDeletePart}
                title="Delete (Del)"
              >
                🗑️ Delete
              </button>
            </div>
          )}

          {/* Boolean Operations Menu */}
          {showBooleanMenu && selectedPartId && mode === 'create' && generatedParts.length >= 2 && (
            <div className="boolean-menu">
              <h4>Boolean Operations</h4>
              <p className="boolean-help">Select operation, then click second part</p>
              <div className="boolean-ops">
                <button
                  className={`boolean-btn ${booleanOperation === 'subtract' ? 'active' : ''}`}
                  onClick={() => {
                    setBooleanOperation('subtract');
                    setBooleanPartA(selectedPartId);
                    showNotification('Click second part to subtract');
                  }}
                >
                  ➖ Subtract
                </button>
                <button
                  className={`boolean-btn ${booleanOperation === 'union' ? 'active' : ''}`}
                  onClick={() => {
                    setBooleanOperation('union');
                    setBooleanPartA(selectedPartId);
                    showNotification('Click second part to union');
                  }}
                >
                  ➕ Union
                </button>
                <button
                  className={`boolean-btn ${booleanOperation === 'intersect' ? 'active' : ''}`}
                  onClick={() => {
                    setBooleanOperation('intersect');
                    setBooleanPartA(selectedPartId);
                    showNotification('Click second part to intersect');
                  }}
                >
                  ✂️ Intersect
                </button>
              </div>
              {booleanPartA && (
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                  <p style={{ color: '#fbbf24', fontSize: '0.75rem', margin: 0 }}>
                    First part selected: {generatedParts.find(p => p.id === booleanPartA)?.name}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Scene Info Overlay */}
          <div className="scene-info">
            <span>Parts: {generatedParts.length}</span>
            {selectedPartId && <span>Selected: {generatedParts.find(p => p.id === selectedPartId)?.name}</span>}
          </div>

          {/* Version Number */}
          <div className="version-number">
            v0.2 Alpha
          </div>
        </div>

        {/* Control Panel */}
        <aside className="control-panel">
          {/* CREATE MODE */}
          {mode === 'create' && (
            <>
              {!showPartLibrary ? (
                /* Collapsed State - Three category buttons */
                <div className="panel-collapsed">
                  <button 
                    className="btn btn-primary btn-large btn-category"
                    onClick={() => {
                      setPartCategory('primitives');
                      setShowPartLibrary(true);
                    }}
                  >
                    🔷 Primitive Shapes
                  </button>
                  <button 
                    className="btn btn-primary btn-large btn-category"
                    onClick={() => {
                      setPartCategory('mechanical');
                      setShowPartLibrary(true);
                    }}
                  >
                    ⚙️ Mechanical Parts
                  </button>
                  <button 
                    className="btn btn-primary btn-large btn-category"
                    onClick={() => {
                      setPartCategory('electronics');
                      setShowPartLibrary(true);
                    }}
                  >
                    ⚡ Motors & Electronics
                  </button>
                </div>
              ) : (
                /* Expanded State - Full part library */
                <div className="panel-expanded">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>{partCategory === 'primitives' ? 'Primitive Shapes' : 
                         partCategory === 'mechanical' ? 'Mechanical Parts' : 
                         'Motors & Electronics'}</h2>
                    <button 
                      className="btn-close"
                      onClick={() => setShowPartLibrary(false)}
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
              
              {/* Part Selector - Primitives */}
              {partCategory === 'primitives' && (
                <div className="part-selector">
                  <button
                    className={`part-btn ${activePart === 'cylinder' ? 'active' : ''}`}
                    onClick={() => setActivePart('cylinder')}
                  >
                    🔵 Cylinder
                  </button>
                  <button
                    className={`part-btn ${activePart === 'cube' ? 'active' : ''}`}
                    onClick={() => setActivePart('cube')}
                  >
                    🔲 Cube
                  </button>
                  <button
                    className={`part-btn ${activePart === 'sphere' ? 'active' : ''}`}
                    onClick={() => setActivePart('sphere')}
                  >
                    ⚪ Sphere
                  </button>
                  <button
                    className={`part-btn ${activePart === 'cone' ? 'active' : ''}`}
                    onClick={() => setActivePart('cone')}
                  >
                    🔺 Cone
                  </button>
                </div>
              )}

              {/* Part Selector - Mechanical */}
              {partCategory === 'mechanical' && (
              <div className="part-selector">
                <button
                  className={`part-btn ${activePart === 'gear' ? 'active' : ''}`}
                  onClick={() => setActivePart('gear')}
                >
                  ⚙️ Spur Gear
                </button>
                <button
                  className={`part-btn ${activePart === 'bevel-gear' ? 'active' : ''}`}
                  onClick={() => setActivePart('bevel-gear')}
                >
                  🔧 Bevel Gear
                </button>
                <button
                  className={`part-btn ${activePart === 'worm-gear' ? 'active' : ''}`}
                  onClick={() => setActivePart('worm-gear')}
                >
                  🪛 Worm Gear
                </button>
                <button
                  className={`part-btn ${activePart === 'bolt' ? 'active' : ''}`}
                  onClick={() => setActivePart('bolt')}
                >
                  🔩 Bolt
                </button>
                <button
                  className={`part-btn ${activePart === 'beam' ? 'active' : ''}`}
                  onClick={() => setActivePart('beam')}
                >
                  📏 Beam
                </button>
                <button
                  className={`part-btn ${activePart === 'plate' ? 'active' : ''}`}
                  onClick={() => setActivePart('plate')}
                >
                  🔲 Plate
                </button>
                <button
                  className={`part-btn ${activePart === 'spring' ? 'active' : ''}`}
                  onClick={() => setActivePart('spring')}
                >
                  🌀 Spring
                </button>
              </div>
              )}

              {/* Part Selector - Motors & Electronics */}
              {partCategory === 'electronics' && (
              <div className="part-selector">
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  🔋 Battery Holder
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  ⚡ DC Motor
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  🎛️ Servo Motor
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  🧲 Stepper Motor
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  📟 Arduino/PCB
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  🔌 Wire Holder
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  💡 LED Mount
                </button>
                <button
                  className="part-btn part-btn-disabled"
                  disabled
                  title="Coming soon"
                >
                  🎚️ Switch Mount
                </button>
              </div>
              )}

              <div className="divider"></div>

              {/* Color Picker */}
              <div className="color-picker-section">
                <h3>Color</h3>
                <div className="color-picker">
                  <input
                    type="color"
                    value={partColor}
                    onChange={(e) => setPartColor(e.target.value)}
                  />
                  <span className="color-value">{partColor}</span>
                </div>
              </div>

              <div className="divider"></div>

              {/* Material Selector (Grayed Out) */}
              <div className="material-section">
                <h3>Material</h3>
                <select className="material-select" disabled>
                  <option>Standard (Default)</option>
                  <option>Metallic</option>
                  <option>Glossy</option>
                  <option>Matte</option>
                  <option>Glass</option>
                </select>
                <p className="coming-soon">Coming soon...</p>
              </div>

              <div className="divider"></div>

              {/* Cylinder Controls */}
              {activePart === 'cylinder' && (
                <div className="parameters">
                  <h3>Cylinder Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Radius: {cylinderRadius.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={cylinderRadius}
                        onChange={(e) => setCylinderRadius(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Height: {cylinderHeight.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={cylinderHeight}
                        onChange={(e) => setCylinderHeight(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Cylinder
                  </button>
                </div>
              )}

              {/* Cube Controls */}
              {activePart === 'cube' && (
                <div className="parameters">
                  <h3>Cube Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Width: {cubeWidth.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={cubeWidth}
                        onChange={(e) => setCubeWidth(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Height: {cubeHeight.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={cubeHeight}
                        onChange={(e) => setCubeHeight(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Depth: {cubeDepth.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={cubeDepth}
                        onChange={(e) => setCubeDepth(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Cube
                  </button>
                </div>
              )}

              {/* Sphere Controls */}
              {activePart === 'sphere' && (
                <div className="parameters">
                  <h3>Sphere Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Radius: {sphereRadius.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={sphereRadius}
                        onChange={(e) => setSphereRadius(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Sphere
                  </button>
                </div>
              )}

              {/* Cone Controls */}
              {activePart === 'cone' && (
                <div className="parameters">
                  <h3>Cone Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Radius: {coneRadius.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={coneRadius}
                        onChange={(e) => setConeRadius(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Height: {coneHeight.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={coneHeight}
                        onChange={(e) => setConeHeight(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Cone
                  </button>
                </div>
              )}

              {/* Gear Controls */}
              {activePart === 'gear' && (
                <div className="parameters">
                  <h3>Gear Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Teeth: {teeth}</span>
                      <input
                        type="range"
                        min="8"
                        max="60"
                        step="1"
                        value={teeth}
                        onChange={(e) => setTeeth(parseInt(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Module: {gearModule.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.1"
                        max="0.5"
                        step="0.01"
                        value={gearModule}
                        onChange={(e) => setGearModule(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Thickness: {thickness.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.2"
                        max="2"
                        step="0.1"
                        value={thickness}
                        onChange={(e) => setThickness(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Bore Hole: {boreRadius.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.05"
                        value={boreRadius}
                        onChange={(e) => setBoreRadius(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Gear
                  </button>
                </div>
              )}

              {/* Plate Controls */}
              {activePart === 'plate' && (
                <div className="parameters">
                  <h3>Plate Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Width: {plateWidth.toFixed(2)}</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={plateWidth}
                        onChange={(e) => setPlateWidth(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Length: {plateLength.toFixed(2)}</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={plateLength}
                        onChange={(e) => setPlateLength(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Thickness: {plateThickness.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={plateThickness}
                        onChange={(e) => setPlateThickness(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Plate
                  </button>
                </div>
              )}

              {/* Spring Controls */}
              {activePart === 'spring' && (
                <div className="parameters">
                  <h3>Spring Parameters</h3>
                  
                  <div className="param-group">
                    <label>
                      <span>Radius: {springRadius.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.2"
                        max="2"
                        step="0.1"
                        value={springRadius}
                        onChange={(e) => setSpringRadius(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Coils: {springCoils}</span>
                      <input
                        type="range"
                        min="3"
                        max="30"
                        step="1"
                        value={springCoils}
                        onChange={(e) => setSpringCoils(parseInt(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Height: {springHeight.toFixed(2)}</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={springHeight}
                        onChange={(e) => setSpringHeight(parseFloat(e.target.value))}
                      />
                    </label>

                    <label>
                      <span>Wire Thickness: {wireThickness.toFixed(2)}</span>
                      <input
                        type="range"
                        min="0.05"
                        max="0.3"
                        step="0.01"
                        value={wireThickness}
                        onChange={(e) => setWireThickness(parseFloat(e.target.value))}
                      />
                    </label>
                  </div>

                  <button className="btn btn-primary" onClick={handleGeneratePart}>
                    ➕ Generate Spring
                  </button>
                </div>
              )}
                </div>
              )}
            </>
          )}

          {/* PRINT MODE */}
          {mode === 'print' && (
            <div className="panel-expanded">
              <h2>Print Mode</h2>
              
              <div className="print-stats">
                <div className="stat">
                  <span className="stat-label">Total Parts:</span>
                  <span className="stat-value">{generatedParts.length}</span>
                </div>
              </div>

              <div className="divider"></div>

              <div className="part-list">
                <h3>Parts to Export</h3>
                {generatedParts.length === 0 ? (
                  <p className="empty-message">No parts generated yet. Go to Create mode to add parts.</p>
                ) : (
                  <ul>
                    {generatedParts.map(part => (
                      <li key={part.id}>
                        <span className="part-icon">
                          {part.type === 'cylinder' ? '🔵' :
                           part.type === 'gear' ? '⚙️' :
                           part.type === 'plate' ? '🔲' : '🌀'}
                        </span>
                        <span className="part-name">{part.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="divider"></div>

              <button 
                className="btn btn-primary btn-large"
                onClick={handleExportAllSTL}
                disabled={generatedParts.length === 0}
              >
                📥 Export All as STL
              </button>

              <div className="info-box">
                <h4>💡 Print Tips</h4>
                <ul>
                  <li><strong>Scale:</strong> Check size in slicer</li>
                  <li><strong>Orientation:</strong> Adjust for strength</li>
                  <li><strong>Support:</strong> May be needed</li>
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
