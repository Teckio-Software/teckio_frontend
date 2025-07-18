import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {
  private readonly tipoGrafica = 'tipoGrafica';
  constructor(private _snackBar: MatSnackBar) { }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  guardarTitulosGraficas(tipoGrafica: string){
    localStorage.setItem(this.tipoGrafica, tipoGrafica);
  }
  obtenerTitulosGraficasBoolean():boolean{
    const tipoGrafica = localStorage.getItem(this.tipoGrafica);
    if (tipoGrafica) {
      return true;
    }
    return false;
  }
  obtenerTitulosGraficas():string{
    const tipoGrafica = localStorage.getItem(this.tipoGrafica);
    if (tipoGrafica) {
      return tipoGrafica || "";
    }
    return "";
  }
  removerTitulosGraficas(){
    localStorage.removeItem(this.tipoGrafica);
  }

  esEmailValido(email: string):boolean {
    let mailValido = false;
    if (typeof email === 'undefined' || !email || email == "") {
      return false;
    }
    var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(EMAIL_REGEX)){
      mailValido = true;
    }
    return mailValido;
  }
  esStringValido(cadena: string, longitud: number): boolean{
    if (typeof cadena === 'undefined' || !cadena || cadena == "") {
      return false;
    }
    if (cadena.length > longitud) {
      return false;
    }
    return true;
  }
}
