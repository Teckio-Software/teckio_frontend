import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { especialidadDTO } from '../especialidades/tsEspecialidad';
import { Observable } from 'rxjs';
import { especialidadXContratistaCreacionDTO, especialidadXContratistaDTO } from './tsEspecialidadXContratista';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadxcontratistaService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "especialidadxcontratista";
  public obtenerEspecialidadesPaginadoPorIdContratista(pagina: number, zCantidaElementosAMostrar: number, idContratista: number): Observable<any>{
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('recordsPorPagina', zCantidaElementosAMostrar.toString());
    return this.httpClient.get<especialidadDTO[]>(`${this.apiUrl}/todos/${idContratista}`, {observe: 'response', params});
  }
  public obtenerXId(id: number): Observable<especialidadDTO>{
    return this.httpClient.get<especialidadDTO>(`${this.apiUrl}/${id}`);
  }
  public borrar(zId: number){
    return this.httpClient.delete(`${this.apiUrl}/${zId}`);
  }
  public asignarEspecialidadAContratista(registro: especialidadXContratistaCreacionDTO){
    return this.httpClient.post(this.apiUrl, registro);
  }
  public editarCostoEspecialidadContratista(registro: especialidadXContratistaDTO){
    return this.httpClient.put(`${this.apiUrl}`, registro);
  }
}
