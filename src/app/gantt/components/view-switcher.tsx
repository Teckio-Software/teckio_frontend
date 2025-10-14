import React from 'react';
import { ViewMode } from 'gantt-task-react';

const VIEW_OPTIONS: Array<{ label: string; value: ViewMode }> = [
  { label: 'Hoy', value: ViewMode.Day },
  { label: 'Semana', value: ViewMode.Week },
  { label: 'Mes', value: ViewMode.Month },
  { label: 'Trimestre', value: ViewMode.Year },
];

type ViewSwitcherProps = {
  activeView: ViewMode;
  setHiddenTable: (hiddenTable: boolean) => void;
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  activeView,
  onViewModeChange,
  onViewListChange,
  setHiddenTable,
  isChecked,
}) => {
  const handleViewChange = (viewMode: ViewMode) => {
    onViewModeChange(viewMode);
    if (viewMode === ViewMode.Week) {
      setHiddenTable(false);
    } else {
      setHiddenTable(true);
    }
  };

  return (
    <div className="gantt-view-switcher">
      <div className="gantt-view-switcher__tabs">
        {VIEW_OPTIONS.map((option) => {
          const isActive = option.value === activeView;

          return (
            <button
              key={option.value}
              type="button"
              className={`gantt-view-switcher__tab${
                isActive ? ' gantt-view-switcher__tab--active' : ''
              }`}
              onClick={() => handleViewChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label className="gantt-view-switcher__toggle">
        <input type="checkbox" checked={isChecked} onChange={() => onViewListChange(!isChecked)} />
        <span className="gantt-view-switcher__toggle-slider" />
        <span className="gantt-view-switcher__toggle-label">
          {isChecked ? 'Ocultar lista' : 'Mostrar lista'}
        </span>
      </label>
    </div>
  );
};
