export interface conceptoDTO{
  id: number;
  idProyecto: number;
  descripcion: string;
  unidad: string;
  codigo: string;
  idEspecialidad: number;
  descripcionEspecialidad:string;
  costoUnitario: number;
}



export interface conceptoCreacionDTO{
  idProyecto: number;
  descripcion: string;
  unidad: string;
  codigo: string;
  idEspecialidad: number;
  costoUnitario: number;
}


export interface conceptoEdicionDTO{
  id: number;
  idProyecto: number;
  descripcion: string;
  unidad: string;
  codigo: string;
  idEspecialidad: number;
  costoUnitario: number;
}
