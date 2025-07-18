export interface insumoXRequisicionCreacion {
  idRequisicion: number;
  descripcion: string;
  unidad: string;
  cantidad: number;
  folio: string;
  personaIniciales: string;
  observaciones: string;
  denominacionBool: boolean;
  denominacion: number;
  fechaEntrega: Date;
  idTipoInsumo: number;
  idInsumo: number;
  cUnitario: number;
  cPresupuestada: number;
}
export interface insumoXRequisicionDTO {
  id: number;
  descripcion: string;
  unidad: string;
  cantidad: number;
  folio: string;
  personaIniciales: string;
  observaciones: string;
  denominacionBool: boolean;
  denominacion: number;
  estatusInsumoSurtidoDescripcion: string;
  estatusInsumoCompradoDescripcion: string;
  fechaEntrega: Date;
  idTipoInsumo: number;
  idInsumo: number;
  cUnitario: number;
  cPresupuestada: number;
  isExpanded: boolean;
}

export interface listaInsumosRequisicionDTO {
  idInsumo: number;
  cantidad: number;
}

export interface insumoXRequisicionSeleccionDTO {
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
}

export interface insumoXRequisicionBusquedaDTO {
  idRequisicion: number;
  descripcion: string;
}
