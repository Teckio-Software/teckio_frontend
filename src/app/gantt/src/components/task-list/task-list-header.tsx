import React, {
  Fragment,
  memo,
} from "react";

import { TaskListHeaderProps } from "../../types/public-types";


const TaskListHeaderDefaultInner: React.FC<TaskListHeaderProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  columns,
  columnResizeEvent,
  canResizeColumns,
  onColumnResizeStart,
}) => {
  return (
    <div
      className="ganttTable"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className="ganttTable_Header"
        style={{
          height: headerHeight - 2,
        }}
      >
        {columns.map(({
          title,
          width,
          canResize,
        }, index) => {
          const columnWidth = columnResizeEvent && columnResizeEvent.columnIndex === index
            ? Math.max(5, width + columnResizeEvent.endX - columnResizeEvent.startX)
            : width;

          return (
            <Fragment key={index}>
              {index > 0 && (
                <div
                  className="ganttTable_HeaderSeparator"
                  style={{
                    height: headerHeight * 0.5,
                    marginTop: headerHeight * 0.2,
                  }}
                />
              )}

              <div
                className="ganttTable_HeaderItem"
                style={{
                  minWidth: columnWidth,
                  maxWidth: columnWidth,
                }}
              >
                {title}

                {canResizeColumns && canResize !== false &&  (
                  <div
                    className="resizer"
                    onMouseDown={(event) => {
                      onColumnResizeStart(index, event.clientX);
                    }}
                    onTouchStart={(event) => {
                      const firstTouch = event.touches[0];

                      if (firstTouch) {
                        onColumnResizeStart(index, firstTouch.clientX);
                      }
                    }}
                  />
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const TaskListHeaderDefault = memo(TaskListHeaderDefaultInner);
