import React, {
  useCallback,
} from "react";

import { ColumnProps } from "../../../types/public-types";


export const DeleteColumn: React.FC<ColumnProps> = ({
  data: {
    handleDeteleTasks,
    icons,
    task,
  },
}) => {
  const onClick = useCallback(() => {
    handleDeteleTasks([task]);
  }, [task, handleDeteleTasks]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="button"
    >
      {icons?.renderDeleteIcon ? icons.renderDeleteIcon() : "-"}
    </button>
  );
};
