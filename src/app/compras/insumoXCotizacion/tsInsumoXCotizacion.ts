export interface insumoXCotizacionDTO {
  id: number;
  idCotizacion: number;
  noCotizacion: string;
  idInsumoRequisicion: number;
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidadCotizada: string;
  cantidadCotizada: number;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  importeSinIva: number;
  importeTotal: number;
  estatusInsumoCotizacion: number;
  estatusInsumoCotizacionBool: boolean;
  estatusInsumoCotizacionDescripcion: string;
  descuento: number;
  esSeleccionada: boolean;
  isExpanded: boolean;
  cantidadConFormato: string
  descuentoConFormato: string
  precioUnitarioConFormato: string
  importeTotalConFormato: string;
  pIvaConFormato : string;
}

export interface listaInsumoXCotizacionDTO {
  idCotizacion: number;
  idInsumo: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  importe: number;
  estatus: number;
  estatusCotizacion: number;
}

export interface insumoXCotizacionSeleccionDTO {
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number;
  cantidad: number;
  descuento: number;
  iva: number;
  estatus: number;
  estatusCotizacion: number;
}
//Este DTO es para la creación de un insumo en una cotización
export interface listaInsumosCotizacionDTO {
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  cantidadCotizada: number;
  iva: number;
  estatus: number;
  estatusCotizacion: number;
  isr: number;
  ieps: number;
  isan: number;
}

export interface editaEstatusInsumoXCotizacionDTO {
  id: number;
  estatus: number;
}
