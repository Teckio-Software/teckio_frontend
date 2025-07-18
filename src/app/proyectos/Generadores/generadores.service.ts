import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { GeneradoresDTO } from './tsGeneradores';

@Injectable({
  providedIn: 'root'
})
export class GeneradoresService {

    constructor(private HttpClient: HttpClient){}
    private apiUrl = environment.apiURL + "generadores";
  
    public obtenerTodos(idPrecioUnitario: number, idEmpresa: number){
        return this.HttpClient.get<GeneradoresDTO[]>(`${this.apiUrl}/${idEmpresa}/todos/${idPrecioUnitario}`);
    }

    public creaRegistro(nuevoRegistro: GeneradoresDTO, idEmpresa: number){
        return this.HttpClient.post<GeneradoresDTO>(`${this.apiUrl}/${idEmpresa}/crear`, nuevoRegistro);
    }

    public editaRegistro(registro: GeneradoresDTO, idEmpresa: number){
        return this.HttpClient.put<GeneradoresDTO>(`${this.apiUrl}/${idEmpresa}/editar`, registro);
    }

    public eliminaRegistro(id: number, idEmpresa: number){
        return this.HttpClient.delete<GeneradoresDTO[]>(`${this.apiUrl}/${idEmpresa}/${id}`);
    }
}