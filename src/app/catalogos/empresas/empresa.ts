import { StickyDirection } from "@angular/cdk/table";



//Misma interfaz que en el Backend
export interface empresaDTO{
  id: number;
  razonSocial: string;
  rfc: string;
  representanteLegal: string;
  cargoRepresentanteLegal: string;
  domicilio: string;
  colonia: string;
  ciudad: string;
  telefono: string;
  correoElectronico: string;
}
//Misma interfaz que en el Backend
export interface empresaCreacionDTO{
  razonSocial: string;
  rfc: string;
  representanteLegal: string;
  cargoRepresentanteLegal: string;
  domicilio: string;
  colonia: string;
  ciudad: string;
  telefono: string;
  correoElectronico: string;
}

export interface cuentaBancariaDTO{
  id: number;
  idBanco: number;
  nombre: string;
  bancoRFC: string;
  numeroSucursal: number;
  clabe: string;
  idCuentaContable: number;
  codigo: string;
  topeMinimo: boolean;
  ultimoNoCheque: number;
  fechaApertura: Date;
  tipoMoneda: string;
  idEmpresa: number;
}

export interface cuentaBancariaCreacionDTO{
  bancoRFC: string;
  numeroSucursal: number;
  clabe: string;
  idCuentaContable: number;
  codigo: string;
  topeMinimo: boolean;
  ultimoNoCheque: number;
  fechaApertura: Date;
  tipoMoneda: string;
  idEmpresa: number;
}

export interface bancoDTO{
  id: number;
  nombre: string;
  codigo: string;
}

export interface CuentaBancariaObtenCodigoDTO{
  clabe: string;
}

export interface EmpresaDTO {
  estatus: boolean;
  fechaRegistro: Date;
  guidEmpresa: string;
  id: number;
  idCorporativo: number;
  nombreComercial: string;
  rfc: string;
  sociedad: string;
  codigoPostal: string;
}

export interface Empresa {
  id: number;
  anio: string;
  nombre: string;
  descripcion: string;
  rfc: string;
  pais: string;
  estado: string;
  cp: string;
  colonia: string;
  municipio: string;
  localidad: string;
  direccion: string;
  noExt: string;
  noInt: string;
  referencia: string;
  telefono: string;
  telefonoVenta: string;
  email: string;
  estatus: string;
  idCorporativo: string;
  corporativoDescripcion: string;
  sociedad: string;
  division: string;
}
export interface Corporativo {
  id:number,
  nombre:string,
  estatus:number
}

export interface empresaFiltradoDTO{
  seccionFiltro: string;
  usuarioFiltro: string;
}

export interface ParametroEmpresa{
  id:number,
  idEmpresa:number,
  diaMaximoCargaCfdi:number,
  diasFinMes:number,
  toleranciaCfdi:number,
  requiereNotificacion:number,
  revalidaMesAnterior:number,
  validaPptoWs:number,
  decimalesTolerancia:number,
  toleranciaUniversal:number,
  montoToleranciaMxn:number,
  facturaDirecto:number,
  asignacionDirectaObligada:number;
}
