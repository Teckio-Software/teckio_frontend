export interface vistaBalanzaComprobacionDTO{
    idCuentaContable: number;
    cuentaContableCodigo: string;
    cuentaContableDescripcion: string;
    saldoInicial: number;
    saldoFinal: number;
    debe: number;
    haber: number;
    nivel: number;
    idPadre: number;
    expandido: boolean;
    hijos: vistaBalanzaComprobacionDTO[];
}

export interface filtroBalanzaPeriodoDTO{
    mes: number;
    anio: number;
}

export interface filtroBalanzaRangoFechaDTO{
    mesInicio: number;
    anioInicio: number;
    mesTermino: number;
    anioTermino: number;
}