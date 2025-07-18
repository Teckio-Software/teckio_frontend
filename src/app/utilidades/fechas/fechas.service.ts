import { mesesDTO, aniosDTO } from "./fechas";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class FechasService{
    meses: mesesDTO[] = []
    anios: aniosDTO[] = []
    public obtenerMeses(){
        for(let i = 1; i < 13; i++){
            this.meses.push({
                mes: i
            });
        }
        return this.meses;
    }

    public obtenerAnios(){
        let aux = new Date();
        let anio = aux.getFullYear();
        for(let i = anio; i > 1979; i--){
            this.anios.push({
                anio: i
            })
        }
        return this.anios;
    }
}