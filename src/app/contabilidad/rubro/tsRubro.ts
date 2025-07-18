

export interface rubroDTO{
  id: number;
  descripcion: string;
  naturalezaRubro: number; //1 = Deudor, 2 = Acreedor
  tipoReporte: number; //1 = reporte estado de resultados, 2 = reporte estado de posición financiera
  posicion: number;
}

export interface rubroCreacionDTO{
  descripcion: string;
  naturalezaRubro: number; //1 = Deudor, 2 = Acreedor
  tipoReporte: number; //1 = reporte estado de resultados, 2 = reporte estado de posición financiera
  posicion: number;
}
