

export interface graficaDTO{
  label: string;
  detalle: graficaDetalleDTO[];
}

export interface graficaDetalleDTO{
  labels: string;
  data: number;
}


