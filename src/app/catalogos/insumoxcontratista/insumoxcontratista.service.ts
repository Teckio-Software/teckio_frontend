import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { InsumoDTO } from '../insumo/tsInsumo';
import { insumoXContratistaCreacionDTO, insumoXContratistaDTO } from './tsInsumoXContratista';

@Injectable({
  providedIn: 'root'
})
export class InsumoxcontratistaService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "insumoxcontratista";
  public obtenerInsumosPaginadoPorIdContratista(pagina: number, zCantidaElementosAMostrar: number, idContratista: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<InsumoDTO[]>(`${this.apiUrl}/todos/${idContratista}`, {observe: 'response', params});
  }
  public obtenerXId(id: number): Observable<InsumoDTO>{
    return this.httpClient.get<InsumoDTO>(`${this.apiUrl}/${id}`);
  }
  public borrar(zId: number){
    return this.httpClient.delete(`${this.apiUrl}/${zId}`);
  }
  public asignarInsumoAContratista(registro: insumoXContratistaCreacionDTO){
    return this.httpClient.post(this.apiUrl, registro);
  }
  public editarCostoInsumoContratista(registro: insumoXContratistaDTO){
    return this.httpClient.put(`${this.apiUrl}`, registro);
  }
}
