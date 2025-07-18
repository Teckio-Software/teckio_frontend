import React, { useEffect, useState } from "react";
import { ColumnProps } from "../../../types/public-types";
import { format } from "date-fns";
import { EditarGantt } from "src/app/gantt/service/api/ganttService";

export const DateEndColumn: React.FC<ColumnProps> = ({
  data: {
    dateSetup: { dateFormats, dateLocale },
    task,
  },
}) => {
  if (!task || task.type === "empty") {
    return null;
  }

  const [fecha, setFecha] = useState<string>(
    task.end ? format(task.end, 'yyyy-MM-dd', { locale: dateLocale }) : ''
  );

  useEffect(() => {
    setFecha(
      task.end ? format(task.end, 'yyyy-MM-dd', { locale: dateLocale }) : ''
    );
  }, [task.end, dateLocale]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFecha = event.target.value;
    setFecha(newFecha);

    const updatedTask = {
      ...task,
      end: newFecha,
    };

    EditarGantt(updatedTask, task.selectedEmpresa);
    setTimeout(() => {
      task.getProgramaciones && task.getProgramaciones();
      task.getImporteSemanal && task.getImporteSemanal();
    }, 500);
  };
  if (task.type === "task") {
    return (
      <input
      type="date"
      className="bg-transparent w-full outline-none"
      onChange={handleChange}
      value={fecha}
    />
    );
  } else if (task.type === "project") {
    return (
      <input
      disabled
      type="date"
      className="bg-transparent w-full outline-none"
      onChange={handleChange}
      value={fecha}
    />
    );
  }

  return null;
 
};
