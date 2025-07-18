import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { clienteDTO, clienteCreacionDTO } from "./tsCliente";
import { RespuestaDTO } from "src/app/utilidades/tsUtilidades";
import { cuentaContableDTO } from "src/app/contabilidad/cuenta-contable/tsCuentaContable";

@Injectable({
    providedIn: 'root'
})
export class ClienteService{

    constructor(private httpClient: HttpClient){}
    private  apiUrl = environment.apiURL + "cliente/";

    public obtenerTodos(idEmp:number): Observable<any>{
        return this.httpClient.get<clienteDTO[]>(`${this.apiUrl}${idEmp}/todos`);
    }

    public obtenerXId(idEmp:number,id: number): Observable<clienteCreacionDTO>{
        return this.httpClient.get<clienteCreacionDTO>(`${this.apiUrl}${idEmp}/${id}`);
    }
    
    public borrar(idEmp:number,id: number): Observable<RespuestaDTO>{
        return this.httpClient.delete<RespuestaDTO>(`${this.apiUrl}${idEmp}/${id}`)
    }

    public editar(idEmp:number,registro: clienteDTO):Observable<RespuestaDTO>{
        return this.httpClient.put<RespuestaDTO>(`${this.apiUrl}${idEmp}/EditarCliente`, registro)
    }

    public crear(idEmp:number,registro: clienteDTO): Observable<RespuestaDTO>{
        return this.httpClient.post<RespuestaDTO>(`${this.apiUrl}${idEmp}/GuardarCliente`, registro);
    }

    public obtenerCuentasContables(idEmpresa : number, IdCliente : number){
        return this.httpClient.get<cuentaContableDTO[]>(`${this.apiUrl}${idEmpresa}/cuentasContables/${IdCliente}`);
      }
}