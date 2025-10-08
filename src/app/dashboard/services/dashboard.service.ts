import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { Observable } from 'rxjs';
import { requisicionDTO } from 'src/app/compras/requisicion/tsRequisicion';
import { RequisicionDTO } from '../types/RequisicionDTO';
import { precioUnitarioDTO } from 'src/app/proyectos/precio-unitario/tsPrecioUnitario';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  private zvApiUrl = environment.apiURL;

  public obtenerProyectos(): Observable<proyectoDTO[]> {
    return this.http.get<proyectoDTO[]>(`${this.zvApiUrl}proyecto/1/todos`);
  }

  public obtenerRequisiciones(): Observable<RequisicionDTO[]> {
    return this.http.get<RequisicionDTO[]>(
      `${this.zvApiUrl}requisicion/1/sinpaginartodos`
    );
  }

  public obtenerPresupuestos(): Observable<precioUnitarioDTO[]> {
    return this.http.get<precioUnitarioDTO[]>(
      `${this.zvApiUrl}precioUnitario/1/todos`
    );
  }
}
