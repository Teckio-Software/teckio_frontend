import { detalleXContratoParaTablaDTO } from "../contratos/tsContratos";
import { PeriodoEstimacionesDTO, PeriodoResumenDTO } from "../estimaciones/tsEstimaciones";

export interface ReporteDestajoDTO {
    idPeriodoEstimacion: number;
    idContratista: number;
    idContrato: number;
    idPrecioUnitario: number;
    idProyecto: number;
    descripcion: string;
    porcentajeEstimacion: number;
    porcentajeEstimacionConFormato: string;
    importe: number;
    importeConFormato: string;
    porcentajePago: number;
    porcentajePagoConFormato: string;
    acumulado: number;
    acumuladoConFormato: string;
    porcentajeDestajo: number;
    porcentajeDestajoConFormato: string;
    importeDestajo: number;
    importeDestajoConFormato: string;
    tipoContrato : boolean;
}

export interface ObjetoDestajoacumuladoDTO {
    destajos: detalleXContratoParaTablaDTO[];
    periodos: PeridoAcumuladosDTO[];
}
export interface PeridoAcumuladosDTO extends PeriodoEstimacionesDTO {
    detalles: AcumuladosDTO[];
}
export interface AcumuladosDTO {
    id: number;
    importe: number;
    importeConFormato: string;
    avance: number;
    avanceConFormato: string;
}

export interface ObjetoDestajoTotalDTO {
    contratistas: ContaratistaImporteDTO[];
    periodos: PeriodosTotalesDTO[];
}

export interface ContaratistaImporteDTO {
    id: number;
    razonSocial: string;
    importe: number;
    importeConFormato: string;
}

export interface PeriodosTotalesDTO extends PeriodoEstimacionesDTO {
    totales: TotalesDTO[];
}

export interface TotalesDTO {
    idContratista: number;
    importe: number;
    importeConFormato: string;
    avance: number;
    avanceConFormato: string;
}
