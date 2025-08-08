
export interface OrdenVentaDTO {
    id: number;
    numeroOrdenVenta: string;
    autorizo: string;
    idCliente: number;
    fechaRegistro: Date
    estatus: number;
    importeTotal: number;
    subtotal: number;
    estatusSaldado: number;
    totalSaldado: number;
    descuento: number;
    observaciones: string;
    detalleOrdenVenta: DetalleOrdenVentaDTO[];
    elaboro: string;
}

export interface DetalleOrdenVentaDTO {
    id: number;
    idOrdenVenta: number;
    idProductoYservicio: number;
    idEstimacion: number;
    cantitdad: number;
    precioUnitario: number;
    descuento: number;
    importeTotal: number;
    impuestosDetalleOrdenVenta: ImpuestoDetalleOrdenVentaDTO[];
}

export interface ImpuestoDetalleOrdenVentaDTO {
    id: number;
    idDetalleOrdenVenta: number;
    idTipoImpuesto: number;
    idTipoFactor: number;
    idCategoriaImpuesto: number;
    idClasificacionImpuesto: number;
    tasaCuota: number;
    importeTotal: number;
}