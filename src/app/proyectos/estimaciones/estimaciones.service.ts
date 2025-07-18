import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { EstimacionesDTO, GeneradoresXEstimacionDTO, PeriodoEstimacionesDTO, PeriodosXEstimacionDTO } from './tsEstimaciones';

@Injectable({
    providedIn: 'root'
})
export class EstimacionesService{
    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "estimaciones";

    public obtenerPeriodos(idProyecto: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<PeriodoEstimacionesDTO[]>(`${this.apiUrl}/${idEmpresa}/todosPeriodos/${idProyecto}`)
    }

    public obtenerEstimaciones(idPeriodo: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<EstimacionesDTO[]>(`${this.apiUrl}/${idEmpresa}/todasEstimaciones/${idPeriodo}`)
    }

    public obtenerEstimacionesXReportes(idPeriodo: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<EstimacionesDTO[]>(`${this.apiUrl}/${idEmpresa}/todasEstimacionesReportes/${idPeriodo}`)
    }

    public crearPeriodo(registro: PeriodoEstimacionesDTO, idEmpresa: number): Observable<any>{
        return this.HttpClient.post<PeriodoEstimacionesDTO>(`${this.apiUrl}/${idEmpresa}/crearPeriodo`, registro)
    }

    public editarEstimacion(registro: EstimacionesDTO, idEmpresa: number){
        return this.HttpClient.post<EstimacionesDTO[]>(`${this.apiUrl}/${idEmpresa}/editarEstimacion`, registro)
    }

    public eliminarPeriodo(idPeriodo: number, idEmpresa: number){
        return this.HttpClient.delete<PeriodoEstimacionesDTO>(`${this.apiUrl}/${idEmpresa}/eliminarPeriodo/${idPeriodo}`)
    }

    public ObtenerPeriodosXEstimacion(IdEstimacion: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<PeriodosXEstimacionDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerPeriodosXEstimacion/${IdEstimacion}`)
    }

    public ObtenerGeneradoresXEstimacion(IdEstimacion: number, idEmpresa: number): Observable<any>{
        return this.HttpClient.get<GeneradoresXEstimacionDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerGeneradoresXEstimacion/${IdEstimacion}`)
    }

    public CrearGeneradorXEstimacion(generador : GeneradoresXEstimacionDTO, idEmpresa: number): Observable<any>{
        return this.HttpClient.post<GeneradoresXEstimacionDTO[]>(`${this.apiUrl}/${idEmpresa}/CrearGeneradorXEstimacion`, generador)
    }

    public EliminarGeneradorXEstimacion(idGenerador : number, idEmpresa: number): Observable<any>{
        return this.HttpClient.delete<GeneradoresXEstimacionDTO[]>(`${this.apiUrl}/${idEmpresa}/EliminarGeneradorXEstimacion/${idGenerador}`)
    }
}
