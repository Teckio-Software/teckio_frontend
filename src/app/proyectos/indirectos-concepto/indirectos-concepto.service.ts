import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IndirectosXConceptoDTO } from './Indirectos-concepto';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndirectosConceptoService {

  constructor(private http: HttpClient){}
  private apiUrl = environment.apiURL + "indirectosXConcepto/";

  public ObtenerIndirectos(idEmp : number, idConcepto : number): Observable<IndirectosXConceptoDTO[]>{
    return this.http.get<IndirectosXConceptoDTO[]>(`${this.apiUrl}${idEmp}/ObtenerIndirectos/${idConcepto}`);
  }

  public CrearIndirectosPadre(idEmp : number, idConcepto : number){
    return this.http.get<RespuestaDTO>(`${this.apiUrl}${idEmp}/CrearIndirectosPadre/${idConcepto}`);
  }

  public CrearIndirecto(idEmp : number, registro : IndirectosXConceptoDTO){
    return this.http.post<RespuestaDTO>(`${this.apiUrl}${idEmp}/CrearIndirecto`, registro);
  }

  public EditarIndirecto(idEmp : number, registro : IndirectosXConceptoDTO){
    return this.http.put<RespuestaDTO>(`${this.apiUrl}${idEmp}/EditarIndirecto`, registro);
  }

  public EliminarIndirecto(idEmp : number, idIndirecto : number){
    return this.http.delete<RespuestaDTO>(`${this.apiUrl}${idEmp}/EliminarIndirecto/${idIndirecto}`);
  }
}
