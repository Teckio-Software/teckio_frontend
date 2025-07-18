export interface OrdenCompra {
  selected: boolean;
  numeroOrdenCompra: string;
  proveedor: string;
  rfcProveedor: string;
  fecha: string;
  estatusAlmacen: number;
  total: number;
  //tabla 2
  noLin: string;
  descripcion: string;
  cantidad: number;
  cantidadFormato: string;
  unidad: string;
  costoUnitario: number;
  costoUnitarioFormato: string;
  costoTotal: number;
  costoTotalFormato: string;

  //tabla 3
  noLinea: string;
  noEntrada: number;
  unidadMedida: number;
  precioUnitario: number;
  importe: number;
  nombreRecortado: number;
  referncia: string;
  moneda: string;
  referencia: string;
  totalFormateado: string;
  totalgralFormateado:string;
  estatusAlmacenFormato: string;
  estatusOrdenCompraWS: string;
}


export interface OrdenCompraWS {
  id: number;
  idUsuario: number;
  numeroOrdenCompra: string;
  numeroConfirmacion: string;
  fecha: Date;
  total: number;
  estatusOrdenCompra: number;
  estatusAlmacen: number;
  estatusPago: number;
  fechaPago: Date;
  // EHG 28/06/2019 Se agrega la División
  division: string;
  proveedor: string;
  totalRegistros: number;
  registrosXPagina: number;
  paginaActual: number;
  estatusOrdenCompraWS: string;
  detallesOrdenConfimada: detalleOrdenPorConfirmarModel[];
  entradasDetalle: EntradasLinea[];
  entradasAgrupadas: agrupacionEntrada[];
}

export interface detalleOrdenPorConfirmarModel{
  id: number;
  idOrdenCompra: number;
  item: number;
  noParte: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  unidadDeNegocio: string;
  costoUnitario: number;
  impuestos: number;
  costoTotal: number;
  costoDeEnvio: number;
  cantidadConfirmar: number;
  confirmarPedido: boolean;
  fechaEntrega: Date;
  noLinea: string;
}

export interface EntradasLinea
{
  idEstatus: number;
  noLinea: string;
  pedido: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  estatus: string;
  organizacionCompra: string;
  noEntrada: string;
  descripcion: string;
  unidadMedida: string;
  fecha: Date;
  total: string;
  moneda: string;
  referencia: string;
}

export interface agrupacionEntrada
{
  noEntrada: string;
  fecha: Date;
  total: string;
  moneda: string;
  referencia: string;
  estatus: string;
  listaDetalles: EntradasLinea[];
}
