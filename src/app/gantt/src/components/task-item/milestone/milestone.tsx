import React, {
  useMemo,
} from "react";

import cx from "classnames";

import { BarRelationHandle } from "../bar/bar-relation-handle";

import type { TaskItemProps } from "../task-item";
import type { BarMoveAction } from "../../../types/gantt-task-actions";


export const Milestone: React.FC<TaskItemProps & {
  onLeftRelationTriggerMouseDown: () => void;
  onRightRelationTriggerMouseDown: () => void;
  onTaskEventStart: (action: BarMoveAction, clientX: number) => void;
}> = ({
  taskYOffset,

  distances: {
    barCornerRadius,
    relationCircleOffset,
    relationCircleRadius,
  },

  taskHeight,
  taskHalfHeight,
  isRelationChangeable,
  isRelationDrawMode,
  onLeftRelationTriggerMouseDown,
  onRightRelationTriggerMouseDown,
  onTaskEventStart,
  isSelected,
  isCritical,
  colorStyles,
  x1,
  x2,
}) => {
  const rotatedHeight = taskHeight / 1.414;

  const transform = `rotate(45 ${x1 + rotatedHeight * 0.356} 
    ${taskYOffset + rotatedHeight * 0.85})`;

  const barColor = useMemo(() => {
    if (isCritical) {
      if (isSelected) {
        return colorStyles.milestoneBackgroundSelectedCriticalColor;
      }

      return colorStyles.milestoneBackgroundCriticalColor;
    }

    if (isSelected) {
      return colorStyles.milestoneBackgroundSelectedColor;
    }

    return colorStyles.milestoneBackgroundColor;
  }, [isSelected, isCritical, colorStyles]);

  return (
    <g
      tabIndex={0}
      className={cx(["milestoneWrapper"], "barRelationHandleWrapper")}
    >
      <rect
        fill={barColor}
        x={x1}
        width={rotatedHeight}
        y={taskYOffset}
        height={rotatedHeight}
        rx={barCornerRadius}
        ry={barCornerRadius}
        transform={transform}
        className="milestoneBackground"
        onMouseDown={(e) => {
          onTaskEventStart("move", e.clientX);
        }}
        onTouchStart={(e) => {
          const firstTouch = e.touches[0];

          if (firstTouch) {
            onTaskEventStart("move", firstTouch.clientX);
          }
        }}
      />

      <g className="handleGroup">
        {isRelationChangeable && (
          <g>
            {/* left */}
            <BarRelationHandle
              isRelationDrawMode={isRelationDrawMode}
              x={x1 - relationCircleOffset}
              y={taskYOffset + taskHalfHeight}
              radius={relationCircleRadius}
              startDrawRelation={onLeftRelationTriggerMouseDown}
            />
            {/* right */}
            <BarRelationHandle
              isRelationDrawMode={isRelationDrawMode}
              x={x2 + relationCircleOffset}
              y={taskYOffset + taskHalfHeight}
              radius={relationCircleRadius}
              startDrawRelation={onRightRelationTriggerMouseDown}
            />
          </g>
        )}
      </g>
    </g>
  );
};
