import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { programacionEstimadaDTO } from './tsProgramacionEstimada';
import { precioUnitarioDetalleDTO } from "../precio-unitario-detalle/tsPrecioUnitarioDetalle";
import { InsumoParaExplosionDTO } from "src/app/catalogos/insumo/tsInsumo";

@Injectable({
    providedIn: `root`
})

export class ProgramacionEstimadaService{
    @Output()
    OnChange: EventEmitter<number> = new EventEmitter<number>();
    constructor(private HttpClient: HttpClient){}
    private zvApiUrl = environment.apiURL +  "programacionestimada";

    public obtenerProgramacionEstimada(idProyecto: number, idEmpresa: number): Observable<programacionEstimadaDTO[]>{
        return this.HttpClient.get<programacionEstimadaDTO[]>(`${this.zvApiUrl}/${idEmpresa}/obtenerProgramacionEstimada/${idProyecto}`)
    }

    public obtenerProgramacionEstimadaEstructurada(idProyecto: number, idEmpresa: number): Observable<programacionEstimadaDTO[]>{
        return this.HttpClient.get<programacionEstimadaDTO[]>(`${this.zvApiUrl}/${idEmpresa}/obtenerProgramacionEstimadaEstructurada/${idProyecto}`)
    }

    public obtenerSinPaginar(idProyecto: number, idEmpresa: number){
        return this.HttpClient.get<programacionEstimadaDTO[]>(`${this.zvApiUrl}/${idEmpresa}/sinpaginar/${idProyecto}`)
    }

    public editarDatePicker(registro: programacionEstimadaDTO, idEmpresa: number){
        return this.HttpClient.put(`${this.zvApiUrl}/${idEmpresa}/editafechasdatepicker`, registro)
    }

    public editaGantt(registro: programacionEstimadaDTO, idEmpresa: number){
        return this.HttpClient.put(`${this.zvApiUrl}/${idEmpresa}/editagantt`, registro)
    }

    public editarDias(registro: programacionEstimadaDTO, idEmpresa: number){
        return this.HttpClient.put(`${this.zvApiUrl}/${idEmpresa}/editafechasdias`, registro)
    }

    public editarPredecesor(registro: programacionEstimadaDTO, idEmpresa: number){
        return this.HttpClient.put(`${this.zvApiUrl}/${idEmpresa}/editapredecesora`, registro)
    }

    public obtenerFecha(id: number, idEmpresa: number){
        return this.HttpClient.get<Date>(`${this.zvApiUrl}/${idEmpresa}/obtenerFechaFinal/${id}`, {observe: 'response'})
    }
}