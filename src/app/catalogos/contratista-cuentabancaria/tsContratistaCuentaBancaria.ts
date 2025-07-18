






export interface ContratistaCuentaBancariaDTO{
  id: number;
  idBanco: number;
  nombreBanco: string;
  numeroSucursal: string;
  numeroCuenta: string;
  clabe: string;
  topeMinimo: boolean;
  fechaApertura: Date;
  tipoMoneda: string;
  idContratista: number;
}

export interface ContratistaCuentaBancariaCreacionDTO{
  numeroSucursal: string;
  numeroCuenta: string;
  clabe: string;
  topeMinimo: boolean;
  fechaApertura: Date;
  tipoMoneda: string;
  idContratista: number;
}


