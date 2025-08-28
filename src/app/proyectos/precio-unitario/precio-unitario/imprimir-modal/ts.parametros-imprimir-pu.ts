export interface ParametrosImpresionPu {
  id: number;
  encabezadoIzquierdo: string;
  encabezadoCentro: string;
  encabezadoDerecho: string;
  pieIzquierdo: string;
  pieCentro: string;
  pieDerecho: string;
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
