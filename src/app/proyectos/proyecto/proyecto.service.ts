import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { proyectoDTO } from "./tsProyecto";
import { RespuestaDTO } from "src/app/utilidades/tsUtilidades";

@Injectable({
    providedIn: 'root'
})

export class ProyectoService{

    @Output()
    OnChange: EventEmitter<number> = new EventEmitter<number>();
    constructor(private HttpClient: HttpClient){}
    private zvApiUrl = environment.apiURL + "proyecto";

    public obtener(idEmpresa: number): Observable<any>{
        return this.HttpClient.get<proyectoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/todos`)
    }

    public obtenerTodosSinEstructurar(idEmpresa: number){
        return this.HttpClient.get<proyectoDTO[]>(`${this.zvApiUrl}/${idEmpresa}/sinpaginar`);
    }

    public obtenerXId(id: number, idEmpresa: number){
        return this.HttpClient.get<proyectoDTO>(`${this.zvApiUrl}/${idEmpresa}/${id}`);
    }

    public crear(registro: proyectoDTO, idEmpresa: number){
        return this.HttpClient.post<proyectoDTO >(`${this.zvApiUrl}/${idEmpresa}`, registro);
    }

    public crearYObtener(registro: proyectoDTO, idEmpresa: number){
        return this.HttpClient.post<proyectoDTO>(`${this.zvApiUrl}/${idEmpresa}/crearyobtener`, registro);
    }

    public editar(registro: proyectoDTO, idEmpresa: number){
        return this.HttpClient.put<proyectoDTO>(`${this.zvApiUrl}/${idEmpresa}`, registro);
    }

    public eliminar(zId: number, idEmpresa: number){
        return this.HttpClient.delete<proyectoDTO>(`${this.zvApiUrl}/${idEmpresa}/${zId}`, {observe: "response"});
    }
}
