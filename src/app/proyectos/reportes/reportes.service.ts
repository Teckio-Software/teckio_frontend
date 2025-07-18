import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ObjetoDestajoacumuladoDTO, ObjetoDestajoTotalDTO, ReporteDestajoDTO } from './reportesDestajo';
import { parametrosParaBuscarContratos } from '../contratos/tsContratos';
import { PeriodoResumenDTO } from '../estimaciones/tsEstimaciones';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private httpClient: HttpClient) { }
  private apiUrl = environment.apiURL + "reportesdestajo";

  public reporteDestajo(idEmpresa : number, parametros : ReporteDestajoDTO) : Observable<ReporteDestajoDTO[]> {
    return this.httpClient.post<ReporteDestajoDTO[]>(`${this.apiUrl}/${idEmpresa}/reporteDestajo`, parametros);
  }
  
  public destajoAcumulado(idEmpresa : number, parametros : parametrosParaBuscarContratos) : Observable<ObjetoDestajoacumuladoDTO> {
    return this.httpClient.post<ObjetoDestajoacumuladoDTO>(`${this.apiUrl}/${idEmpresa}/destajoAcumulado`, parametros);
  }

  public ObtenerPeridosConImporteTotal(idEmpresa : number, idProyecto : number) : Observable<PeriodoResumenDTO[]> {
    return this.httpClient.get<PeriodoResumenDTO[]>(`${this.apiUrl}/${idEmpresa}/ObtenerPeridosConImporteTotal/${idProyecto}`);
  }

  public DestajoTotal(idEmpresa : number, parametros : parametrosParaBuscarContratos) : Observable<ObjetoDestajoTotalDTO> {
    return this.httpClient.post<ObjetoDestajoTotalDTO>(`${this.apiUrl}/${idEmpresa}/DestajoTotal`, parametros);
  }
}
