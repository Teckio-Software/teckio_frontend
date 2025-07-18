import { polizaDetalleDTO } from "../poliza-detalle/tsPolizaDetalle";

export interface polizaDTO{
    id: number;
    idTipoPoliza: number;
    folio: string;
    numeroPoliza: string;
    fechaAlta: Date;
    fechaPoliza: Date;
    concepto: string;
    estatus: number;
    observaciones: string;
    origenDePoliza: number;
    esPolizaCierre: boolean;
    detalles: polizaDetalleDTO[];
}

export interface PolizaFolioCodigoDTO{
    folio: string;
    numeroPoliza: string;
}