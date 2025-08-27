export interface ParametrosImpresionPu {
  id: number;
  idCliente: number;
  encabezadoIzquierdo: string;
  encabezadoCentro: string;
  encabezadoDerecho: string;
  pieIzquierdo: string;
  pieCentro: string;
  pieDerecho: string;
  idImagen: number;
  margenSuperior: number;
  margenInferior: number;
  margenDerecho: number;
  margenIzquierdo: number;
}

export interface Imagen {
  id: number;
  ruta: string;
  base64: string;
}
