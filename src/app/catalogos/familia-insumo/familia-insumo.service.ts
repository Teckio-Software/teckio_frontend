import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { familiaInsumoCreacionDTO, familiaInsumoDTO } from './tsFamilia';

@Injectable({
  providedIn: 'root'
})
export class FamiliaInsumoService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "familiainsumo";
  public obtenerPaginado(pagina: number, zCantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<familiaInsumoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/todos`, {observe: 'response', params});
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<familiaInsumoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/sinpaginar`);
  }
  public crear(registro: familiaInsumoCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<familiaInsumoDTO>{
    return this.httpClient.get<familiaInsumoDTO>(`${this.zvApiUrl}/${idEmpresa}/${id}`);
  }
  public editar(registro: familiaInsumoDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public borrar(zId: number, idEmpresa: number){
    return this.httpClient.delete(`${this.zvApiUrl}/${idEmpresa}/${zId}`);
  }
}
