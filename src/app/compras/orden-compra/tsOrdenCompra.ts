import { FacturaDetalleDTO } from 'src/app/facturacionTeckio/facturas';
import { insumoXOrdenCompraCreacionDTO } from '../insumoxordencompra/tsInsumoXOrdenCompra';

export interface ordenCompraDTO {
  id: number;
  idContratista: number;
  razonSocial: string;
  montoTotal: number;
  numeroPedido: number;
  idCotizacion: number;
  noCotizacion: number;
  idRequisicion: number;
  noRequisicion: number;
  fechaPedido: Date;
  estatus: number;
  solicito: string;
  elaboro: string;
  autorizo: string;
  chofer: string;
  observaciones: string;
  idProyecto: number;
  nombre: string;
  noOrdenCompra: string;
  fechaRegistro: Date;
  estatusInsumosSurtidos: number;
  estatusInsumosSurtidosDescripcion: string;
  isExpanded: boolean;
  estatusSaldado : number;
  importeTotal : number;
  totalSaldado : number;
  saldo : number;
  montoAPagar : number;
  esSeleccionado : boolean;
  nombreProyecto : string;
}

export interface ordenCompraCreacionDTO {
  idRequisicion: number;
  idCotizacion: number;
  idContratista: number;
  idProyecto: number;
  chofer: string;
  observaciones: string;
  listaInsumosOrdenCompra: insumoXOrdenCompraCreacionDTO[];
}

export interface ImpuestoInsumoOrdenCompraDTO {
  id: number;
  idInsumoOrdenCompra: number;
  idImpuesto: number;
  porcentaje: number;
  importe: number;
  descripcionImpuesto: string;
}


export interface OrdenCompraFacturasDTO {
  idOrdenCompra: number;
  montoTotalOrdenCompra: number;
  montoTotalFactura: number;
  estatusSaldado : number;
  facturasXOrdenCompra: FacturaXOrdenCompraDTO[];
}


export interface FacturaXOrdenCompraDTO {
  id: number;
  idOrdenCompra: number;
  idFactura: number;
  estatus: number;
  total: number;
  fechaEmision : Date;
  fechaCarga : Date;
  uuid :string;
  detalleFactura: FacturaDetalleDTO[];
  montoAPagar : number;
  saldo : number;
  esSeleccionado : boolean;
}

export interface OrdenesCompraXInsumoDTO
{
  idOrdenCompra : number;
  noOrdenCompra : string;
  cantidad : number;
  precioUnitario : number;
  importeSinIva : number;
  importeConIva : number;
}
