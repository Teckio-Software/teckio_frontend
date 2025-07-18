import { Component } from '@angular/core';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent {
  detallePagos: boolean = false;

  mostrarDetalle() {
    this.detallePagos = !this.detallePagos;
  }
}
