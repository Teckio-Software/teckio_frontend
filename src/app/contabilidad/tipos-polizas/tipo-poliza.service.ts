import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { tipoPolizaCreacionDTO, tipoPolizaDTO } from './tsTipoPoliza';

@Injectable({
  providedIn: 'root'
})
export class TipoPolizaService {

  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "tipopoliza";
  public obtenerPaginado(pagina: number, zCantidaElementosAMostrar: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<tipoPolizaDTO[]>(this.zvApiUrl + '/0/todos', {observe: 'response', params});
  }

  public obtenerTodosSinPaginar(idEmpresa: number){
    return this.httpClient.get<tipoPolizaDTO[]>(`${this.zvApiUrl}/${idEmpresa}/sinpaginar`);
  }
  public crear(registro: tipoPolizaCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<tipoPolizaDTO>{
    return this.httpClient.get<tipoPolizaDTO>(`${this.zvApiUrl}/${idEmpresa}/${id}`);
  }
  public editar(registro: tipoPolizaDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public borrar(zId: number, idEmpresa: number){
    return this.httpClient.delete(`${this.zvApiUrl}/${idEmpresa}/${zId}`);
  }
  cambioId(idTipoPoliza: number){
    this.OnChange.emit(idTipoPoliza);
  }
}
