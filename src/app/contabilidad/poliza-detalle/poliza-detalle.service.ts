import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { polizaDetalleDTO } from './tsPolizaDetalle';

@Injectable({
    providedIn: 'root'
})
export class PolizaDetalleService{
    @Output()
    OnChange: EventEmitter<number> = new EventEmitter<number>();
    constructor(private httpClient: HttpClient) { }
    private zvApiUrl = environment.apiURL + "polizadetalle"

    public obtenerDetallesPoliza(idPoliza: number, idEmpresa: number){
        return this.httpClient.get<polizaDetalleDTO[]>(`${this.zvApiUrl}/${idEmpresa}/${idPoliza}`);
    }
}