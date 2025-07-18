import {
  listaInsumoXCotizacionDTO,
  listaInsumosCotizacionDTO,
} from '../insumoXCotizacion/tsInsumoXCotizacion';

export interface objetoRequisicionDTO {
  idRequisicion: number;
  insumosXRequisicion: insumosXRequisicion[];
  cotizacion: cotizacion[];
}

export interface insumosXRequisicion {
  idInsumoXRequisicion: number;
  idInsumo: number;
  descripcion: string;
  unidad: string;
  importe: number;
  precioUnitario: number;
  cantidad: number;
}

export interface cotizacion {
  idCotizacion: number;
  noCotizacion: string;
  idContratista: number;
  razonSocial: string;
  importeTotal: number;
  insumoXCotizacion: insumosXCotizacion[];
}

export interface insumosXCotizacion {
  idInsumoXCotizacion: number;
  idInsumo: number;
  descripcion: string;
  unidad: string;
  importe: number;
  precioUnitario: number;
  cantidad: number;
  estatus: number;
  descuento: number;
  impuestoInsumoCotizado: ImpuestoInsumoCotizadoDTO[];
}

export interface ImpuestoInsumoCotizadoDTO {
  id: number;
  idInsumoCotizado: number;
  idImpuesto: number | null;
  porcentaje: number;
  importe: number;
}
export interface cotizacionDTO {
  id: number;
  idProyecto: number;
  nombre: number;
  idRequisicion: number;
  noRequisicion: number;
  noCotizacion: number;
  idContratista: number;
  representanteLegal: string;
  insumosCotizados: number;
  totalCotizacion: number;
  estatus: number;
  observaciones: string;
  fechaRegistro: Date;
  estatusCotizacion: number;
  estatusCotizacionDescripcion: string;
  estatusCotizacionBool: boolean;
  estatusInsumosComprados: number;
  estatusInsumosCompradosBool: boolean;
  estatusInsumosCompradosDescripcion: string;
  isExpanded: boolean;
}

export interface InsumoXCotizacionCreacionDTO {
  id: number;
  idCotizacion: number;
  idInsumoRequisicion: number;
  idInsumo: number;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  pIVA: number;
  estatus: number;
  importeTotal : number;
  cantidadConFormato: string
  descuentoConFormato: string
  precioUnitarioConFormato: string
  importeTotalConFormato: string;
  pIvaConFormato : string;
  pCotizado: number;
  pCotizadoConFormato: string;
}

export interface cotizacionCreacionDTO {
  idProyecto: number;
  idRequisicion: number;
  idContratista: number;
  observaciones: string;
  listaInsumosCotizacion: InsumoXCotizacionCreacionDTO[];
}

export interface cotizacionEditaEstatusDTO {
  id: number;
  estatus: number;
}

export interface TipoImpuestoDTO {
  id: number;
  claveImpuesto: string;
  descripcionImpuesto: string;
}
