import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import {
  CredencialesUsuarioDTO,
  RespuestaAutenticacionDTO,
  RolDTO,
  RoleEditaNombreDTO,
  UsuarioConRoleDTO,
  UsuarioDTO,
  pantallaTablaAutorizarDTO,
  reestablecerContraseniaDTO,
  rolPermisoDTO,
  roleCreacionDTO,
} from './tsSeguridad';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmpresaDTO } from '../catalogos/empresas/empresa';

@Injectable({
  providedIn: 'root',
})
export class SeguridadService {
  //Importamos la Clase HttpClient para emitir los tipo de peticiones post, put, delete y get
  constructor(private httpClient: HttpClient) {}
  //Url de la api a la que vamos a acceder
  zvApiUrl = environment.ssoApi + 'cuentas';
  //Campo para acceder al token en el local storage
  private readonly zvLlaveToken = 'token';
  private readonly empresasLocal = 'empresas';
  private readonly idEmpresa = 'idEmpresa';
  private readonly idProyecto = 'idProyecto';
  //Campo para acceder a la fecha de expiración del token
  private readonly zvLlaveExpiracion = 'token-expiracion';
  //Campo para acceder al rol del token
  private readonly zvCampoRol = 'role';
  private readonly zvCampoRequisicion = 'Requisición';
  //Para saber si un usuario esta logueado
  private readonly isLoggedIn = new BehaviorSubject<boolean>(true);
  //Para saber si un usuario no esta logueado
  private readonly isLoggedOut = new BehaviorSubject<boolean>(false);
  router = inject(Router);
  recargar: number = 0;
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  public token$ = this.tokenSubject.asObservable();
  //Método para saber si un usuario esta logueado (de tipo observable)
  zfEstaLogueado(): Observable<boolean> {
    const zvToken = localStorage.getItem(this.zvLlaveToken);
    if (!zvToken) {
      return this.isLoggedOut;
    }
    const fechaExpiracion = localStorage.getItem(this.zvLlaveExpiracion);
    const zvExpiracionFecha = new Date(fechaExpiracion || '');
    if (zvExpiracionFecha <= new Date()) {
      this.zfLogOut();
      return this.isLoggedOut;
    }
    return this.isLoggedIn;
  }
  //Método para saber si un usuario esta logueado (de tipo boolean )
  zfEstaLogueadoBoolean(): boolean {
    const zvToken = localStorage.getItem(this.zvLlaveToken);
    if (!zvToken) {
      return false;
    }
    const fechaExpiracion = localStorage.getItem(this.zvLlaveExpiracion);
    const zvExpiracionFecha = new Date(fechaExpiracion || '');
    if (zvExpiracionFecha <= new Date()) {
      this.zfLogOut();
      return false;
    }
    return true;
  }

  //#region Pantallas
  //Obtiene las pantallas para que los roles tengas acceso a los
  zfObtenerPantallas(): Observable<pantallaTablaAutorizarDTO[]> {
    return this.httpClient.get<pantallaTablaAutorizarDTO[]>(
      `${this.zvApiUrl}/pantallas`
    );
  }
  zfObtenerPantallasTreeNode(): Observable<pantallaTablaAutorizarDTO[]> {
    return this.httpClient.get<pantallaTablaAutorizarDTO[]>(
      `${this.zvApiUrl}/pantallasTreeNode`
    );
  }
  //#endregion

