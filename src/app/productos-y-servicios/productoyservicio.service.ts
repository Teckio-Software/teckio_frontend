import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ProductoYServicioConjunto, ProductoYServicioDTO } from '../gestion-ventas/productos/productos';

@Injectable({providedIn: 'root'})
export class ProductoYServicioService {

    constructor(private HttpClient: HttpClient) { }
    
    private apiUrl = environment.apiURL + "productoyservicio";

    public obtenerTodos(idEmp: number){
        return this.HttpClient.get<ProductoYServicioDTO[]>(`${this.apiUrl}/${idEmp}/obtenerTodos`);
      }

    public obtenerConjuntos(idEmp: number){
      return this.HttpClient.get<ProductoYServicioConjunto[]>(`${this.apiUrl}/${idEmp}/obtenerConjunto`);
    }

    
}