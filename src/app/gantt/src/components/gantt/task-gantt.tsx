import React, {
  memo,
  SyntheticEvent,
  useMemo,
} from "react";
import type {
  CSSProperties,
  RefObject,
} from "react";

import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";

export type TaskGanttProps = {
  barProps: TaskGanttContentProps;
  calendarProps: CalendarProps;
  fullRowHeight: number;
  fullSvgWidth: number;
  ganttFullHeight: number;
  ganttHeight: number;
  ganttSVGRef: RefObject<SVGSVGElement>;
  gridProps: GridProps;
  horizontalContainerRef: RefObject<HTMLDivElement>;
  onVerticalScrollbarScrollX: (event: SyntheticEvent<HTMLDivElement>) => void;
  verticalGanttContainerRef: RefObject<HTMLDivElement>;
};

const TaskGanttInner: React.FC<TaskGanttProps> = ({
  barProps,
  barProps: {
    additionalLeftSpace,
  },

  calendarProps,
  fullRowHeight,
  fullSvgWidth,
  ganttFullHeight,
  ganttHeight,
  ganttSVGRef,
  gridProps,
  gridProps: {
    distances: {
      columnWidth,
    },
  },
  horizontalContainerRef,
  onVerticalScrollbarScrollX,
  verticalGanttContainerRef,
}) => {
  const containerStyle = useMemo<CSSProperties>(() => ({
    height: ganttHeight,
    width: fullSvgWidth,
  }), [
    fullSvgWidth,
    ganttHeight,
    ganttFullHeight,
  ]);

  const gridStyle = useMemo<CSSProperties>(() => {
    const offsetX = additionalLeftSpace || 0;

    return {
      height: ganttFullHeight,
      width: fullSvgWidth,
      backgroundColor: '#ffffff',
      backgroundImage: [
        `linear-gradient(to right, rgba(148, 163, 184, 0.35) 1px, transparent 1px)`,
        `linear-gradient(to bottom, rgba(226, 232, 240, 0.9) 1px, transparent 1px)`,
        `linear-gradient(to bottom, rgba(248, 250, 252, 0.65) 50%, transparent 50%)`,
      ].join(', '),
      backgroundSize: [
        `${columnWidth}px ${fullRowHeight}px`,
        `${columnWidth}px ${fullRowHeight}px`,
        `100% ${fullRowHeight * 2}px`,
      ].join(', '),
      backgroundPosition: [
        `${offsetX}px 0`,
        `${offsetX}px 0`,
        `0 0`,
      ].join(', '),
    };
  }, [
    additionalLeftSpace,
    columnWidth,
    fullRowHeight,
    fullSvgWidth,
    ganttFullHeight,
  ]);

  return (
    <div
      className="ganttVerticalContainer"
      ref={verticalGanttContainerRef}
      onScroll={onVerticalScrollbarScrollX}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={fullSvgWidth}
        height={calendarProps.distances.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>

      <div
        ref={horizontalContainerRef}
        className="horizontalContainer"
        style={containerStyle}
      >
        <div style={gridStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={fullSvgWidth}
            height={ganttFullHeight}
            fontFamily={barProps.fontFamily}
            ref={ganttSVGRef}
          >
            <Grid {...gridProps} />
            <TaskGanttContent {...barProps} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const TaskGantt = memo(TaskGanttInner);
