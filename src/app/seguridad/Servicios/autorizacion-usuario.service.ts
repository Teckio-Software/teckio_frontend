import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CambiaPermisoActividad, CambiaPermisoSeccion } from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionUsuarioService {
  zvApiUrl = environment.ssoApi + 'UsuarioSeccion';
  constructor(private httpClient: HttpClient) { }
  //#region autorizaPermisosAUsuario
    //Para darle autorización a un usuario sobre una sección (las secciones son solo vistas) (esta parte es de permisos especiales)
    autorizaSeccionAUsuario(autorizacionSeccion: CambiaPermisoSeccion): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/asignarPermisoSeccionAUsuario', autorizacionSeccion);
    }
    //Para darle autorización a un usuario sobre una actividad en específico
    autorizaActividadAUsuario(autorizacionActividad: CambiaPermisoActividad): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/asignarPermisoActividadAUsuario', autorizacionActividad);
    }
  //#endregion

  //#region autorizaPermisosAUsuario
    //Para darle autorización a un usuario sobre una sección (las secciones son solo vistas) (esta parte es de permisos especiales)
    quitarAutorizacionSeccionAUsuario(autorizacionSeccion: CambiaPermisoSeccion): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/quitarPermisoSeccionAUsuario', autorizacionSeccion);
    }
    //Para darle autorización a un usuario sobre una actividad en específico
    quitarAutorizacionActividadAUsuario(autorizacionActividad: CambiaPermisoActividad): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/quitarPermisoActividadAUsuario', autorizacionActividad);
    }
  //#endregion
}
