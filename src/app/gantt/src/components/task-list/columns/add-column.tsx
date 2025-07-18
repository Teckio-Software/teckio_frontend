import React, {
  useCallback,
} from "react";

import { ColumnProps } from "../../../types/public-types";


export const AddColumn: React.FC<ColumnProps> = ({
  data: {
    handleAddTask,
    icons,
    task,
  },
}) => {
  const onClick = useCallback(() => {
    if (task.type === "empty") {
      return;
    }

    handleAddTask(task);
  }, [task, handleAddTask]);

  if (task.type === "empty" || task.type === "milestone") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="button"
    >
      {icons?.renderAddIcon ? icons.renderAddIcon() : "+"}
    </button>
  );
};
