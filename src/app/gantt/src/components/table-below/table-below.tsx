import React, { useState, useCallback, ReactNode } from 'react';
import { TopPartOfCalendar } from '../calendar/top-part-of-calendar';
import { defaultRenderBottomHeader } from '../calendar/default-render-bottom-header';
import { defaultRenderTopHeader } from '../calendar/default-render-top-header';
import { DateSetup, Distances, ImporteSemanalDTO, RenderBottomHeader, RenderTopHeader, ViewMode } from '../../types/public-types';
import { vi } from 'date-fns/locale';



export type importeProps = {
  importeSemanal : ImporteSemanalDTO[];
  semanasMDO : ImporteSemanalDTO[];
  semanasMaterial : ImporteSemanalDTO[];
  semanasEquipo : ImporteSemanalDTO[];
  semanasHerramienta : ImporteSemanalDTO[];
  isChecked: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  // dateSetup: DateSetup;
  // distances: Distances;
  // endColumnIndex: number;
  // startColumnIndex: number;
  // fontFamily: string;
  // fontSize: string;
  // fullSvgWidth: number;
  // additionalLeftSpace: number;
  // getDate: (index: number) => Date;
  // isUnknownDates: boolean;
  // renderBottomHeader?: RenderBottomHeader;
  // renderTopHeader?: RenderTopHeader;
  // rtl: boolean;




  // numeroSemana : number;
  // fechaInicio : Date;
  // fechaFin : Date;
  // anio : number;
  // total : number;

  }


