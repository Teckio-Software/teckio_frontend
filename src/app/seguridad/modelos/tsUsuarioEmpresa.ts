import { usuarioBaseDTO } from "../seguridad-multi-empresa/tsSeguridadMultiEmpresa";

export interface usuarioCreacionDTO{
  nombreCompleto: string;
  apaterno: string;
  amaterno: string;
  nombreUsuario: string;
  correo: string;
  password: string;
}

export interface usuarioCreacionDTO2{
  nombreCompleto: string;
  aPaterno: string;
  aMaterno: string;
  nombreUsuario: string;
  correo: string;
  password: string;
}

export interface UsuarioEmpresaCreacionDTO extends usuarioCreacionDTO{
  idRol: number;
  listaIdEmpresas: number[];
}

export interface UsuarioProveedorCreacionDTO extends usuarioCreacionDTO{
  rfc: string;
  numeroProveedor: string;
  identificadorFiscal: string;
}

export interface UsuarioProveedorSimple extends usuarioBaseDTO{
  idUser: string;
  rfc: string;
  identificadorFiscal: string;
  numeroProveedor: string
}


export interface UsuarioProveedorMultiEmpresa extends UsuarioEmpresaCreacionDTO{
  rfc: string;
  numeroProveedor: string;
  identificadorFiscal: string;
}

export interface UsuarioGastosMultiEmpresa extends UsuarioEmpresaCreacionDTO{
  seguroSocial: string;
  rfc: string;
  curp: string;
  codigoPostal: string;
  numeroEmpleado: string;
  numeroEmpleadoSAP:string;
  fechaRelacionLaboral: Date | null;
  salarioDiario: number;
  claveContrato: number;
  claveRegimen: number;
  claveJornada: number;
  claveRiesgoPuesto: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  estatus: number;
}


export interface UsuarioCorporativoCreacionDTO extends usuarioCreacionDTO{
  idCorporativo: number;
}
