
export interface OrdenVentaDTO {
    id: number;
    numeroOrdenVenta: string;
    autorizo: string;
    idCliente: number;
    razonSocialCliente : string;
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
    descripcion : string;
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
    descripcionTipoImpuesto: string;
    idTipoFactor: number;
    descripcionTipoFactor: string;
    idCategoriaImpuesto: number;
    descripcionCategoriaImpuesto: string;
    idClasificacionImpuesto: number;
    descripcionClasificacionImpuesto: string;
    tasaCuota: number;
    importeTotal: number;
}