  //#region Roles
  //Obtiene un listado de roles
  // zfObtenerRoles(pagina: number, recordsPorPagina: number): Observable<any> {
  //   let params = new HttpParams();
  //   params = params.append('pagina', pagina.toString());
  //   params = params.append('recordsPorPagina', recordsPorPagina.toString());
  //   return this.httpClient.get<RoleDTO[]>(`${this.zvApiUrl}/listadoRoles`, {observe: 'response', params});
  // }
  //Método para obtener un listado de roles
  zfObtenerRolesSinPaginar(): Observable<any> {
    return this.httpClient.get<RolDTO[]>(
      `${this.zvApiUrl}/listadoRolesSinPaginar`
    );
  }
  //Método para obtener un listado de roles con sus permisos
  obtenerRolesTreeNodePaginado(
    pagina: number,
    recordsPorPagina: number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', recordsPorPagina.toString());
    return this.httpClient.get<RolDTO[]>(
      `${this.zvApiUrl}/listadoRolesTreeNode`,
      { observe: 'response', params }
    );
  }
  //Obtiene las pantallas para que los roles tengas acceso a los
  zfObtenerPantallasXRol(
    zRol: string
  ): Observable<pantallaTablaAutorizarDTO[]> {
    return this.httpClient.get<pantallaTablaAutorizarDTO[]>(
      `${this.zvApiUrl}/pantallasxrol/${zRol}`
    );
  }
  //Este es para crear un rol con los accesos a las pantallas
  zfCrearRole(rolCreacion: roleCreacionDTO) {
    return this.httpClient.post(this.zvApiUrl + '/crearRole', rolCreacion);
  }
  //Este es para editar un rol con los accesos a las pantallas
  zfEditarRole(roleId: string, rolCreacion: roleCreacionDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/editarRole/${roleId}`,
      rolCreacion
    );
  }
  editarNombreRol(rol: RoleEditaNombreDTO) {
    return this.httpClient.post(`${this.zvApiUrl}/editarNombreRol`, rol);
  }
  //Método para obtener los Permisos de los roles //Revisar
  zfObtenerRolePermiso(
    pagina: number,
    recordsPorPagina: number,
    idRole: string
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', recordsPorPagina.toString());
    return this.httpClient.get<RolDTO>(
      `${this.zvApiUrl}/listadoRolesPermisos/${idRole}`,
      { observe: 'response', params }
    );
  }
  //Para asignar o quitar los permisos de un rol
  asignaQuitaPermisoARol(rolPermiso: rolPermisoDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/asignarPermisoRole`,
      rolPermiso
    );
  }
  //Para asignar o quitar los permisos de un rol
  reestablecerPermisosRol(rolPermiso: RolDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/reestablecerPermisosRol`,
      rolPermiso
    );
  }
  //Para asignar o quitar los permisos de un rol
  crearRolPermisos(rolPermiso: RolDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/crearRolePermisosCodigos`,
      rolPermiso
    );
  }
  //#endregion

  //#region Usuarios
  //Hace una petición get que captura el objeto de tipo "UsuarioDTO"
  zfObtenerUsuarios(pagina: number, recordsPorPagina: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', recordsPorPagina.toString());
    return this.httpClient.get<UsuarioDTO>(`${this.zvApiUrl}/listadoUsuarios`, {
      observe: 'response',
      params,
    });
  }
  //Obtiene los usuario con su listado,
  zfObtenerUsersConRoles(
    pagina: number,
    recordsPorPagina: number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', recordsPorPagina.toString());
    return this.httpClient.get<UsuarioConRoleDTO[]>(
      `${this.zvApiUrl}/listadoUsuarioRole`,
      { observe: 'response', params }
    );
  }
  //Reestablece la contraseña por el id del usuario
  zfReestablecerContrasenia(contrasenia: reestablecerContraseniaDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/reestableceContrasenia`,
      contrasenia
    );
  }
  //Crea un usuario con su rol (asigna los claims al usuario con )
  crearUsuarioConRol(credenciales: CredencialesUsuarioDTO) {
    return this.httpClient.post<RespuestaAutenticacionDTO>(
      `${this.zvApiUrl}/crearUsuarioConRol`,
      credenciales
    );
  }
  //Obtiene un usuario por su id
  zfActualizarUsuario(usuario: UsuarioConRoleDTO) {
    return this.httpClient.put(`${this.zvApiUrl}/editarCorreoUsuario`, usuario);
  }
  //Para loguearte en el software
  zfLogin(
    zCredenciales: CredencialesUsuarioDTO
  ): Observable<RespuestaAutenticacionDTO> {
    return this.httpClient.post<RespuestaAutenticacionDTO>(
      this.zvApiUrl + '/login',
      zCredenciales
    );
  }
  //Obtiene un usuario por su id
  zfBorrarUsuario(idUsuario: string) {
    return this.httpClient.delete(
      `${this.zvApiUrl}/borrarUsuario/${idUsuario}`
    );
  }
  //Para asignar o eliminar un rol dentro
  cambiarPermisosUsuarioXPerfil(usuario: UsuarioConRoleDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/cambiarPermisosUsuarioXPerfil`,
      usuario
    );
  }
  //Para asignar o eliminar un rol dentro
  reestablecerPermisosUsuario(usuario: UsuarioConRoleDTO) {
    return this.httpClient.post(
      `${this.zvApiUrl}/reestablecerPermisosUsuario`,
      usuario
    );
  }
  //#endregion

  //#region JWT
  //Obtiene el valor de un campo especifíco
  zfObtenerCampoJwt(zCampo: string): string {
    const zvToken = localStorage.getItem(this.zvLlaveToken);
    if (!zvToken) {
      return '';
    }
    var zvDataToken = JSON.parse(window.atob(zvToken.split('.')[1]));
    this.recargar = this.recargar + 1;
    return zvDataToken[zCampo];
  }
  //Guarda el token en el local storage
  zfGuardarToken(zRespuestaAutenticacionDTO: RespuestaAutenticacionDTO) {
    localStorage.setItem(this.zvLlaveToken, zRespuestaAutenticacionDTO.token);
    localStorage.setItem(
      this.zvLlaveExpiracion,
      zRespuestaAutenticacionDTO.fechaExpiracion!.toString()
    );
  }
  // guardarEmpresas(empresas: Empresa1[]){
  //   localStorage.setItem(this.empresasLocal, empresas);
  // }
  //Obtiene el token del local storage
  zfObtenerToken() {
    return localStorage.getItem(this.zvLlaveToken);
  }
  //Para desloguearte en el software
  zfLogOut() {
    localStorage.removeItem(this.zvLlaveToken);
    localStorage.removeItem(this.zvLlaveExpiracion);
    localStorage.removeItem(this.idEmpresa);
    localStorage.removeItem(this.idProyecto);
    this.router.navigate(['login']);
  }

  zNewClaims() {
    localStorage.removeItem(this.zvLlaveToken);
    localStorage.removeItem(this.zvLlaveExpiracion);
  }
  //Obtiene el rol del JWT
  zfObtenerRol(): string {
    return this.zfObtenerCampoJwt(this.zvCampoRol);
  }
  //#endregion

  //Obtiene los permisos por pantalla
  zfObtenerPermisoEspecialPantalla(zValor: string): string {
    return this.zfObtenerCampoJwt(zValor);
  }

  //Método para asignar el rol de administrador a un usuario
  zfHacerAdmin(zIdUsuario: string) {
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.httpClient.post(
      `${this.zvApiUrl}/hacerAdmin`,
      JSON.stringify(zIdUsuario),
      { headers }
    );
  }
  //Método para remover el rol de administrador a un usuario
  zfRemoverAdmin(zIdUsuario: string) {
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.httpClient.post(
      `${this.zvApiUrl}/removerAdmin`,
      JSON.stringify(zIdUsuario),
      { headers }
    );
  }

  guardaIdEmpresaLocalStorage(idEmpresa: number) {
    localStorage.setItem(this.idEmpresa, idEmpresa.toString());
  }

  guardarIdProyectoLocalStorage(idProyecto: number) {
    localStorage.setItem(this.idProyecto, idProyecto.toString());
  }

  obtenIdEmpresaLocalStorage() {
    return localStorage.getItem(this.idEmpresa);
  }

  obtenerIdProyectoLocalStorage() {
    return localStorage.getItem(this.idProyecto);
  }
  obtenerProyectos() {
    return this.httpClient.get<EmpresaDTO[]>(
      `${this.zvApiUrl}/obtenerEmpresas`
    );
  }

  obtenerSeccionesUsuario(): string[] {
    const token = this.tokenSubject.getValue() ?? '';

    if (!token) {
      return [];
    }
    const payload: Record<string, any> = JSON.parse(atob(token.split('.')[1]));
    const secciones = Object.keys(payload).filter((key) =>
      key.startsWith('Seccion')
    );
    const permisosSecciones = secciones.map((key) => key);

    if (payload['role']) {
      permisosSecciones.push(payload['role']);
    }
    return permisosSecciones;
  }

  actualizarToken(nuevoToken: string) {
    localStorage.setItem('token', nuevoToken);
    this.tokenSubject.next(nuevoToken);
  }
}
