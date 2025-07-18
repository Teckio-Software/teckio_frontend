


export interface almacenSalidaInsumosDTO{
  id: number;
  idAlmacenSalida: number;
  idInsumo: number;
  codigo: string;
  descripcioninsumo: string;
  unidadinsumo: string;
  cantidadSolicitada: number;
  cantidadPorSalir : number;
  estatus: number;
  esPrestamo : boolean;
  codigoSalida : string;
  prestamoFinalizado : boolean;
  personaRecibio : string;
  seleccionado : boolean;
}

export interface almacenSalidaInsumosCreacionDTO{
  idSalidaAlmacen : number;
  idInsumo: number;
  cantidadPorSalir: number;
  esPrestamo : boolean;
}


export interface insumoXSalidaSeleccionDTO{
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidadExistencia: number;
  cantidad: number;
}
