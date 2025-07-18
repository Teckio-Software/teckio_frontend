

export interface Facturas {
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
}

export interface FacturaNumeroDocumento extends Facturas{
  numeroDocumento: string;
}

export interface BuscarFacturasDTO{
  serieCfdi: string;
  folioCfdi: string;
  uuid: string;
  buscaXFechaValidacion: boolean;
  fechaValidacion: Date;
  buscaXFechaTimbrado: boolean;
  fechaTimbrado: Date;
  buscaXFechaEmision: boolean;
  fechaEmision: Date;
  estatus: number;
  moneda: string;
  tipo: number;
  numeroDocumento: string;
  idEntradaMaterial: number;
}

export interface FacturaEstructuraDTO{
  idFactura: number;
  serieCfdi: string;
  folioCfdi: string;
  numeroOrdenCompra: string;
  razonSocial: string;
  fechaTimbrado: Date;
  fechaRegistro: Date;
  subtotal: number;
  descuento: number;
  totalIva: number;
  totalIsr: number;
  impuestosLocales: number;
  total: number;
        //Revalidación
  estatusAnteriorCfdi: boolean;
  estatusActualCfdi: boolean;
  fechaRevalidacion: Date;
        //Complemento de pago
  fechaComplementoPago: Date;
        //REPSE
  estatusRepse: number;
}

