export interface proyectoDTO{
    id: number;
    codigoProyecto: string;
    nombre: string;
    noSerie: number;
    moneda: string;
    presupuestoSinIva: number;
    tipoCambio: number;
    presupuestoSinIvaMonedaNacional: number;
    porcentajeIva: number;
    presupuestoConIvaMonedaNacional: number;
    anticipo: number;
    codigoPostal: number;
    domicilio: string;
    fechaInicio: Date;
    fechaFinal: Date;
    tipoProgramaActividad: number;
    inicioSemana: number;
    esSabado: true;
    esDomingo: true;
    idPadre: number;
    nivel: number;
    expandido: boolean;
    hijos: proyectoDTO[];
}