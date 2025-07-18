import { AbstractControl, ValidatorFn } from "@angular/forms";


//#region Permisos
//Interfaz credenciales para entrar al software o para dar de alta un nuevo usuario
export interface CredencialesUsuarioDTO{
  //Correo electrónico de la cuenta
  email: string;
  //Contraseña de la cuenta
  password: string;
  //Identificador único del rol
  role: string;
}
//Esta interfaz es para obtener el token y la fecha de expiración
export interface RespuestaAutenticacionDTO{
  //Llave que nos permite entrar a un archivo
  token: string;
  //Fecha en la que expira el token
  fechaExpiracion: Date;
}
//Para mostrar los usuarios en pantalla
export interface UsuarioDTO{
  //Identificador del usuario
  id: string;
  //Correo del usuario
  Email: string;
  listaHijos: pantallaTablaAutorizarDTO[];
}
//Para mostrar los usuario con sus respectivos roles
export interface UsuarioConRoleDTO{
  //Identificador de la relación entre el usuario con el rol
  id: string;
  //Correo del usuario
  email: string;
  //Identificador del rol
  roleId: string;
  //Lista de los
  permisos: string[];
}
//Para mostrar los roles en pantalla
// export interface RoleDTO{
//   //Identificador único del rol
//   id: string;
//   //Nombre del rol
//   name: string;
//   //Aqui van los
//   permisos: string[];
// }
//Para mostrar los roles en pantalla
export interface RoleEditaNombreDTO{
  //Identificador único del rol
  id: string;
  //Nombre del rol
  name: string;
}
//Para mostrar los permisos por roles
export interface RolePermisoDTO{
  //Identificador de la relación
  id: string;
  //Identificador del role
  RoleId: string;
  //Tipo del claim
  ClaimType: string;
  //Valor del claim
  ClaimValue: string;
}
//Para la creación de un nuevo rol por medio de una
export interface roleCreacionDTO{
  descripcion: string;
  listaIdPantallas: number[];
}
export interface rolPermisoDTO{
  id: string;
  permiso: pantallaTablaAutorizarDTO;
}
//
export interface pantallaTablaDTO{
  idPantallaTabla: number;
  descripcion: string;
  codigoTabla: string;
  idPadre: number;
  listaHijos: pantallaTablaAutorizarDTO[];
}

export interface pantallaTablaAutorizarDTO extends pantallaTablaDTO{
  esAutorizado: boolean;
  esIndetermediate: boolean;
}

export interface reestablecerContraseniaDTO{
  idUsuario: string;
  nuevaContrasenia: string;
  nuevaContraseniaConfirma: string;
}
//#endregion

// export interface Rol {
//   id:number;
//   nombre:string;
//   idEmpresa: number;
//   listaIdPantallas: number[];
// }

export interface RolDTO {
  id: number;
  nombre: string;
}


export function zfPrimeraLetraMayuscula(): ValidatorFn{
  //función Lambda
  return (zvControl: AbstractControl) => {
      const vValor = <string> zvControl.value;
      if (!vValor){
          return null;
      }

      if (vValor.length === 0) return null;

      const zvPrimeraLetra = vValor[0];
      if (zvPrimeraLetra !== zvPrimeraLetra.toUpperCase()){
          return {
              zvPrimeraLetraMayuscula: {
                  vMensaje: 'La primera letra debe ser mayúscula'
              }
          }
      }
      return null;
  }
}

export function zfContraseniaFormatoCorrecto(): ValidatorFn{
  //función Lambda
  return (zvControl: AbstractControl) => {
      const vValor = <string> zvControl.value;
      if (!vValor){
          return null;
      }

      if (vValor.length === 0) return null;
      var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

      if (!regex.test(vValor)){
          return {
              zvFormatoPassword: {
                  vMensaje: 'Debe contener mayúsculas, minúsculas, números y carácteres especiales'
              }
          }
      }
      return null;
  }
}
