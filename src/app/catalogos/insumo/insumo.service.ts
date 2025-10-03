import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { InsumoCreacionDTO, InsumoDTO, InsumoFormDTO } from './tsInsumo';
import { InsumoProyectoBusquedaDTO } from 'src/app/compras/requisicion/tsRequisicion';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "insumo";
  public obtenerPaginado(idProyecto: number, idEmpresa: number){
    return this.httpClient.get<InsumoDTO[]>(`${this.apiUrl}/${idEmpresa}/todos/${idProyecto}`);
  }
  public obtenerParaAutocomplete(idProyecto: number, idEmpresa: number): Observable<InsumoDTO[]>{
    return this.httpClient.get<InsumoDTO[]>(`${this.apiUrl}/${idEmpresa}/todosparaautocomplete/${idProyecto}`);
  }
  public obtenerXId(id: number, idEmpresa: number): Observable<InsumoDTO>{
    return this.httpClient.get<InsumoDTO>(`${this.apiUrl}/${idEmpresa}/${id}`);
  }
  public obtenerXIdProyecto(idEmpresa: number, idProyecto : number){
    return this.httpClient.get<InsumoDTO[]>(`${this.apiUrl}/${idEmpresa}/todos/${idProyecto}`);
  }
  public crear(registro: InsumoCreacionDTO, idEmpresa: number){
    return this.httpClient.post(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public ObtenerPorDescripcionInsumo(registro: InsumoProyectoBusquedaDTO, idEmpresa: number): Observable<InsumoDTO[]>{
    return this.httpClient.post<InsumoDTO[]>(`${this.apiUrl}/${idEmpresa}/buscarPorDescripcion`, registro);
  }
  public CrearYDevolverInsumoCreado(registro: InsumoCreacionDTO, idEmpresa: number): Observable<InsumoDTO>{
    return this.httpClient.post<InsumoDTO>(`${this.apiUrl}/${idEmpresa}/crearYDevolverGuid`, registro);
  }
  public editar(registro: InsumoFormDTO, idEmpresa: number){
    return this.httpClient.put(`${this.apiUrl}/${idEmpresa}`, registro);
  }
  public borrar(zId: number, idEmpresa: number){
    return this.httpClient.delete(`${this.apiUrl}/${idEmpresa}/${zId}`);
  }

  public filtrar(valores: any, idEmpresa: number){
    const params = new HttpParams({fromObject: valores});
    return this.httpClient.get<InsumoDTO[]>(`${this.apiUrl}/${idEmpresa}/buscar`, {params, observe: 'response'});
  }

  public obtenerTodos(idEmpresa: number){
    return this.httpClient.get<InsumoDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerTodos`);
  }
}
