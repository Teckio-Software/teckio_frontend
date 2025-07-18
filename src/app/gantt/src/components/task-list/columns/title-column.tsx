import React, {
  useCallback,
  useMemo,
} from "react";

import { useDrag } from "react-dnd";

import cx from "classnames";

import { ROW_DRAG_TYPE } from "../../../constants";

import { ColumnProps, Icons } from "../../../types/public-types";


const getExpanderSymbol = (
  hasChildren: boolean,
  isClosed: boolean,
  icons: Partial<Icons> | undefined,
) => {
  if (!hasChildren) {
    return icons?.renderNoChildrenIcon ? icons.renderNoChildrenIcon() : "";
  }

  if (isClosed) {
    return icons?.renderClosedIcon ? icons.renderClosedIcon() : "⊞";
  }

  return icons?.renderOpenedIcon ? icons.renderOpenedIcon() : "⊟";
};

export const TitleColumn: React.FC<ColumnProps> = ({
  data: {
    canMoveTasks,

    distances: {
      expandIconWidth,
      nestedTaskNameOffset,
    },

    icons,
    isShowTaskNumbers,
    hasChildren,
    isClosed,
    depth,
    // indexStr,
    task,
    onExpanderClick,
  },
}) => {
  const {
    id,
    comparisonLevel = 1,
    name,
  } = task;

  const [collected, drag] = useDrag({
    type: ROW_DRAG_TYPE,
    item: task,

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }, [id, comparisonLevel, task]);

  const expanderSymbol = useMemo(
    () => getExpanderSymbol(hasChildren, isClosed, icons),
    [hasChildren, isClosed, icons],
  );

  // const title = isShowTaskNumbers ? `${indexStr} ${name}` : name;

  const onClick = useCallback(() => {
    if (task.type !== "empty") {
      onExpanderClick(task);
    }
  }, [onExpanderClick, task]);

  return (
    <div
      className={cx(["taskListNameWrapper"], {
        "dragging": collected.isDragging,
      })}
      style={{
        paddingLeft: depth * nestedTaskNameOffset,
      }}
      // title={title}
      ref={canMoveTasks ? drag : undefined}
    >
      <div
        className={cx(["taskListExpander"], {
          "taskListEmptyExpander": !hasChildren,
        })}
        onClick={onClick}
        style={{
          width: expandIconWidth,
        }}
      >
        {expanderSymbol}
      </div>

      {/* <div className="taskName">
        {isShowTaskNumbers && (
          <b>{indexStr}{' '}</b>
        )} */}

        {name}
      </div>
    // </div>
  );
};
