import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { OrdenVentaDTO } from './ordenVenta';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private HttpClient: HttpClient) { }

  private apiUrl = environment.apiURL + "ordenventa";

  public crear(idEmp : number, ordenVenta: OrdenVentaDTO){
    return this.HttpClient.post<RespuestaDTO>(`${this.apiUrl}/${idEmp}/crearOrdenVenta`, ordenVenta);
  }
}
  