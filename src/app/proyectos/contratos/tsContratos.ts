export interface detalleXContratoDTO {
    id: number;
    idPrecioUnitario: number;
    idContrato: number;
    porcentajeDestajo: number;
    importeDestajo: number;
}

export interface detalleXContratoParaTablaDTO {
    idDetalleXContrato: number;
    idPrecioUnitario: number;
    codigo: string;
    descripcion: string;
    unidad: string;
    costoUnitario: number;
    costoUnitarioConFormato: string;
    cantidad: number;
    cantidadConFormato: string;
    importe: number;
    importeConFormato: string;
    tipoPrecioUnitario: number;
    idPrecioUnitarioBase: number;
    idContrato: number;
    porcentajeDestajo: number;
    porcentajeDestajoConFormato: string;
    factorDestajo: number;
    factorDestajoConFormato: string;
    porcentajeDestajoEditando: boolean;
    importeDestajo: number;
    importeDestajoConFormato: string;
    porcentajeDestajoAcumulado: number;
    porcentajeDestajoAcumuladoConFormato: string;
    expandido: boolean;
    aplicarPorcentajeDestajoHijos : boolean;
    hijos: detalleXContratoParaTablaDTO[];
}

export interface porcentajeAcumuladoContratoDTO {
    id: number;
    porcentajeDestajoAcumulado: number;
    idPrecioUnitario: number;
}

export interface contratoDTO {
    id: number;
    tipoContrato: boolean;
    numeroDestajo: number;
    estatus: number;
    idProyecto: number;
    costoDestajo: number;
    idContratista: number;
    fechaRegistro : Date;
    numeroDestajoDescripcion : string;
}

export interface parametrosParaBuscarContratos {
    idProyecto: number;
    tipoContrato: boolean;
    idContratista: number;
    idContrato: number;
    fechaInicio: string | null;
    fechaFin: string | null;
}

export interface destajistasXConceptoDTO {
    idPrecioUnitario: number;
    idContratista: number;
    razonSocial: string;
    idContrato: number;
    numeroDestajo: string;
    idDetalleXContrato: number;
    porcentajeDestajo: number;
    porcentajeDestajoConFormato: string;
}