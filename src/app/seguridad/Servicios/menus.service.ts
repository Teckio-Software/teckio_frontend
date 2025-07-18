import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ActividadDTO, SeccionDTO } from '../menusXEmpresa/tsMenu';
import { MenuDTO } from '../modelos/tsMenu';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  //Importamos la Clase HttpClient para emitir los tipo de peticiones post, put, delete y get
  constructor(private httpClient: HttpClient) { }
  //Url de la api a la que vamos a acceder
  zvApiUrl = environment.ssoApi + 'servicios';
  //#region consultaMenus
    //Para consultar solo los menus que estan dados de alta en la empresa
    // obtenMenusXIdEmpresa(idEmpresa: number): Observable<MenuDTO[]> {
    //   return this.httpClient.get<MenuDTO[]>(`${this.zvApiUrl}/menu/${idEmpresa}`);
    // }
    //Para consultar las secciones que estan dadas de alta en la empresa filtradas por menu
    // obtenSeccionXIdMenu(idMenu: number): Observable<SeccionDTO[]> {
    //   return this.httpClient.get<SeccionDTO[]>(`${this.zvApiUrl}/seccion/${idMenu}`);
    // }
    //Para consultar las actividades que estan dadas de alta en la empresa filtradas por sección
    obtenActividadesXIdSeccion(idSeccion: number): Observable<ActividadDTO[]> {
      return this.httpClient.get<ActividadDTO[]>(`${this.zvApiUrl}/actividad/${idSeccion}`);
    }
    //Para obtener la estructura de los menus, secciones y actividades
    obtenMenus(): Observable<MenuDTO[]> {
      return this.httpClient.get<MenuDTO[]>(`${this.zvApiUrl}/ObtenMenus`);
    }
  //#endregion
}
