import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { tipoInsumoCreacionDTO, tipoInsumoDTO } from './tsTipoInsumo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoInsumoService {
  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "tipoinsumo";
  public obtenerPaginado(pagina: number, cantidaElementosAMostrar: number, idEmpresa: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', cantidaElementosAMostrar.toString());
    return this.httpClient.get<tipoInsumoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/todos`, {observe: 'response', params});
  }
  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<tipoInsumoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/sinpaginar`);
  }

  public TipoInsumosParaRequisitar(idEmpresa: number){
    return this.httpClient.get<tipoInsumoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/TipoInsumosParaRequisitar`);
  }
  public crear(registro: tipoInsumoCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<tipoInsumoDTO>{
    return this.httpClient.get<tipoInsumoDTO>(`${this.zvApiUrl}/${idEmpresa}/${id}`);
  }
  public editar(registro: tipoInsumoDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public borrar(zId: number, idEmpresa: number){
    return this.httpClient.delete(`${this.zvApiUrl}/${idEmpresa}/${zId}`);
  }
}
