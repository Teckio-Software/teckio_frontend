import { RolDTO } from "../tsSeguridad";


export interface usuarioPorCorporativo{
  idCorporativo: number;
  idUsuario: number;
  idRol: number;
  idEmpresa: number;
  descripcion: string;
  esUsuarioCorporativo: boolean;
  estaEnEmpresa: boolean;
  estructura: usuarioPorCorporativo[];
}

export interface usuarioBaseDTO{
  id: number;
  idAspNetUser: string;
  nombreCompleto: string;
  apaterno: string;
  amaterno: string;
  nombreUsuario: string;
  correo: string;
  activo: boolean;
}

export interface usuarioCorporativoDTO extends usuarioBaseDTO {
  idCorporativo: number;
}

export interface usuarioProveedorDTO extends usuarioBaseDTO {
  rfc: string;
  identificadorFiscal: string;
  numeroProveedor: string;
}

export interface UsuarioEstructuraCorporativoDTO extends usuarioBaseDTO{
  idUsuario: number;
  nombreUsuario: string;
  esActivo: boolean;
}

export interface UsuarioEmpresaEstructura{
  idEmpresa: number;
  idRol: number;
  nombreEmpresa: string;
  activoEmpresa: boolean;
  roles: RolDTO[];
}

export interface usuarioUltimaSeccion{
  id: number;
  idProyecto: number;
  idEmpresa: number;
  idUsuario: number;
}
