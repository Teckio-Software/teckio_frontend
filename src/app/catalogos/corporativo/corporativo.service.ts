import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from 'src/app/utilidades/tsUtilidades';
import { environment } from 'src/environments/environment.development';
import { Corporativo } from '../empresas/empresa';
import { corporativo } from 'src/app/seguridad/usuario-multi-empresa/tsUsuarioMultiEmpresa';

@Injectable({
  providedIn: 'root'
})
export class CorporativoService {

  private urlApi:string = environment.ssoApi + "Corporativo/";
  constructor(private http:HttpClient) { }

  lista():Observable<corporativo[]>{
    return this.http.get<corporativo[]>(`${this.urlApi}Lista`)
  }

  guardar(request:Corporativo):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`,request)
  }

  editar(request:Corporativo):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`,request)
  }

  eliminar(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
