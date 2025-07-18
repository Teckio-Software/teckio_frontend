import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { graficaDTO } from './tsGrafica';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  private urlApi:string = environment.apiURL + "Graficas/";

  constructor(private http:HttpClient) { }

  obtenerGraficaProveedores(idEmpresa: number):Observable<graficaDTO>{
    return this.http.get<graficaDTO>(`${this.urlApi}${idEmpresa}/GraficasOrdenCompra`)
  }
  obtenerGraficaTotalesDivision(idEmpresa: number):Observable<graficaDTO>{
    return this.http.get<graficaDTO>(`${this.urlApi}${idEmpresa}/GraficasTotalesDivision`)
  }
  obtenerGraficaTotalesPeriodo(idEmpresa: number):Observable<graficaDTO>{
    return this.http.get<graficaDTO>(`${this.urlApi}${idEmpresa}/GraficasTotalesPeriodo`)
  }
}