export const TableBelow: React.FC<importeProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  // dateSetup,
  importeSemanal,
  semanasMDO,
  semanasMaterial,
  semanasEquipo,
  semanasHerramienta,
  // distances: {
  //   columnWidth,
  //   headerHeight,
  // },
  // endColumnIndex,
  // startColumnIndex,
  // fontFamily,
  // fontSize,
  // additionalLeftSpace,
  // fullSvgWidth,
  // getDate,
  // isUnknownDates,
  // renderBottomHeader = defaultRenderBottomHeader,
  // renderTopHeader = defaultRenderTopHeader,
  // rtl,
}) => {
  console.log("importe", importeSemanal)

  // const [tooltip, setTooltip] = useState<{ visible: boolean, content: string, x: number, y: number }>({
  //   visible: false,
  //   content: '',
  //   x: 0,
  //   y: 0,
  // });

  // // Maneja el evento de mouse sobre el texto (hover)
  // const handleMouseEnter = (event: React.MouseEvent, value: string) => {
  //   console.log("value", value);
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   setTooltip({
  //     visible: true,
  //     content: value,
  //     // Usar el rect del contenedor actual para posicionar el tooltip
  //     x: rect.left + rect.width / 2 - 100,  // Centrar el tooltip dentro del elemento
  //     y: rect.top + rect.height + 10,  // Justo debajo del elemento (ajustar si es necesario)
  //   });
  // };

  // // Maneja el evento de mouse al salir
  // const handleMouseLeave = () => {
  //   setTooltip(prevTooltip => ({
  //     ...prevTooltip,
  //     visible: false,  // Ocultar el tooltip
  //   }));
  // };

  //   const renderTopHeaderByDate = useCallback(
  //   (date: Date) => renderTopHeader(date, dateSetup.viewMode, dateSetup),
  //   [renderTopHeader, dateSetup],
  // );

  // const renderBottomHeaderByDate = useCallback(
  //   (date: Date, index: number) => renderBottomHeader(
  //     date,
  //     dateSetup.viewMode,
  //     dateSetup,
  //     index,
  //     isUnknownDates,
  //   ),
  //   [renderBottomHeader, dateSetup, isUnknownDates],
  // );

  // // Maneja el evento de click sobre el texto
  // const handleClick = (event: React.MouseEvent, value: string) => {
  //   console.log("value", value);
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   setTooltip(prevTooltip => ({
  //     visible: !prevTooltip.visible,  // Alternar la visibilidad
  //     content: value,
  //     // Calcular las coordenadas para centrar el tooltip en la ventana
  //     x: window.innerWidth / 2 - 100,  // Centrar en el medio de la ventana (ajustar 100px según el tamaño del rect)
  //     y: window.innerHeight / 2 - 25,  // Centrar verticalmente en la ventana (ajustar 25px según el tamaño del rect)
  //   }));
  // };

  // const topValues: ReactNode[] = [];
  // const bottomValues: ReactNode[] = [];
  // let weeksCount: number = 1;
  // const topDefaultHeight = headerHeight * 0.5;

  // for (let i = endColumnIndex; i >= startColumnIndex; i--) {
  //   const date = getDate(i);
  //   const month = date.getMonth();
  //   const fullYear = date.getFullYear();

  //   // Buscar el valor correspondiente en importeSemanal
  //   const matchedImporte = importeSemanal.find((importe: any) => {
  //     const fechaInicio = new Date(importe.fechaInicio);
  //     const fechaFin = new Date(importe.fechaFin);
  //     return date >= fechaInicio && date <= fechaFin;
  //   });

  //   let topValue: ReactNode = "";
  //   if (!isUnknownDates && (i === startColumnIndex || month !== getDate(i - 1).getMonth())) {
  //     topValue = renderTopHeaderByDate(date);
  //   }

  //   const bottomValue = renderBottomHeaderByDate(date, i);

  //   bottomValues.push(
  //     <text
  //       key={date.getTime()}
  //       y={headerHeight * 0.8}
  //       x={additionalLeftSpace + columnWidth * (i + +rtl)}
  //       className="calendarBottomTextTest"
  //       onMouseEnter={(e) => handleMouseEnter(e, bottomValue as string)}  // Mostrar tooltip en hover
  //       onMouseLeave={handleMouseLeave}  // Ocultar tooltip
  //       onClick={(e) => handleClick(e, bottomValue as string)}  // Alternar tooltip con click
  //       style={{ pointerEvents: 'all' }}  // Asegurarse de que los eventos se reciban
  //     >
  //       {bottomValue}
  //     </text>
  //   );

  //   if (topValue) {
  //     topValues.push(
  //       <TopPartOfCalendar
  //         key={`${month}_${fullYear}`}
  //         value={topValue}
  //         x1Line={additionalLeftSpace + columnWidth * i + weeksCount * columnWidth}
  //         y1Line={0}
  //         y2Line={topDefaultHeight}
  //         xText={additionalLeftSpace + columnWidth * i + columnWidth * weeksCount * 0.5}
  //         yText={topDefaultHeight * 0.9}
  //       />
  //     );
  //     weeksCount = 0;
  //   }

  //   if (matchedImporte && matchedImporte.fechaInicio instanceof Date) {
  //     const matchedDay = matchedImporte.fechaInicio.getDate();
  //     bottomValues.push(
  //       <text
  //         key={matchedImporte.numeroSemana}
  //         x={additionalLeftSpace + columnWidth * i + +rtl}
  //         y={headerHeight * 1.2}
  //         className="calendarBottomTextTest"
  //       >
  //         {matchedDay}
  //       </text>
  //     );
  //   }

  //   weeksCount++;
    // }

    return (
      <div className='flex'>
        <div className="table-wrapper" style={{ display: 'flex', overflowX: 'auto', width: '100%' }}>
          <table style={{ width: "max-content", borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                  <div className="titulo-total">
                    <div style={{width: "440px"}}>{"Semana"}</div>
                  </div>
                </th>
                {importeSemanal.map((importe, index) => (
                  <th className="th01" key={index}>
                    <div>
                      <div>{"Periodo-" + importe.numeroSemana }</div>
                    </div>
                  </th>
                ))}
              </tr>


              <tr>
                <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                  <div className="titulo-total">
                    <div>{"Total mano de obra"}</div>
                  </div>
                </th>
                {semanasMDO.map((importe, index) => (
                  <th className="th0" key={index}>
                    <div>
                      <div >{importe.totalConFormato}</div>
                    </div>
                  </th>
                ))}
              </tr>

              <tr>
                <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                  <div className="titulo-total">
                    <div>{"Total material"}</div>
                  </div>
                </th>
                {semanasMaterial.map((importe, index) => (
                  <th className="th0" key={index}>
                    <div>
                      <div >{importe.totalConFormato}</div>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                  <div className="titulo-total">
                    <div>{"Equipo"}</div>
                  </div>
                </th>
                {semanasEquipo.map((importe, index) => (
                  <th className="th0" key={index}>
                    <div>
                      <div >{importe.totalConFormato}</div>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                  <div className="titulo-total">
                    <div>{"Herramienta"}</div>
                  </div>
                </th>
                {semanasHerramienta.map((importe, index) => (
                  <th className="th0" key={index}>
                    <div>
                      <div >{importe.totalConFormato}</div>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                  <div className="titulo-total">
                    <div>{"Total ($)"}</div>
                  </div>
                </th>
                {importeSemanal.map((importe, index) => (
                  <th className="th0" key={index}>
                    <div>
                      <div >

                        {importe.totalConFormato}</div>


                    </div>
                  </th>
                ))}
              </tr>
                {/* <tr>
                  <th className="th01" style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>
                    <div className="titulo-total">
                      <div>{"Fecha"}</div>
                    </div>
                  </th>
                  {importeSemanal.map((importe, index) => (
                    <th className="th0" key={index}>
                      <div style={{ width: "max-content"}}  >
                        <div>{`${new Date(importe.fechaInicio).toLocaleDateString()} - ${new Date(importe.fechaFin).toLocaleDateString()}`}</div>
                      </div>
                    </th>
                  ))}
                </tr> */}
            </thead>
            <tbody>
              {/* Aquí va el contenido de las filas si lo tienes */}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
