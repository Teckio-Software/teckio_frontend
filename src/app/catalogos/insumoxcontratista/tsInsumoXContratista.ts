




export interface insumoXContratistaDTO{
  id: number;
  idInsumo: number;
  idContratista: number;
  codigo: string;
  descripción: string;
  unidad: string;
  costo: number;
}

export interface insumoXContratistaCreacionDTO{
  idInsumo: number;
  idcontratista: number;
  costo: number;
}
