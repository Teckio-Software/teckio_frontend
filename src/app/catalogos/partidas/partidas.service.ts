import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { partidasCreacionDTO, partidasDTO } from './partidas';

@Injectable({
  providedIn: 'root'
})
export class PartidasService {

  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "partida";
  public obtenerPaginado(pagina: number, zCantidaElementosAMostrar: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<partidasDTO[]>(this.zvApiUrl + '/todos', {observe: 'response', params});
  }

  public obtenerTodosSinPaginar(){
    return this.httpClient.get<partidasDTO[]>(`${this.zvApiUrl}/todossinpaginar`);
  }
  public crear(registro: partidasCreacionDTO){
    return this.httpClient.post(this.zvApiUrl, registro);
  }
  public obtenerXId(id: number): Observable<partidasDTO>{
    return this.httpClient.get<partidasDTO>(`${this.zvApiUrl}/${id}`);
  }
  public editar(registro: partidasDTO){
    return this.httpClient.put(`${this.zvApiUrl}`, registro);
  }
  public borrar(zId: number){
    return this.httpClient.delete(`${this.zvApiUrl}/${zId}`);
  }
  cambioId(idTipoPoliza: number){
    this.OnChange.emit(idTipoPoliza);
  }


}
