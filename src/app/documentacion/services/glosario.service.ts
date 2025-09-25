import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { GlosarioDTO } from '../types/GlosarioDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlosarioService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiURL + 'glosario/';

  public crearTermino(glosario: GlosarioDTO): Observable<GlosarioDTO> {
    return this.http.post<GlosarioDTO>(`${this.apiUrl}CrearYObtener`, glosario);
  }

  public editarTermino(glosario: GlosarioDTO): Observable<GlosarioDTO> {
    return this.http.put<GlosarioDTO>(`${this.apiUrl}Editar`, glosario);
  }

  public obtenerTodos(): Observable<GlosarioDTO[]> {
    return this.http.get<GlosarioDTO[]>(`${this.apiUrl}ObtenerTodos`);
  }

  public obtenerTermino(id: number): Observable<GlosarioDTO> {
    return this.http.get<GlosarioDTO>(`${this.apiUrl}ObtenerXId/${id}`);
  }

  public eliminarTermino(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}Eliminar/${id}`);
  }
}
