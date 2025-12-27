import { useMemo } from 'react';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

/**
 * BooleanTool - Performs CSG (Constructive Solid Geometry) operations
 * Similar to Blender's Boolean modifier
 * 
 * Operations:
 * - 'subtract': A - B (cut B from A)
 * - 'union': A + B (combine both)
 * - 'intersect': A ∩ B (only overlapping parts)
 */
export default function BooleanTool({ 
  meshA,        // First mesh (base object)
  meshB,        // Second mesh (tool object)
  operation = 'subtract',  // 'subtract' | 'union' | 'intersect'
  color = '#8b5cf6'
}) {
  // Perform CSG operation
  const resultGeometry = useMemo(() => {
    if (!meshA || !meshB) return null;

    try {
      // Clone meshes to avoid modifying originals
      const meshACopy = meshA.clone();
      const meshBCopy = meshB.clone();

      // Update matrices
      meshACopy.updateMatrix();
      meshBCopy.updateMatrix();

      // Perform CSG operation
      let result;
      switch(operation) {
        case 'subtract':
          result = CSG.subtract(meshACopy, meshBCopy);
          break;
        case 'union':
          result = CSG.union(meshACopy, meshBCopy);
          break;
        case 'intersect':
          result = CSG.intersect(meshACopy, meshBCopy);
          break;
        default:
          result = meshACopy;
      }

      return result.geometry;
    } catch (error) {
      console.error('Boolean operation failed:', error);
      return meshA.geometry; // Return original if operation fails
    }
  }, [meshA, meshB, operation]);

  if (!resultGeometry) return null;

  return (
    <mesh geometry={resultGeometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color={color}
        metalness={0.4}
        roughness={0.3}
      />
    </mesh>
  );
}

/**
 * Helper function to create a hole in a part
 * 
 * @param {THREE.Mesh} part - The part to add hole to
 * @param {Object} holeConfig - Hole configuration
 * @param {number} holeConfig.radius - Hole radius
 * @param {number} holeConfig.depth - Hole depth
 * @param {Array} holeConfig.position - [x, y, z] position
 * @param {string} holeConfig.axis - 'x' | 'y' | 'z' - drilling direction
 * @returns {THREE.Mesh} Result mesh with hole
 */
export function createHole(part, holeConfig) {
  const { radius = 0.2, depth = 10, position = [0, 0, 0], axis = 'z' } = holeConfig;

  // Create cylinder for hole (drill bit)
  let holeGeometry;
  if (axis === 'y') {
    holeGeometry = new THREE.CylinderGeometry(radius, radius, depth, 16);
  } else if (axis === 'x') {
    holeGeometry = new THREE.CylinderGeometry(radius, radius, depth, 16);
    holeGeometry.rotateZ(Math.PI / 2);
  } else {
    holeGeometry = new THREE.CylinderGeometry(radius, radius, depth, 16);
    holeGeometry.rotateX(Math.PI / 2);
  }

  const holeMesh = new THREE.Mesh(
    holeGeometry,
    new THREE.MeshBasicMaterial()
  );
  holeMesh.position.set(...position);
  holeMesh.updateMatrix();

  // Subtract hole from part
  const partCopy = part.clone();
  partCopy.updateMatrix();

  const result = CSG.subtract(partCopy, holeMesh);
  return result;
}
