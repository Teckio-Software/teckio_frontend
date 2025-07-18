import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi, RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { environment } from 'src/environments/environment.development';
import { OrdenCompraWS } from './tsOrdenCompra';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraWsUtilidadesService {

  private urlApi:string = environment.apiURL + "OrdenCompraWS/";
  private zvUrlApi: string = environment.apiURL + "MisFacturas/";

  constructor(private http:HttpClient) { }

  obtenerOC(Orden:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}ObtenerOC/${Orden}`)
  }
  ObtenerOC2(Orden:string,div:string):Observable<ResponseApi>{
    //return this.http.get<ResponseApi>(`${this.urlApi}ObtenerOCFechas/${Orden}`)
    return this.http.get<ResponseApi>(`${this.urlApi}ObtenerOC2/${Orden}/${div}`);
  }
  SimulacionWebService(files: FileList, idEmpresa:string): Observable<OrdenCompraWS[]> {
    // Crea un objeto FormData y agrega los archivos a él
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    const httpOptions = {
      headers: new HttpHeaders()
    };
    // No es necesario especificar el Content-Type, FormData se encargará de ello
    return this.http.post<OrdenCompraWS[]>(`${this.zvUrlApi}${idEmpresa}/Index`, formData, httpOptions);
  }

}
