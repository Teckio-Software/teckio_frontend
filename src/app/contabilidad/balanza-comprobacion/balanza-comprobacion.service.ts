import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { vistaBalanzaComprobacionDTO, filtroBalanzaPeriodoDTO, filtroBalanzaRangoFechaDTO } from "./tsBalanzaComprobacion";

@Injectable({
    providedIn: 'root'
})
export class BalanzaComprobacionService{
    constructor(private httpClient: HttpClient){}
    private apiUrl = environment.apiURL + "saldosbalanzacomprobacion";

    public obtenXPeriodo(filtro: filtroBalanzaPeriodoDTO, idEmpresa: number): Observable<any>{
        return this.httpClient.post<vistaBalanzaComprobacionDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenxperiodo`, filtro);
    }

    public obtenXRangoFecha(filtro: filtroBalanzaRangoFechaDTO, idEmpresa: number){
        return this.httpClient.post<vistaBalanzaComprobacionDTO[]>(`${this.apiUrl}/${idEmpresa}/obtenerxrangofecha`, filtro);
    }
}