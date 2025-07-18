export interface EstimacionesDTO {
  id: number;
  idPrecioUnitario: number;
  cantidad: number;
  cantidadConFormato: number;
  idPadre: number;
  idConcepto: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  costoUnitario: number;
  costoUnitarioConFormato: string;
  importe: number;
  importeConFormato: string;
  idProyecto: number;
  importeDeAvance: number;
  importeDeAvanceConFormato: string;
  porcentajeAvance: number;
  porcentajeAvanceConFormato: string;
  porcentajeAvanceEditando: boolean;
  cantidadAvance: number;
  cantidadAvanceConFormato: string;
  cantidadAvanceEditando: boolean;
  importeDeAvanceAcumulado: number;
  importeDeAvanceAcumuladoConFormato: string;
  porcentajeAvanceAcumulado: number;
  porcentajeAvanceAcumuladoConFormato: string;
  cantidadAvanceAcumulado: number;
  cantidadAvanceAcumuladoConFormato: string;
  idPeriodo: number;
  tipoPrecioUnitario: number;
  porcentajeTotal: number;
  porcentajeTotalConFormato: string;
  importeTotal: number;
  importeTotalConFormato: string;
  cantidadAvanceTotal: number;
  cantidadAvanceTotalConFormato: string;
  hijos: EstimacionesDTO[];
  expandido: boolean;
}

export interface PeriodoEstimacionesDTO {
  id: number;
  idProyecto: number;
  fechaInicio: Date;
  fechaTermino: Date;
  numeroPeriodo: number;
  descripcionPeriodo: string;
  esCerrada: boolean;
}

export interface PeriodoResumenDTO extends PeriodoEstimacionesDTO {
  importe: number;
  importeConFormato: string;
  avance: number;
  avanceConFormato: string;
}

export interface PeriodosXEstimacionDTO {
  idEstimacion: number;
  idPeriodo: number;
  descripcionPeriodo: string;
  importe: number;
  importeConFormato: string;
  avance: number;
  avanceConFormato: string;
  idProyecto: number;
}

export interface GeneradoresXEstimacionDTO {
  id: number;
  idEstimacion: number;
  idGenerador: number;
  codigo: string;
  ejeX: string;
  ejeY: string;
  ejeZ: string;
  cantidad: number;
  cantidadReferencia: number;
  x: number;
  y: number;
  z: number;
  cantidadTotal: number;
  cantidadOperacion: string;
}
