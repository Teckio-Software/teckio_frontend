import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { autorizacionMenu, MenuEstructuraDTO } from '../menusXEmpresa/tsMenu';

@Injectable({
  providedIn: 'root'
})
export class MenusXEmpresaService {
  zvApiUrl = environment.ssoApi + 'menusXEmpresa';
  constructor(private httpClient: HttpClient) { }
  //#region ServiciosEstructura
    //Obtiene la relación de los servicios dados de alta con los servicios contratados por la empresa
    obtenMenuEstructura(idEmpresa: number): Observable<MenuEstructuraDTO[]> {
      return this.httpClient.get<MenuEstructuraDTO[]>(`${this.zvApiUrl}/menusActivosEstructura/${idEmpresa}`);
    }
  //#endregion

  //#region autorizaMenusAEmpresa
    //Para dar de alta un menu en una empresa
    autorizaMenu(autorizacionMenu: autorizacionMenu): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/activaMenuAEmpresa', autorizacionMenu);
    }
    desautorizaMenu(autorizacionMenu: autorizacionMenu): Observable<any> {
      return this.httpClient.post(this.zvApiUrl + '/desactivaMenuAEmpresa', autorizacionMenu);
    }
  //#endregion
}
