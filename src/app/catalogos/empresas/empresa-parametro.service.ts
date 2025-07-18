import { HttpClient} from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ParametroEmpresa } from './empresa';
import { Observable } from 'rxjs';
import { ResponseApi } from 'src/app/utilidades/tsUtilidades';

@Injectable({
  providedIn: 'root'
})
export class EmpresaParametroService {

  @Output()
  OnChange: EventEmitter<number> = new EventEmitter<number>();
  //HttpClient permite llamar los servicios.
  constructor(private httpClient: HttpClient) { }
  private zvApiUrl = environment.ssoApi + "parametrosempresa";
  //Obtiene el número conforme el paginado.

   //Crea un nuevo registro.
   public crear(registro: ParametroEmpresa){
    return this.httpClient.post(`${this.zvApiUrl}/Guardar`, registro);
  }

   //Edita un registro existente.
   public editar(registro: ParametroEmpresa){
    return this.httpClient.put(`${this.zvApiUrl}/Editar`, registro);
  }

  lista(id: number): Observable<ResponseApi> {
    // Suponiendo que 'id' debería ser parte de la URL
    return this.httpClient.get<ResponseApi>(`${this.zvApiUrl}/Lista/${id}`);
  }


}
