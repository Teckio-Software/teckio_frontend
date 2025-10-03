import { precioUnitarioDetalleAbstractaDTO, precioUnitarioDetalleCopiaDTO, precioUnitarioDetalleDTO } from "../precio-unitario-detalle/tsPrecioUnitarioDetalle";

export interface precioUnitarioAbstractaDTO{
    id: number;
    idProyecto: number;
    cantidad: number;
    cantidadConFormato: string;
    cantidadEditado: boolean;
    cantidadExcedente: number;
    cantidadExcedenteConFormato: string;
    tipoPrecioUnitario: number;
    costoUnitario: number;
    porcentajeIndirecto: number;
    porcentajeIndirectoConFormato : string;
    costoUnitarioConFormato: string;
    costoUnitarioEditado: boolean;
    nivel: number;
    noSerie: number;
    idPrecioUnitarioBase: number;
    esDetalle: boolean;
    idConcepto: number;
    codigo: string;
    descripcion: string;
    unidad: string;
    precioUnitario: number;
    precioUnitarioConFormato: string;
    precioUnitarioEditado: boolean;
    importe: number;
    importeConFormato: string;
    importeSeries: number;
    importeSeriesConFormato: string;
    expandido: boolean;
    posicion: number;
    codigoPadre: string;
    esCatalogoGeneral : boolean;
    esAvanceObra : boolean;
    esAdicional : boolean;
    esSeleccionado : boolean;
}

export interface precioUnitarioDTO extends precioUnitarioAbstractaDTO{
    hijos: precioUnitarioDTO[];
}

export interface precioUnitarioCopiaDTO extends precioUnitarioAbstractaDTO{
    hijos: precioUnitarioCopiaDTO[];
    seleccionado: boolean;
}

export interface datosParaCopiarDTO{
    registros: precioUnitarioCopiaDTO[];
    idPrecioUnitarioBase: number;
    idProyecto: number;
}

export interface DatosParaImportarCatalogoGeneralDTO
{
    registros: precioUnitarioDTO[];
    precioUnitario: precioUnitarioDTO;
}

export interface detalleDesglosadoDTO{
    id: number;
    idPrecioUnitario: number;
    codigo: string;
    descripcion: string;
    unidad: string;
    cantidad: number;
    idDetallePerteneciente: number;
    costo: number;
    cantidadConFormato: string;
    costoConFormato: string;
}

export interface DatosParaCopiarArmadoDTO{
    registros: precioUnitarioDetalleCopiaDTO[];
    idPrecioUnitarioBase: number;
    idProyecto: number;
}

export interface preciosParaEditarPosicionDTO{
    seleccionado: precioUnitarioDTO;
    destino: precioUnitarioDTO;
    esSubnivel : boolean;
    esCopiado : boolean;
}

export interface CostoHorarioFijoXPrecioUnitarioDetalleDTO {
  id: number;
  idPrecioUnitarioDetalle: number;
  inversion: number;
  interesAnual: number;
  horasUso: number;
  vidaUtil: number;
  porcentajeReparacion: number;
  porcentajeSeguroAnual: number;
  gastoAnual: number;
  mesTrabajoReal: number;
}

export interface CostoHorarioVariable extends precioUnitarioDetalleAbstractaDTO{
  id: number;
  idPrecioUnitarioDetalle: number; //Relacion a precioUnitarioDetalleDTO
  idPrecioUnitarioDetallePerteneciente: number; //Padre
  tipoCostoVariable: number; // 1: Combustible, 2: Neumaticos y partes especiales, 3: Fletes
  rendimiento: number; // 1: combustible x hora/ 2: vida util en horas/ 3: tiempo uso
}

export interface parametrosImportarExcel{

}
