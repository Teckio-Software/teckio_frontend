import React from "react";

type BarDateHandleProps = {
  barCornerRadius: number;
  height: number;
  startMove: (clientX: number) => void;
  width: number;
  x: number;
  y: number;
};

export const BarDateHandle: React.FC<BarDateHandleProps> = ({
  barCornerRadius,
  height,
  startMove,
  width,
  x,
  y,
}) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className="barHandle"
      ry={barCornerRadius}
      rx={barCornerRadius}
      onMouseDown={(e) => {
        startMove(e.clientX);
      }}
      onTouchStart={(e) => {
        const firstTouch = e.touches[0];

        if (firstTouch) {
          startMove(firstTouch.clientX);
        }
      }}
    />
  );
};
