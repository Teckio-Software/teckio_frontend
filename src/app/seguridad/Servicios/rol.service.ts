import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { autorizaActividadARolDTO, autorizaSeccionARolDTO, RolCreacionEnEmpresaDTO, RolMenuEstructuraDTO } from '../rol-multi-empresa/tsRolMultiEmpresa';
import { rolesPorEmpresa } from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { RolDTO } from '../tsSeguridad';
import { ResponseApi } from 'src/app/utilidades/tsUtilidades';
import { MenuDTO } from '../modelos/tsMenu';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  zvApiUrl = environment.ssoApi + 'rol';
  constructor(private httpClient: HttpClient) { }

  //Para registrar un rol en una empresa (multiEmpresa)
  crearRoleEnEmpresa(rolCreacion: RolCreacionEnEmpresaDTO): Observable<any> {
    return this.httpClient.post<ResponseApi>(this.zvApiUrl + '/CrearRol', rolCreacion);
  }

  obtenRolesXEmpresa(idEmpresa: number): Observable<RolDTO[]>{
    return this.httpClient.get<RolDTO[]>(`${this.zvApiUrl}/obtenRolesXEmpresa/${idEmpresa}`);
  }

  //#region editarRol
  editarNombreRol(rol: rolesPorEmpresa) {
    return this.httpClient.post(`${this.zvApiUrl}/editarNombreRol`, rol);
  }

  obtenSeccionesPorRol(idRol: number, idMenu: number): Observable<RolMenuEstructuraDTO[]> {
    return this.httpClient.get<RolMenuEstructuraDTO[]>(`${this.zvApiUrl}/rolSeccionEstructura/${idRol}/${idMenu}`);
  }

  obtenActividadesPorRol(idRol: number, idSeccion: number): Observable<RolMenuEstructuraDTO[]> {
    return this.httpClient.get<RolMenuEstructuraDTO[]>(`${this.zvApiUrl}/rolActividadEstructura/${idRol}/${idSeccion}`);
  }
  obtenMenusXEmpresa(idEmpresa: number): Observable<MenuDTO[]> {
    return this.httpClient.get<MenuDTO[]>(`${this.zvApiUrl}/ObtenMenusXIdEmpresa/${idEmpresa}`);
  }

  eliminar(id: number): Observable<ResponseApi> {
    return this.httpClient.delete<ResponseApi>(`${this.zvApiUrl}Eliminar/${id}`);
  }

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
