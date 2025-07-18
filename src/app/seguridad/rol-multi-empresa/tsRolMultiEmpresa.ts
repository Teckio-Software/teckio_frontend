

export interface rolMenuDTO{
  id: number;
  idMenu: number;
  menuDescripcion: string;
  idRol: number;
  rolDescripcion: string;
}

export interface rolMenuSeccionDTO{
  id: number;
  idRolMenu: number;
  idSeccion: number;
  seccionDescripcion: string;
}

export interface rolMenuSeccionActividadDTO{
  id: number;
  idRolMenuSeccion: number;
  idActividades: number;
  actividadDescripcion: string;
}


export interface RolMenuEstructuraDTO{
  idRol: number;
  idMenu: number;
  idSeccion: number;
  idActividad: number;
  //1 = menú, 2 = sección, 3 = actividad
  tipoMenu: number;
  descripcion: string;
  estructura: RolMenuEstructuraDTO[];
  esActivo: boolean;
  esAutorizado: boolean;
}


export interface RolCreacionEnEmpresaDTO{
  nombre: string;
  idEmpresa: number;
}

export interface autorizaSeccionARolDTO{
  idRol: number;
  idSeccion: number;
}

export interface autorizaActividadARolDTO{
  idRol: number;
  idMenu: number;
  idSeccion: number;
  idActividad: number;
}
