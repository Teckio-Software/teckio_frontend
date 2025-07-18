import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { InsumoCompraDirectaContratistaDTO } from './tsInsumosCompradosXContratista';

@Injectable({
  providedIn: 'root'
})
export class ComprasDirectasContratistaService {
  private apiUrl = environment.apiURL + "comprasporcontratista";
  constructor(private httpClient: HttpClient) { }

  public obtenerTodosSinPaginar(idContratista: number){
    return this.httpClient.get<InsumoCompraDirectaContratistaDTO[]>(`${this.apiUrl}/insumoscompradosxcontratista/${idContratista}`);
  }
}
