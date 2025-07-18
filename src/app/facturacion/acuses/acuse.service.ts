import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AcuseService {
  private urlApi:string = environment.apiURL + "GeneraAcuses/";
  constructor(private http:HttpClient) { }
  obtenAcusePdf(idEmpresa: number, idFactura: number): Observable<Blob> {
    return this.http.get(`${this.urlApi}${idEmpresa}/DescargaAcuse/${idFactura}`, { responseType: 'blob' });
  }
}
