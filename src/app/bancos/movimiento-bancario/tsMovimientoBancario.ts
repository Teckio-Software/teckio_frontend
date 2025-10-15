import { FacturaXOrdenCompraDTO, ordenCompraDTO } from "src/app/compras/orden-compra/tsOrdenCompra";
import { FacturaXOrdenVentaDTO, OrdenVentaDTO } from "src/app/gestion-ventas/ventas/ordenVenta";

export interface MovimientoBancarioTeckioDTO extends MBancarioBeneficiarioDTO {
  id : number;
  idPoliza : number;
  idFactura : number;
  idCuentaBancariaEmpresa : number;
  beneficiario : string;
  noMovimientoBancario : string;
  folio : string;
  fechaAlta : Date;
  fechaAplicacion : Date;
  fechaCobra : Date;
  modalidad : number;
  descripcionModalidad : string;
  tipoDeposito : number;
  montoTotal : number;
  saldo : number;
  concepto : string;
  tipoCambio : number;
  moneda : number;
  descripcionMoneda : string;
  estatus : number;
  descripcionEstatus : string;
  tipoBeneficiario : number;
  esFactura : boolean;
  esOrdenCompra : boolean;
  facturasXOrdenCompra : FacturaXOrdenCompraDTO[];
  ordenCompras : ordenCompraDTO[];
  esFacturaOrdenVenta : boolean;
  esOrdenVenta : boolean;
  facturasXOrdenVenta : FacturaXOrdenVentaDTO[];
  ordenVentas : OrdenVentaDTO[];
}

export interface MBancarioBeneficiarioDTO {
  id : number;
  idBeneficiario : number;
  idCuentaBancaria : number;
  idMovimientoBancario : number;
}





//Este DTO es para mostrar la información de los movimientos bancarios
export interface movimientoBancarioDTO {
  id: number;
  noMovBancario: string;
  fechaAlta: Date;
  fechaAplicacion: Date;
  fechaCobro: Date;
  modalidad: string;
  noCheque: string;
  referencia: string;
  idContratista: number;
  idContratistaCuentaBancaria: number;
  contratistaCuentaBancariaClabe: string;
  contratistaCuentaBancariaNumeroCuenta: string;
  beneficiario: string;
  deposito: number;
  retiro: number;
  saldo: number;
  noPoliza: string;
  estatus: string;
  concepto: string;
  idCuentaBancariaEmpresa: string;
  clabeCuentaBancariaEmpresa: string;
  nombreTercerPersona: string;
  rfcTerceraPersona: string;
  naturaleza: string;
  idProyecto: number;
  descripcionProyecto: string;
}


export interface movimientoBancarioCreacionDTO {
  noMovBancario: string;
  fechaAlta: Date;
  fechaAplicacion: Date;
  fechaCobro: Date;
  modalidad: string;
  noCheque: string;
  referencia: string;
  idContratista: number;
  idContratistaCuentaBancaria: number;
  //beneficiario: string;
  deposito: number;
  retiro: number;
  saldo: number;
  abonoACuenta: boolean;
  generaPoliza: boolean;
  //noPoliza: string;
  estatus: string;
  concepto: string;
  idCuentaBancariaEmpresa: number;
  nombreTercerPersona: string
  rfcTerceraPersona: string;
  naturaleza: string;
  idProyecto: number;
  aplicaDiot: boolean;// si aplica es el total del monto
  tipoMoneda: string;
  tipoCambio: Number;
  tipoMovimiento: string;
  monto: number;
  montoTotal: number;
  montoBaseDiot: number;
  tasaIvaDiot: number;
  tipoGastoDirecto: string;
  tipoMovimientoProyecto: string;
}

