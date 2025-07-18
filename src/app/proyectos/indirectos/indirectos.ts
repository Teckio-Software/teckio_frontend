export interface IndirectosAbstractDTO {
    id: number;
    idConjuntoIndirectos: number;
    codigo: string;
    descripcion: string;
    tipoIndirecto: number;
    porcentaje: number;
    porcentajeConFormato : string;
    idIndirectoBase: number;
    expandido : boolean;
    nivel : number;
}

export interface IndirectosDTO extends IndirectosAbstractDTO{
    hijos : IndirectosDTO[];
}