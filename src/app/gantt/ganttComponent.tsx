import React, { useCallback, useEffect, useRef, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import {
//   initTasks,
//   onAddTask,
//   onEditTask,
// } from "./helper";
import {
  Column,
  ColumnProps,
  DateEndColumn,
  DateStartColumn,
  EditColumn,
  Gantt,
  Icons,
  ImporteSemanalDTO,
  OnChangeTasks,
  GanttViewport,
  OnDateChangeSuggestionType,
  Task,
  TaskOrEmpty,
  TitleColumn,
  ViewMode,
} from "./src";
import { ViewSwitcher } from "./components/view-switcher";
import { CodigoColumn } from "./src/components/task-list/columns/codigo-column";
import { DescripcionColumn } from "./src/components/task-list/columns/descripcion-column";
import {
  asignarComando,
  asignarDuracionGantt,
  asignarProgresoGantt,
  dependenciaProgramacionEstimadaDTO,
  EditarGantt,
  EliminarGantt,
  GanttData,
  GenerarDependencia,
  GenerarDependenciaXNumerador,
  GenerarDesfase,
  ImporteSemanalGanttData,
} from "./service/api/ganttService";
import { ImporteColumn } from "./src/components/task-list/columns/importe-column";
import { TableBelow } from "./src/components/table-below/table-below";
import { faFolder, faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const refreshTaskData = async (task: TaskOrEmpty) => {
  if (task.type === "empty") {
    return;
  }

  if (typeof task.refreshAllData === "function") {
    try {
      await task.refreshAllData();
    } catch (error) {
      console.error("Error al refrescar la informacion del Gantt", error);
    }
  }
};
const ProgressColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [progress, setProgress] = useState(`${task.progress}`);

  useEffect(() => {
    setProgress(`${task.progress}`);
  }, [task.progress]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newProgress = Number(progress);
      if (!isNaN(newProgress)) {
        const updatedTask = {
          ...task,
          progress: newProgress,
        };

        try {
          await asignarProgresoGantt(updatedTask, task.selectedEmpresa);
          await refreshTaskData(task);
        } catch (error) {
          console.error("Error al actualizar el progreso", error);
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(event.target.value);
  };

  if (task.type === "task") {
    return (
      <input
        type="number"
        className="bg-transparent w-full outline-none"
        style={{
          color: "#0055ff",
        }}
        value={progress}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else if (task.type === "project") {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
        value={progress}
      />
    );
  }

  return null;
};

const DesfaseComandoColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [desfaseComando, setDesfaseComando] = useState(
    `${task.desfaseComando}`
  );

  useEffect(() => {
    setDesfaseComando(`${task.desfaseComando}`);
  }, [task.desfaseComando]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newdesfaseComando = Number(desfaseComando);
      if (!isNaN(newdesfaseComando)) {
        const updatedTask = {
          ...task,
          desfaseComando: newdesfaseComando,
        };

        try {
          await GenerarDesfase(updatedTask, task.selectedEmpresa);
          await refreshTaskData(task);
        } catch (error) {
          console.error("Error al actualizar el desfase", error);
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesfaseComando(event.target.value);
  };

  if (task.type === "task") {
    return (
      <input
        type="number"
        className="bg-transparent w-full outline-none"
        style={{
          color: "#0055ff",
        }}
        value={desfaseComando}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else if (task.type === "project") {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
      />
    );
  }

  return null;
};

const NumeradorColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [numerador, setNumerador] = useState(`${task.numerador}`);

  useEffect(() => {
    setNumerador(`${task.numerador}`);
  }, [task.numerador]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newNumerador = Number(numerador);
      if (!isNaN(newNumerador)) {
        const updatedTask = {
          ...task,
          numerador: newNumerador,
        };

        try {
          await asignarProgresoGantt(updatedTask, task.selectedEmpresa);
          await refreshTaskData(task);
        } catch (error) {
          console.error("Error al actualizar el numerador", error);
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumerador(event.target.value);
  };

  return (
    <input
      type="text"
      className="bg-transparent w-full outline-none"
      disabled
      style={{
        color: "#000000",
      }}
      value={numerador}
      onChange={handleChange}
      onKeyDown={(event) => {
        event.stopPropagation();
        handleKeyDown(event);
      }}
    />
  );
};

const DuracionColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [duracion, setDuracion] = useState(`${task.duracion}`);

  useEffect(() => {
    setDuracion(`${task.duracion}`);
  }, [task.duracion]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newDuracion = Number(duracion);
      if (!isNaN(newDuracion)) {
        const updatedTask = {
          ...task,
          duracion: newDuracion,
        };

        try {
          await asignarDuracionGantt(updatedTask, task.selectedEmpresa);
          await refreshTaskData(task);
        } catch (error) {
          console.error("Error al actualizar la duracion", error);
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuracion(event.target.value);
  };

  if (task.type === "task") {
    return (
      <input
        type="number"
        className="bg-transparent w-full outline-none"
        style={{
          color: "#0055ff",
        }}
        value={duracion}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else if (task.type === "project") {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
        value={duracion}
      />
    );
  }

  return null;
};

const PredecesorColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [predecesor, setPredecesor] = useState(`${task.predecesor}`);

  useEffect(() => {
    setPredecesor(`${task.predecesor}`);
  }, [task.numerador]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newPredecesor = Number(predecesor);
      if (!isNaN(newPredecesor)) {
        const updatedTask = {
          ...task,
          predecesor: newPredecesor,
        };

        try {
          await GenerarDependenciaXNumerador(updatedTask, task.selectedEmpresa);
          await refreshTaskData(task);
        } catch (error) {
          console.error("Error al actualizar la dependencia", error);
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPredecesor(event.target.value);
  };

  return (
    <input
      type="text"
      className="bg-transparent w-full outline-none"
      style={{
        color: "#000000",
      }}
      value={predecesor}
      onChange={handleChange}
      onKeyDown={(event) => {
        event.stopPropagation();
        handleKeyDown(event);
      }}
    />
  );
};

const ComandoColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [comando, setComando] = useState(`${task.comando}`);

  useEffect(() => {
    setComando(`${task.comando}`);
  }, [task.comando]);

  const handleKeyDown = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newComando = Number(event.target.value);
    if (!isNaN(newComando)) {
      const updatedTask = {
        ...task,
        comando: newComando,
      };

      try {
        await asignarComando(updatedTask, task.selectedEmpresa);
        await refreshTaskData(task);
      } catch (error) {
        console.error("Error al actualizar el comando", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setComando(event.target.value);
  };

  if (task.type === "task") {
    return (
      <select
        defaultValue={comando}
        onChange={(event) => {
          handleChange(event);
          handleKeyDown(event);
        }}
      >
        <option value="0">-</option>
        <option value="1">CC</option>
        <option value="2">CF</option>
        <option value="3">FC</option>
        <option value="4">FF</option>
      </select>
    );
  } else if (task.type === "project") {
    return (
      <input
        type="text"
        className="bg-transparent w-full outline-none"
        disabled
      />
    );
  }

  return null;
};

const CantidadColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [cantidad, setCantidad] = useState(`${task.cantidad}`);

  useEffect(() => {
    setCantidad(`${task.cantidad}`);
  }, [task.cantidad]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newCantidad = Number(cantidad);
      if (!isNaN(newCantidad)) {
        await refreshTaskData(task);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(event.target.value);
  };

  if (task.type === "task") {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
        style={{
          color: "#000000",
        }}
        value={cantidad}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
      />
    );
  }
};

const DependenciasColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  const [cadenaDependencias, setCadenaDependencias] = useState(
    `${task.cadenaDependencias}`
  );

  useEffect(() => {
    setCadenaDependencias(`${task.cadenaDependencias}`);
  }, [task.cadenaDependencias]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const newCadenaDependencias = Number(cadenaDependencias);
      if (!isNaN(newCadenaDependencias)) {
        await refreshTaskData(task);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCadenaDependencias(event.target.value);
  };

  if (task.type === "task") {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
        style={{
          color: "#000000",
        }}
        value={cadenaDependencias}
      />
    );
  } else {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
      />
    );
  }
};

const icons: Icons = {
  renderAddIcon: () => <>➕</>,
  renderClosedIcon: () => (
    <>
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: "#000000" }}
          size="2xs"
        />
      </div>
    </>
  ),
  renderDeleteIcon: () => <>➖</>,
  renderEditIcon: () => <>🗃</>,
  renderNoChildrenIcon: () => <></>,
  renderOpenedIcon: () => (
    <>
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ color: "#000000" }}
          size="2xs"
        />
      </div>
    </>
  ),
};

const columns: Column[] = [
  {
    component: NumeradorColumn,
    width: 41,
    title: "#",
  },
  {
    component: CodigoColumn,
    width: 150,
    title: "codigo",
  },
  {
    component: CantidadColumn,
    width: 50,
    title: "Cant.",
  },
  {
    component: ImporteColumn,
    width: 80,
    title: "Importe",
  },
  {
    component: DateStartColumn,
    width: 95,
    title: "Inicio",
    canResize: true,
  },
  {
    component: DateEndColumn,
    width: 95,
    title: "Fin",
    canResize: true,
  },
  {
    component: DuracionColumn,
    width: 41,
    title: "Dur",
  },
  {
    component: ProgressColumn,
    width: 41,
    title: "Pro%",
  },
  {
    component: ComandoColumn,
    width: 41,
    title: "TR",
  },
  {
    component: DesfaseComandoColumn,
    width: 41,
    title: "DD",
  },
  {
    component: PredecesorColumn,
    width: 41,
    title: "Predecesor",
  },
  {
    component: DependenciasColumn,
    width: 60,
    title: "Depencencias",
  },
];

type AppProps = {
  ganttHeight?: number;
  loading?: boolean;
  selectedEmpresa: number;
  selectedProyecto: number;
};

export const GanttComponent: React.FC<AppProps> = (props) => {
  const [actividades, setActividades] = useState<Task[]>([]);
  const [viewport, setViewport] = useState<GanttViewport | null>(null);
  const getProgramaciones = useCallback(async () => {
    try {
      const response = await GanttData(
        props.selectedEmpresa,
        props.selectedProyecto
      );

      if (Array.isArray(response)) {
        setActividades(response);
      } else if (response) {
        console.warn("Formato inesperado al obtener actividades", response);
        setActividades([]);
      } else {
        setActividades([]);
      }
    } catch (error) {
      console.error("Error al obtener programaciones", error);
    }
  }, [props.selectedEmpresa, props.selectedProyecto]);

  const [semanas, setSemanas] = useState<ImporteSemanalDTO[]>([]);
  const [semanasMDO, setSemanasMDO] = useState<ImporteSemanalDTO[]>([]);
  const [semanasMaterial, setSemanasMaterial] = useState<ImporteSemanalDTO[]>(
    []
  );
  const [semanasEquipo, setSemanasEquipo] = useState<ImporteSemanalDTO[]>([]);
  const [semanasHerramienta, setSemanasHerramienta] = useState<
    ImporteSemanalDTO[]
  >([]);
  const getImporteSemanal = useCallback(async () => {
    try {
      const response = await ImporteSemanalGanttData(
        props.selectedEmpresa,
        props.selectedProyecto
      );

      if (response) {
        setSemanas(response.semanas ?? []);
        setSemanasMDO(response.semanasMDO ?? []);
        setSemanasMaterial(response.semanasMaterial ?? []);
        setSemanasEquipo(response.semanasEquipo ?? []);
        setSemanasHerramienta(response.semanasHerramienta ?? []);
      } else {
        setSemanas([]);
        setSemanasMDO([]);
        setSemanasMaterial([]);
        setSemanasEquipo([]);
        setSemanasHerramienta([]);
      }
    } catch (error) {
      console.error("Error al obtener importe semanal", error);
    }
  }, [props.selectedEmpresa, props.selectedProyecto]);



  const handleViewportChange = useCallback((nextViewport: GanttViewport) => {
    setViewport(nextViewport);
  }, []);

  const refreshStateRef = useRef<{ inFlight: Promise<void> | null; queued: boolean }>({
    inFlight: null,
    queued: false,
  });

  const performDataFetch = useCallback(async () => {
    await Promise.all([getProgramaciones(), getImporteSemanal()]);
  }, [getProgramaciones, getImporteSemanal]);

  const refreshAllData = useCallback(async (): Promise<void> => {
    const state = refreshStateRef.current;

    if (state.inFlight) {
      state.queued = true;
      await state.inFlight;

      if (state.queued) {
        state.queued = false;
        return refreshAllData();
      }

      return;
    }

    state.inFlight = (async () => {
      try {
        await performDataFetch();
      } finally {
        refreshStateRef.current.inFlight = null;
      }
    })();

    await state.inFlight;

    if (state.queued) {
      state.queued = false;
      return refreshAllData();
    }
  }, [performDataFetch]);

  useEffect(() => {
    void refreshAllData();
  }, [refreshAllData]);

  let TasckDataMap = actividades.map((actividad) => {
    return {
      start: new Date(actividad.start),
      end: new Date(actividad.end),
      name: actividad.name,
      id: actividad.id,
      progress: actividad.progress,
      codigo: actividad.codigo,
      descripcion: actividad.descripcion,
      importe: actividad.importe,
      selectedEmpresa: props.selectedEmpresa,
      getProgramaciones: getProgramaciones,
      getImporteSemanal: getImporteSemanal,
      refreshAllData: refreshAllData,
      type: actividad.type,
      hideChildren: false,
      dependencies:
        actividad.dependencies?.map((dep) => ({
          sourceId: dep.sourceId,
          sourceTarget: "endOfTask" as "endOfTask",
          ownTarget: "startOfTask" as "startOfTask",
          id: dep.id,
        })) || [],
      parent: actividad.parent,
      numerador: actividad.numerador,
      cantidad: actividad.cantidad,
      comando: actividad.comando,
      desfaseComando: actividad.desfaseComando,
      idProyecto: actividad.idProyecto,
      predecesor: actividad.predecesor,
      duracion: actividad.duracion,
      cadenaDependencias: actividad.cadenaDependencias,
    };
  });

  const onChangeTasks = useCallback<OnChangeTasks>(
    async (nextTasks, action) => {


      try {
        switch (action.type) {
          case "delete_relation": {
            setActividades(
              nextTasks.filter((task): task is Task => task.type !== "empty")
            );

            if (
              action.payload.taskFrom.dependencies &&
              action.payload.taskTo.dependencies
            ) {
              await EliminarGantt(
                action.payload.taskTo.dependencies,
                action.payload.taskFrom.dependencies,
                props.selectedEmpresa
              );
            }

            await refreshAllData();
            break;
          }
          case "delete_task": {
            if (window.confirm("Are you sure?")) {
              setActividades(
                nextTasks.filter((task): task is Task => task.type !== "empty")
              );
              await refreshAllData();
            }
            break;
          }
          case "progress_change":
          case "duration_change":
          case "date_change": {
            setActividades(
              nextTasks.filter((task): task is Task => task.type !== "empty")
            );
            await refreshAllData();
            break;
          }
          default: {
            const filteredTasks = nextTasks.filter(
              (task): task is Task => task.type !== "empty"
            );

            const dependencyCalls: Promise<unknown>[] = [];

            filteredTasks.forEach((task) => {
              if ((task.dependencies?.length ?? 0) > 0) {
                task.dependencies?.forEach((dependencia) => {
                  if (dependencia.id == null) {
                    const registro: dependenciaProgramacionEstimadaDTO = {
                      sourceId: dependencia.sourceId,
                      sourceTarget: dependencia.sourceTarget,
                      ownTarget: dependencia.ownTarget,
                      id: "0",
                      idProyecto: props.selectedProyecto,
                      idProgramacionEstimadaGantt: Number(task.id),
                    };
                    dependencyCalls.push(
                      GenerarDependencia(registro, props.selectedEmpresa)
                    );
                  }
                });
              }
            });

            if (dependencyCalls.length > 0) {
              await Promise.all(dependencyCalls);
            }

            setActividades(filteredTasks);
            await refreshAllData();
            break;
          }
        }
      } catch (error) {
        console.error("Error al procesar cambios en el Gantt", error);
      }
    },
    [refreshAllData, props.selectedEmpresa, props.selectedProyecto]
  );

  const handleDblClick = useCallback((task: Task) => {
    alert("On Double Click event Id:" + task.id);
  }, []);

  const handleClick = useCallback((_task: Task) => {}, []);

  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = React.useState(true);
  const [hiddenTable, setHiddenTable] = React.useState(false);

  const onProgressChange = useCallback(
    async (task: Task, dependentTasks: readonly Task[], taskIndex: number) => {
      try {
        await asignarProgresoGantt(task, props.selectedEmpresa);
        await refreshAllData();
      } catch (error) {
        console.error("Error al actualizar el progreso desde el diagrama", error);
      }
    },
    [props.selectedEmpresa, refreshAllData]
  );
  const onDateChange = useCallback(
    async (
      actividad: TaskOrEmpty,
      _dependentTasks: readonly Task[],
      _taskIndex: number,
      _parents: readonly Task[],
      _suggestions: readonly OnDateChangeSuggestionType[],
    ) => {
      if (actividad.type === "empty") {
        return;
      }

      try {
        await EditarGantt(actividad, props.selectedEmpresa);
        await refreshAllData();
      } catch (error) {
        console.error("Error al actualizar las fechas", error);
      }
    },
    [props.selectedEmpresa, refreshAllData]
  );
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <ViewSwitcher
          onViewModeChange={(viewMode) => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
          setHiddenTable={setHiddenTable}
        />

        <Gantt
          {...props}
          onDateChange={onDateChange}
          onProgressChange={onProgressChange}
          // onEditTaskClick={onEditTask}
          isShowCriticalPath
          isRecountParentsOnChange={false}
          isShowChildOutOfParentWarnings
          // onEditTask={onEditTask}
          // onAddTask={onAddTask}
          onViewportChange={handleViewportChange}
          onChangeTasks={onChangeTasks}
          // onDoubleClick={handleDblClick}
          // onClick={handleClick}
          icons={icons}
          viewMode={view}
          tasks={TasckDataMap}
          columns={columns}
          isChecked={isChecked}
          isDeleteDependencyOnDoubleClick={true}
        />
        {view === ViewMode.Week && !hiddenTable && viewport && (
          <TableBelow
            timeline={viewport}
            importeSemanal={semanas}
            semanasMDO={semanasMDO}
            semanasMaterial={semanasMaterial}
            semanasEquipo={semanasEquipo}
            semanasHerramienta={semanasHerramienta}
            onViewModeChange={(viewMode) => setView(viewMode)}
            onViewListChange={setIsChecked}
            isChecked={isChecked}
          />
        )}
      </DndProvider>
    </>
  );
};





