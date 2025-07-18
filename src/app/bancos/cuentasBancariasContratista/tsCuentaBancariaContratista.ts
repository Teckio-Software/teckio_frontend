










export interface contratistaCuentaBancariaDTO{
  id: number;
  idBanco: number;
  nombreBanco: string;
  numeroSucursal: string;
  numeroCuenta: string;
  clabe: string;
  topeMinimo: number;
  fechaApertura: Date;
  tipoMoneda: string;
  idContratista: number;
}

export interface contratistaCuentaBancariaCreacionDTO{
  idBanco: number;
  nombreBanco: string;
  numeroSucursal: string;
  numeroCuenta: string;
  clabe: string;
  topeMinimo: number;
  fechaApertura: Date;
  tipoMoneda: string;
  idContratista: number;
}

// export interface facturaDTO{
//   id: number;
//   codigo: string;
// }


export interface pedidoDTO{
  id: number;
  fechaRegistro: Date;
  fechaEntrega: Date;
  idContratista: number;
  razonContratista: string;
  totalMontoInsumos: number; //Subtotal
  montoDescuento: number;//Monto descuento
  importeIva: number; //Importe iva
  totalPedido: number; //Total con iva
  totalInsumos: number; //Numero de insumos - Por ejemplo 1.6 toneladas
  estatus: number;
  idAlmacen: number;
  codigoalmacen: string;
  descripcionAlmacen: string;
  idPedido: number;
  descripcionPedido: string;
  observaciones: string;
}
