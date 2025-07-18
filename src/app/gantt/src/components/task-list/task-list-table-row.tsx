import React, {
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import type {
  CSSProperties,
  MouseEvent,
} from 'react';

import { useDrop } from "react-dnd";

import cx from "classnames";

import {
  ColorStyles,
  Column,
  ColumnData,
  ColumnResizeEvent,
  DateSetup,
  DependencyMap,
  Distances,
  Icons,
  Task,
  TaskOrEmpty,
} from "../../types/public-types";

// import styles from "./task-list-table-row.module.css";
import { ROW_DRAG_TYPE } from "../../constants";

type TaskListTableRowProps = {
  canMoveTasks: boolean;
  colors: ColorStyles;
  columnResizeEvent: ColumnResizeEvent | null;
  columns: readonly Column[];
  dateSetup: DateSetup;
  dependencyMap: DependencyMap;
  depth: number;
  distances: Distances;
  fullRowHeight: number;
  getTaskCurrentState: (task: Task) => Task;
  handleAddTask: (task: Task) => void;
  handleDeteleTasks: (task: TaskOrEmpty[]) => void;
  handleEditTask: (task: TaskOrEmpty) => void;
  handleMoveTaskAfter: (target: TaskOrEmpty, taskForMove: TaskOrEmpty) => void;
  handleMoveTasksInside: (parent: Task, childs: readonly TaskOrEmpty[]) => void;
  handleOpenContextMenu: (task: TaskOrEmpty, clientX: number, clientY: number) => void;
  hasChildren: boolean;
  icons?: Partial<Icons>;
  indexStr: string;
  isClosed: boolean;
  isCut: boolean;
  isEven: boolean;
  isSelected: boolean;
  isShowTaskNumbers: boolean;
  onExpanderClick: (task: Task) => void;
  scrollToTask: (task: Task) => void;
  selectTaskOnMouseDown: (taskId: string, event: MouseEvent) => void;
  style?: CSSProperties;
  task: TaskOrEmpty;
};

const TaskListTableRowInner: React.FC<TaskListTableRowProps> = ({
  canMoveTasks,
  colors,
  columnResizeEvent,
  columns,
  dateSetup,
  dependencyMap,
  depth,
  distances,
  fullRowHeight,
  getTaskCurrentState,
  handleAddTask,
  handleDeteleTasks,
  handleEditTask,
  handleMoveTaskAfter,
  handleMoveTasksInside,
  handleOpenContextMenu,
  hasChildren,
  icons = undefined,
  indexStr,
  isClosed,
  isCut,
  isEven,
  isSelected,
  isShowTaskNumbers,
  onExpanderClick,
  scrollToTask,
  selectTaskOnMouseDown,
  style = undefined,
  task,
}) => {
  const {
    id,
    comparisonLevel = 1,
  } = task;

  const onRootMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    if (task.type === 'empty') {
      return;
    }

    scrollToTask(task);
    selectTaskOnMouseDown(task.id, event);
  }, [
    scrollToTask,
    selectTaskOnMouseDown,
    task,
  ]);

  const onContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    handleOpenContextMenu(task, event.clientX, event.clientY);
  }, [handleOpenContextMenu, task]);

  const [dropInsideProps, dropInside] = useDrop({
    accept: ROW_DRAG_TYPE,

    drop: (item: TaskOrEmpty, monitor) => {
      if (
        monitor.didDrop()
        || task.type === "empty"
        || task.type === "milestone"
      ) {
        return;
      }

      handleMoveTasksInside(task, [item]);
    },

    canDrop: (item: TaskOrEmpty) => item.id !== id
      || (item.comparisonLevel || 1) !== comparisonLevel,

    collect: (monitor) => ({
      isLighten: monitor.canDrop() && monitor.isOver(),
    }),
  }, [id, comparisonLevel, handleMoveTasksInside, task]);

  const [dropAfterProps, dropAfter] = useDrop({
    accept: ROW_DRAG_TYPE,
    
    drop: (item: TaskOrEmpty) => {
      handleMoveTaskAfter(task, item);
    },

    collect: (monitor) => ({
      isLighten: monitor.isOver(),
    }),
  }, [id, comparisonLevel, handleMoveTaskAfter, task]);

  const dependencies = useMemo<Task[]>(() => {
    const dependenciesAtLevel = dependencyMap.get(comparisonLevel);

    if (!dependenciesAtLevel) {
      return [];
    }

    const dependenciesByTask = dependenciesAtLevel.get(id);

    if (!dependenciesByTask) {
      return [];
    }

    return dependenciesByTask.map(({ source }) => source);
  }, [comparisonLevel, dependencyMap, id]);


const EditarColumnwhitInput: React.FC<{ data: ColumnData }> = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data.task.name);
  const [task, setTask] = useState(data.task);
  const [isDisabled, setIsDisabled] = useState(data.task.isDisabled);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === "Enter") {
      setIsEditing(false);
      setTask({
        ...task,
        name: value,
      });
      data.handleEditTask({
        ...task,
        name: value,
      });
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={cx(["taskListCellInputWrapper"], {
        "taskListCellInputWrapperHovered": isHovered,
        "taskListCellInputWrapperFocused": isFocused,
      })}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isEditing ? (
        <input
          className="taskListCellInput"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className="taskListCellInput">
          {task.name}
        </div>
      )}
    </div>
  );
}

  const columnData: ColumnData = useMemo(() => ({
    canMoveTasks,
    dateSetup,
    dependencies,
    depth,
    distances,
    handleDeteleTasks,
    handleAddTask,
    handleEditTask,
    hasChildren,
    icons,
    indexStr,
    isClosed,
    isShowTaskNumbers,
    onExpanderClick,
    task: task.type === 'empty' ? task : getTaskCurrentState(task),
  }), [
    canMoveTasks,
    dateSetup,
    dependencies,
    depth,
    distances,
    getTaskCurrentState,
    handleDeteleTasks,
    handleAddTask,
    handleEditTask,
    hasChildren,
    icons,
    indexStr,
    isClosed,
    isShowTaskNumbers,
    onExpanderClick,
    task,
  ]);

  return (
    <div
      className={cx(["taskListTableRow"], {
        "lighten": dropInsideProps.isLighten && !dropAfterProps.isLighten,
        "cut" : isCut,
      })}
      onMouseDown={onRootMouseDown}
      style={{
        height: fullRowHeight,
        backgroundColor: isSelected
          ? colors.selectedTaskBackgroundColor
          : isEven
            ? colors.evenTaskBackgroundColor
            : undefined,
        ...style,
      }}
      onContextMenu={onContextMenu}
      ref={dropInside}
    >
      {/* <h1>holaaaaaaa</h1> */}
      {columns.map(({
        component: Component,
        width,
      }, index) => {
        const columnWidth = columnResizeEvent && columnResizeEvent.columnIndex === index
          ? Math.max(5, width + columnResizeEvent.endX - columnResizeEvent.startX)
          : width;

        return (
          <div
            className="taskListCell"
            style={{
              minWidth: columnWidth,
              maxWidth: columnWidth,
            }}
            key={index}
          >
            {/* <EditarColumnwhitInput
              data={columnData}
            /> */}
            <Component
              data={columnData}
            />
          </div>
        );
      })}

      {dropInsideProps.isLighten && (
        <div
          className={cx(["dropAfter"], {
            "dropAfterLighten": dropAfterProps.isLighten,
          })}
          ref={dropAfter}
        />
      )}
    </div>
  );
};

export const TaskListTableRow = memo(TaskListTableRowInner);
