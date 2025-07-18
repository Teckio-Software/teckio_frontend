import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface UsuarioGastosDTO{
  id: number;
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  numeroEmpleado: string;
  numeroEmpleadoSAP: string | null;
  seguroSocial: string | null;
  rfc: string | null;
  curp: string | null;
  codigoPostal: string | null;
  fechaRelacionLaboral: Date | null;
  salarioDiario: number | null;
  claveContrato: number | null;
  claveRegimen: number | null;
  claveJornada: number | null;
  claveRiesgoPuesto: number | null;
}

export interface DatosEmpleadoDTO extends UsuarioGastosDTO{
  id: number;
  numeroEmpleadoSAP: string | null;
  seguroSocial: string | null;
  rfc: string | null;
  curp: string | null;
  codigoPostal: string | null;
  fechaRelacionLaboral: Date | null;
  salarioDiario: number | null;
  claveContrato: number | null;
  claveRegimen: number | null;
  claveJornada: number | null;
  claveRiesgoPuesto: number | null;
}

export interface PlazaEmpleadoDTO{
  id: number;
  idPlaza: number;
  idEmpleado: number;
  idDivision: number;
  estatus:number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  metodos_pagos_multiples: boolean;
  Limite_personalizado_Alimentos: number;
  Limite_personalizado_Hospedaje: number;
  Limite_personalizado_Transporte: number;
}

export interface arbolDTO{
  id: number;
  idPlazaEmpleado: number;
  fecha_alta: Date;
  esAnticipo: boolean;
}

export interface autorizadoresDTO{
  id: number;
  idArbol: number;
  idPlazaEmpleado: number;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  nombre: string;
  nivel: number;
}

export interface arbol_AutorizadoresDTO{
  id: number;
  idArbol: number;
  idAutorizador: number;
  nivelAutorizacion: number;
}

export interface PlazaCuentaDTO{
  id: number;
  idPlaza: number;
  idCuentaContableGastos: number;
  estatus: number;
  nombreCuenta: string;
  codigo: string;
}

export interface PlazaCentroDTO{
  id: number;
  id_centro_costo: number;
  idPlaza: number;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  nombreCentro: string;
  codigo: string;
}

export interface ContratosDTO{
  id: number;
  clave: number;
  descripcion: string;
  estatus: number;
}

export interface RiesgosDTO{
  id: number;
  clave: number;
  descripcion: string;
  estatus: number;
}

export interface RegimenesDTO{
  id: number;
  clave: number;
  descripcion: string;
  estatus: number;
}

export interface JornadasDTO{
  id: number;
  clave: number;
  descripcion: string;
  estatus: number;
}

export interface DatosEmpleadoCreacionDTO{
  id: number;
  idUsuario: number;
  numeroEmpleadoSAP: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date;
  seguroSocial: string;
  rfc: string;
  curp: string;
  codigoPostal: string;
  numeroEmpleado: string;
  fechaRelacionLaboral: Date;
  salarioDiario: Float32Array;
  claveContrato: number;
  claveRegimen: number;
  claveJornada: number;
  claveRiesgoPuesto: number;
}


