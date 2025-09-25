import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { Locale } from "date-fns";
import { format, getISOWeek, getISOWeekYear } from "date-fns";

import { GanttViewport, ImporteSemanalDTO, ViewMode } from "../../types/public-types";

export type ImportesTableProps = {
  timeline: GanttViewport;
  importeSemanal: ImporteSemanalDTO[];
  semanasMDO: ImporteSemanalDTO[];
  semanasMaterial: ImporteSemanalDTO[];
  semanasEquipo: ImporteSemanalDTO[];
  semanasHerramienta: ImporteSemanalDTO[];
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

const buildWeekKey = (year: number, week: number) => `${year}-${week}`;

type ImporteLookup = {
  byWeekKey: Map<string, ImporteSemanalDTO>;
  ranges: Array<{ start: number; end: number; item: ImporteSemanalDTO }>;
};

const buildImporteLookup = (items: ImporteSemanalDTO[]): ImporteLookup => {
  const byWeekKey = new Map<string, ImporteSemanalDTO>();
  const ranges: Array<{ start: number; end: number; item: ImporteSemanalDTO }> = [];

  items.forEach((item) => {
    const startDate = parseToDate(item.fechaInicio);
    const endDate = parseToDate(item.fechaFin);

    if (!startDate || !endDate) {
      return;
    }

    const isoWeek = getISOWeek(startDate);
    const isoYear = getISOWeekYear(startDate);
    const key = buildWeekKey(isoYear, isoWeek);

    if (!byWeekKey.has(key)) {
      byWeekKey.set(key, item);
    }

    ranges.push({
      start: startDate.getTime(),
      end: endDate.getTime(),
      item,
    });
  });

  return { byWeekKey, ranges };
};

const findImporteForColumn = (lookup: ImporteLookup, date: Date) => {
  const isoWeek = getISOWeek(date);
  const isoYear = getISOWeekYear(date);
  const key = buildWeekKey(isoYear, isoWeek);

  const direct = lookup.byWeekKey.get(key);
  if (direct) {
    return direct;
  }

  const time = date.getTime();

  return lookup.ranges.find(({ start, end }) => time >= start && time <= end)?.item;
};

const parseToDate = (value: Date | string | undefined) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatRange = (start: Date | string | undefined, end: Date | string | undefined, locale: Locale | undefined) => {
  const startDate = parseToDate(start);
  const endDate = parseToDate(end);

  if (!startDate || !endDate) {
    return "";
  }

  try {
    return `${format(startDate, "dd MMM", { locale })} - ${format(endDate, "dd MMM", { locale })}`;
  } catch (error) {
    return "";
  }
};

export const TableBelow: React.FC<ImportesTableProps> = ({
  timeline,
  importeSemanal,
  semanasMDO,
  semanasMaterial,
  semanasEquipo,
  semanasHerramienta,
  isChecked: _isChecked,
  onViewListChange: _onViewListChange,
  onViewModeChange: _onViewModeChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  const timelineDates = timeline.dates;

  const totalsLookup = useMemo(() => buildImporteLookup(importeSemanal), [importeSemanal]);
  const manoDeObraLookup = useMemo(() => buildImporteLookup(semanasMDO), [semanasMDO]);
  const materialLookup = useMemo(() => buildImporteLookup(semanasMaterial), [semanasMaterial]);
  const equipoLookup = useMemo(() => buildImporteLookup(semanasEquipo), [semanasEquipo]);
  const herramientaLookup = useMemo(() => buildImporteLookup(semanasHerramienta), [semanasHerramienta]);

  const weekColumns = useMemo(() => {
    if (timeline.viewMode !== ViewMode.Week) {
      return [] as Array<{ key: string; isoWeek: number; isoYear: number; date: Date }>;
    }

    return timelineDates.map((date) => {
      const isoWeek = getISOWeek(date);
      const isoYear = getISOWeekYear(date);

      return {
        key: buildWeekKey(isoYear, isoWeek),
        isoWeek,
        isoYear,
        date,
      };
    });
  }, [timelineDates, timeline.viewMode]);

  const stickyWidth = Math.max(timeline.tableWidth ?? 0, 220);
  const columnWidth = timeline.columnWidth || 1;
  const timelineWidth = Math.max(weekColumns.length * columnWidth, 0);
  const tableWidth = stickyWidth + timelineWidth;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingRef.current) {
      return;
    }

    timeline.setScrollX(event.currentTarget.scrollLeft);
  }, [timeline]);

  useEffect(() => {
    const node = scrollContainerRef.current;

    if (!node) {
      return;
    }

    if (Math.abs(node.scrollLeft - timeline.scrollX) <= 1) {
      return;
    }

    isSyncingRef.current = true;
    node.scrollLeft = timeline.scrollX;

    const timeout = requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });

    return () => cancelAnimationFrame(timeout);
  }, [timeline.scrollX]);

  const renderCellValue = useCallback((lookup: ImporteLookup, columnDate: Date) => {
    const item = findImporteForColumn(lookup, columnDate);

    return item?.totalConFormato ?? "--";
  }, []);

  if (timeline.viewMode !== ViewMode.Week || weekColumns.length === 0) {
    return null;
  }

  const locale = timeline.dateSetup.dateLocale;

  const rows = [
    { label: "Total mano de obra", lookup: manoDeObraLookup },
    { label: "Total material", lookup: materialLookup },
    { label: "Equipo", lookup: equipoLookup },
    { label: "Herramienta", lookup: herramientaLookup },
    { label: "Total ($)", lookup: totalsLookup },
  ];


  return (
    <div className="flex">
      <div
        className="table-wrapper"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{ display: "flex", overflowX: "auto", width: "100%" }}
      >
        <table
          style={{
            width: tableWidth,
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th
                className="th01"
                style={{
                  position: "sticky",
                  left: 0,
                  background: "#fff",
                  zIndex: 2,
                  minWidth: stickyWidth,
                  width: stickyWidth,
                }}
              >
                <div className="titulo-total">
                  <div>{"Semana"}</div>
                </div>
              </th>
              {weekColumns.map((column) => {
                const periodo = findImporteForColumn(totalsLookup, column.date);

                return (
                  <th
                    key={column.key}
                    className="th01"
                    style={{
                      minWidth: columnWidth,
                      width: columnWidth,
                    }}
                  >
                    <div>
                      <div>{`Semana ${column.isoWeek}`}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {formatRange(periodo?.fechaInicio, periodo?.fechaFin, locale)}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, lookup }) => (
              <tr key={label}>
                <th
                  className="th01"
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    zIndex: 1,
                    minWidth: stickyWidth,
                    width: stickyWidth,
                  }}
                >
                  <div className="titulo-total">
                    <div>{label}</div>
                  </div>
                </th>
                {weekColumns.map((column) => (
                  <td
                    key={`${label}-${column.key}`}
                    className="th0"
                    style={{
                      minWidth: columnWidth,
                      width: columnWidth,
                      textAlign: "center",
                    }}
                  >
                    {renderCellValue(lookup, column.date)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
