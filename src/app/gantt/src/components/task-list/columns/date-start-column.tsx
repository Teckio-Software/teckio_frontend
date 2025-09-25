import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnProps } from "../../../types/public-types";
import { format } from "date-fns";
import { EditarGantt } from "src/app/gantt/service/api/ganttService";

export const DateStartColumn: React.FC<ColumnProps> = ({
  data: {
    dateSetup: { dateLocale },
    task,
  },
}) => {
  if (!task || task.type === "empty") {
    return null;
  }

  const startDate = useMemo(() => {
    if (!task.start) {
      return null;
    }

    if (task.start instanceof Date) {
      return Number.isNaN(task.start.getTime()) ? null : task.start;
    }

    const parsed = new Date(task.start);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [task.start]);

  const formattedStart = useMemo(() => {
    if (!startDate) {
      return "";
    }

    try {
      return format(startDate, "yyyy-MM-dd", { locale: dateLocale });
    } catch (error) {
      return "";
    }
  }, [startDate, dateLocale]);

  const [fecha, setFecha] = useState<string>(formattedStart);

  useEffect(() => {
    if (fecha !== formattedStart) {
      setFecha(formattedStart);
    }
  }, [formattedStart, fecha]);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFecha = event.target.value;
      setFecha(newFecha);

      const nextStart = newFecha ? new Date(newFecha) : startDate;

      if (!nextStart || Number.isNaN(nextStart.getTime())) {
        return;
      }

      const updatedTask = {
        ...task,
        start: nextStart,
      };

      try {
        await EditarGantt(updatedTask, task.selectedEmpresa);
        if (typeof task.refreshAllData === "function") {
          await task.refreshAllData();
        }
      } catch (error) {
        console.error("Error al actualizar la fecha de inicio", error);
      }
    },
    [startDate, task],
  );

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
        type="date"
        disabled
        className="bg-transparent w-full outline-none"
        onChange={handleChange}
        value={fecha}
      />
    );
  }

  return null;
};

