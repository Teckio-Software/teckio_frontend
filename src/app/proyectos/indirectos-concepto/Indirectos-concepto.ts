export interface IndirectosXConceptoAbstractDTO {
    id: number;
    idConcepto: number;
    codigo: string;
    descripcion: string;
    tipoIndirecto: number;
    porcentaje: number;
    porcentajeConFormato : string;
    idIndirectoBase: number;
    expandido : boolean;
    nivel : number;
}

export interface IndirectosXConceptoDTO extends IndirectosXConceptoAbstractDTO{
    hijos : IndirectosXConceptoDTO[];
}