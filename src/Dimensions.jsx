import { Html } from '@react-three/drei';

/**
 * Dimensions component - Shows measurements on parts
 * Displays key dimensions floating next to the part
 */
export default function Dimensions({ type, params, scale = [1, 1, 1], position = [0, 0, 0] }) {
  // Calculate what dimensions to show based on part type (with scale applied)
  const getDimensions = () => {
    switch (type) {
      case 'cylinder':
        return [
          { label: `R: ${(params.radius * scale[0]).toFixed(2)}mm`, offset: [params.radius + 0.5, 0, 0] },
          { label: `H: ${(params.height * scale[1]).toFixed(2)}mm`, offset: [0, params.height / 2 + 0.5, 0] }
        ];
      
      case 'gear':
        const pitchRadius = (params.module * params.teeth) / 2;
        return [
          { label: `T: ${params.teeth}`, offset: [0, params.thickness / 2 + 0.5, 0] },
          { label: `D: ${(pitchRadius * 2 * scale[0]).toFixed(2)}mm`, offset: [pitchRadius + 0.5, 0, 0] },
          { label: `B: ${(params.boreRadius * scale[0]).toFixed(2)}mm`, offset: [0, 0, params.boreRadius + 0.3] }
        ];
      
      case 'plate':
        return [
          { label: `W: ${(params.width * scale[0]).toFixed(2)}mm`, offset: [params.width / 2 + 0.5, 0, 0] },
          { label: `L: ${(params.length * scale[2]).toFixed(2)}mm`, offset: [0, 0, params.length / 2 + 0.5] },
          { label: `T: ${(params.thickness * scale[1]).toFixed(2)}mm`, offset: [0, params.thickness / 2 + 0.3, 0] }
        ];
      
      case 'spring':
        return [
          { label: `R: ${(params.radius * scale[0]).toFixed(2)}mm`, offset: [params.radius + 0.5, 0, 0] },
          { label: `H: ${(params.height * scale[1]).toFixed(2)}mm`, offset: [0, params.height / 2 + 0.5, 0] },
          { label: `C: ${params.coils}`, offset: [0, 0, params.radius + 0.5] }
        ];
      
      default:
        return [];
    }
  };

  const dimensions = getDimensions();

  return (
    <group position={position}>
      {dimensions.map((dim, index) => (
        <Html
          key={index}
          position={dim.offset}
          center
          distanceFactor={5}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="dimension-label">
            {dim.label}
          </div>
        </Html>
      ))}
    </group>
  );
}
