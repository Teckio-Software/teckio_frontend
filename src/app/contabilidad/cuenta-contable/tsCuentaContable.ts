export interface cuentaContableCatalogoDTO{
  id: number;
  codigo: string;
  descripcion: string;
  idRubro: number;
  descripcionRubro: string;
  tipoMoneda: number;
  saldoInicial: number;
  saldoFinal: number;
  presupuesto: number;
  idCodigoAgrupadorSat: number;
  descripcionCodigoAgrupadorSat: string;
  idPadre: number;
  nivel: number;
}


export interface cuentaContableDTO{
  id: number;
  codigo: string;
  descripcion: string;
  idRubro: number;
  descripcionRubro: string;
  tipoMoneda: number;
  saldoInicial: number;
  saldoFinal: number;
  presupuesto: number;
  idCodigoAgrupadorSat: number;
  descripcionCodigoAgrupadorSat: string;
  idPadre: number;
  nivel: number;
  existeMovimiento: boolean;
  existePoliza: boolean;
  expandido: boolean;
  seleccionado: boolean;
  hijos: cuentaContableDTO[];
  tipoCuentaContableDescripcion : string;
  esCuentaContableEmpresa : boolean;
  tipoCuentaContable : number;
}

export interface cuentaContableHijoDTO{
  id: number;
  codigo: string;
  descripcion: string;
  idRubro: number;
  descripcionRubro: string;
  tipoMoneda: number;
  saldoInicial: number;
  saldoFinal: number;
  presupuesto: number;
  idCodigoAgrupadorSat: number;
  descripcionCodigoAgrupadorSat: string;
  idPadre: number;
  nivel: number;
  existeMovimiento: boolean;
  existePoliza: boolean;
  expandido: boolean;
  hijos: cuentaContableHijoDTO[];
}


export interface cuentaContableCreacionDTO{
  codigo: string;
  descripcion: string;
  idRubro: number;
  tipoMoneda: number;
  saldoInicial: number;
  saldoFinal: number;
  presupuesto: number;
  idCodigoAgrupadorSat: number;
  idPadre: number;
  nivel: number;
  hijos: cuentaContableCreacionHijoDTO[];
  esCuentaContableEmpresa : boolean;
  tipoCuentaContable : number;
}

export interface cuentaContableCreacionHijoDTO{
  codigo: string;
  descripcion: string;
  idRubro: number;
  tipoMoneda: number;
  saldoInicial: number;
  saldoFinal: number;
  presupuesto: number;
  idCodigoAgrupadorSat: number;
  idPadre: number;
  nivel: number;
  hijos: cuentaContableCreacionHijoDTO[];
}




// export interface conceptoProyecto{
//   idPartida: number;
//   partidaBase: number;
//   codigo: string;
//   descripcion: string;
//   idRubro: number;
//   unidad: string;
//   detalle: string;
//   nivel: number;
//   hijos: conceptoProyectoHijo[];
// }

// export interface conceptoProyectoHijo{
//   idPartida: number;
//   partidaBase: number;
//   codigo: string;
//   descripcion: string;
//   idRubro: number;
//   unidad: string;
//   detalle: string;
//   nivel: number;
//   hijos: conceptoProyectoHijo[];
// }

// export interface ExampleFlatNode {
//   expandable: boolean;
//   id: number;
//   codigo: string;
//   descripcion: string;
//   idRubro: number;
//   unidad: string;
//   detalle:string;
//   nivel: number;
//   count: number;
//   level: number;
// }



export interface CuentaContableNode {
  expandable: boolean;
  id: number;
  codigo: string;
  descripcion: string;
  idRubro: number;
  descripcionRubro: string;
  tipoMoneda: number;
  saldoInicial: number;
  saldoFinal: number;
  presupuesto: number;
  idCodigoAgrupadorSat: number;
  descripcionCodigoAgrupadorSat: string;
  idPadre: number;
  nivel: number;
  count: number;
  level: number;
}


export interface Mes {
  id: number;
  mes: string;
}


export interface Anio {
  id: number;
  anio: string;
}

export interface codigoAgrupadorDTO{
  id: number;
  nivel: string;
  codigo: string;
  descripcion: string;
}

export interface cuentaContableObtenCodigo {
  idEmpresa: number;
  codigo: string;
}

export interface pruebaDTO{
  id: string;
  name: string;
  expand: boolean;
  items: pruebaDTO[];
}

