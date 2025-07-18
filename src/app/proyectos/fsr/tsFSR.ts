export interface diasConsideradosDTO{
    id: number;
    codigo: string;
    descripcion: string;
    valor: number;
    articulosLey: string;
    esLaborableOPagado: boolean;
    idFactorSalarioIntegrado: number;
    idProyecto : number;
}

export interface factorSalarioIntegradoDTO{
    id: number;
    idProyecto: number;
    fsi: number;
}

export interface factorSalarioRealDetalleDTO{
    id: number;
    idFactorSalarioReal: number;
    codigo: string;
    descripcion: string;
    porcentajeFsrdetalle: number;
    articulosLey: string;
    idProyecto : number;
}

export interface factorSalarioRealDTO{
    id: number;
    idProyecto: number;
    porcentajeFsr: number;
}

export interface relacionFSRInsumoDTO{
    id: number;
    idProyecto: number;
    sueldoBase: number;
    prestaciones: number;
    codigo: string;
    descripcion: string;
    unidad: string;
    costoUnitario: number;
    idTipoInsumo: number;
    idInsumo: number;
}

export interface fsrXInsumoMdODetalleDTO{
    id: number;
    codigo: string;
    descripcion: string;
    articulosLey: string;
    porcentajeFsr: number;
    idFsrXInsumoMdO: number;
    idInsumo: number;
    idProyecto: number;
}

export interface fsiXInsumoMdODetalleDTO{
    id: number;
    codigo: string;
    descripcion: string;
    articulosLey: string;
    dias: number;
    esLaborableOpagado: boolean;
    idFsiXInsumMdO: number;
    idInsumo: number;
    idProyecto: number;
}

export interface fsrXInsumoMdODTO{
    id: number;
    costoDirecto: number;
    costoFinal: number;
    fsr: number;
    idInsumo: number;
    idProyecto: number;
}

export interface fsiXInsumoMdODTO{
    id: number;
    diasNoLaborales: number;
    diasPagados: number;
    fsi: number;
    idInsumo: number;
    idProyecto: number;
}

export interface estructuraFsrXInsummoMdODTO extends fsrXInsumoMdODTO{
    detalles: fsrXInsumoMdODetalleDTO[];
}

export interface estructuraFsiXInsummoMdODTO extends fsiXInsumoMdODTO{
    detalles: fsiXInsumoMdODetalleDTO[];
}

export interface objetoFactorSalarioXInsumoDTO{
    fsr: estructuraFsrXInsummoMdODTO;
    fsi: estructuraFsiXInsummoMdODTO;
}