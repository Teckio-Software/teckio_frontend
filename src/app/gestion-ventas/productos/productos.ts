export interface ProductoYServicioDTO {
  id: number;
  codigo: string;
  descripcion: string;
  idUnidad: number;
  idProductoYservicioSat: number;
  idUnidadSat: number;
  idCategoriaProductoYServicio: number;
  idSubategoriaProductoYServicio: number;
}

export interface ProductoYServicioConjunto {
  id: number;
  codigoPS: string;
  descripcionPS: string;
  idUnidad: number;
  descripcionUnidad: string;
  idPSS: number;
  clavePSS: string;
  descripcionPSS: string;
  idUnidSSat: number;
  tipoUS: string;
  claveUS: string;
  nombreUs: string;
  idCPS: number;
  descripcionCPS: string;
  idSPS: number;
  descripcionSPS: string;
}
