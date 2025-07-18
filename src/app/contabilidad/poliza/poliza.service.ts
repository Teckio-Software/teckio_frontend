import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { polizaDTO, PolizaFolioCodigoDTO } from './tsPoliza';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
    providedIn: 'root'
})
export class PolizaService {

    @Output()
    OnChange: EventEmitter<number> = new EventEmitter<number>();
    constructor(private httpClient: HttpClient) { }
    private zvApiUrl = environment.apiURL + "poliza";

    public obtenerTodosXEmpresa(idEmpresa: number) {
        return this.httpClient.get<polizaDTO[]>(`${this.zvApiUrl}/${idEmpresa}`);
    }

    public obtenerFolioNumeroPoliza(registro: polizaDTO, idEmpresa: number) {
        return this.httpClient.post<PolizaFolioCodigoDTO>(`${this.zvApiUrl}/${idEmpresa}/generarfolio`, registro);
    }

    public crear(registro: polizaDTO, idEmpresa: number): Observable<any> {
        return this.httpClient.post(`${this.zvApiUrl}/${idEmpresa}`, registro);
    }

    public editar(registro: polizaDTO, idEmpresa: number) {
        return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}/editar`, registro)
    }

    public cancelar(registro: polizaDTO, idEmpresa: number) {
        return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}/cancelar`, registro)
    }

    public auditar(registro: polizaDTO, idEmpresa: number) {
        return this.httpClient.put(`${this.zvApiUrl}/${idEmpresa}/auditar`, registro)
    }

    public GenerarPolizaXIdMovimientoBancario(idEmpresa: number, IdMovimientoBancario: number) {
        return this.httpClient.get<RespuestaDTO>(`${this.zvApiUrl}/${idEmpresa}/GenerarPolizaXIdMovimientoBancario/${IdMovimientoBancario}`);
    }

    public EliminarPolizaXIdMovimientoBancario(idEmpresa: number, IdMovimientoBancario: number) {
        return this.httpClient.delete<RespuestaDTO>(`${this.zvApiUrl}/${idEmpresa}/EliminarPolizaXIdMovimientoBancario/${IdMovimientoBancario}`);
    }
}