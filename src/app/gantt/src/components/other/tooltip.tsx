import React, { ComponentType } from 'react';
import type { Strategy } from '@floating-ui/dom';
import type { Task } from '../../types/public-types';

export type TooltipProps = {
  tooltipX: number | null;
  tooltipY: number | null;
  tooltipStrategy: Strategy;
  setFloatingRef: (node: HTMLElement | null) => void;
  getFloatingProps: () => Record<string, unknown>;
  task: Task;
  fontSize: string;
  fontFamily: string;
  TooltipContent: ComponentType<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};

export const Tooltip: React.FC<TooltipProps> = ({
  tooltipX,
  tooltipY,
  tooltipStrategy,
  setFloatingRef,
  getFloatingProps,
  task,
  fontSize,
  fontFamily,
  TooltipContent,
}) => {
  return (
    <div
      ref={setFloatingRef}
      style={{
        position: tooltipStrategy,
        top: tooltipY ?? 0,
        left: tooltipX ?? 0,
        width: 'max-content',
        zIndex: 9999,
      }}
      {...getFloatingProps()}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

/* ============================
   NUEVO TOOLTIP ESTILIZADO
   ============================ */

const formatDate = (d: Date) =>
  `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;

const daysBetween = (a: Date, b: Date) =>
  Math.max(0, Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));

const ProgressCircle: React.FC<{ value: number }> = ({ value }) => {
  const radius = 16;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <svg width="44" height="44" className="tt-progress" aria-label={`Progreso ${value}%`}>
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx="22"
        cy="22"
      />
      <circle
        stroke="#3B82F6"
        fill="transparent"
        strokeLinecap="round"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx="22"
        cy="22"
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset .4s ease',
        }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="tt-progress-text"
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style: React.CSSProperties = { fontSize, fontFamily };

  const rangoFechas = `${formatDate(task.start)} - ${formatDate(task.end)}`;
  const duracionDias = task.duracion ?? daysBetween(task.start, task.end);
  const desfase = task.desfaseComando ?? 0;
  const codigo = task.codigo ?? task.id ?? '00000';
  const descripcion = task.descripcion || '—';
  const progreso = task.progress ?? 0;

  const estatus = { label: 'En progreso', className: 'tt-badge tt-badge--inprogress' };
  const prioridad = {
    label: 'Alta',
    className: 'tt-priority tt-priority--high',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" className="tt-priority-icon" aria-hidden>
        <path d="M12 4l6 8H6l6-8z" fill="currentColor" />
      </svg>
    ),
  };

  return (
    <div className="tt-container" style={style}>
      {/* Título */}
      {/* <div className="tt-title">
        <div className="tt-title-name" title={task.name}>
          {task.name}
        </div>
        <div className="tt-title-dates">{rangoFechas}</div>
      </div> */}

      {/* Cuerpo en dos columnas */}
      <div className="tt-grid">
        {/* Columna izquierda */}
        <div className="tt-col">
          <div className="tt-row">
            <div className="tt-label">Código</div>
            <div className="tt-value mono">{codigo}</div>
          </div>

          <div className="tt-row">
            <div className="tt-label">Estatus</div>
            <div className="tt-value">
              <span className={estatus.className}>{estatus.label}</span>
            </div>
          </div>

          <div className="tt-row">
            <div className="tt-label">Prioridad</div>
            <div className="tt-value tt-prio-wrap">
              <span className={prioridad.className}>{prioridad.icon}</span>
              <span className="tt-prio-text">{prioridad.label}</span>
            </div>
          </div>

          <div className="tt-row">
            <div className="tt-label">Días desfase</div>
            <div className="tt-value mono">{desfase.toString().padStart(5, '0')}</div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="tt-col">
          <div className="tt-row">
            <div className="tt-label">Inicio / Final</div>
            <div className="tt-value">{rangoFechas}</div>
          </div>

          <div className="tt-row">
            <div className="tt-label">Progreso</div>
            <div className="tt-value tt-progress-wrap">
              <ProgressCircle value={progreso} />
              <div className="tt-progress-caption">
                <div className="tt-progress-percent">{Math.round(progreso)}%</div>
                <div className="tt-progress-note">Completo</div>
              </div>
            </div>
          </div>

          {duracionDias > 0 && (
            <div className="tt-row">
              <div className="tt-label">Duración</div>
              <div className="tt-value">{duracionDias} día(s)</div>
            </div>
          )}

          <div className="tt-row tt-row--block">
            <div className="tt-label">Procede</div>
            <div className="tt-value">{descripcion}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
