


export interface existenciasInsumosDTO {
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  tipoExistencia: string;
  cantidadExistencia: number;
  idAlmacen: number;
  almacenNombre: string;
  esCentral: boolean;
  esNoConsumible: boolean;
  cantidadAumenta: number;
  cantidadRetira: number;
  cantidadInsumos: number;
  fechaRegistro : number;
  esDisponible : boolean;
}

export interface existenciaActualizacionDTO {
  idInsumo: number;
  cantidadExistencia: number;
  idAlmacen: number;
}
