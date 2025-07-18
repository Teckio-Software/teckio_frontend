export interface precioUnitarioDetalleAbstractaDTO {
    idPrecioUnitario: number;
    idInsumo: number;
    esCompuesto: boolean;
    costoUnitario: number;
    costoUnitarioConFormato: string;
    costoUnitarioEditado: boolean;
    cantidad: number;
    cantidadConFormato: string;
    cantidadEditado: boolean;
    cantidadExcedente: number;
    idPrecioUnitarioDetallePerteneciente: number;
    codigo: string;
    descripcion: string;
    unidad: string;
    idTipoInsumo: number;
    idFamiliaInsumo: number;
    importe: number;
    importeConFormato: string;
    costoBase: number;
    costoBaseConFormato: string;
}

export interface precioUnitarioDetalleDTO extends precioUnitarioDetalleAbstractaDTO {
    id: number;
}

export interface precioUnitarioDetalleCopiaDTO extends precioUnitarioDetalleDTO{
    seleccionado: boolean;
}
