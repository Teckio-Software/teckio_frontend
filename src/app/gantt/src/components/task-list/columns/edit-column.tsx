import React, {
  useCallback,
} from "react";

import { ColumnProps } from "../../../types/public-types";


export const EditColumn: React.FC<ColumnProps> = ({
  data: {
    handleEditTask,
    icons,
    task,
  },
}) => {
  const onClick = useCallback(() => {
    handleEditTask(task);
  }, [task, handleEditTask]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="button"
    >
      {icons?.renderEditIcon ? icons.renderEditIcon() : "✎"}
    </button>
  );
};
