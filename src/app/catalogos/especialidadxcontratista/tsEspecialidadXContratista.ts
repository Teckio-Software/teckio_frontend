


export interface especialidadXContratistaDTO{
  id: number;
  idEspecialidad: number;
  idContratista: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  costo: number;
}

export interface especialidadXContratistaCreacionDTO{
  idEspecialidad: number;
  idContratista: number;
  unidad: string;
  costo: number;
}
