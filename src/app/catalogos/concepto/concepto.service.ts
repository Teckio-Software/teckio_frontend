import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { conceptoCreacionDTO, conceptoDTO } from './concepto';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {

  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.apiURL + "concepto";
  public obtenerPaginado(idProyecto: number, idEmpresa: number){
    return this.httpClient.get<conceptoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/todos/${idProyecto}`);
  }

  public obtenerTodosSinPaginar(idProyecto: number, idEmpresa: number){
    return this.httpClient.get<conceptoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/sinpaginar/${idProyecto}`);
  }
  public crear(registro: conceptoCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<conceptoDTO>{
    return this.httpClient.get<conceptoDTO>(`${this.zvApiUrl}/${idEmpresa}/${id}`);
  }
  public editar(registro: conceptoDTO, idEmpresa: number){
    return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}`, registro);
  }
  public borrar(zId: number, idEmpresa: number){
    return this.httpClient.delete(`${this.zvApiUrl}/${idEmpresa}/${zId}`);
  }
  cambioId(idConcepto: number, idEmpresa: number){
    this.OnChange.emit(idConcepto);
  }


}
