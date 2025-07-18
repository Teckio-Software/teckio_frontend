


export interface UsuarioRolMenuDTO{
  id: number;
  idUsuario: number;
  idMenu: number;
  idRolMenu: number;
  esActivo: boolean;
  listaUsuarioRolMenuSecciones: UsuarioRolMenuSeccionDTO[];
}

export interface UsuarioRolMenuSeccionDTO{
  id: number;
  idUsuario: number;
  idSeccion: number;
  idRolMenuSeccion: number;
  esActivo: boolean;
  listaUsuarioRolMenuSeccionActividades: UsuarioRolMenuSeccionActividadDTO[];
}

export interface UsuarioRolMenuSeccionActividadDTO{
  id: number;
  idUsuario: number;
  idActividad: number;
  idRolMenuSeccionActividades: number;
  esActivo: boolean;
}

export interface UsuarioRolMenuEstructuraDTO{
  idUsuario: number;
  idEmpresa: number;
  idRol: number;
  idMenu: number;
  idSeccion: number;
  idActividad: number;
  tipoMenu: number;
  descripcion: string;
  esActivo: boolean;
  estructura: UsuarioRolMenuEstructuraDTO[];
}

export interface cambiaPermisoRolXEmpresa{
  idUsuario: number;
  idRol: number;
  idEmpresa: number;
}

export interface asignarRolAUsuarioEnEmpresaPorPoryectoDTO extends cambiaPermisoRolXEmpresa {
  idProyecto: number;
}

export interface rolProyectoEmpresaUsuarioDTO{
  id: number;
  idUsuario: number;
  idRol: number;
  descripcionRol : string;
  idEmpresa: number;
  idProyecto: number;
  estatus: boolean;
}

export interface UsuarioCreacionMultiEmpresaDTO{
  listaIdRoles: number[];
}

// export interface usuarioEnEmpresa{
//   id: number;
//   nombreCompleto: string;
//   nombreUsuario: string;
//   correo: string;
//   rfc: string;
//   esActivo: boolean;
//   idEmpresa: number;
//   idRol: number;
//   rolDescripcion: string;
//   idAspNetUser: string;
//   numeroProveedor: string;
//   identificadorFiscal: string;
// }

export interface UsuarioMenuDTO{
  id: number;
  idUsuario: number;
  idMenu: number;
  idRolMenu: number;
  esActivo: boolean;
  listaUsuarioRolMenuSecciones: UsuarioMenuSeccionDTO[];
}

export interface UsuarioMenuSeccionDTO{
  id: number;
  idUsuario: number;
  idSeccion: number;
  idRolMenuSeccion: number;
  esActivo: boolean;
  listaUsuarioRolMenuSeccionActividades: UsuarioMenuSeccionActividadDTO[];
}

export interface UsuarioMenuSeccionActividadDTO{
  id: number;
  idUsuario: number;
  idActividad: number;
  idRolMenuSeccionActividades: number;
  esActivo: boolean;
}

export interface UsuarioMenuEstructuraDTO{
  idUsuario: number;
  idEmpresa: number;
  idRol: number;
  idMenu: number;
  idSeccion: number;
  idActividad: number;
  tipoMenu: number;
  descripcion: string;
  esActivo: boolean;
  estructura: UsuarioRolMenuEstructuraDTO[];
}


export interface empresaConRoles{
  idEmpresa: number;
  descripcionEmpresa: string;
  listaRoles: rolesPorEmpresa[];
}

export interface rolesPorEmpresa{
  idRol: number;
  descripcionRol: string;
}

export interface corporativo{
  id: number;
  nombre: string;
  estatus: number;
}

export interface usuarioRolCreacionEnEmpresaDTO{
  nombreCompleto: string;
  nombreUsuario: string;
  correo: string;
  password: string;
  rfc: string;
  esActivo: boolean;
  idAspNetUser: string;
  idRol: number;
  numeroProveedor: string;
  identificadorFiscal: string;
  listaIdEmpresas: number[];
}

export interface CambiaPermisoSeccion{
  idEmpresa: number;
  idUsuario: number;
  idSeccion: number;
}

export interface CambiaPermisoActividad{
  idEmpresa: number;
  idUsuario: number;
  idActividad: number;
}
