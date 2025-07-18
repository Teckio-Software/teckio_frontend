import React, {
  ComponentType,
} from "react";

import type { Strategy } from "@floating-ui/dom";

import type {
  Task,
} from "../../types/public-types";


export type TooltipProps = {
  tooltipX: number | null;
  tooltipY: number | null;
  tooltipStrategy: Strategy;
  setFloatingRef: (node: HTMLElement | null) => void;
  getFloatingProps: () => Record<string, unknown>;
  task: Task;
  fontSize: string;
  fontFamily: string;
  TooltipContent: ComponentType<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipX,
  tooltipY,
  tooltipStrategy,
  setFloatingRef,
  getFloatingProps,
  task,
  fontSize,
  fontFamily,
  TooltipContent,
}) => {
  return (
    <div
      ref={setFloatingRef}
      style={{
        position: tooltipStrategy,
        top: tooltipY ?? 0,
        left: tooltipX ?? 0,
        width: 'max-content',
      }}
      {...getFloatingProps()}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  return (
    <div
      className="tooltipDefaultContainer"
      style={style}
    >
      <b style={{ fontSize: fontSize + 5 }}>{`${
        task.name
      }: ${task.start.getDate()}-${
        task.start.getMonth() + 1
      }-${task.start.getFullYear()} - ${task.end.getDate()}-${
        task.end.getMonth() + 1
      }-${task.end.getFullYear()}`}</b>
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className="tooltipDefaultContainerParagraph">{`Duracción: ${~~(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} Día(s)`}</p>
      )}

      <p className="tooltipDefaultContainerParagraph">
        {!!task.progress && `Progreso: ${task.progress} %`}
      </p>
    </div>
  );
};
