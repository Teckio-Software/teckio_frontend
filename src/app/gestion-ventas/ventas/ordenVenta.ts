import { FacturaDetalleDTO } from "src/app/facturacionTeckio/facturas";

export interface OrdenVentaDTO {
  id: number;
  numeroOrdenVenta: string;
  autorizo: string;
  idCliente: number;
  razonSocialCliente: string;
  fechaRegistro: Date;
  estatus: number;
  importeTotal: number;
  subtotal: number;
  estatusSaldado: number;
  totalSaldado: number;
  descuento: number;
  observaciones: string;
  detalleOrdenVenta: DetalleOrdenVentaDTO[];
  elaboro: string;
  saldo : number;
  montoAPagar : number;
  esSeleccionado : boolean;
}

export interface DetalleOrdenVentaDTO {
  id: number;
  idOrdenVenta: number;
  idProductoYservicio: number;
  descripcion: string;
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

export interface CancelarOrdenVentaDTO {
  idOrdenVenta: number;
  idAlmacenDestino: number;
}


export interface FacturaXOrdenVentaDTO{
  id : number;
idFactura : number;
idOrdenVenta : number;
estatus : number;
totalSaldado : number;
uuid : string;
total : number;
fechaEmision : Date;
fechaCarga : Date;
montoAPagar : number;
saldo : number;
esSeleccionado : boolean;
detalleFactura: FacturaDetalleDTO[];

}
