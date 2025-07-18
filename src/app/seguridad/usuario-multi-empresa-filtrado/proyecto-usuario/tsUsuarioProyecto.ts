
export interface usuarioProyectoParametrosBusquedaDTO{
  idUsuario: number;
  idEmpresa: number;
}

export interface usuarioProyectoDTO{
  id: number;
  idUsuario: number;
  idEmpresa: number;
  idProyecto: number;
  nombreProyecto : string;
  estatus: boolean;
}
