import { insumoXRequisicionCreacion, listaInsumosRequisicionDTO } from "../insumos-requicision/insumoxrequisicion/tsInsumoXRequisicion";

export interface requisicionDTO{
    id: number;
    noRequisicion: string;
    totalInsumosRequisitados: number;
    insumosPendientes: number;
    insumosComprados: number;
    estatus: string;
    idProyecto: number;
    nombre: string;//Nombre del proyecto
    idAlmacen: number;
    nombreAlmacen: string;
    observaciones: string;
    fechaEntrega: Date;
    fechaRegistro: Date;
    estatusInt: number;
    estatusInsumosSurtidos: number;
}

export interface listaRequisicionDTO{
  id : number;
  idProyecto : number;
  noRequisicion : string;
  personaSolicitante : string;
  observaciones : string;
  fechaRegistro : string;
  estatusRequisicion : number;
  estatusInsumosComprados : number;
  estatusInsumosCompradosDescripcion : string;
  estatusInsumosSurtIdos : number;
  estatusInsumosSurtIdosDescripcion : string;
  residente : string;
}

export interface requisicionCreacionDTO{
    [x: string]: any;
    idProyecto: number;
    observaciones: string;
    residente :  string;
    listaInsumosRequisicion: insumoXRequisicionCreacion[];
}

export interface InsumoProyectoBusquedaDTO{
  idProyecto: number;
  descripcionInsumo: string;
  unidad: string;
}

export interface InsumoRequisicionBusquedaDTO{
  idProyecto: number;
  idRequisicion: number;
  numeroRequisicion: string;
}

export interface RequisicionBuscarDTO{
  idProyecto: number;
  NoRequisicion: number;
}

export interface RequisicionBusquedaExtensaDTO{
  idProyecto: number;
  fechaInicio: Date;
  fechaFinal: Date;
  esBusquedaPorFechas: boolean;
  estatus: number;
}

