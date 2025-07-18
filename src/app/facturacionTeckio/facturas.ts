export interface FacturasTeckioDTO {
  id: number;
  ordenCompra: string;
  uuid: string;
  fechaValidacion: Date;
  fechaTimbrado: Date;
  fechaEmision: Date;
  rfcEmisor: string;
  rfcReceptor: string;
  subtotal: number;
  total: number;
  serieCfdi: string;
  folioCfdi: string;
  estatus: number;
  tipo: number;
  moneda: string;
  modalidad: number;
  idArchivo: number;
  metodoPago: string;
  formaPago: number;
  descuento: number;
  idArchivoPdf: number;
  numeroDocumento: string;
  estatusValido: number;
}
export interface FacturaDTO {
  id: number;
  uuid: string;
  fechaValidacion: Date;
  fechaTimbrado: Date;
  fechaEmision: Date;
  rfcEmisor: string;
  subtotal: number;
  total: number;
  serieCfdi: string;
  folioCfdi: string;
  estatus: number;
  tipo: number;
  modalidad: number
  idArchivo: number;
  metodoPago: string;
  descuento: number;
  idArchivoPdf: number;
  estatusEnviadoCentroCostos: number;
  versionFactura: string;
  codigoPostal: string;
  tipoCambio: number;
  formaPago: string;
  moneda: string;
  rfcReceptor: string;
  idCliente: number;
  idFormaPago: number;
  idRegimenFiscalSat: number;
  idUsoCfdi: number;
  idMonedaSat: number;
  razonSocialCliente: string;
  regimenFiscal: string;
  usoCfdi: string;
  monedaSat: string;
}

export interface FacturaDetalleDTO {
  id: number;
  idFactura: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  unidadSat: string;
  importe: number;
  descuento: number;
  idProductoYservicio: number;
  idCategoriaProductoYServicio: number;
  idSubcategoriaProductoYServicio: number;
}

export interface FacturaComplementoPagoDTO {
  id: number;
  idFactura: number;
  uuid: number;
  impuestoSaldoInsoluto: number;
  impuestoSaldoAnterior: number;
  impuestoPagado: number;
  numeroParcialidades: number;
}

export interface FacturaTeckioDetallesDTO {
  totalIVA: number;
  totalISR: number;
  impuestosLocales: number;
  razonSocial: string;
  complementosPagos: FacturaComplementoPagoVista[];
}

export interface FacturaComplementoPagoVista {
  idFactura: number;
  serie: string;
  folio: string;
  uuid: string;
}