import React, { useCallback, useMemo, useRef } from 'react';

import { ImporteSemanalDTO, ViewMode } from '../../types/public-types';

type TableBelowProps = {
  importeSemanal: ImporteSemanalDTO[];
  semanasMDO: ImporteSemanalDTO[];
  semanasMaterial: ImporteSemanalDTO[];
  semanasEquipo: ImporteSemanalDTO[];
  semanasHerramienta: ImporteSemanalDTO[];
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  columnWidth?: number;
  additionalLeftSpace?: number;
  additionalRightSpace?: number;
  fullWidth?: number;
  viewMode?: ViewMode;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (scrollLeft: number) => void;
  taskListWidth?: number;
  splitterWidth?: number;
};

const DEFAULT_COLUMN_WIDTH = 240;
const STICKY_COLUMN_WIDTH = 220;
const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };

const getWeekKey = (semana: ImporteSemanalDTO) => `${semana.anio}-${semana.numeroSemana}`;

const createWeekMap = (items: ImporteSemanalDTO[]) => {
  const map = new Map<string, ImporteSemanalDTO>();

  items.forEach((item) => {
    map.set(getWeekKey(item), item);
  });

  return map;
};

const formatCurrency = (value?: string) => value ?? '$0.00';

const formatRange = (start: Date | string, end: Date | string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return '--';
  }

  return `${startDate.toLocaleDateString('es-MX', DATE_OPTIONS)} - ${endDate.toLocaleDateString('es-MX', DATE_OPTIONS)}`;
};

