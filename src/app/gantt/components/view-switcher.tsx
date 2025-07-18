import React from "react";
import { ViewMode } from "gantt-task-react";
type ViewSwitcherProps = {
  setHiddenTable: (hiddenTable: boolean) => void;
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
};
export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
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
    <div className="grid grid-cols-2 justify-between">
    
  <div className="flex ">
    <button  onClick={() => { onViewModeChange(ViewMode.Day); handleViewChange(ViewMode.Day); }}
      className="bg-[#51aec7] hover:bg-hoverButton   titular items-center bg-custom-bg flex  font-bold tracking-wider  m-0 text-center">
      <p className=" text-[#f2f2f2] titular bg-custom-bg w-52  font-bold tracking-wider  m-0 text-center">
        Día</p>
    </button>
    
    <button   onClick={() => {onViewModeChange(ViewMode.Week) ; handleViewChange(ViewMode.Week)}}
      className="bg-[#51aec7] hover:bg-hoverButton   titular items-center bg-custom-bg flex  font-bold tracking-wider  m-0 text-center">
      <p className=" text-[#f2f2f2] titular bg-custom-bg w-52  font-bold tracking-wider  m-0 text-center">
        Semana</p>
    </button>


    {/* <button   onClick={() => onViewModeChange(ViewMode.Month)}
      className="bg-[#51aec7] hover:bg-hoverButton   titular items-center bg-custom-bg flex  font-bold tracking-wider  m-0 text-center">
      <p className=" text-[#f2f2f2] titular bg-custom-bg w-52  font-bold tracking-wider  m-0 text-center">
        Mes</p>
    </button>
    <button  onClick={() => onViewModeChange(ViewMode.Year)}
      className="bg-[#51aec7] hover:bg-hoverButton   titular items-center bg-custom-bg flex  font-bold tracking-wider  m-0 text-center">
      <p className=" text-[#f2f2f2] titular bg-custom-bg w-52  font-bold tracking-wider  m-0 text-center">
        Año</p>
    </button> */}
    
  </div>
 

 <div className="Switch">
        <label className="Switch_Toggle">
          <input
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => onViewListChange(!isChecked)}
          />
          <span className="Slider" />
        </label>
        Ocultar tabla
      </div>
    </div>

    );
};