import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Logs } from './ts.auditorias';

@Injectable({providedIn: 'root'})
export class AuditoriaService {

    constructor(private HttpClient: HttpClient) {}
    
    private apiUrl = environment.ssoApi + 'Logs';

    /**
     * Obtiene todos los logs de una empresa
     * @param {number} idEmp - Identificador de la empresa
     * @returns {Observable<Logs[]>} - Observables con los logs de la empresa
     */
    public obtenerTodos(idEmp: number) {
        return this.HttpClient.get<Logs[]>(
          `${this.apiUrl}/ObtenerLogsEmpresa/${idEmp}`
        );
      }
}