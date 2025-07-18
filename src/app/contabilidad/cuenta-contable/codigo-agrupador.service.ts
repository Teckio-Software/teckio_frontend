import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { codigoAgrupadorDTO } from './tsCuentaContable';

@Injectable({
  providedIn: 'root'
})
export class CodigoAgrupadorService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "codigoagrupador";

  public obtenerTodosSinPaginar(idEmpresa: number): Observable<any>{
    return this.httpClient.get<codigoAgrupadorDTO[]>(`${this.apiUrl}/${idEmpresa}/todos`);
  }
}
