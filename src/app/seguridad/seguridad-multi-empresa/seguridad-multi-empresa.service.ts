import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { MenuEstructuraDTO, autorizacionMenu } from '../menusXEmpresa/tsMenu';
import { RolMenuEstructuraDTO } from '../rol-multi-empresa/tsRolMultiEmpresa';
import { UsuarioRolMenuEstructuraDTO, corporativo, empresaConRoles } from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO } from '../tsSeguridad';

@Injectable({
  providedIn: 'root'
})
export class SeguridadMultiEmpresaService {
  //Importamos la Clase HttpClient para emitir los tipo de peticiones post, put, delete y get
  constructor(private httpClient: HttpClient) { }
  //Url de la api a la que vamos a acceder
  zvApiUrl = environment.ssoApi + 'cuenta';
  //Campo para acceder al token en el local storage
  private readonly zvLlaveToken = 'token';
  //Campo para acceder a la fecha de expiración del token
  private readonly zvLlaveExpiracion = 'token-expiracion';
  //Campo para acceder al rol del token
  private readonly zvCampoRol = 'role';
  //Para saber si un usuario esta logueado
  private readonly isLoggedIn = new BehaviorSubject<boolean>(true);
  //Para saber si un usuario no esta logueado
  private readonly isLoggedOut = new BehaviorSubject<boolean>(false);
  router = inject(Router);
  //Método para saber si un usuario esta logueado (de tipo observable)
  zfEstaLogueado(): Observable<boolean> {
    const zvToken = localStorage.getItem(this.zvLlaveToken);
    if (!zvToken) {
      return this.isLoggedOut;
    }
    const fechaExpiracion = localStorage.getItem(this.zvLlaveExpiracion);
    const zvExpiracionFecha = new Date(fechaExpiracion || "");
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
    const zvExpiracionFecha = new Date(fechaExpiracion || "");
    if (zvExpiracionFecha <= new Date()) {
      this.zfLogOut();
      return false;
    }
    return true;
  }
  private _refresh$ = new Subject<void>();
  get refresh$(){
    return this._refresh$;
  }
  zfLogin(zCredenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.httpClient.post<RespuestaAutenticacionDTO>(this.zvApiUrl + '/login', zCredenciales)
      // .pipe(tap(() => {
      //   this._refresh$.next();
      // }))
      ;
  }

  actualizarClaims(): Observable<RespuestaAutenticacionDTO> {
    return this.httpClient.get<RespuestaAutenticacionDTO>(this.zvApiUrl + '/actualizarClaims')
  }

  zfGuardarToken(zRespuestaAutenticacionDTO: RespuestaAutenticacionDTO) {
    localStorage.setItem(this.zvLlaveToken, zRespuestaAutenticacionDTO.token);
    localStorage.setItem(this.zvLlaveExpiracion, zRespuestaAutenticacionDTO.fechaExpiracion!.toString());
  }
  respuestaFront(zCredenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.httpClient.post<RespuestaAutenticacionDTO>(this.zvApiUrl + '/RespuestaFront', zCredenciales)
      .pipe(tap(() => {
        this._refresh$.next();
      }));
  }
  //#region ServiciosEstructura
    //Obtiene la relación de los servicios dados de alta con los servicios contratados por la empresa
    obtenMenuEstructura(idEmpresa: number): Observable<MenuEstructuraDTO[]> {
      return this.httpClient.get<MenuEstructuraDTO[]>(`${this.zvApiUrl}/menusActivosEstructura/${idEmpresa}`);
    }
  //#endregion

  //#region autorizaMenusAEmpresa
    //Para dar de alta un menu en una empresa
    autorizaMenu(autorizacionMenu: autorizacionMenu): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/autorizaMenu', autorizacionMenu);
    }
  //#endregion










  //#region VistasRolesYUsuariosPermisos

  //Para la parte de los usuariosMultiEmpresa (filtrado)
  //Obtiene la estructura de los permisos que puede tener un usuario respecto a su rol
  obtenUsuarioMenuEstructura(idEmpresa: number): Observable<UsuarioRolMenuEstructuraDTO[]> {
    return this.httpClient.get<UsuarioRolMenuEstructuraDTO[]>(`${this.zvApiUrl}/usuariosEstructuraXEmpresa/${idEmpresa}`);
  }
  //Para la parte de los usuarios multi empresa (filtrado)
  //Obtiene la estructura de los permisos que puede tener un usuario respecto a su rol
  // obtenUsuarioRolMenuEstructura(idEmpresa: number): Observable<UsuarioRolMenuEstructuraDTO[]> {
  //   return this.httpClient.get<UsuarioRolMenuEstructuraDTO[]>(`${this.zvApiUrl}/usuariosEstructuraPorRolXEmpresa/${idEmpresa}`);
  // }
  //#endregion




  //#region empresasRol
  obtenEmpresasConRolesPorCorporativo(idCorporativo: number): Observable<empresaConRoles[]> {
    return this.httpClient.get<empresaConRoles[]>(`${this.zvApiUrl}/empresasConRolPorCorporativo/${idCorporativo}`);
  }

  obtenCorporativos(): Observable<corporativo[]> {
    return this.httpClient.get<corporativo[]>(`${this.zvApiUrl}/obtenCorporativos`);
  }
  //#endregion










  //Para desloguearte en el software
  zfLogOut(){
    localStorage.removeItem(this.zvLlaveToken);
    localStorage.removeItem(this.zvLlaveExpiracion);
    this.router.navigate(['login']);
  }

}
