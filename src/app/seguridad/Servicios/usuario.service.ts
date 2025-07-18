import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { asignarRolAUsuarioEnEmpresaPorPoryectoDTO, cambiaPermisoRolXEmpresa, rolProyectoEmpresaUsuarioDTO, usuarioRolCreacionEnEmpresaDTO } from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { UsuarioEstructuraCorporativoDTO, usuarioBaseDTO } from '../seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { reestablecerContraseniaDTO } from '../tsSeguridad';
import { usuarioCreacionDTO2 } from '../modelos/tsUsuarioEmpresa';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  zvApiUrl = environment.ssoApi + 'usuario';
  constructor(private httpClient: HttpClient) { }

  //#region Usuario
  // creaUsuarioMultiEmpresa(usuarioNuevo: usuarioRolCreacionEnEmpresaDTO) {
  //   return this.httpClient.post(`${this.zvApiUrl}/creaUsuarioEnVariasEmpresasSimple`, usuarioNuevo);
  // }
  creaUsuarioBase(usuarioNuevo: usuarioCreacionDTO2) {
    return this.httpClient.post<RespuestaDTO>(`${this.zvApiUrl}/creaUsuarioBase`, usuarioNuevo);
  }
  obtenTipoUsuario(idUsuario: number){
    return this.httpClient.get<RespuestaDTO>(`${this.zvApiUrl}/obtenTipoUsuario/${idUsuario}`);
  }
  guardarInfoUsuario(parametro: usuarioBaseDTO){
    return this.httpClient.post<RespuestaDTO>(`${this.zvApiUrl}/actualizaInfoUsuario`, parametro);
  }
  //#endregion
  cambiaPermisoRolAUsuario(rol: cambiaPermisoRolXEmpresa): Observable<any> {
    return this.httpClient.post(`${this.zvApiUrl}/cambiarPermisosUsuarioXPerfil`, rol);
  }
  obtenUsuarioPorCorporativo(idCorporativo: number): Observable<UsuarioEstructuraCorporativoDTO[]> {
    return this.httpClient.get<UsuarioEstructuraCorporativoDTO[]>(`${this.zvApiUrl}/usuariosEstructuraPorRolXEmpresa/${idCorporativo}`);
  }
  activaUsuario(idUsuario: number) {
    return this.httpClient.post(`${this.zvApiUrl}/activaUsuario/${idUsuario}`, {});
  }
  desactivaUsuario(idUsuario: number){
    return this.httpClient.post(`${this.zvApiUrl}/desactivaUsuario/${idUsuario}`, {});
  }
  ReestableceContraseniaUsuario(usuarioContrasenia: reestablecerContraseniaDTO): Observable<RespuestaDTO>{
    return this.httpClient.post<RespuestaDTO>(`${this.zvApiUrl}/reestableceContrasenia`, usuarioContrasenia);
  }

  asignarRolesPorProyecto(registro: asignarRolAUsuarioEnEmpresaPorPoryectoDTO): Observable<any>{
    return this.httpClient.post<RespuestaDTO>(`${this.zvApiUrl}/AsignarRolesPorProyecto`, registro);
  }

  obtenerRolesPorProyectoPorUsuario(registro: asignarRolAUsuarioEnEmpresaPorPoryectoDTO){
    return this.httpClient.post<rolProyectoEmpresaUsuarioDTO[]>(`${this.zvApiUrl}/obtenerRelacionesRolProyectoUsuario`, registro);
  }
}
