import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { RolMenuEstructuraDTO, autorizaActividadARolDTO, autorizaSeccionARolDTO } from '../rol-multi-empresa/tsRolMultiEmpresa';

@Injectable({
  providedIn: 'root'
})
export class AutorizacionRolService {
  zvApiUrl = environment.ssoApi + 'rol';
  constructor(private httpClient: HttpClient) { }
  //#region autorizaPermisosARol
    //Para darle autorización a un rol sobre una sección en específico (las secciones son solo vistas)
    autorizaSeccionARol(autorizacionSeccion: autorizaSeccionARolDTO): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/autorizaSeccionARol', autorizacionSeccion);
    }
    //Para darle autorización a un rol sobre una actividad en específico
    autorizaActividadARol(autorizacionActividad: autorizaActividadARolDTO): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/autorizaActividadARol', autorizacionActividad);
    }
  //#endregion

  //#region quitarPermisosARol
    //Para darle autorización a un usuario sobre una sección (las secciones son solo vistas) (esta parte es de permisos especiales)
    quitarAutorizacionSeccionARol(autorizacionSeccion: RolMenuEstructuraDTO): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/quitarPermisoSeccionARol', autorizacionSeccion);
    }
    //Para darle autorización a un usuario sobre una actividad en específico
    quitarAutorizacionActividadARol(autorizacionActividad: RolMenuEstructuraDTO): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/quitarPermisoActividadARol', autorizacionActividad);
    }
  //#endregion
}
