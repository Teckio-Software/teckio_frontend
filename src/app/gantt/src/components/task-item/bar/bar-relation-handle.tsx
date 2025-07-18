import React, {
  memo,
} from "react";

import cx from "classnames";


type BarRelationHandleProps = {
  isRelationDrawMode: boolean;
  radius: number;
  startDrawRelation: () => void;
  x: number;
  y: number;
};

const BarRelationHandleInner: React.FC<BarRelationHandleProps> = ({
  isRelationDrawMode,
  radius,
  startDrawRelation,
  x,
  y,
}) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      className={cx(["barRelationHandle"], {
        "barRelationHandle_drawMode": isRelationDrawMode,
      })}
      onMouseDown={startDrawRelation}
      onTouchStart={startDrawRelation}
      data-draw-mode={isRelationDrawMode}
    />
  );
};

export const BarRelationHandle = memo(BarRelationHandleInner);
