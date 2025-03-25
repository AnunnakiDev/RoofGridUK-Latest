import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const TestKonva: React.FC = () => {
  return (
    <Stage width={300} height={300}>
      <Layer>
        <Rect x={50} y={50} width={100} height={100} fill="red" />
      </Layer>
    </Stage>
  );
};

export default TestKonva;