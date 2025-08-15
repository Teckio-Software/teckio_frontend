export interface InsumoXProductoYServicioDTO {
  id: number;
  idProductoYservicio: number;
  idInsumo: number;
  cantidad: number;
}

export interface InsumoXProductoYServicioConjuntoDTO {
  id: number;
  idProductoYservicio: number;
  idInsumo: number;
  cantidad: number;
  clave: string;
  descripcion: string;
}
