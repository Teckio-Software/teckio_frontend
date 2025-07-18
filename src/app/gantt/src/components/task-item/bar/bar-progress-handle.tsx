import React from "react";

type BarProgressHandleProps = {
  progressPoint: string;
  startMoveProgress: (clientX: number) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  progressPoint,
  startMoveProgress,
}) => {
  return (
    <polygon
      className="barHandle"
      points={progressPoint}
      onMouseDown={(e) => {
        startMoveProgress(e.clientX);
      }}
      onTouchStart={(e) => {
        const firstTouch = e.touches[0];
      
        if (firstTouch) {
          startMoveProgress(firstTouch.clientX);
        }
      }}
    />
  );
};
