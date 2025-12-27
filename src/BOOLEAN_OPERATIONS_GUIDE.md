# Boolean Operations in Firnas

## What are Boolean Operations?

Just like Blender's Boolean modifier, this lets you combine or cut shapes from each other:

- **Subtract** (A - B): Cut holes or remove material
- **Union** (A + B): Combine two shapes into one
- **Intersect** (A ∩ B): Keep only overlapping parts

## Installation

You'll need to install the CSG library:

```bash
npm install three-csg-ts
```

## Basic Usage

### Example 1: Create a Plate with Holes

```jsx
import Plate from './Plate';
import Cylinder from './Cylinder';
import BooleanTool from './BooleanTool';
import { useRef, useEffect } from 'react';

function PlateWithHoles() {
  const plateRef = useRef();
  const holeRef = useRef();

  return (
    <group>
      {/* Base plate (hidden) */}
      <Plate ref={plateRef} width={4} length={4} thickness={0.5} />
      
      {/* Hole cylinder (hidden) */}
      <Cylinder ref={holeRef} radius={0.3} height={1} />
      
      {/* Result: Plate with hole cut out */}
      <BooleanTool 
        meshA={plateRef.current}
        meshB={holeRef.current}
        operation="subtract"
        color="#ef4444"
      />
    </group>
  );
}
```

### Example 2: Create Mounting Holes Pattern

```jsx
function PlateWith4Holes() {
  const plateRef = useRef();
  const hole1Ref = useRef();
  const hole2Ref = useRef();
  const hole3Ref = useRef();
  const hole4Ref = useRef();

  // Position holes at corners
  const holePositions = [
    [-1.5, 0, -1.5],  // Top-left
    [1.5, 0, -1.5],   // Top-right
    [1.5, 0, 1.5],    // Bottom-right
    [-1.5, 0, 1.5]    // Bottom-left
  ];

  return (
    <group>
      <Plate ref={plateRef} width={4} length={4} thickness={0.5} />
      
      {holePositions.map((pos, i) => (
        <Cylinder 
          key={i}
          position={pos}
          radius={0.2} 
          height={1}
        />
      ))}
      
      {/* Apply multiple subtracts */}
      <BooleanTool 
        meshA={plateRef.current}
        meshB={hole1Ref.current}
        operation="subtract"
      />
    </group>
  );
}
```

### Example 3: Gear with Custom Bore

```jsx
import { createHole } from './BooleanTool';

function GearWithBore() {
  const gearRef = useRef();
  const [resultMesh, setResultMesh] = useState(null);

  useEffect(() => {
    if (gearRef.current) {
      // Create hole through center
      const withHole = createHole(gearRef.current, {
        radius: 0.5,
        depth: 2,
        position: [0, 0, 0],
        axis: 'z'
      });
      setResultMesh(withHole);
    }
  }, [gearRef.current]);

  return (
    <>
      <SpurGear ref={gearRef} teeth={20} module={0.2} />
      {resultMesh && <primitive object={resultMesh} />}
    </>
  );
}
```

## Advanced: Multi-Part Assembly with Holes

```jsx
function ComplexAssembly() {
  // 1. Create base plate
  const basePlate = useRef();
  
  // 2. Create mounting holes
  const holes = [
    { pos: [-2, 0, -2], radius: 0.2 },
    { pos: [2, 0, -2], radius: 0.2 },
    { pos: [2, 0, 2], radius: 0.2 },
    { pos: [-2, 0, 2], radius: 0.2 }
  ];
  
  // 3. Subtract all holes
  let result = basePlate.current;
  holes.forEach(hole => {
    result = createHole(result, {
      radius: hole.radius,
      depth: 1,
      position: hole.pos,
      axis: 'y'
    });
  });

  return <primitive object={result} />;
}
```

## Integration with Firnas

To add this to your main app:

1. **Add Boolean Mode Toggle**
   - Add "Boolean Tool" button to part selector
   - When active, show two part selectors (A and B)
   - Show operation buttons (Subtract, Union, Intersect)

2. **Workflow**
   - User selects Part A (e.g., Plate)
   - User selects Part B (e.g., Cylinder for hole)
   - User positions Part B on Part A
   - User clicks "Apply Boolean"
   - Result replaces Part A

3. **UI Additions Needed**
   ```jsx
   const [booleanMode, setBooleanMode] = useState(false);
   const [partA, setPartA] = useState(null);
   const [partB, setPartB] = useState(null);
   const [operation, setOperation] = useState('subtract');
   ```

## Next Steps for Full Integration

1. **Install library**: `npm install three-csg-ts`
2. **Add mode selector**: Boolean mode button in UI
3. **Add part positioning**: Drag & drop for Part B
4. **Add preview**: Show ghost of operation result
5. **Add apply button**: Finalize the boolean operation
6. **Add undo**: Store history of operations

## Benefits

- ✅ Create complex shapes from simple primitives
- ✅ Add mounting holes to plates
- ✅ Create custom gears with special bores
- ✅ Design interlocking parts
- ✅ Professional CAD-like workflow

## Limitations

- ⚠️ CSG operations can be slow on complex meshes
- ⚠️ Some operations may fail on non-manifold geometry
- ⚠️ Results may need smoothing/cleanup
- ⚠️ Requires good understanding of 3D positioning

## Alternative Approach (Simpler)

If CSG is too complex, you can use pre-defined hole patterns:

```jsx
function PlateWithHolePattern({ pattern = 'corners' }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Draw plate outline
    shape.moveTo(-2, -2);
    shape.lineTo(2, -2);
    shape.lineTo(2, 2);
    shape.lineTo(-2, 2);
    
    // Add holes as shape.holes
    if (pattern === 'corners') {
      const positions = [[-1.5, -1.5], [1.5, -1.5], [1.5, 1.5], [-1.5, 1.5]];
      positions.forEach(([x, y]) => {
        const hole = new THREE.Path();
        hole.absarc(x, y, 0.2, 0, Math.PI * 2);
        shape.holes.push(hole);
      });
    }
    
    return new THREE.ExtrudeGeometry(shape, { depth: 0.5 });
  }, [pattern]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#ef4444" />
    </mesh>
  );
}
```

This is simpler but less flexible than full CSG operations.