export const TableBelow: React.FC<TableBelowProps> = ({
  importeSemanal,
  semanasMDO,
  semanasMaterial,
  semanasEquipo,
  semanasHerramienta,
  isChecked: _isChecked,
  onViewListChange: _onViewListChange,
  onViewModeChange: _onViewModeChange,
  columnWidth,
  additionalLeftSpace,
  additionalRightSpace,
  fullWidth,
  viewMode = ViewMode.Week,
  scrollContainerRef,
  onScroll,
  taskListWidth,
  splitterWidth,
}) => {
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = scrollContainerRef ?? internalScrollRef;

  const weeks = useMemo(() => {
    const map = new Map<string, ImporteSemanalDTO>();

    importeSemanal.forEach((item) => {
      map.set(getWeekKey(item), item);
    });

    [semanasMDO, semanasMaterial, semanasEquipo, semanasHerramienta].forEach((list) => {
      list.forEach((item) => {
        const key = getWeekKey(item);

        if (!map.has(key)) {
          map.set(key, item);
        }
      });
    });

    const ordered = Array.from(map.values());

    ordered.sort((a, b) => {
      const aTime = new Date(a.fechaInicio).getTime();
      const bTime = new Date(b.fechaInicio).getTime();

      if (aTime === bTime) {
        return a.numeroSemana - b.numeroSemana;
      }

      return aTime - bTime;
    });

    return ordered;
  }, [importeSemanal, semanasEquipo, semanasHerramienta, semanasMaterial, semanasMDO]);

  const weekMaps = useMemo(() => ({
    total: createWeekMap(importeSemanal),
    mdo: createWeekMap(semanasMDO),
    material: createWeekMap(semanasMaterial),
    equipo: createWeekMap(semanasEquipo),
    herramienta: createWeekMap(semanasHerramienta),
  }), [importeSemanal, semanasEquipo, semanasHerramienta, semanasMaterial, semanasMDO]);

  const effectiveColumnWidth = Math.max(80, columnWidth ?? DEFAULT_COLUMN_WIDTH);
  const leftSpacer = Math.max(0, additionalLeftSpace ?? 0);
  const rightSpacer = Math.max(0, additionalRightSpace ?? 0);
  const fixedSectionWidth = Math.max(taskListWidth ?? 0, STICKY_COLUMN_WIDTH);
  const splitterSpacer = Math.max(0, splitterWidth ?? 0);

  const columnsCount = weeks.length;
  const timelineWidth = leftSpacer + columnsCount * effectiveColumnWidth + rightSpacer;
  const timelineContentWidth = Math.max(fullWidth ?? 0, timelineWidth);
  const contentWidth = fixedSectionWidth + splitterSpacer + timelineContentWidth;

  const stickyCellStyle: React.CSSProperties = {
    position: 'sticky',
    left: 0,
    background: '#fff',
    zIndex: 2,
    minWidth: fixedSectionWidth,
    width: fixedSectionWidth,
  };

  const spacerStyle = (width: number): React.CSSProperties => ({
    minWidth: width,
    width: width,
    padding: 0,
    border: 'none',
  });

  const columnStyle: React.CSSProperties = {
    minWidth: effectiveColumnWidth,
    width: effectiveColumnWidth,
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    overflowX: 'auto',
    width: '100%',
    maxWidth: '100%',
  };

  const renderSpacerCell = (key: string, width: number) =>
    width > 0 ? <th key={key} aria-hidden="true" style={spacerStyle(width)} /> : null;

  const renderSplitterCell = (key: string) =>
    splitterSpacer > 0 ? (
      <th key={key} aria-hidden="true" style={spacerStyle(splitterSpacer)} />
    ) : null;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) {
      onScroll(event.currentTarget.scrollLeft);
    }
  }, [onScroll]);

  if (weeks.length === 0) {
    return null;
  }

  const renderHeaderRow = (
    label: string,
    formatter: (week: ImporteSemanalDTO) => React.ReactNode,
    keyPrefix: string,
  ) => (
    <tr key={`${keyPrefix}-row`}>
      <th className="th01" style={stickyCellStyle}>
        <div className="titulo-total">
          <div>{label}</div>
        </div>
      </th>
      {renderSplitterCell(`${keyPrefix}-splitter`)}
      {renderSpacerCell(`${keyPrefix}-left-spacer`, leftSpacer)}
      {weeks.map((week) => (
        <th className="th01" style={columnStyle} key={`${keyPrefix}-${getWeekKey(week)}`}>
          <div>{formatter(week)}</div>
        </th>
      ))}
      {renderSpacerCell(`${keyPrefix}-right-spacer`, rightSpacer)}
    </tr>
  );

  const renderDataRow = (label: string, dataMap: Map<string, ImporteSemanalDTO>) => (
    <tr key={label}>
      <th className="th01" style={stickyCellStyle}>
        <div className="titulo-total">
          <div>{label}</div>
        </div>
      </th>
      {renderSplitterCell(`${label}-splitter`)}
      {renderSpacerCell(`${label}-left-spacer`, leftSpacer)}
      {weeks.map((week) => {
        const key = getWeekKey(week);
        const value = formatCurrency(dataMap.get(key)?.totalConFormato);

        return (
          <th className="th0" style={columnStyle} key={`${label}-${key}`}>
            <div>{value}</div>
          </th>
        );
      })}
      {renderSpacerCell(`${label}-right-spacer`, rightSpacer)}
    </tr>
  );

  return (
    <div className="flex">
      <div
        ref={containerRef}
        className="table-wrapper"
        style={wrapperStyle}
        onScroll={handleScroll}
      >
        <div style={{ minWidth: contentWidth }}>
          <table style={{ width: contentWidth, borderCollapse: 'collapse' }}>
            <thead>
              {renderHeaderRow('Semana', (week) => `Periodo-${week.numeroSemana}`, 'weeks')}
              {renderHeaderRow(
                viewMode === ViewMode.Week ? 'Fechas' : 'Periodo',
                (week) => formatRange(week.fechaInicio, week.fechaFin),
                'dates',
              )}
            </thead>
            <tbody>
              {renderDataRow('Total mano de obra', weekMaps.mdo)}
              {renderDataRow('Total material', weekMaps.material)}
              {renderDataRow('Equipo', weekMaps.equipo)}
              {renderDataRow('Herramienta', weekMaps.herramienta)}
              {renderDataRow('Total ($)', weekMaps.total)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
