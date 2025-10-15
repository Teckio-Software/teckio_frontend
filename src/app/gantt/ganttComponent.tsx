import React, { useCallback, useEffect, useRef, useState } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  Task,
  TaskOrEmpty,
  TitleColumn,
  TimelineMetrics,
  ViewMode,
} from './src';
import { ViewSwitcher } from './components/view-switcher';
import { CodigoColumn } from './src/components/task-list/columns/codigo-column';
import { DescripcionColumn } from './src/components/task-list/columns/descripcion-column';
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
} from './service/api/ganttService';
import { ImporteColumn } from './src/components/task-list/columns/importe-column';
import { TableBelow } from './src/components/table-below/table-below';
import { faFolder, faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronDown,
  faChevronRight,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

const ProgressColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type !== 'empty') {
  }

  const [progress, setProgress] = useState(`${task.progress}`);

  useEffect(() => {
    setProgress(`${task.progress}`);
  }, [task.progress]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newProgress = Number(progress);
      if (!isNaN(newProgress)) {
        const updatedTask = {
          ...task,
          progress: newProgress,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)
        asignarProgresoGantt(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(event.target.value);
  };

  if (task.type === 'task') {
    return (
      <input
        type="number"
        className="bg-transparent w-full outline-none"
        style={{
          color: '#0055ff',
        }}
        value={progress}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else if (task.type === 'project') {
    return (
      <input type="text" disabled className="bg-transparent w-full outline-none" value={progress} />
    );
  }

  return null;
};

const DesfaseComandoColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type !== 'empty') {
  }

  const [desfaseComando, setDesfaseComando] = useState(`${task.desfaseComando}`);

  useEffect(() => {
    setDesfaseComando(`${task.desfaseComando}`);
  }, [task.desfaseComando]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newdesfaseComando = Number(desfaseComando);
      if (!isNaN(newdesfaseComando)) {
        const updatedTask = {
          ...task,
          desfaseComando: newdesfaseComando,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)
        GenerarDesfase(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesfaseComando(event.target.value);
  };

  if (task.type === 'task') {
    return (
      <input
        type="number"
        className="bg-transparent w-full outline-none"
        style={{
          color: '#0055ff',
        }}
        value={desfaseComando}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else if (task.type === 'project') {
    return <input type="text" disabled className="bg-transparent w-full outline-none" />;
  }

  return null;
};

const NumeradorColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type !== 'empty') {
  }

  const [numerador, setNumerador] = useState(`${task.numerador}`);

  useEffect(() => {
    setNumerador(`${task.numerador}`);
  }, [task.numerador]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newNumerador = Number(numerador);
      if (!isNaN(newNumerador)) {
        const updatedTask = {
          ...task,
          numerador: newNumerador,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)
        asignarProgresoGantt(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
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
        color: '#000000',
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
  if (task.type !== 'empty') {
  }

  const [duracion, setDuracion] = useState(`${task.duracion}`);

  useEffect(() => {
    setDuracion(`${task.duracion}`);
  }, [task.duracion]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newDuracion = Number(duracion);
      if (!isNaN(newDuracion)) {
        const updatedTask = {
          ...task,
          duracion: newDuracion,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)
        asignarDuracionGantt(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDuracion(event.target.value);
  };

  if (task.type === 'task') {
    return (
      <input
        type="number"
        className="bg-transparent w-full outline-none"
        style={{
          color: '#0055ff',
        }}
        value={duracion}
        onChange={handleChange}
        onKeyDown={(event) => {
          event.stopPropagation();
          handleKeyDown(event);
        }}
      />
    );
  } else if (task.type === 'project') {
    return (
      <input type="text" disabled className="bg-transparent w-full outline-none" value={duracion} />
    );
  }

  return null;
};

const PredecesorColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type !== 'empty') {
  }

  const [predecesor, setPredecesor] = useState(`${task.predecesor}`);

  useEffect(() => {
    setPredecesor(`${task.predecesor}`);
  }, [task.numerador]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newPredecesor = Number(predecesor);
      if (!isNaN(newPredecesor)) {
        const updatedTask = {
          ...task,
          predecesor: newPredecesor,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)

        GenerarDependenciaXNumerador(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
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
        color: '#000000',
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
  if (task.type !== 'empty') {
  }

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

      // Actualizar Gantt con la nueva tarea (simulación de la actualización)
      asignarComando(updatedTask, task.selectedEmpresa);

      setTimeout(() => {
        task.getProgramaciones && task.getProgramaciones();
        task.getImporteSemanal && task.getImporteSemanal();
      }, 600);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setComando(event.target.value);
  };

  if (task.type === 'task') {
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
  } else if (task.type === 'project') {
    return <input type="text" className="bg-transparent w-full outline-none" disabled />;
  }

  return null;
};

const CantidadColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type !== 'empty') {
  }

  const [cantidad, setCantidad] = useState(`${task.cantidad}`);

  useEffect(() => {
    setCantidad(`${task.cantidad}`);
  }, [task.cantidad]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newCantidad = Number(cantidad);
      if (!isNaN(newCantidad)) {
        const updatedTask = {
          ...task,
          cantidad: newCantidad,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)
        // asignarProgresoGantt(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(event.target.value);
  };

  if (task.type === 'task') {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
        style={{
          color: '#000000',
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
    return <input type="text" disabled className="bg-transparent w-full outline-none" />;
  }
};

const DependenciasColumn: React.FC<ColumnProps> = ({ data: { task } }) => {
  if (task.type !== 'empty') {
  }

  const [cadenaDependencias, setCadenaDependencias] = useState(`${task.cadenaDependencias}`);

  useEffect(() => {
    setCadenaDependencias(`${task.cadenaDependencias}`);
  }, [task.cadenaDependencias]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const newCadenaDependencias = Number(cadenaDependencias);
      if (!isNaN(newCadenaDependencias)) {
        const updatedTask = {
          ...task,
          cadenaDependencias: newCadenaDependencias,
        };

        // Actualizar Gantt con la nueva tarea (simulación de la actualización)
        // asignarProgresoGantt(updatedTask, task.selectedEmpresa);

        setTimeout(() => {
          task.getProgramaciones && task.getProgramaciones();
          task.getImporteSemanal && task.getImporteSemanal();
        }, 600);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCadenaDependencias(event.target.value);
  };

  if (task.type === 'task') {
    return (
      <input
        type="text"
        disabled
        className="bg-transparent w-full outline-none"
        style={{
          color: '#000000',
        }}
        value={cadenaDependencias}
      />
    );
  } else {
    return <input type="text" disabled className="bg-transparent w-full outline-none" />;
  }
};

const icons: Icons = {
  renderAddIcon: () => <>➕</>,
  renderClosedIcon: () => (
    <>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faChevronRight} style={{ color: '#000000' }} size="2xs" />
      </div>
    </>
  ),
  renderDeleteIcon: () => <>➖</>,
  renderEditIcon: () => <>🗃</>,
  renderNoChildrenIcon: () => <></>,
  renderOpenedIcon: () => (
    <>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faChevronDown} style={{ color: '#000000' }} size="2xs" />
      </div>
    </>
  ),
};

const columns: Column[] = [
  {
    component: NumeradorColumn,
    width: 41,
    title: '#',
  },
  {
    component: CodigoColumn,
    width: 150,
    title: 'Código',
  },
  {
    component: CantidadColumn,
    width: 50,
    title: 'Cant.',
  },
  {
    component: ImporteColumn,
    width: 80,
    title: 'Importe',
  },
  {
    component: DateStartColumn,
    width: 95,
    title: 'Inicio',
    canResize: true,
  },
  {
    component: DateEndColumn,
    width: 95,
    title: 'Fin',
    canResize: true,
  },
  {
    component: DuracionColumn,
    width: 41,
    title: 'Dur',
  },
  {
    component: ProgressColumn,
    width: 41,
    title: 'Pro%',
  },
  {
    component: ComandoColumn,
    width: 41,
    title: 'TR',
  },
  {
    component: DesfaseComandoColumn,
    width: 41,
    title: 'DD',
  },
  {
    component: PredecesorColumn,
    width: 41,
    title: 'Predecesor',
  },
  {
    component: DependenciasColumn,
    width: 60,
    title: 'Depencencias',
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

  const getProgramaciones = async () => {
    GanttData(props.selectedEmpresa, props.selectedProyecto)
      .then((response) => {
        setActividades(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [semanas, setSemanas] = useState<ImporteSemanalDTO[]>([]);
  const [semanasMDO, setSemanasMDO] = useState<ImporteSemanalDTO[]>([]);
  const [semanasMaterial, setSemanasMaterial] = useState<ImporteSemanalDTO[]>([]);
  const [semanasEquipo, setSemanasEquipo] = useState<ImporteSemanalDTO[]>([]);
  const [semanasHerramienta, setSemanasHerramienta] = useState<ImporteSemanalDTO[]>([]);
  const [timelineMetrics, setTimelineMetrics] = useState<TimelineMetrics | null>(null);
  const tableScrollContainerRef = useRef<HTMLDivElement>(null);
  const [externalScrollLeft, setExternalScrollLeft] = useState<number | undefined>(undefined);
  const scrollSyncOriginRef = useRef<'gantt' | 'table' | null>(null);
  const lastSyncedScrollRef = useRef<number>(0);
  const getImporteSemanal = async () => {
    console.log('getImporteSemanal()', props.selectedEmpresa, props.selectedProyecto);

    try {
      const response = await ImporteSemanalGanttData(props.selectedEmpresa, props.selectedProyecto);
      console.log('ImporteSemanal data', response);
      setSemanas(response?.semanas ?? []);
      setSemanasMDO(response?.semanasMDO ?? []);
      setSemanasMaterial(response?.semanasMaterial ?? []);
      setSemanasEquipo(response?.semanasEquipo ?? []);
      setSemanasHerramienta(response?.semanasHerramienta ?? []);
    } catch (error) {
      console.error('getImporteSemanal error', error);
      setSemanas([]);
      setSemanasMDO([]);
      setSemanasMaterial([]);
      setSemanasEquipo([]);
      setSemanasHerramienta([]);
    }
  };

  useEffect(() => {
    getProgramaciones();
    getImporteSemanal();
  }, []);

  const handleTimelineMetricsChange = useCallback((metrics: TimelineMetrics) => {
    setTimelineMetrics((prev) => {
      if (
        prev &&
        prev.columnWidth === metrics.columnWidth &&
        prev.additionalLeftSpace === metrics.additionalLeftSpace &&
        prev.additionalRightSpace === metrics.additionalRightSpace &&
        prev.startColumnIndex === metrics.startColumnIndex &&
        prev.endColumnIndex === metrics.endColumnIndex &&
        prev.fullSvgWidth === metrics.fullSvgWidth &&
        prev.viewMode === metrics.viewMode
      ) {
        return prev;
      }

      return metrics;
    });
  }, []);

  const handleGanttHorizontalScroll = useCallback((scrollLeft: number) => {
    lastSyncedScrollRef.current = scrollLeft;

    if (scrollSyncOriginRef.current === 'table') {
      return;
    }

    scrollSyncOriginRef.current = 'gantt';

    if (tableScrollContainerRef.current) {
      tableScrollContainerRef.current.scrollLeft = scrollLeft;
    }

    requestAnimationFrame(() => {
      if (scrollSyncOriginRef.current === 'gantt') {
        scrollSyncOriginRef.current = null;
      }
    });
  }, []);

  const handleTableScroll = useCallback((scrollLeft: number) => {
    lastSyncedScrollRef.current = scrollLeft;

    if (scrollSyncOriginRef.current === 'gantt') {
      return;
    }

    scrollSyncOriginRef.current = 'table';

    setExternalScrollLeft((prev) => (prev === scrollLeft ? prev : scrollLeft));

    requestAnimationFrame(() => {
      if (scrollSyncOriginRef.current === 'table') {
        scrollSyncOriginRef.current = null;
      }
    });
  }, []);

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
      type: actividad.type,
      hideChildren: false,
      dependencies:
        actividad.dependencies?.map((dep) => ({
          sourceId: dep.sourceId,
          sourceTarget: 'endOfTask' as 'endOfTask',
          ownTarget: 'startOfTask' as 'startOfTask',
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

  const onChangeTasks = useCallback<OnChangeTasks>(async (nextTasks, action) => {
    switch (action.type) {
      case 'delete_relation':
        setActividades(nextTasks.filter((task): task is Task => task.type !== 'empty'));
        if (action.payload.taskFrom.dependencies && action.payload.taskTo.dependencies) {
          EliminarGantt(
            action.payload.taskTo.dependencies,
            action.payload.taskFrom.dependencies,
            props.selectedEmpresa,
          );
        }
        break;

      case 'delete_task':
        if (window.confirm('Are you sure?')) {
          setActividades(nextTasks.filter((task): task is Task => task.type !== 'empty'));
        }
        break;
      case 'progress_change':
        setActividades(nextTasks.filter((task): task is Task => task.type !== 'empty'));

        setTimeout(() => {
          getImporteSemanal();
          getProgramaciones();
        }, 600);
        break;
      case 'duration_change':
        setActividades(nextTasks.filter((task): task is Task => task.type !== 'empty'));

        setTimeout(() => {
          getImporteSemanal();
          getProgramaciones();
        }, 600);
        break;
      case 'date_change':
        setActividades(nextTasks.filter((task): task is Task => task.type !== 'empty'));
        setTimeout(() => {
          getImporteSemanal();
          getProgramaciones();
        }, 600);

        break;

      default:
        nextTasks.forEach((task) => {
          if (task.type !== 'empty') {
            if ((task.dependencies?.length ?? 0) > 0) {
              task.dependencies?.forEach((dependencia) => {
                if (dependencia.id == null) {
                  let registro: dependenciaProgramacionEstimadaDTO = {
                    sourceId: dependencia.sourceId,
                    sourceTarget: dependencia.sourceTarget,
                    ownTarget: dependencia.ownTarget,
                    id: '0',
                    idProyecto: props.selectedProyecto,
                    idProgramacionEstimadaGantt: Number(task.id),
                  };
                  GenerarDependencia(registro, props.selectedEmpresa);
                }
              });
            }
          }
        });
        setActividades(nextTasks.filter((task): task is Task => task.type !== 'empty'));
        setTimeout(() => {
          getProgramaciones();
          getImporteSemanal();
        }, 600);
        break;
    }
  }, []);

  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);

  const [isChecked, setIsChecked] = React.useState(true);
  const [hiddenTable, setHiddenTable] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filterChips = React.useMemo(
    () => [
      { id: 'progress', label: 'Progreso', placeholder: 'Todos' },
      { id: 'date', label: 'Fecha', placeholder: 'Recientes' },
      { id: 'priority', label: 'Prioridad', placeholder: 'Todas' },
      { id: 'status', label: 'Estatus', placeholder: 'Todos' },
    ],
    [],
  );

  const periodLabelByView: Record<ViewMode, string> = {
    [ViewMode.Hour]: 'Hora',
    [ViewMode.QuarterDay]: 'Hoy',
    [ViewMode.HalfDay]: 'Hoy',
    [ViewMode.Day]: 'Hoy',
    [ViewMode.Week]: 'Semana',
    [ViewMode.Month]: 'Mes',
    [ViewMode.Year]: 'Trimestre',
  };
  const periodLabel = periodLabelByView[view] ?? 'Hoy';

  const onProgressChange = (task: Task, dependentTasks: readonly Task[], taskIndex: number) => {
    asignarProgresoGantt(task, props.selectedEmpresa);
  };

  const onDateChange = (actividades: any) => {
    EditarGantt(actividades, props.selectedEmpresa); // EditarGantt(actividades, props.selectedEmpresa);
  };

  return (
    <div className="gantt-page">
      <div className="gantt-card">
        <header className="gantt-card__header">
          <div className="gantt-card__top">
            <div className="gantt-card__top-switcher">
              <ViewSwitcher
                activeView={view}
                onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
                onViewListChange={setIsChecked}
                isChecked={isChecked}
                setHiddenTable={setHiddenTable}
              />
            </div>
          </div>
        </header>

        <div className="gantt-card__body">
          <div className="gantt-card__toolbar gantt-card__toolbar--bottom">
            <div className="gantt-search">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="gantt-filters">
              {filterChips.map((chip) => (
                <button key={chip.id} type="button" className="gantt-filter-chip">
                  <span className="gantt-filter-chip__label">{chip.label}</span>
                  <span className="gantt-filter-chip__value">{chip.placeholder}</span>
                  <FontAwesomeIcon icon={faChevronDown} className="gantt-filter-chip__icon" />
                </button>
              ))}
            </div>
          </div>

          <DndProvider backend={HTML5Backend}>
            <Gantt
              onDateChange={onDateChange}
              onProgressChange={onProgressChange}
              // onEditTaskClick={onEditTask}
              isShowCriticalPath
              isRecountParentsOnChange={false}
              isShowChildOutOfParentWarnings
              {...props}
              // onEditTask={onEditTask}
              // onAddTask={onAddTask}
              onChangeTasks={onChangeTasks}
              // onDoubleClick={handleDblClick}
              // onClick={handleClick}
              icons={icons}
              viewMode={view}
              tasks={TasckDataMap}
              columns={columns}
              isChecked={isChecked}
              isDeleteDependencyOnDoubleClick={true}
              onTimelineMetricsChange={handleTimelineMetricsChange}
              onHorizontalScroll={handleGanttHorizontalScroll}
              externalHorizontalScroll={externalScrollLeft}
            />
            {view === ViewMode.Week && !hiddenTable && timelineMetrics && (
              <TableBelow
                importeSemanal={semanas}
                semanasMDO={semanasMDO}
                semanasMaterial={semanasMaterial}
                semanasEquipo={semanasEquipo}
                semanasHerramienta={semanasHerramienta}
                onViewModeChange={(viewMode) => setView(viewMode)}
                onViewListChange={setIsChecked}
                isChecked={isChecked}
                columnWidth={timelineMetrics.columnWidth}
                additionalLeftSpace={timelineMetrics.additionalLeftSpace}
                additionalRightSpace={timelineMetrics.additionalRightSpace}
                fullWidth={timelineMetrics.fullSvgWidth}
                taskListWidth={timelineMetrics.taskListWidth}
                splitterWidth={timelineMetrics.splitterWidth}
                viewMode={timelineMetrics.viewMode}
                scrollContainerRef={tableScrollContainerRef}
                onScroll={handleTableScroll}
              />
            )}
          </DndProvider>
        </div>
      </div>
    </div>
  );
};
