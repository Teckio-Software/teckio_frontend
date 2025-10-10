import { Component } from '@angular/core';

@Component({
  selector: 'app-cuentas-por-cobrar',
  templateUrl: './cuentas-por-cobrar.component.html',
  styleUrls: ['./cuentas-por-cobrar.component.css'],
})
export class CuentasPorCobrarComponent {
  crearCuenta: boolean = false;
  cerrar: boolean = false;

  nuevaCuenta() {
    this.crearCuenta = true;
  }
}
